import React, {Suspense} from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import LoadingIndicator from './components/UI/LoadingIndicator';

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
const TrackingPage = React.lazy(() => import('./pages/TrackingPage'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const MyRoutes = () => {
    const userData = useSelector((state) => state.auth.userData);

    return (
        <Suspense fallback={<LoadingIndicator type='fixed' />}>
            <Routes>
                <Route
                    exact
                    path='/'
                    element={
                        <Root>
                            <HomePage />
                        </Root>
                    }
                />
                <Route
                    path='dien-thoai/:productId'
                    element={
                        <Root>
                            <DetailPage />
                        </Root>
                    }
                />
                <Route
                    path='may-tinh-bang/:productId'
                    element={
                        <Root>
                            <DetailPage />
                        </Root>
                    }
                />
                <Route
                    path='dien-thoai/hang/:brand'
                    element={
                        <Root>
                            <BrandPage />
                        </Root>
                    }
                />
                <Route
                    path='may-tinh-bang/hang/:brand'
                    element={
                        <Root>
                            <BrandPage />
                        </Root>
                    }
                />
                <Route
                    exact
                    path=':category'
                    element={
                        <Root>
                            <CategoryPage />
                        </Root>
                    }
                />
                <Route
                    path='so-sanh/:category'
                    element={
                        <Root>
                            <ComparePage />
                        </Root>
                    }
                />
                <Route
                    exact
                    path='cart'
                    element={
                        <Root>
                            <CartPage />
                        </Root>
                    }
                />
                <Route
                    exact
                    path='cartConfirm'
                    element={
                        <Root>
                            <CartConfirmPage />
                        </Root>
                    }
                />
                <Route
                    exact
                    path='orderDetail/:orderId'
                    element={
                        <Root>
                            <ConfirmOrderPage />
                        </Root>
                    }
                />
                <Route
                    exact
                    path='dang-nhap'
                    element={
                        userData ? (
                            <Navigate to='/' />
                        ) : (
                            <Root>
                                <LoginPage />
                            </Root>
                        )
                    }
                />
                <Route
                    exact
                    path='dang-ky'
                    element={
                        userData ? (
                            <Navigate to='/' />
                        ) : (
                            <Root>
                                <SignUpPage />
                            </Root>
                        )
                    }
                />
                <Route
                    path='tai-khoan/*'
                    element={
                        <PrivateRoute>
                            <Root>
                                <ProfilePage />
                            </Root>
                        </PrivateRoute>
                    }
                />
                <Route
                    path='order/:orderId'
                    element={
                        <PrivateRoute>
                            <Root mobileView={true} title='Đơn hàng'>
                                <ProfilePage mobileView={true} />
                            </Root>
                        </PrivateRoute>
                    }
                />
                <Route
                    path='tracking'
                    element={
                        <Root>
                            <TrackingPage />
                        </Root>
                    }
                />
                {/* <Route path='tai-khoan' element={<Root><ProfilePage/></Root>} /> */}
                <Route path='*' element={<NotFound />} />
                <Route path='404' element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default MyRoutes;