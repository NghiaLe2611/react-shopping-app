import { useState, useEffect } from 'react';
import { firebase } from '../firebase/config';
import { firebaseAuth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import 'firebase/compat/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/auth';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Cookies from 'js-cookie';
import classes from '../scss/Login.module.scss';

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
        // As httpOnly cookies are to be used, do not persist any state client side.
        // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
    }, []);

    // Handle signed in user
    const handleSignedInUser = () => {
        return firebase.auth().currentUser.getIdToken().then((token) => {
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
        });
    };

    // Configure FirebaseUI.
	const uiConfig = {
		// Popup signin flow rather than redirect flow.
		signInFlow: 'popup',
		// signInSuccessUrl: '/',
		signInOptions: [
            // firebase.auth.EmailAuthProvider.PROVIDER_ID,
			firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
		],
        callbacks: {
            signInSuccessWithAuthResult: (authResult, redirectUrl) => {
                // handleSignedInUser();
                return navigate('/');
            },
        }
        /*
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => {
                // let timerInterval;
                // const Toast = formAlert.mixin({
                //     toast: true,
                //     confirmButtonText: 'Chuyển trang ngay',
                //     confirmButtonColor: '#2f80ed',
                //     timer: 5000,
                //     didOpen: () => {
                //         timerInterval = setInterval(() => {
                //             Swal.getHtmlContainer().querySelector('strong').textContent = (Swal.getTimerLeft() / 1000).toFixed(0)
                //         }, 100);
                //     },
                //     willClose: () => {
                //         clearInterval(timerInterval);
                //     }
                // });
                // Toast.fire({
                //     icon: 'success',
                //     html: `<p>Đăng nhập thành công.<br/>Hệ thống sẽ tự động chuyển trang sau <strong></strong> giây.</p>`
                // }).then(isConfirm => {
                //     if (isConfirm) {
                //         navigate('/');
                //     }
                // });

                Swal.fire({
                    icon: 'success',
                    html: `<p>Đăng nhập thành công</p>`,
                    confirmButtonText: 'Chuyển sang trang chủ',
                    confirmButtonColor: '#2f80ed',
                    showCancelButton: true,
                    cancelButtonText: 'Ở lại trang này',
                    cancelButtonColor: '#dc3741'
                }).then(result => {
                   if (result.isConfirmed) navigate('/');
                   return;
                });
            }
        }
        */
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
        const { name, value } = e.target;

        setUserInput(data => data = {...data, [name]: value});
        validateInput(name, value);
    };

    const onBlurInput = (e) => {
        const { name, value } = e.target;

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
                    setTimeout(() => {
                        navigate('/');
                    }, 1000);
                    
                    // let timerInterval;

                    // const Toast = formAlert.mixin({
                    //     toast: true,
                    //     confirmButtonText: 'Chuyển trang ngay',
                    //     confirmButtonColor: '#2f80ed',
                    //     timer: 5000,
                    //     didOpen: () => {
                    //         timerInterval = setInterval(() => {
                    //             Swal.getHtmlContainer().querySelector('strong').textContent = (Swal.getTimerLeft() / 1000).toFixed(0)
                    //         }, 100);
                    //     },
                    //     willClose: () => {
                    //         clearInterval(timerInterval);
                    //     }
                    // });
                    // Toast.fire({
                    //     icon: 'success',
                    //     html: `<p>Đăng nhập thành công.<br/>Hệ thống sẽ tự động chuyển trang sau <strong></strong> giây.</p>`
                    // }).then(isConfirm => {
                    //     if (isConfirm) {
                    //         navigate('/');
                    //     }
                    // });
                }
            } catch (err) {
                formAlert.fire({
                    icon: 'error',
                    html: `<p style="font-size: 16px;">${formErrors[err.code]}</p>`,
                    confirmButtonColor: '#dc3741'
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
        <div className='container'>
            <div className={classes['wrap-user-form']}>
                <h3 className={classes.title}>Đăng nhập</h3>
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
        </div>
    );
};

export default LoginPage;
