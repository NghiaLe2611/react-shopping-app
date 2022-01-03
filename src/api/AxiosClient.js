import axios from 'axios';
import queryString from 'query-string';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const getFirebaseToken = async () => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) return currentUser.getIdToken();

    // Not logged in
    const hasToken = localStorage.getItem('firebaseToken');
    if (!hasToken) return null;

    // Logged in but current user is not fetched -> wait
    return new Promise((resolve , reject) => {
        const waitTimer = setTimeout(() => {
            reject(null);
        }, 10000);

        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                reject(null);
            }
            const token = await user.getIdToken();
            resolve(token);

            unregisterAuthObserver();
            clearTimeout(waitTimer);
        });
    });
};

const axiosClient = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
	},
    paramsSerializer: params => queryString.stringify(params),
});

// Add a request interceptor
axiosClient.interceptors.request.use(async (config) => {
    // const currentUser = firebase.auth().currentUser;
    // if (currentUser) {
    //     const token = await currentUser.getIdToken();
    //     config.headers.Authorization = `Bearer ${token}`;
    // }

    const token = await getFirebaseToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})

// Add a response interceptor
// axiosClient.interceptors.response.use(
// 	(response) => {
// 		if (response && response.data) {
// 			return response.data;
// 		}

// 		return response;
// 	},
// 	(error) => {
// 		// Handle errors
// 		throw error;
// 	}
// );

export default axiosClient;
