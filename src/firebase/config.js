import firebase from 'firebase/compat/app';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import 'firebase/compat/auth';

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	databaseURL: 'https://learn-react-2816d-default-rtdb.firebaseio.com',
	projectId: 'learn-react-2816d',
	storageBucket: 'learn-react-2816d.appspot.com',
	messagingSenderId: '602412042352',
	appId: '1:602412042352:web:434c54982a370b98a60cb5',
};
firebase.initializeApp(config);

const app = initializeApp(config);

export { firebase };
export const authApp = firebase.auth();
export const firebaseAuth = getAuth(app);