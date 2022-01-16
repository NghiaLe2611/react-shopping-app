import React, { Fragment, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingIndicator from './components/UI/LoadingIndicator';
import PrivateRoute from './components/PrivateRoute';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from './store/auth';
import { authApp } from './firebase/config';

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
    const userData = useSelector(state => state.auth.userData);

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

                const userDataStorage = localStorage.getItem('userData');
                if (!userDataStorage) {
                    setTimeout(() => {
                        dispatch(authActions.updateState({
                            userData: userDataObj
                        }));
            
                        localStorage.setItem('userData', JSON.stringify(userDataObj));
                    }, 5200);
                }
            } else {
                console.log('Not logged in');       
                setTimeout(() => {
                    dispatch(authActions.updateState({
                        userData: null
                    }));
                    localStorage.removeItem('userData');
                }, 520);     
            }
        });

        // Cleanup subscription on unmount
        return () => unregisterAuthObserver();

    }, [dispatch]);

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
                    <Route exact path='dang-nhap' element={userData ? <Navigate to='/tai-khoan' /> : <Root><LoginPage/></Root>} />
                    <Route exact path='dang-ky' element={userData ? <Navigate to='/tai-khoan' /> : <Root><SignUpPage/></Root>} />
                    <Route path='tai-khoan/*'
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
