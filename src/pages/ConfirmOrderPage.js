import { Fragment } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import classes from '../scss/ConfirmOrder.module.scss';
import { Link } from 'react-router-dom';
import { convertDateTime, formatCurrency, convertProductLink, 
    shippingFee, fastShippingFee, getPaymentMethod } from '../helpers/helpers';

const ConfirmOrderPage = () => {
    const location = useLocation();

    if (location.state) {
        const { orderId, customerInfo, shippingMethod, paymentMethod, orderDate, products,
            discount, totalPrice, finalPrice } = location.state;
        return (
            <div className='container'>
                <div className={classes['wrap-order']}>
                    <div className={classes.confirm}>
                        <div className={classes.checked}>
                            <span className='icon-check-circle'></span><br/>
                            <p className={classes.lg}>Đơn hàng của bạn đã được hệ thống xác nhận và đang xử lý.</p>
                        </div>   
                        <div className={classes.txt}>
                            <p>Mã đơn hàng: <span style={{fontWeight: '500'}}>#{orderId}</span></p>
                            <p>Thông tin xác nhận đơn hàng với chi tiết và theo dõi tình trạng đơn hàng đã được gửi về email của bạn.</p>
                            <p>Bạn cũng có thể kiểm tra tình trạng đơn hàng tại <Link to='/tai-khoan/don-hang'>đây</Link>.</p>
                            <p>
                                <Link to='/' className={classes.shopping}>Tiếp tục mua hàng</Link>
                            </p>
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
                                    <span className={classes.txt}>{ convertDateTime(orderDate) }</span>
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
                            <table className={classes['product-list']}>
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Tạm tính</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        products.map(item => (
                                            <tr key={item._id}>
                                                <td>
                                                    <div className={classes.product}>
                                                        <img src={item.img} alt={item.name} />
                                                        <div className={classes['product-info']}>
                                                            <Link to={`/${item.category === 'smartphone' ? 'dien-thoai' : 'may-tinh-bang'}/${convertProductLink(item.name)}`}>{item.category === 'smartphone' ? 'Điện thoại' : 'Máy tính bảng'} {item.name}</Link>
                                                            <span className={classes.review}>Viết nhận xét</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{formatCurrency(item.price)}đ</td>
                                                <td>{item.quantity}</td>
                                                <td>{formatCurrency(item.price*item.quantity)}₫</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="3"><span>Tạm tính</span></td>
                                        <td>{formatCurrency(totalPrice)} đ</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3"><span>Phí vận chuyển</span></td>
                                        <td>{shippingMethod === 1 ? formatCurrency(fastShippingFee) : formatCurrency(shippingFee)} đ</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3"><span>Giảm giá</span></td>
                                        <td>{discount > 0 ? `-${formatCurrency(discount)} đ` : `0 đ`}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3"><span>Tổng cộng</span></td>
                                        <td><span className={classes.sum}>{formatCurrency(finalPrice)} ₫</span></td>
                                    </tr>
                                </tfoot>
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

export default ConfirmOrderPage;