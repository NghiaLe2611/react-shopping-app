import { authApp, firebase } from '../firebase/config';
import 'firebase/compat/auth';

function logout() {
    return authApp.signOut();
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