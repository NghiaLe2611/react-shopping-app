import React, { useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from './store/auth';
import { cartActions } from './store/cart';
import { authApp } from './firebase/config';
import useFetch from './hooks/useFetch';
import { authService } from './api/auth-service';
import Cookies from 'js-cookie';
import MyRoutes from './routes';

// import Root from './components/UI/Root';
// import HomePage from './pages/HomePage';
// import DetailPage from './pages/DetailPage';
// import CategoryPage from './pages/CategoryPage';
// import NotFound from './pages/NotFound';
// import BrandPage from './pages/BrandPage';
// import CartPage from './pages/CartPage';
// import ComparePage from './pages/ComparePage';

// function getCookie(name) {
// 	const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
// 	return v ? v[2] : null;
// }

function App() {
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.auth.userData);
	const isLoggingOut = useSelector((state) => state.auth.isLoggingOut);

	const { fetchData: fetchUser } = useFetch();
	const { fetchData: postUserInfo } = useFetch();
	// const { fetchData: updateUserInfo } = useFetch();

	useEffect(() => {
		// Create user data
		const postUserData = () => {
			// console.log('postUserData');

			const data = {
				uuid: userData.uuid,
				displayName: userData.displayName,
				email: userData.email,
				photoURL: userData.photoURL,
				emailVerified: userData.emailVerified,
			};

			postUserInfo({
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				url: `${process.env.REACT_APP_API_URL}/api/v1/me/account`,
				body: data,
			});
		};

        const getUserData = (userDataObj) => {
            fetchUser({
                url: `${process.env.REACT_APP_API_URL}/api/v1/me/account`
            }, (data) => {
                    // console.log('fetchUser', data);
                    if (!data) {
                        postUserData();
                    } else {
                        // updateUser();
                        const cloneData = (({ uuid, displayName, email, photoURL, emailVerified, ...val }) => val)(data);
                        dispatch(
                            authActions.updateState({
                                userData: {
                                    ...userDataObj,
                                    ...cloneData,
                                },
                            }),
                        );
                    }
                }
            );
        };

		// Update user data
		// const updateUser = () => {
		//     const data = {
		//         uuid: userData.uuid,
		//         displayName: userData.displayName,
		//         email: userData.email,
		//         photoURL: userData.photoURL,
		//         emailVerified: userData.emailVerified,
		//     };

		//     updateUserInfo({
		//         method: 'PUT',
		//         headers: { 'Content-Type': 'application/json' },
		//         url: `${process.env.REACT_APP_API_URL}/api/v1/me/account`,
		//         body: data
		//     });
		// };

		// const onChangeToken = authApp.onIdTokenChanged(async (user) => {
		// 	user.getIdTokenResult()
		// 		.then((idTokenResult) => {
		// 			console.log(idTokenResult);
		// 		})
		// 		.catch((error) => {
		// 			console.log(error);
		// 		});
		// });
        
		const unregisterAuthObserver = authApp.onAuthStateChanged(async (user) => {
            if (user) {
                const lastTimeLogin = user.metadata.lastLoginAt;
				const currentTime = new Date().getTime();

				// Log out user if more than 1 day
				if (currentTime - lastTimeLogin >= 86400000) { // 86400000: 1 day
                    console.log('Log out due to expired time');
					// await authApp.signOut();

					dispatch(authActions.setIsLoggingOut(true));					
					fetch(`${process.env.REACT_APP_API_URL}/sessionLogout`, {
						method: 'POST',
						credentials: 'include',
						withCredentials: true,
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							idToken: Cookies.get('idToken')
						}),
						// mode: 'no-cors',
					})
					.then(response => response.json())
					.then(data => {
						if(data.success) {
							Cookies.remove('idToken');
							authService.logout();
						}
					})
					.catch((error) => {
						console.error(error);
					});
					
					return;
				}

                const userDataObj = {
                    uuid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    emailVerified: user.emailVerified,
                };

                // dispatch(
                //     authActions.updateState({
                //         userData: userDataObj
                //     }),
                // );

                // Post session to server when login by firebase
                return authApp.currentUser.getIdToken().then((token) => {
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
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								idToken: token,
								csrfToken: csrfToken,
							}),
						});
					}

                    localStorage.setItem('access_token', token);

                    if (!userData) {
                        getUserData(userDataObj);
                    }
                });
            } else {
                dispatch(
                    authActions.updateState({
                        userData: null,
                    }),
                );

                dispatch(cartActions.clearCart());
                if (isLoggingOut) {
                    dispatch(authActions.setIsLoggingOut(false));
                }

				localStorage.removeItem('access_token');


                // Cookies.remove('csrfToken');
                // Cookies.remove('session');
                // Cookies.remove('idToken');
            }
		});

		// Cleanup subscription on unmount
		return () => {
			unregisterAuthObserver();
			// onChangeToken();
		};
	}, [dispatch]);

    //dispatch, fetchUser, postUserInfo
	// userData.displayName, userData.uuid, userData.email, userData.photoURL, userData.emailVerified

	useEffect(() => {
		if (userData) {
			localStorage.setItem('userData', JSON.stringify(userData));
		} else {
			localStorage.removeItem('userData');
		}
	}, [userData]);

	return (
		<Fragment>
			<MyRoutes/>
		</Fragment>
	);
}

export default App;
