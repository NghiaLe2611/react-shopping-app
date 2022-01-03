import { firebase } from '../firebase/config';
import 'firebase/compat/auth';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { authActions } from '../store/auth';
import { useEffect } from 'react';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const { replace } = useNavigate()

    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    useEffect(() => {
        // replace({
        //     goTo: '/login',
        //     when: !isLoggedIn,
        //     onPaths: ['/tai-khoan/**'],
        //     otherwiseGoTo: '/', 
        // })

        if (!isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const logOutHandler = () => {     
        firebase.auth().signOut()
            .then(function () {
                setTimeout(() => {
                    dispatch(authActions.updateState({
                        isLoggedIn: false,
                        userData: null
                    }));
                    navigate('/');
                }, 1000);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <div>
            {
                isLoggedIn ? <span onClick={logOutHandler}>Đăng xuất</span> : null
            }
        </div>
    )
};

export default ProfilePage;