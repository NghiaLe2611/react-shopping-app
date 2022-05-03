import { useState } from 'react';
import { firebaseAuth } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { emailIsValid, passwordIsValid } from '../helpers/helpers';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/auth';
import classes from '../scss/Login.module.scss';
import Cookies from 'js-cookie';

const errorMessages = {
    email: 'Email không hợp lệ.',
    EMAIL_EXISTS: 'Email đã tồn tại. Vui lòng nhập lại.',
    password: 'Mật khẩu phải chứa ít nhất 8 chữ ký tự, gồm 1 chữ hoa, 1 chữ thường và 1 chữ số.',
    confirmPassword: 'Mật khẩu không khớp. Vui lòng nhập lại.'
};

const formAlert = withReactContent(Swal);

const SignUpPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [userInput, setUserInput] = useState({
        email: null,
        password: null,
        confirmPassword: null
    });
    const [isValid, setIsValid] = useState({
        email: {
            status: null, message: null
        },
        password: {
            status: null, message: null
        },
        confirmPassword: {
            status: null, message: null
        }
    });
    const [isBlur, setIsBlur] = useState({
        email: false,
        password: false,
        confirmPassword: false
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateInput = (name, value) => {
        switch (name) {
            case 'email': 
                if (emailIsValid(value)) {
                    setIsValid(data => data = {...data, [name]: {
                        status: true, message: null
                    }}); // valid
                } else {
                    setIsValid(data => data = {...data, [name]: {
                        status: false, message: errorMessages[name]
                    }});
                }
                break;
            case 'password': 
                if (passwordIsValid(value)) {
                    setIsValid(data => data = {...data, [name]: {
                        status: true, message: null
                    }}); // valid
                } else {
                    setIsValid(data => data = {...data, [name]: {
                        status: false, message: errorMessages[name]
                    }});
                }
                break;
            case 'confirmPassword': 
                if (passwordIsValid(value)) {
                    if (value === userInput.password) {
                        setIsValid(data => data = {...data, [name]: {
                            status: true, message: null
                        }}); // valid
                    } else {
                        setIsValid(data => data = {...data, [name]: {
                            status: false, message: errorMessages[name]
                        }});
                    }
                } 
                
                if (!passwordIsValid(value)) {
                    setIsValid(data => data = {...data, [name]: {
                        status: false, message: errorMessages['password']
                    }});
                }
                break;
            default: return;
        }
    };

    const onChangeInput = (e) => {
        const { name, value } = e.target;

        setUserInput(data => data = {...data, [name]: value});

        if (isBlur[name] || isSubmitted) {
            validateInput(name, value);
        }
    };

    const onBlurInput = (e) => {
        const { name, value } = e.target;

        setIsBlur(data => data = {...data, [name]: true});
        validateInput(name, value);
    };

    const registerHandler = async (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        if (!isValid.email.status) {
            if (!isValid.email.message) {
                setIsValid(data => data = {...data, email: {
                    status: false, message: errorMessages['email']
                }});
            }
        }

        if (!isValid.password.status) {
            setIsValid(data => data = {...data, password: {
                status: false, message: errorMessages['password']
            }});
        }

        if (!isValid.confirmPassword.status) {
            setIsValid(data => data = {...data, confirmPassword: {
                status: false, message: errorMessages['password']
            }});
        }

        if (isValid.email.status && isValid.password.status && isValid.confirmPassword.status) {
            if (userInput.password === userInput.confirmPassword) {
                // Register success
                try {
                    const userCredential = await createUserWithEmailAndPassword(
                        firebaseAuth, 
                        userInput.email, 
                        userInput.password
                    );

                    if (userCredential.user.accessToken) {
                        console.log('register', userCredential.user);

                        return firebaseAuth.currentUser.getIdToken().then((token) => {
                            const prevCookie = Cookies.get('idToken');
                            const csrfToken = Cookies.get('csrfToken');
                
                            if (prevCookie === undefined || prevCookie !== token) {
                                Cookies.set('idToken', token, {
                                    expires: 1,
                                }); // 1 day
                                fetch(`${process.env.REACT_APP_API_URL}/sessionLogin`, {
                                    method: 'POST',
                                    credentials: 'include',
                                    withCredentials: true,
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        idToken: token,
                                        csrfToken: csrfToken
                                    }),
                                });
                            }
                
                            dispatch(authActions.setToken(token));
                        });
                        
                        // let timerInterval;

                        // const Toast = formAlert.mixin({
                        //     toast: true,
                        //     confirmButtonText: 'Chuyển trang ngay',
                        //     confirmButtonColor: '#2f80ed',
                        //     timer: 5000,
                        //     didOpen: (res) => {
                        //         console.log(res);
                        //         timerInterval = setInterval(() => {
						// 			Swal.getHtmlContainer().querySelector('strong').textContent = (Swal.getTimerLeft() / 1000).toFixed(0);
						// 		}, 100);
                        //     },
                        //     willClose: () => {
                        //         clearInterval(timerInterval);
                        //     }
                        // });      
						// Toast.fire({
						// 	icon: 'success',
						// 	html: '<p>Đăng nhập thành công.<br/>Hệ thống đang tự động chuyển trang.</p>'
						// }).then(isConfirm => {
                        //     if (isConfirm) {
                        //         navigate('/');
                        //     }
                        // });
                    }
                } catch (err) {
                    const errorObj = JSON.parse(JSON.stringify(err));
                    // console.log(errorObj.customData._tokenResponse.error.message);
                    const message = errorObj.customData._tokenResponse.error.message;
                    formAlert.fire({
                        icon: 'error',
                        html: `<p style="font-size: 16px;">${errorMessages[message]}</p>`,
                        confirmButtonColor: '#2f80ed'
                    });
                    setIsValid(data => data = {...data, email: {
                        status: false, message: errorMessages[message]
                    }});
                }
            } else {
                setIsValid(data => data = {...data, password: {
                    status: false, message: errorMessages['confirmPassword']
                }});
            }
        }
    };

	return (
        <div className="container">
            {
            <div className={classes['wrap-user-form']}>
                <h3>Đăng ký</h3>
                <form className={classes['user-form']}>
                    <input type='text' placeholder='Email' name='email' 
                        className={isValid.email.status === false ? classes.invalid : ''}
                        onChange={onChangeInput}   
                        onBlur={onBlurInput}
                    />
                    {isValid.email.message && <p className={classes.error}>{isValid.email.message}</p>}
                    <input type='password' placeholder='Mật khẩu' name='password' 
                        className={isValid.password.status === false ? classes.invalid : ''}
                        onChange={onChangeInput}
                        onBlur={onBlurInput}
                    />
                    {isValid.password.message && <p className={classes.error}>{isValid.password.message}</p>}
                    <input type='password' placeholder='Nhập lại mật khẩu' name='confirmPassword' 
                        className={isValid.confirmPassword.status  === false ? classes.invalid : ''}
                        onChange={onChangeInput} 
                        onBlur={onBlurInput}
                    />
                    {isValid.confirmPassword.message && <p className={classes.error}>{isValid.confirmPassword.message}</p>}
                    <button type='submit' className={classes.submit} onClick={registerHandler}>Đăng ký</button>
                    <p className={classes['txt-bottom']}>
                        Bạn đã tài khoản ? <Link to='/dang-nhap'>Đăng nhập</Link>
                    </p>
                </form>
            </div>
            }     
        </div>  
    )
};

export default SignUpPage;
