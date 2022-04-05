import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children }) {
    const location = useLocation();
    const userData = useSelector(state => state.auth.userData);
    const isLoggingOut = useSelector(state => state.auth.isLoggingOut);

    // const slug = location.pathname.split('/').pop();
    // return isLoggedIn ? children : <Navigate to='/dang-nhap' state={{ from: location }}/>;

    if (userData) {
        return children;
    }

    if (!isLoggingOut) {
        return <Navigate to = '/dang-nhap'
        state = {
            { from: location } }
        replace / > ;
    } else {
        return <Navigate to = '/' / > ;
    }
}