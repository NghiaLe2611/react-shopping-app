import React, { useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from './store/auth';
import { cartActions } from './store/cart';
import { authApp } from './firebase/config';
import useFetch from './hooks/useFetch';
import { authService } from './api/auth-service';
import Cookies from 'js-cookie';
import MyRoutes from './routes';
import jwt from 'jsonwebtoken';

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

		// Get user data
        const getUserData = (userDataObj) => {
            fetchUser({
                url: `${process.env.REACT_APP_API_URL}/api/v1/me/account`
            }, (data) => {
                    if (!data) {
                        dispatch(
                            authActions.updateState({
                                userData: userDataObj
                            })
                        );
                        postUserData();
                    } else {
                        let cloneData = (({ uuid, email, photoURL, emailVerified, ...val }) => val)(data);
                        
                        if (userDataObj.emailVerified) {
                            cloneData = (({ uuid, displayName, email, photoURL, emailVerified, ...val }) => val)(data);
                        }

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
        
		const unregisterAuthObserver = authApp.onAuthStateChanged(async (user) => {
            if (user) {
                // const lastTimeLogin = user.metadata.lastLoginAt;
				const currentTime = new Date().getTime();
				const token = Cookies.get('idToken');
				
				// Log out user if more than 1h
				if (token) {
					const decodedToken = jwt.decode(token);
					if (currentTime >= decodedToken.exp * 1000) {
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
				}

                const userDataObj = {
                    uuid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    emailVerified: user.emailVerified,
                };

                // Post session to server when login by firebase
                return authApp.currentUser.getIdToken().then(async (token) => {
                   const prevCookie = Cookies.get('idToken');
                   const csrfToken = Cookies.get('csrfToken');
       
                    if (prevCookie === undefined || prevCookie !== token) {
						Cookies.set('idToken', token, {
							expires: 1,
						}); // 1 day

						try {
							const response = await fetch(`${process.env.REACT_APP_API_URL}/sessionLogin`, {
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

							if (!response.ok) {
								throw new Error(`HTTP error! Status: ${response.status}`);
							}

							// const data = await response.json();
						} catch (error) {
							console.error('Fetch error:', error);
						}

						  
						// fetch(`${process.env.REACT_APP_API_URL}/sessionLogin`, {
						// 	method: 'POST',
						// 	credentials: 'include',
						// 	withCredentials: true,
						// 	headers: {
						// 		Accept: 'application/json',
						// 		'Content-Type': 'application/json',
						// 	},
						// 	body: JSON.stringify({
						// 		idToken: token,
						// 		csrfToken: csrfToken,
						// 	}),
						// });
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
            }
		});

		// Cleanup subscription on unmount
		return () => {
			unregisterAuthObserver();
		};
	}, [dispatch, fetchUser, isLoggingOut, postUserInfo, userData]);

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
