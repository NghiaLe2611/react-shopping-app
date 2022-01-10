import { firebase } from '../firebase/config';
import 'firebase/compat/auth';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../store/auth';
import { useEffect } from 'react';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    useEffect(() => {
        // react-use-navigate
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

    return (
        <div>
            Profile page
        </div>
    )
};

export default ProfilePage;