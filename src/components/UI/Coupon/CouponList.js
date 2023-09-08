import couponActive from 'assets/images/coupon-active.svg';
import couponBg from 'assets/images/coupon-bg.svg';
import couponCondition from 'assets/images/coupon-condition.svg';
import couponIcon from 'assets/images/coupon-icon.svg';
import freeshipCoupon from 'assets/images/freeship.png';
import iconCopy from 'assets/images/icon-copy.svg';
import { readPrice } from 'helpers/helpers';
import useCheckMobile from 'hooks/useCheckMobile';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classes from 'scss/CouponModal.module.scss';
import { cartActions } from 'store/cart';
import { useDelayUnmount } from 'hooks/useDelayUnmount';
import Swal from 'sweetalert2';
import Modal from '../Modal';
import { debounce } from 'lodash';

export const couponList = [
	{
		id: 1,
		type: 'discount',
		discount: 500,
		code: 'DISCOUNT500KFOR16000000',
		condition: 16000000,
		date: '10/03/2022',
	},
	{
		id: 2,
		type: 'discount',
		discount: 300,
		code: 'DISCOUNT300KFOR9000000',
		condition: 9000000,
		date: '10/03/2022',
	},
	{
		id: 3,
		type: 'discount',
		discount: 200,
		code: 'DISCOUNT200KFOR5000000',
		condition: 5000000,
		date: '10/03/2022',
	},
	{
		id: 4,
		type: 'discount',
		discount: 100,
		code: 'DISCOUNT100KFOR2000000',
		condition: 2000000,
		date: '10/03/2022',
	},
	{
		id: 5,
		type: 'discount',
		discount: 20,
		code: 'DISCOUNT20KFOR500000',
		condition: 500000,
		date: '10/03/2022',
	},
	{
		id: 6,
		type: 'shipping',
		discount: 30,
		code: 'FREESHIP',
		condition: 5000000,
		date: '20/03/2022',
	},
];

const CouponList = () => {
	const dispatch = useDispatch();
	const { appliedCoupons, totalPrice } = useSelector((state) => state.cart);

	const [selectedCoupons, setSelectedCoupons] = useState([]);
	const [activeInfoCoupon, setActiveInfoCoupon] = useState(null);
	const [showCouponPopup, setShowCouponPopup] = useState(false);
	const [modalStylesInline, setModalStylesInline] = useState({});
    
	const { isMobile } = useCheckMobile();
	const shouldRenderCouponPopup = useDelayUnmount(showCouponPopup, 300);

	const timer = useRef(null);
	const debouncedHandleMouseEnter = useRef(null);

    // Hide info coupon code
	const hideInfoCoupon = useCallback(() => {
		setActiveInfoCoupon(null);
		setShowCouponPopup(false);
	}, [setShowCouponPopup]);

	useEffect(() => {
		setSelectedCoupons(appliedCoupons);
	}, [appliedCoupons]);

	// Handle mouseover on coupon item
	useEffect(() => {
		debouncedHandleMouseEnter.current = debounce(handleMouseEnter, 500);

		function handleMouseEnter(e) {
			if (e.target.closest('.' + classes['modal-info-coupon']) || e.target.closest('.' + classes['btn-info'])) {
				return;
			} else {
				hideInfoCoupon();
			}
		}

		if (showCouponPopup && activeInfoCoupon) {
			document.addEventListener('mousemove', debouncedHandleMouseEnter.current);
		}

		return () => {
            document.addEventListener('mousemove', debouncedHandleMouseEnter.current);
			// Clean up the debounced function
			debouncedHandleMouseEnter.current.cancel();
		};
	}, [showCouponPopup, activeInfoCoupon, hideInfoCoupon]);

	useEffect(() => {
		return () => {
			if (timer.current) {
				clearTimeout(timer.current);
			}
		};
	}, []);

	useEffect(() => {
		const updatedSelectedCoupons = selectedCoupons.filter((val) => val.condition <= totalPrice);
		setSelectedCoupons(updatedSelectedCoupons);
	}, [totalPrice]);

    // Show info coupon code
	const showInfoCoupon = (e, item) => {
		const pos = e.target.getBoundingClientRect();

		if (!isMobile) {
			setModalStylesInline({ ...modalStylesInline, left: pos.left - 11 * 16 + 22 + 'px', top: pos.y + 40 + 'px' });
		} else {
			const styles = {
				left: 0,
				top: 'inherit',
				bottom: 0,
				width: '100%',
			};

			setModalStylesInline(styles);
		}

		timer.current = window.setTimeout(function () {
			setActiveInfoCoupon(item);
			setShowCouponPopup(true);
		}, 100);
	};

    // Add coupon code
	const addCoupon = (item) => {
		dispatch(cartActions.addCoupon(item));
	};

    // Copy coupon code
	const copyCode = () => {
		if (activeInfoCoupon) {
			navigator.clipboard.writeText(activeInfoCoupon.code);

			Swal.fire({
				icon: 'success',
				title: 'Mã giảm giá đã được sao chép',
				showConfirmButton: false,
				iconColor: '#068209',
				timer: 1500,
				customClass: {
					popup: classes.swal,
					title: classes['swal-title'],
					icon: classes['swal-icon'],
				},
			});
		}
	};

	return (
		<>
			<div className={classes['body-scroll']}>
				<div className={classes['coupon-list-wrapper']}>
					<div className={classes['group-header']}>Mã giảm giá</div>
					<div className={classes['coupon-list']}>
						{[...couponList]
							.sort((val) => (val.condition <= totalPrice ? -1 : 1))
							.map((item, index) => (
								<div
									key={item.id}
									className={`${classes['coupon-bg']} ${totalPrice < item.condition ? classes.disabled : ''}`}>
									{selectedCoupons.some((val) => val.id === item.id) ? (
										<img src={couponActive} alt='coupon-active' />
									) : (
										<img src={couponBg} alt='coupon-bg' />
									)}
									<div className={classes['coupon-content']}>
										<div className={classes.left}>
											{item.type === 'shipping' ? (
												<img src={freeshipCoupon} alt='freeship' />
											) : (
												<img src={couponIcon} alt='coupon-icon' />
											)}
										</div>
										<div className={classes.right}>
											<div className={classes['coupon-info']}>
												<h5 className={classes.sale}>
													{' '}
													{item.type === 'shipping'
														? `Giảm ${item.discount}K phí vận chuyển`
														: `Giảm ${item.discount}K`}{' '}
												</h5>
												<p> Cho đơn hàng từ {readPrice(item.condition)} </p>
												<button
													className={classes['btn-info']}
													onMouseEnter={(e) => showInfoCoupon(e, item)}
													onClick={(e) => {
														if (isMobile) showInfoCoupon(e, item);
													}}
													// onMouseLeave={hideInfoCoupon}
												>
													<span className={classes.info}> i </span>
												</button>
											</div>
											<div className={classes['coupon-action']}>
												<p className={classes.expire}> HSD: {item.date} </p>
												{totalPrice >= item.condition ? (
													selectedCoupons.some((val) => val.id === item.id) ? (
														<button className={classes.apply} onClick={() => addCoupon(item)}>
															Bỏ Chọn
														</button>
													) : (
														<button className={classes.apply} onClick={() => addCoupon(item)}>
															Áp Dụng
														</button>
													)
												) : (
													<img src={couponCondition} alt='condition' />
												)}
											</div>
										</div>
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
			{shouldRenderCouponPopup && activeInfoCoupon && (
				<Modal
					isShowModal={showCouponPopup && activeInfoCoupon}
					closeModal={hideInfoCoupon}
					backdrop={false}
					type='popup'
					position='fixed'
					modalStyles={modalStylesInline}
					contentClass={`${classes['modal-info-coupon']}`}>
					<div className={classes['wrap-info-coupon']}>
						<p>
							<span>Mã </span>
							<span>
								{activeInfoCoupon.code}
								<var onClick={copyCode}>
									<img src={iconCopy} alt='copy-code' />
								</var>
							</span>
						</p>
						<p>
							<span>Hạn sử dụng </span> <span> {activeInfoCoupon.date} </span>
						</p>
						<p>
							<span>Điều kiện </span>
							<span>
								• &nbsp; {activeInfoCoupon.type === 'shipping' && `Giảm ${activeInfoCoupon.discount}K phí vận chuyển`}
								{activeInfoCoupon.type === 'discount' &&
									`Giảm ${activeInfoCoupon.discount}K cho đơn hàng từ ${readPrice(activeInfoCoupon.condition)}`}
								{activeInfoCoupon.type === 'special' && `Giảm ${activeInfoCoupon.discount}K (mã đặc biệt)`}
							</span>
						</p>
						{isMobile && (
							<div className={classes['hide-info']}>
								<button onClick={() => hideInfoCoupon()}>Đóng</button>
							</div>
						)}
					</div>
				</Modal>
			)}
		</>
	);
};

export default memo(CouponList);
