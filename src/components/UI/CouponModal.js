import {useState, useEffect, useCallback, useMemo, Fragment} from 'react';
import classes from '../../scss/CouponModal.module.scss';
import Modal from './Modal';
import {useSelector, useDispatch} from 'react-redux';
import {cartActions} from '../../store/cart';
import {readPrice} from '../../helpers/helpers';
import Swal from 'sweetalert2';
import {debounce} from 'lodash';
import {useDelayUnmount} from '../../hooks/useDelayUnmount';

import couponImg1 from '../../assets/images/coupon1.svg';
import couponIcon from '../../assets/images/coupon-icon.svg';
import couponBg from '../../assets/images/coupon-bg.svg';
import couponCondition from '../../assets/images/coupon-condition.svg';
import couponActive from '../../assets/images/coupon-active.svg';
import freeshipCoupon from '../../assets/images/freeship.png';
import iconCopy from '../../assets/images/icon-copy.svg';
import useCheckMobile from '../../hooks/useCheckMobile';

const couponList = [
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


const CouponModal = (props) => {
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart);

	const [selectedCoupons, setSelectedCoupons] = useState(cart.appliedCoupons);
	const [activeInfoCoupon, setActiveInfoCoupon] = useState(null);
	const [couponCode, setCouponCode] = useState('');
	const [codeStatus, setCodeStatus] = useState(null);
	const [modalStylesInline, setModalStylesInline] = useState({});

	const {
		showCouponModal,
		showCouponModalHandler,
		closeCouponModalHandler,
		showCouponPopup,
		setShowCouponPopup,
		// selectedCoupons, setSelectedCoupons, addCoupon
	} = props;

	const shouldRenderCouponModal = useDelayUnmount(showCouponModal, 300);
	const shouldRenderCouponPopup = useDelayUnmount(showCouponPopup, 300);

    const {isMobile} = useCheckMobile();

	// Get total discount
	const calculateDiscount = useCallback(() => {
		if (selectedCoupons.length) {
			return selectedCoupons.reduce((n, {discount}) => n + discount * 1000, 0);
		}
		return 0;
	}, [selectedCoupons]);
	const totalDiscount = useMemo(() => calculateDiscount(), [calculateDiscount]);

	// const timer = (item) => {
	//     setTimeout(() => {
	//         setActiveInfoCoupon(item);
	//         setShowCouponPopup(true);
	//     }, 200);
	// };

    let timer;

	useEffect(() => {
		const updatedSelectedCoupons = selectedCoupons.filter((val) => val.condition <= cart.totalPrice);
		setSelectedCoupons(updatedSelectedCoupons);
	}, [cart.totalPrice]);

	useEffect(() => {
		dispatch(cartActions.setDiscount(totalDiscount));
	}, [totalDiscount]);

	useEffect(() => {
		setSelectedCoupons(cart.appliedCoupons);
	}, [cart.appliedCoupons]);

	useEffect(() => {
		function handleMouseEnter(e) {
			if (e.target.closest('.' + classes['modal-info-coupon']) || e.target.closest('.' + classes['btn-info'])) {
				return;
			} else {
				hideInfoCoupon();
			}
		}

		if (showCouponPopup && activeInfoCoupon) {
			document.addEventListener('mousemove', debounce(handleMouseEnter, 500));
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseEnter);
			if (timer) {
				clearTimeout(timer);
			}
		};
	}, [showCouponPopup, activeInfoCoupon, timer]);

	const closeCouponModal = () => {
		closeCouponModalHandler();
		setCouponCode('');
		setCodeStatus(null);
	};

	const hideInfoCoupon = () => {
		setActiveInfoCoupon(null);
		setShowCouponPopup(false);
	};

	const showInfoCoupon = (e, item) => {
		const pos = e.target.getBoundingClientRect();

        if (!isMobile) {
            setModalStylesInline({...modalStylesInline, left: pos.left - 11 * 16 + 22 + 'px', top: pos.y + 40 + 'px'});
        } else {
            const styles = {
                left: 0,
                top: 'inherit',
                bottom: 0,
                width: '100%'
            };

            setModalStylesInline(styles);
        }

		timer = window.setTimeout(function () {
			setActiveInfoCoupon(item);
			setShowCouponPopup(true);
		}, 200);
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
		if (!cart.finalItems.length) {
			setCodeStatus(1); // 1: chưa chọn sản phẩm
		} else {
			const couponIndex = couponList.findIndex((val) => val.code === couponCode);
			const discountExistIndex = selectedCoupons.findIndex((val) => val.type === 'discount');

			const discountExisted = cart.appliedCoupons.findIndex((val) => val.code === couponCode);

			if (discountExisted >= 0) {
				setCodeStatus(4); // 4: mã giảm giá đã được áp dụng
				return;
			}

			if (couponIndex >= 0) {
				const appliedCoupon = couponList[couponIndex];
				const coupons = [...selectedCoupons, appliedCoupon];

				if (cart.totalPrice >= appliedCoupon.condition) {
					setSelectedCoupons([...selectedCoupons, appliedCoupon]);
					applyCouponSuccess(appliedCoupon.code);

					if (discountExistIndex >= 0) {
						if (appliedCoupon.type === 'shipping') {
							setSelectedCoupons(coupons);
						} else {
							coupons.splice(discountExistIndex, 1);
							setSelectedCoupons(coupons);
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

	const addCoupon = (item) => {
		dispatch(cartActions.addCoupon(item));
	};

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
		<Fragment>
			
			{shouldRenderCouponModal && (
				<Modal isShowModal={showCouponModalHandler} closeModal={closeCouponModal} animation='none' contentClass={classes.couponModal}>
					<div className={classes['wrap-coupon-modal']}>
						<div className={classes.header}> Khuyến mãi </div>
						<div className={classes['wrap-coupon']}>
							<div className={classes['wrap-ip']}>
								<img src={couponImg1} alt='coupon' />
								<input type='text' placeholder='Nhập mã giảm giá' onChange={onChangeCoupon} value={couponCode || ''} />
								<span className={classes.clear} style={{display: couponCode.length ? 'flex' : 'none'}} onClick={() => setCouponCode('')}>
									
									& times;
								</span>
							</div>
							<button disabled={couponCode.length ? false : true} onClick={applyCouponCode}>
								
								Áp dụng
							</button>
							{codeStatus && (
								<p style={{color: 'red', fontSize: 12, width: '100%', marginTop: 10}}>
									
									{codeStatus === 1
										? 'Bạn cần chọn sản phẩm trước khi dùng mã giảm giá'
										: codeStatus === 2
										? 'Mã giảm giá không hợp lệ'
										: codeStatus === 3
										? 'Bạn chưa đủ điều kiện để áp dụng mã'
										: codeStatus === 4
										? 'Mã giảm giá đã được áp dụng'
										: null}
								</p>
							)}
						</div>
						<div className={classes['body-scroll']}>
							<div className={classes['coupon-list-wrapper']}>
								<div className={classes['group-header']}> Mã giảm giá </div>
								<div className={classes['coupon-list']}>
									
									{[...couponList]
										.sort((val) => (val.condition <= cart.totalPrice ? -1 : 1))
										.map((item, index) => (
											<div key={item.id} className={`${classes['coupon-bg']} ${cart.totalPrice < item.condition ? classes.disabled : ''}`}>
												
												{selectedCoupons.some((val) => val.id === item.id) ? <img src={couponActive} alt='coupon-active' /> : <img src={couponBg} alt='coupon-bg' />}
												<div className={classes['coupon-content']}>
													<div className={classes.left}>
														
														{item.type === 'shipping' ? <img src={freeshipCoupon} alt='freeship' /> : <img src={couponIcon} alt='coupon-icon' />}
													</div>
													<div className={classes.right}>
														<div className={classes['coupon-info']}>
															<h5 className={classes.sale}> {item.type === 'shipping' ? `Giảm ${item.discount}K phí vận chuyển` : `Giảm ${item.discount}K`} </h5>
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
															{cart.totalPrice >= item.condition ? (
																selectedCoupons.some((val) => val.id === item.id) ? (
																	<button className={classes.apply} onClick={() => addCoupon(item)}>Bỏ Chọn</button>
																) : (
																	<button className={classes.apply} onClick={() => addCoupon(item)}>Áp Dụng</button>
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
					</div>
				</Modal>
			)}
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
								{activeInfoCoupon.type === 'discount' && `Giảm ${activeInfoCoupon.discount}K cho đơn hàng từ ${readPrice(activeInfoCoupon.condition)}`}
								{activeInfoCoupon.type === 'special' && `Giảm ${activeInfoCoupon.discount}K (mã đặc biệt)`}
							</span>
						</p>
                        {isMobile && <div className={classes['hide-info']}>
                            <button onClick={() => hideInfoCoupon()}>Đóng</button>
                        </div>}
					</div>
				</Modal>
			)}
		</Fragment>
	);
};

export default CouponModal;
