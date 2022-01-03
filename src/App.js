import React, { Fragment, Suspense, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingIndicator from './components/UI/LoadingIndicator';
import { firebase } from './firebase/config';
import 'firebase/compat/auth';
import { useDispatch } from 'react-redux';
import { authActions } from './store/auth';

// import Root from './components/UI/Root';
// import HomePage from './pages/HomePage';
// import DetailPage from './pages/DetailPage';
// import CategoryPage from './pages/CategoryPage';
// import NotFound from './pages/NotFound';
// import BrandPage from './pages/BrandPage';
// import CartPage from './pages/CartPage';
// import ComparePage from './pages/ComparePage';

const Root = React.lazy(() => import('./components/UI/Root'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const DetailPage = React.lazy(() => import('./pages/DetailPage'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const BrandPage = React.lazy(() => import('./pages/BrandPage'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const ComparePage = React.lazy(() => import('./pages/ComparePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const SignUpPage = React.lazy(() => import('./pages/SignUpPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                console.log('Not logged in');
                dispatch(authActions.updateState({
                    isLoggedIn: false,
                    userData: null
                }));
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userData');

                return;
            }

            const token = await user.getIdToken();
            const userData = {
                id: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL
            };

            dispatch(authActions.updateState({
                isLoggedIn: token ? true : false,
                userData: userData
            }));

            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('userData', JSON.stringify(userData));
        });

		return () => unregisterAuthObserver();
    }, []);

	return (
		<Fragment>
            <Suspense fallback={<LoadingIndicator type='fixed'/>}>
                <Routes>
                    <Route exact path='/' element={<Root><HomePage /></Root>}/>
                    <Route exact path='dien-thoai/:productId' element={<Root><DetailPage/></Root>} />
                    <Route exact path='may-tinh-bang/:productId' element={<Root><DetailPage/></Root>} />
                    <Route path='dien-thoai/hang/:brand' element={<Root><BrandPage/></Root>} />
                    <Route path='may-tinh-bang/hang/:brand' element={<Root><BrandPage/></Root>} />
                    <Route path=':category' element={<Root><CategoryPage/></Root>} />
                    <Route path='so-sanh/:category' element={<Root><ComparePage/></Root>} />
                    <Route path='/cart' element={<Root><CartPage/></Root>} />
                    <Route path='dang-nhap' element={<Root><LoginPage/></Root>} />
                    <Route path='dang-ky' element={<Root><SignUpPage/></Root>} />
                    <Route path='tai-khoan' element={<Root><ProfilePage/></Root>} />
                    <Route path='*' element={<NotFound />} />
                    <Route path='/not-found' element={<NotFound />} />
                </Routes>
            </Suspense>
		</Fragment>
	);
}

export default App;
