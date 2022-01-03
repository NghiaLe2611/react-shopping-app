import { useRef } from 'react';
import { firebase } from '../firebase/config';
import 'firebase/compat/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../store/auth';
import classes from '../scss/Login.module.scss';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const emailRef = useRef('');
    const passwordRef = useRef('');

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

	return (
        <div className="container">
            <div className={classes['wrap-user-form']}>
                <h3>Đăng nhập</h3>
                <form className={classes['user-form']}>
                    <input type='text' placeholder='Email' ref={emailRef} />
                    <input type='password' placeholder='Mật khẩu' ref={passwordRef}/>
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
