import React, {Fragment, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, convertProductLink, fastShippingFee, shippingFee,
	convertDateTime, getOrderStatus, getPaymentMethod } from '../helpers/helpers';
import useFetch from '../hooks/useFetch';
import classes from '../scss/Tracking.module.scss';
import iconShipping from '../assets/images/icon-shipping.svg';
import iconFastShipping from '../assets/images/icon-fast-shipping.svg';
import trackingImg from '../assets/images/tracking.jpg';
import LoadingIndicator from '../components/UI/LoadingIndicator';

const TrackingPage = () => {
	const [orderDetail, setOrderDetail] = useState({});
	const [searchKey, setSearchKey] = useState(null);

	let { isLoading, error, fetchData: trackingOrder } = useFetch();

	useEffect(() => {

	}, []);

	const searchOrder = () => {
		if (searchKey) {
            trackingOrder({
				url: `${process.env.REACT_APP_API_URL}/api/v1/orders/tracking/${searchKey}`
			}, data => {
				console.log(111, data);
				if (data) {
					setOrderDetail(data.result);
				}
			});		
        }
	};

	let content;

	if (isLoading) {
		content = <LoadingIndicator/>;
	} 
	
	if (!isLoading && !error) {
		if (orderDetail && Object.keys(orderDetail).length) {
			content = (
				<div className='card'>
					<div className={classes.heading}>
						Chi tiết đơn hàng #{orderDetail._id} - <span>{getOrderStatus(orderDetail.status)}</span>
					</div>
					<div className={classes['order-date']}>Ngày đặt hàng: {convertDateTime(orderDetail.orderDate)}</div>
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
								{orderDetail.shippingMethod === 1 ? (
									<p>
										<img src={iconFastShipping} className={classes.fast} alt='fast-shipping' />
										Giao siêu tốc
									</p>
								) : (
									<p>
										<img src={iconShipping} className={classes.standard} alt='standard-shipping' />
										Giao tiết kiệm
									</p>
								)}
							</div>
						</div>
						<div className={classes.group}>
							<p className={classes.title}>Hình thức thanh toán</p>
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
								{orderDetail.products.map((item) => (
									<tr key={item._id}>
										<td>
											<div className={classes.product}>
												<img src={item.img} alt={item.name} />
												<div className={classes['product-info']}>
													<Link to={`/${item.category === 'smartphone' ? 'dien-thoai' : 'may-tinh-bang'}/${convertProductLink(item.name)}`}>
														{item.category === 'smartphone' ? 'Điện thoại' : 'Máy tính bảng'} {item.name}
													</Link>
													<span className={classes.review}>Viết nhận xét</span>
												</div>
											</div>
										</td>
										<td>{formatCurrency(item.price)}đ</td>
										<td>{item.quantity}</td>
										<td>{formatCurrency(item.price * item.quantity)}₫</td>
									</tr>
								))}
							</tbody>
							<tfoot>
								<tr>
									<td colSpan='3'>
										<span>Tạm tính</span>
									</td>
									<td>{formatCurrency(orderDetail.totalPrice)} đ</td>
								</tr>
								<tr>
									<td colSpan='3'>
										<span>Phí vận chuyển</span>
									</td>
									<td>{orderDetail.shippingMethod === 1 ? formatCurrency(fastShippingFee) : formatCurrency(shippingFee)} đ</td>
								</tr>
								<tr>
									<td colSpan='3'>
										<span>Giảm giá</span>
									</td>
									<td>{orderDetail.discount > 0 ? `-${formatCurrency(orderDetail.discount)} đ` : `0 đ`}</td>
								</tr>
								<tr>
									<td colSpan='3'>
										<span>Tổng cộng</span>
									</td>
									<td>
										<span className={classes.sum}>{formatCurrency(orderDetail.finalPrice)} ₫</span>
									</td>
								</tr>
							</tfoot>
						</table>
					</div>
				</div>
			);
		} 
		
		if(!orderDetail) {
			content = <div>Không tìm thấy đơn hàng. Vui lòng thử lại.</div>
		}
	}
	
	if (error) {
		content = <div>{error}</div>;
	}

	return (
		<div className='container'>
			<div className={classes['wrap-tracking']}>
				<div className={classes.banner}>
					<img src={trackingImg} alt='tracking' />
					<div className={classes.content}>
						<h3>Tra cứu đơn hàng</h3>
						<div className={classes['search-order']}>
							<input type='text' placeholder='Nhập mã đơn hàng cần tra cứu' className={classes['search-ip']} onChange={(e) => { setSearchKey(e.target.value); }}/>
							<button className={classes['btn-tracking']} onClick={searchOrder}>Tra cứu</button>
						</div>
					</div>
				</div>
				{content}
			</div>
		</div>
	);
};

export default TrackingPage;
