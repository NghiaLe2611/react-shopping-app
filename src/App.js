import React, { useEffect, Fragment, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingIndicator from './components/UI/LoadingIndicator';
import PrivateRoute from './components/PrivateRoute';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from './store/auth';
import { authApp } from './firebase/config';
import useFetch from './hooks/useFetch';
import Cookies from 'js-cookie';

const Root = React.lazy(() => import('./components/UI/Root'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const DetailPage = React.lazy(() => import('./pages/DetailPage'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const BrandPage = React.lazy(() => import('./pages/BrandPage'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const CartConfirmPage = React.lazy(() => import('./pages/CartConfirmPage'));
const ConfirmOrderPage = React.lazy(() => import('./pages/ConfirmOrderPage'));
const ComparePage = React.lazy(() => import('./pages/ComparePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const SignUpPage = React.lazy(() => import('./pages/SignUpPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// import Root from './components/UI/Root';
// import HomePage from './pages/HomePage';
// import DetailPage from './pages/DetailPage';
// import CategoryPage from './pages/CategoryPage';
// import NotFound from './pages/NotFound';
// import BrandPage from './pages/BrandPage';
// import CartPage from './pages/CartPage';
// import ComparePage from './pages/ComparePage';

function getCookie(name) {
	const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return v ? v[2] : null;
}

function App() {
    const dispatch = useDispatch();
    const userData = useSelector(state => state.auth.userData);
    const accessToken = useSelector(state => state.auth.accessToken);

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
                headers: { 'Content-Type': 'application/json' },
                url: `${process.env.REACT_APP_API_URL}/submitUserData`,
                body: data
            });
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
        //         url: `${process.env.REACT_APP_API_URL}/updateUserData/${userData.uuid}`,
        //         body: data
        //     });
        // };
       
        const unregisterAuthObserver = authApp.onAuthStateChanged(async (user) => {
            if (user) {
                user.getIdToken().then(token => {
                    // window.cookie = '__session=' + token + ';max-age=86400';
                    if (Cookies.get('csrfToken') === undefined) {
                        // const csrfToken = getCookie('csrfToken');
                        Cookies.set('csrfToken', token, { expires: 1 }); // 1 day
                        fetch(`${process.env.REACT_APP_API_URL}/sessionLogin`, {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                                'CSRF-Token': Cookies.get('csrfToken'),
                            },
                            body: JSON.stringify({ token }),
                        });
                    }
 
                    dispatch(authActions.setToken(token));
                })

                const userDataObj = {
                    uuid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    emailVerified: user.emailVerified
                };

                dispatch(authActions.updateState({
                    userData: userDataObj
                }));
                dispatch(authActions.setIsLoggingOut(false));
                
                fetchUser({
                    url: `${process.env.REACT_APP_API_URL}/getUserData/${user.uid}` 
                }, data => {
                    // console.log(data);
                    if (!data) {
                        postUserData();
                    } else {
                        // updateUser();
                        const cloneData = (({ uuid, displayName, email, photoURL, emailVerified, ...val }) => val)(data);

                        dispatch(authActions.updateState({
                            userData: {...userDataObj, ...cloneData}
                        }));
                    }
                });
            } else {
                dispatch(authActions.updateState({
                    userData: null,
                }));
                dispatch(authActions.setToken(""));
                Cookies.remove('csrfToken');
            }
        });

        // Cleanup subscription on unmount
        return () => unregisterAuthObserver();

    }, [dispatch, fetchUser, postUserInfo]);

    // userData.displayName, userData.uuid, userData.email, userData.photoURL, userData.emailVerified
    
    useEffect(() => {
        if (userData) {
            // console.log('set storage');
            localStorage.setItem('userData', JSON.stringify(userData));
        } else {
            // console.log('remove storage');
            localStorage.removeItem('userData');
        }
    }, [userData]);

    useEffect(() => {
        if (accessToken) {
            localStorage.setItem('access_token', accessToken);
        } else {
            localStorage.removeItem('access_token');
        }
    }, [accessToken]);

	return (
		<Fragment>
            <Suspense fallback={<LoadingIndicator type='fixed'/>}>
                <Routes>
                    <Route exact path='/' element={<Root><HomePage /></Root>}/>
                    <Route path='dien-thoai/:productId' element={<Root><DetailPage/></Root>} />
                    <Route path='may-tinh-bang/:productId' element={<Root><DetailPage/></Root>} />
                    <Route path='dien-thoai/hang/:brand' element={<Root><BrandPage/></Root>} />
                    <Route path='may-tinh-bang/hang/:brand' element={<Root><BrandPage/></Root>} />
                    <Route exact path=':category' element={<Root><CategoryPage/></Root>} />
                    <Route path='so-sanh/:category' element={<Root><ComparePage/></Root>} />
                    <Route exact path='cart' element={<Root><CartPage/></Root>} />
                    <Route exact path='cartConfirm' element={<Root><CartConfirmPage/></Root>} />
                    <Route exact path='orderDetail/:orderId' element={<Root><ConfirmOrderPage/></Root>} />
                    <Route exact path='dang-nhap' element={userData ? <Navigate to='/tai-khoan' /> : <Root><LoginPage/></Root>} />
                    <Route exact path='dang-ky' element={userData ? <Navigate to='/tai-khoan' /> : <Root><SignUpPage/></Root>} />
                    <Route path='tai-khoan/*'
                        element={
                            <PrivateRoute>
                                <Root><ProfilePage/></Root>
                            </PrivateRoute>
                        }
                    />
                    <Route path='order/:orderId'
                        element={
                            <PrivateRoute>
                                <Root><ProfilePage/></Root>
                            </PrivateRoute>
                        }
                    />
                    {/* <Route path='tai-khoan' element={<Root><ProfilePage/></Root>} /> */}
                    <Route path='*' element={<NotFound />} />
                    <Route path='not-found' element={<NotFound />} />
                </Routes>
            </Suspense>
		</Fragment>
	);
}

export default App;
