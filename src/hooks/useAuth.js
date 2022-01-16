import{ useState, useEffect } from 'react';
import { authApp } from '../firebase/config';
import { useDispatch } from 'react-redux';

const useAuth = () => {
    const dispatch = useDispatch();
    // const userData = useSelector(state => state.auth.userData);
    const [currentUser, setCurrentUser] = useState(null);

    // Subscribe to user on mount
    // Because this sets state in the callback it will cause any ...
    // ... component that utilizes this hook to re-render with the ...
    // ... latest auth object.
    useEffect(() => {
        const unregisterAuthObserver = authApp.onAuthStateChanged(async (user) => {
            if (user) {
                console.log('Logged in');

                const userDataObj = {
                    id: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    emailVerified: user.emailVerified
                };

                setCurrentUser(userDataObj);
            } else {
                console.log('Not logged in');       
                setCurrentUser(null);
            }
        });

        // Cleanup subscription on unmount
        return () => unregisterAuthObserver();

    }, [dispatch]);

    const logout = (callback) => {
        authApp.signOut().then(result => {
            callback();
        })
    };
    
    const login = (email, password) => {
        return authApp.signInWithEmailAndPassword(email, password)
    };
    
    const resetPassword = (email) => {
        return authApp.sendPasswordResetEmail(email);
    };

    return { currentUser, logout, login, resetPassword };

};

export default useAuth;
