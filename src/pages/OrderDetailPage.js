import { Fragment } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import classes from '../scss/OrderDetail.module.scss';
import { Link } from 'react-router-dom';

const OrderDetailPage = () => {
    const location = useLocation();

    const getPaymentMethod = (method) => {
        if (method === 'p1') return 'Thanh toán khi nhận hàng';
        if (method === 'p2') return 'Thanh toán bằng ZaloPay';
        if (method === 'p3') return 'Thanh toán qua thẻ tín dụng, Visa'
    };

    if (location.state) {
        const { orderId, customerInfo, shippingMethod, paymentMethod} = location.state;
        return (
            <div className='container'>
                <div className={classes['wrap-order']}>
                    <div className={classes.confirm}>
                        <div className={classes.checked}>
                            <span className='icon-check-circle'></span><br/>
                            <p className={classes.lg}>Đơn hàng của bạn đã được xác nhận và đang trong quá trình xử lý.</p>
                        </div>   
                        <div className={classes.txt}>
                            <p>Mã đơn hàng: <span style={{fontWeight: '500'}}>#{orderId}</span></p>
                            <p>Thông tin xác nhận đơn hàng với chi tiết và theo dõi tình trạng đơn hàng đã được gửi về email của bạn.</p>
                            <p>Bạn cũng có thể kiểm tra tình trạng đơn hàng tại <Link to='/tai-khoan/don-hang'>đây</Link>.</p>
                        </div>
                    </div>
                    <div className={classes.detail}>
                        <p className={classes.lg}>Chi tiết đơn hàng #{orderId} - <span style={{fontWeight: '500'}}>Đang xử lý</span></p>
                        <div className={classes.group}>
                            <div className={classes.heading}>Thông tin đơn hàng</div>
                            <div className={classes.info}>
                                <p>
                                    <span className={classes.lbl}>Mã đơn hàng: </span>
                                    <span className={classes.txt}>{orderId}</span>
                                </p>
                                <p>
                                    <span className={classes.lbl}>Ngày đặt hàng: </span>
                                    <span className={classes.txt}>{ new Date().toString() }</span>
                                </p>
                                <p>
                                    <span className={classes.lbl}>Hình thức giao hàng: </span>
                                    <span className={classes.txt}>{ shippingMethod === 1 ? 'Giao siêu tốc' : 'Giao tiết kiệm' }</span>
                                </p>
                                <p>
                                    <span className={classes.lbl}>Hình thức thanh toán: </span>
                                    <span className={classes.txt}>
                                        { getPaymentMethod(paymentMethod.id) }
                                        { paymentMethod.id === 'p3' ? 
                                            <Fragment>
                                                <br/><span className={classes.success}>Thanh toán thành công</span><br/>
                                                <span className={classes.card}>Số thẻ: {paymentMethod.card}</span>
                                            </Fragment> : null
                                        }
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className={classes.group}>
                            <div className={classes.heading}>Thông tin người nhận</div>
                            <div className={classes.info}>
                                <p>
                                    <span className={classes.lbl}>Tên: </span>
                                    <span className={classes.txt}>{customerInfo.name}</span>
                                </p>
                                <p>
                                    <span className={classes.lbl}>Địa chỉ: </span>
                                    <span className={classes.txt}>{customerInfo.address}</span>
                                </p>
                                <p>
                                    <span className={classes.lbl}>Điện thoại: </span>
                                    <span className={classes.txt}>{customerInfo.phone}</span>
                                </p>
                            </div>
                        </div>
                        <div className={classes.group}>
                            <table className={classes['products-table']}>
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Tạm tính</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <Navigate to='/'/>;
    }
};

export default OrderDetailPage;