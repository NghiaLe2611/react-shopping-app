import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDelayUnmount } from 'hooks/useDelayUnmount';
import { useDispatch, useSelector } from 'react-redux';
import classes from 'scss/CouponModal.module.scss';
import { cartActions } from 'store/cart';
import Swal from 'sweetalert2';
import Modal from '../Modal';
import couponImg1 from 'assets/images/coupon1.svg';
import CouponList, { couponList } from './CouponList';

const CouponModal = (props) => {
	const dispatch = useDispatch();
	const { appliedCoupons, totalPrice, finalItems } = useSelector((state) => state.cart);

	// const [selectedCoupons, setSelectedCoupons] = useState(appliedCoupons);
	const [couponCode, setCouponCode] = useState('');
	const [codeStatus, setCodeStatus] = useState(null);

	const { showCouponModal, showCouponModalHandler, closeCouponModalHandler } = props;

	const shouldRenderCouponModal = useDelayUnmount(showCouponModal, 300);

	// Get total discount
	const calculateDiscount = useCallback(() => {
		if (appliedCoupons.length) {
			return appliedCoupons.reduce((n, { discount }) => n + discount * 1000, 0);
		}
		return 0;
	}, [appliedCoupons]);
	const totalDiscount = useMemo(() => calculateDiscount(), [calculateDiscount]);

	useEffect(() => {
		dispatch(cartActions.setDiscount(totalDiscount));
	}, [totalDiscount]);

	const closeCouponModal = () => {
		closeCouponModalHandler();
		setCouponCode('');
		setCodeStatus(null);
	};

	const onChangeCoupon = (e) => {
		setCouponCode(e.target.value);
	};

	const applyCouponSuccess = (code) => {
		Swal.fire({
			icon: 'success',
			title: `Mã khuyến mãi "${code}" đã được áp dụng`,
			showConfirmButton: false,
			iconColor: '#068209',
			timer: 1500,
			customClass: {
				popup: classes.swal,
				title: classes['swal-title'],
				icon: classes['swal-icon'],
			},
		});
	};

	const applyCouponCode = () => {
		if (!finalItems.length) {
			setCodeStatus(1); // 1: chưa chọn sản phẩm
		} else {
			const couponIndex = couponList.findIndex((val) => val.code === couponCode);
			const discountExistIndex = appliedCoupons.findIndex((val) => val.type === 'discount');

			const discountExisted = appliedCoupons.findIndex((val) => val.code === couponCode);

			if (discountExisted >= 0) {
				setCodeStatus(4); // 4: mã giảm giá đã được áp dụng
				return;
			}

			if (couponIndex >= 0) {
				const appliedCoupon = couponList[couponIndex];
				const coupons = [...appliedCoupons, appliedCoupon];

				if (totalPrice >= appliedCoupon.condition) {
					dispatch(cartActions.setAppliedCoupons([...appliedCoupons, appliedCoupon]));
					applyCouponSuccess(appliedCoupon.code);

					if (discountExistIndex >= 0) {
						if (appliedCoupon.type === 'shipping') {
							dispatch(cartActions.setAppliedCoupons(coupons));
						} else {
							coupons.splice(discountExistIndex, 1);
							dispatch(cartActions.setAppliedCoupons(coupons));
						}
					}
				} else {
					setCodeStatus(3); // 3: chưa đủ điều kiện áp dụng
				}
			} else {
				setCodeStatus(2); // 2: mã giảm không hợp lệ
			}
		}
	};

	const renderCodeStatus = useMemo(() => {
		let message = '';
		switch (codeStatus) {
			case 1:
				message = 'Bạn cần chọn sản phẩm trước khi dùng mã giảm giá';
				break;
			case 2:
				message = 'Mã giảm giá không hợp lệ';
				break;
			case 3:
				message = 'Bạn chưa đủ điều kiện để áp dụng mã';
				break;
			case 4:
				message = 'Mã giảm giá đã được áp dụng';
				break;
			default:
				// Handle any other cases here
				break;
		}

		return <p style={{ color: 'red', fontSize: 12, width: '100%', marginTop: 10 }}>{message}</p>;
	}, [codeStatus]);

	return (
		<Fragment>
			{shouldRenderCouponModal && (
				<Modal
					isShowModal={showCouponModalHandler}
					closeModal={closeCouponModal}
					animation='none'
					contentClass={classes.couponModal}>
					<div className={classes['wrap-coupon-modal']}>
						<div className={classes.header}> Khuyến mãi </div>
						<div className={classes['wrap-coupon']}>
							<div className={classes['wrap-ip']}>
								<img src={couponImg1} alt='coupon' />
								<input type='text' placeholder='Nhập mã giảm giá' onChange={onChangeCoupon} value={couponCode || ''} />
								<span
									className={classes.clear}
									style={{ display: couponCode.length ? 'flex' : 'none' }}
									onClick={() => setCouponCode('')}>
									&times;
								</span>
							</div>
							<button disabled={couponCode.length ? false : true} onClick={applyCouponCode}>
								Áp dụng
							</button>
							{renderCodeStatus}
						</div>
						<CouponList />
					</div>
				</Modal>
			)}
		</Fragment>
	);
};

export default CouponModal;
