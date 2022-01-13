import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children }) {
    const location = useLocation();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    // return isLoggedIn ? children : <Navigate to='/dang-nhap' state={{ from: location }}/>;

    if (isLoggedIn) {
        return children;
    }

    return <Navigate to='/dang-nhap' state={{ from: location }} replace/>;
}