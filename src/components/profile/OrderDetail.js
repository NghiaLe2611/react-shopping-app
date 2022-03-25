import { Fragment, useState, useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useFetch from '../../hooks/useFetch';
import { shippingFee, fastShippingFee, formatCurrency, convertProductLink,
    convertDateTime, getOrderStatus, getPaymentMethod } from '../../helpers/helpers';
import classes from '../../scss/OrderDetail.module.scss';
import iconShipping from '../../assets/images/icon-shipping.svg';
import iconFastShipping from '../../assets/images/icon-fast-shipping.svg';

const OrderDetail = () => {
    const orderId = useParams().orderId;
    const [orderDetail, setOrderDetail] = useState(null);
    const { isLoading, fetchData: getOrderDetail } = useFetch();

    useEffect(() => {
        const randomStr = Math.random().toString(36).substring(2, 16);
        getOrderDetail({
            url: `${process.env.REACT_APP_API_URL}/order/${orderId}`,
            headers: { 'x-request-id': randomStr + '_' + orderId }
        }, data => {
            if (data) {
                setOrderDetail(data);
            }
        });
    }, [getOrderDetail, orderId]);

    return (
        <div className='container'>
            <div className={classes['wrap-order-detail']}>
                {
                    orderDetail && (
                        <Fragment>
                            <div className={classes.heading}>Chi tiết đơn hàng #{orderId} - <span>{getOrderStatus(orderDetail.status)}</span></div>
                            <div className={classes['order-date']}>Ngày đặt hàng: { convertDateTime(orderDetail.orderDate) }</div>
                            <div className={classes['wrap-order-info']}>
                                <div className={classes.group}>
                                    <p className={classes.title}>Địa chỉ người nhận</p>
                                    <div className={classes.content}>
                                        <p className={classes.name}>{orderDetail.customerName}</p>
                                        <p>Địa chỉ: {orderDetail.address}</p>
                                        <p>Điện thoại: {orderDetail.phone}</p>
                                    </div>
                                </div>
                                <div className={classes.group}>
                                    <p className={classes.title}>Hình thức giao hàng</p>
                                    <div className={classes.content}>
                                        {
                                            orderDetail.shippingMethod === 1 ? 
                                            <p>
                                                <img src={iconFastShipping} className={classes.fast} alt='fast-shipping' />Giao siêu tốc
                                            </p> : 
                                            <p>
                                                <img src={iconShipping} className={classes.standard} alt='standard-shipping' />Giao tiết kiệm
                                            </p>
                                        }
                                    </div>
                                </div>
                                <div className={classes.group}>
                                    <p className={classes.title}>Hình thức thanh toán</p>
                                    <div className={classes.content}>
                                        <p>{orderDetail.paymentMethod.id ? getPaymentMethod(orderDetail.paymentMethod.id) : getPaymentMethod(orderDetail.paymentMethod)}</p>
                                        { orderDetail.paymentMethod.id === 'p3' ? 
                                            <Fragment>
                                                <p className={classes.success}>Thanh toán thành công</p>
                                                <p className={classes.card}>Số thẻ: {orderDetail.paymentMethod.card}</p>
                                            </Fragment> : null
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className={classes['wrap-product-list']}>
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
                                            orderDetail.products.map(item => (
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
                                            <td colSpan="3"><span>Tạm tính</span></td>
                                            <td>{formatCurrency(orderDetail.totalPrice)} đ</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3"><span>Phí vận chuyển</span></td>
                                            <td>{orderDetail.shippingMethod === 1 ? formatCurrency(fastShippingFee) : formatCurrency(shippingFee)} đ</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3"><span>Giảm giá</span></td>
                                            <td>{orderDetail.discount > 0 ? `-${formatCurrency(orderDetail.discount)} đ` : `0 đ`}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3"><span>Tổng cộng</span></td>
                                            <td><span className={classes.sum}>{formatCurrency(orderDetail.finalPrice)} ₫</span></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </Fragment>
                    )
                }
            </div>
        </div>
    );
};

export default OrderDetail;