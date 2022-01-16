import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children }) {
    const location = useLocation();
    const userData = useSelector(state => state.auth.userData);
    const slug = location.pathname.split('/').pop();
    console.log(slug);
    
    // return isLoggedIn ? children : <Navigate to='/dang-nhap' state={{ from: location }}/>;

    if (userData) {
        return children;
    }

    return <Navigate to='/dang-nhap' state={{ from: location }} replace/>;
}