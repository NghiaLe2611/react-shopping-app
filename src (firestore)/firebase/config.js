// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app'; //v9
import 'firebase/compat/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyD-BfZjl4hBkcgrq_MEvNA1buYMqDAQUUg',
	authDomain: 'learn-react-2816d.firebaseapp.com',
	databaseURL: 'https://learn-react-2816d-default-rtdb.firebaseio.com',
	projectId: 'learn-react-2816d',
	storageBucket: 'learn-react-2816d.appspot.com',
	messagingSenderId: '602412042352',
	appId: '1:602412042352:web:434c54982a370b98a60cb5',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// export default firebase;

const db = firebase.firestore();
export { db, firebase };



// const firebaseApp = firebase.initializeApp(firebaseConfig);
// export default firebaseApp;

// const ref = firebaseApp.firestore().collection('products');
    // function getProducts() {
    //     ref.onSnapshot((querySnapshot) => {
    //         const items = [];
    //         querySnapshot.forEach(doc => {
    //             items.push(doc.data());
    //         });

    //         console.log(items);
    //     })
    // }