import { useState, useEffect } from 'react';
import { firebase } from '../firebase/config';
import { firebaseAuth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import 'firebase/compat/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
// import { authActions } from '../store/auth';
import classes from '../scss/Login.module.scss';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const formAlert = withReactContent(Swal);
const errorMessages = {
    email: 'Email không được trống !',
    password: 'Mật khẩu không được trống !',
};
const formErrors = {
    'auth/user-not-found': 'Tài khoản không tồn tại',
    'auth/invalid-email': 'Email không hợp lệ. Vui lòng thử lại.',
    'auth/wrong-password': 'Mật khẩu không chính xác'
};

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    const [userInput, setUserInput] = useState({
        email: null,
        password: null
    });
    const [isValid, setIsValid] = useState({
        email: {
            status: null, message: null
        },
        password: {
            status: null, message: null
        }
    });
    const [isBlur, setIsBlur] = useState({
        email: false,
        password: false
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/tai-khoan');
        }
    }, []);

    // Configure FirebaseUI.
	const uiConfig = {
		// Popup signin flow rather than redirect flow.
		signInFlow: 'popup',
		signInSuccessUrl: '/',
		signInOptions: [
            // firebase.auth.EmailAuthProvider.PROVIDER_ID,
			firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
		]
        // callbacks: {
        //     // Avoid redirects after sign-in.
        //     signInSuccessWithAuthResult: () => false
        // }
	};

    const validateInput = (name, value) => {
        if (value.length) {
            setIsValid(data => data = {...data, [name]: {
                status: true, message: null
            }}); // valid
        } else {
            setIsValid(data => data = {...data, [name]: {
                status: false, message: errorMessages[name]
            }});
        }
    };

    const onChangeInput = (e) => {
        const { name } = e.target;
        const { value } = e.target;

        setUserInput(data => data = {...data, [name]: e.target.value});

        validateInput(name, value);
    };

    const onBlurInput = (e) => {
        const { name } = e.target;
        const { value } = e.target;

        setIsBlur(data => data = {...data, [name]: true});
        validateInput(name, value);
    };

    const loginWithEmail = async (e) => {
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

        if (isValid.email.status && isValid.password.status) {
            // Login success
            try {
                const userCredential = await signInWithEmailAndPassword(
                    firebaseAuth, 
                    userInput.email, 
                    userInput.password
                );

                if (userCredential.user.accessToken) {
                    let timerInterval;

                    const Toast = formAlert.mixin({
                        toast: true,
                        confirmButtonText: 'Chuyển trang ngay',
                        confirmButtonColor: '#2f80ed',
                        timer: 5000,
                        didOpen: () => {
                            timerInterval = setInterval(() => {
                            Swal.getHtmlContainer().querySelector('strong')
                                .textContent = (Swal.getTimerLeft() / 1000)
                                .toFixed(0)
                            }, 100);
                        },
                        willClose: () => {
                            clearInterval(timerInterval);
                        }
                    });
                    Toast.fire({
                        icon: 'success',
                        html: `<p>Đăng nhập thành công.<br/>Hệ thống sẽ tự động chuyển trang sau <strong></strong> giây.</p>`
                    }).then(isConfirm => {
                        if (isConfirm) {
                            navigate('/');
                        }
                    });
                }
            } catch (err) {
                formAlert.fire({
                    icon: 'error',
                    html: `<p style="font-size: 16px;">${formErrors[err.code]}</p>`,
                    confirmButtonColor: '#2f80ed'
                });
                
                if (err.code === 'auth/user-not-found') {
                    setIsValid(data => data = {...data, email: {
                        status: false, message: formErrors[err.code]
                    }});
                } 

                if (err.code === 'auth/invalid-email') {
                    setIsValid(data => data = {...data, email: {
                        status: false, message: formErrors[err.code]
                    }});
                }

                if (err.code === 'auth/wrong-password') {
                    setIsValid(data => data = {...data, password: {
                        status: false, message: formErrors[err.code]
                    }});
                }
            }
        }
    };

	return (
        <div className="container">
            {
                <div className={classes['wrap-user-form']}>
                    <h3>Đăng nhập</h3>
                    <form className={classes['user-form']} onSubmit={loginWithEmail}>
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
                        <button type='submit' className={classes.submit}>Đăng nhập</button>
                        <a href="/#" className={classes['forget-password']}>Quên mật khẩu ?</a>
                        <p className={classes.txt}>Hoặc</p>
                        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
                        <p className={classes['txt-bottom']}>
                            Bạn chưa có tài khoản ? <Link to='/dang-ky'>Đăng ký</Link>
                        </p>
                    </form>
                </div>
            }      
        </div>
    );
};

export default LoginPage;
