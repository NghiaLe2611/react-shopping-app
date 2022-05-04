import { Fragment, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { shippingFee, fastShippingFee, formatCurrency, convertProductLink,
    convertDateTime, getOrderStatus, getPaymentMethod, getDayName } from '../../helpers/helpers';
import classes from '../../scss/OrderDetail.module.scss';
import iconShipping from '../../assets/images/icon-shipping.svg';
import iconFastShipping from '../../assets/images/icon-fast-shipping.svg';
import LoadingIndicator from '../UI/LoadingIndicator';
import useCheckMobile from '../../hooks/useCheckMobile';

const OrderDetail = () => {
    const orderId = useParams().orderId;
    const [orderDetail, setOrderDetail] = useState(null);
    const { isLoading, error, fetchData: getOrderDetail } = useFetch();
    const {isMobile} = useCheckMobile();

    useEffect(() => {
        getOrderDetail({
            url: `${process.env.REACT_APP_API_URL}/api/v1/orders/${orderId}`
        }, data => {
            if (data) {
                setOrderDetail(data);
            }
        });
    }, [getOrderDetail, orderId]);

    let orderContent;

    if (isLoading) {
        orderContent = <LoadingIndicator/>
    }

    if (!isLoading && !error) {
        if (orderDetail) {
            if (!isMobile) {
                orderContent = (
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
                                            <img src={iconFastShipping} className={`${classes.shipping} ${classes.fast}`} alt='fast-shipping' />Giao siêu tốc
                                        </p> : 
                                        <p>
                                            <img src={iconShipping} className={`${classes.shipping} ${classes.standard}`} alt='standard-shipping' />Giao tiết kiệm
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
                                                            <Link to={`/${item.category === 'smartphone' ? 'dien-thoai' : 'may-tinh-bang'}/${convertProductLink(item.name)}`}>
                                                                {item.category === 'smartphone' ? 'Điện thoại ' : 'Máy tính bảng '} 
                                                                {item.name}{item.color && ` - Màu ${item.color}`}
                                                            </Link>
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
            } else {
                orderContent = (
					<Fragment>
						<div className={classes.group}>
							<div className={classes['wrap-title']}>
								<span className='icon-letter'></span>
								<h4 className={classes.title}>Mã đơn hàng: {orderId}</h4>
							</div>
							<div className={classes.content}>
								<div className={classes['order-date']}>Ngày đặt hàng: {convertDateTime(orderDetail.orderDate)}</div>
								<div className={classes.time}>Dự kiến giao: {orderDetail.shippingMethod === 1 ? 'Giao trước 11:59 sáng mai' : `Giao vào ${getDayName()}`}</div>
							</div>
						</div>
						<div className={classes.group}>
							<div className={classes['wrap-title']}>
								<span className='icon-truck'></span>
								<h4 className={classes.title}>Theo dõi đơn hàng</h4>
							</div>
							<div className={classes.content}>
								<div className={classes['order-date']}>Ngày đặt hàng: {convertDateTime(orderDetail.orderDate)}</div>
								<div className={classes.time}>Dự kiến giao: {orderDetail.shippingMethod === 1 ? 'Giao trước 11:59 sáng mai' : `Giao vào ${getDayName()}`}</div>
							</div>
						</div>
						<div className={classes.group}>
							<div className={classes['wrap-title']}>
								<span className='icon-map'></span>
								<h4 className={classes.title}>Địa chỉ người nhận</h4>
							</div>
							<div className={classes.content}>
								<p className={classes['ctm-name']}>{orderDetail.customerName}</p>
								<p>{orderDetail.address}</p>
								<p>{orderDetail.phone}</p>
							</div>
						</div>
						<div className={classes.group}>
							<div className={classes['wrap-title']}>
								<span className='icon-package'></span>
								<h4 className={classes.title}>Thông tin kiện hàng</h4>
							</div>
							<ul className={classes.items}>
                                {orderDetail.products.map((item) => (
                                    <li key={item._id}>
                                        <div className={classes.img}>
                                            <img src={item.img} alt={item.name} />
                                        </div>
                                        <div className={classes['product-info']}>
                                            <Link to={`/${item.category === 'smartphone' ? 'dien-thoai' : 'may-tinh-bang'}/${convertProductLink(item.name)}`}>
                                                {item.category === 'smartphone' ? 'Điện thoại ' : 'Máy tính bảng '}
                                                {item.name}
                                                {item.color && ` - Màu ${item.color}`}
                                            </Link>
                                            <p>
                                                <span className={classes.price}>{formatCurrency(item.price)}đ</span> x {item.quantity}
                                            </p>
                                            {/* <p>{formatCurrency(item.price*item.quantity)}₫</p> */}
                                        </div>
                                    </li>
                                ))}
                            </ul>
						</div>
						<div className={classes.group}>
							<div className={classes['wrap-title']}>
								<span className='icon-earth'></span>
								<h4 className={classes.title}>Hình thức giao hàng</h4>
							</div>
							<div className={classes.content}>
								{orderDetail.shippingMethod === 1 ? (
									<p>
										<img src={iconFastShipping} className={`${classes.shipping} ${classes.fast}`} alt='fast-shipping' />
										Giao siêu tốc
									</p>
								) : (
									<p>
										<img src={iconShipping} className={`${classes.shipping} ${classes.standard}`} alt='standard-shipping' />
										Giao tiết kiệm
									</p>
								)}
							</div>
						</div>
						<div className={classes.group}>
							<div className={classes['wrap-title']}>
								<span className='icon-credit-card'></span>
								<h4 className={classes.title}>Hình thức thanh toán</h4>
							</div>
							<div className={classes.content}>
								<p>{orderDetail.paymentMethod.id ? getPaymentMethod(orderDetail.paymentMethod.id) : getPaymentMethod(orderDetail.paymentMethod)}</p>
								{orderDetail.paymentMethod.id === 'p3' ? (
									<Fragment>
										<p className={classes.success}>Thanh toán thành công</p>
										<p className={classes.card}>Số thẻ: {orderDetail.paymentMethod.card}</p>
									</Fragment>
								) : null}
							</div>
						</div>
                        <div className={classes.group}>
                            <div className={classes.total}>
                                <span className={classes.text}>Tạm tính</span>
                                <span className={classes.value}>{formatCurrency(orderDetail.totalPrice)} đ</span>
                            </div>
                            <div className={classes.total}>
                                <span className={classes.text}>Giảm giá</span>
                                <span className={`${classes.value} ${classes.discount}`}>{orderDetail.discount > 0 ? `-${formatCurrency(orderDetail.discount)} đ` : `0 đ`}</span>
                            </div>
                            <div className={classes.total}>
                                <span className={classes.text}>Phí vận chuyển</span>
                                <span className={classes.value}>{orderDetail.shippingMethod === 1 ? formatCurrency(fastShippingFee) : formatCurrency(shippingFee)} đ</span>
                            </div>
                            <div className={`${classes.total} ${classes.sum}`}>
                                <span className={classes.text}>Thành tiền</span>
                                <span className={classes.value}>{formatCurrency(orderDetail.finalPrice)} ₫</span>
                            </div>
                        </div>
					</Fragment>
				);
            }
        }
    }

    if (error) {
        orderContent = <p>{error}</p>;
    }

    return (
        <div className='container'>
            <div className={classes['wrap-order-detail']}>
                {orderContent}
            </div>
        </div>
    );
};

export default OrderDetail;