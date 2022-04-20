import { authApp } from '../firebase/config';
import 'firebase/compat/auth';
// import useFetch from '../hooks/useFetch';

const logout = (callback) => {
    return authApp.signOut();
    // authApp.signOut().then(result => {
    //     callback();
    // })
}

function login(email, password) {
    return authApp.signInWithEmailAndPassword(email, password)
}

function resetPassword(email) {
    return authApp.sendPasswordResetEmail(email);
}

export const authService = {
    logout,
    login,
    resetPassword
}