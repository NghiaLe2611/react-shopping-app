import { useLocation, Navigate } from 'react-router-dom';

const OrderDetailPage = () => {
    const location = useLocation();

    if (location.state && location.state.orderId) {
        return <div>ORDER_ID: {location.state.orderId}</div>;
    } else {
        return <Navigate to='/'/>;
    }
};

export default OrderDetailPage;