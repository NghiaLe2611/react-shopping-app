import {useState, useEffect, useRef, Fragment} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {cartActions} from '../store/cart';
import CartItem from '../components/cart/CartItem';
import {Link, useNavigate} from 'react-router-dom';
import CouponModal from '../components/UI/CouponModal';
import SelectedCoupons from '../components/UI/SelectedCoupons';
import AddressModal from '../components/UI/AddressModal';
import {formatCurrency} from '../helpers/helpers';
import Swal from 'sweetalert2';
import classes from '../scss/Cart.module.scss';

const CartPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [customerInfo, setCustomerInfo] = useState(null);
	const [isSelectAll, setIsSelectAll] = useState(false);
	const [showCouponModal, setShowCouponModal] = useState(false);
	const [showCouponPopup, setShowCouponPopup] = useState(false);
	const [showAddressModal, setShowAddressModal] = useState(false);

	const showCart = useSelector((state) => state.cart.isShowCart);
	const cart = useSelector((state) => state.cart);
	const userData = useSelector((state) => state.auth.userData);
	const shippingInfo = useSelector((state) => state.auth.shippingInfo);

	const selectAlInput = useRef();

	useEffect(() => {
        const finalItemsStorage = localStorage.getItem('finalItems');
        if (finalItemsStorage) {
            dispatch(
				cartActions.updateCartItems({
					updatedItems: JSON.parse(finalItemsStorage)
				})
			);
        }
    }, []);

	useEffect(() => {
		if (showCart) {
			dispatch(cartActions.showCartPopup(false));
		}
	}, [showCart]);

	useEffect(() => {
		if (showCouponModal) {
			document.querySelector('html').classList.add('modal-open');
			document.body.classList.add('modal-open');
		} else {
			document.querySelector('html').classList.remove('modal-open');
			document.body.classList.remove('modal-open');
		}

		return () => {};
	}, [showCouponModal]);

	useEffect(() => {
		if (shippingInfo) {
			setCustomerInfo(shippingInfo);
			return;
		}
		if (userData && userData.addresses && userData.addresses.length) {
			const index = userData.addresses.findIndex((val) => val.default === true);
			setCustomerInfo(userData.addresses[index]);
		}
	}, [userData, shippingInfo]);

	useEffect(() => {
		if (isSelectAll) {
			dispatch(
				cartActions.updateCartItems({
					updatedItems: cart.items,
				})
			);
		}

		// if (cart.items.length > 0) {
		// 	localStorage.setItem('cartItems', JSON.stringify(cart.items));
		// } else {
		// 	setIsSelectAll(false);
		// 	localStorage.removeItem('cartItems');
		// }
	}, [cart.items, isSelectAll]);

    useEffect(() => {
        if (cart.finalItems.length) {
            localStorage.setItem('finalItems', JSON.stringify(cart.finalItems));
        } else {
            localStorage.removeItem('finalItems');
        }
    }, [cart.finalItems]);

	const checkInputSelectHandler = () => {
		if (cart.finalItems.length === cart.items.length) {
			selectAlInput.current.checked = true;
		} else if (cart.finalItems.length === 0 || cart.finalItems.length < cart.items.length) {
			selectAlInput.current.checked = false;
		}
	};

	const selectAllHandler = (e) => {
		if (e.target.checked) {
			setIsSelectAll(true);
			for (let i = 0; i < cart.items.length; i++) {
				const item = cart.items[i];
				let isExist = cart.finalItems.filter((val) => val.product_id === item.product_id).length > 0;

				if (isExist) {
					continue;
				}
				dispatch(
					cartActions.confirmChooseCart({
						type: 'ADD',
						item,
					})
				);
			}
		} else {
			setIsSelectAll(false);
			cart.items.forEach((item) => {
				dispatch(
					cartActions.confirmChooseCart({
						type: 'REMOVE',
						item,
					})
				);
			});
		}
	};

	const removeCartHandler = () => {
		if (cart.finalItems.length > 0) {
			Swal.fire({
				icon: 'warning',
				html: `<p>Bạn có chắc muốn xoá những sản phẩm này ?</p>`,
				confirmButtonText: 'Xoá',
				confirmButtonColor: '#2f80ed',
				showCancelButton: true,
				cancelButtonText: 'Huỷ',
				cancelButtonColor: '#dc3741',
			}).then((result) => {
                console.log(result);
				if (result.isConfirmed) {
					// cart.finalItems.forEach((item) => {
					// 	dispatch(cartActions.removeCartItem(item.product_id));
					// });
                    console.log(111);
                    dispatch(cartActions.removeCartItem({
                        type: 'MULTIPLE',
                        items: cart.finalItems
                    }));
				}
				return;
			});
		} else {
			const Toast = Swal.mixin({
				toast: true,
				showConfirmButton: false,
				timer: 2000,
				background: 'rgba(0,0,0,0.8)',
			});

			Toast.fire({
				html: `<p style="color: #fff">Vui lòng chọn sản phẩm để xoá !</p>`,
			});
		}
	};

	const showCouponModalHandler = () => {
		setShowCouponModal(true);
	};

	const closeCouponModalHandler = () => {
		setShowCouponModal(false);
	};

	const showAddressModalHandler = (e) => {
		e.preventDefault();
		setShowAddressModal(true);
	};

	const closeAddressModalHandler = (e) => {
		setShowAddressModal(false);
	};

	const goToCartConfirm = () => {
		if (cart.finalItems.length > 0) {
			navigate('/cartConfirm');
		}
	};

	return (
		<div className='container'>
			<Fragment>
				<h2> GIỎ HÀNG </h2>
				{cart.items.length > 0 ? (
					<Fragment>
						<div className={classes['wrap-cart']}>
							<div className={classes.left}>
								<div className={`${classes['cart-heading']} ${classes.box}`}>
									<p className={classes['col-1']}>
										<label className={classes.checkbox}>
											<input type='checkbox' onChange={(e) => selectAllHandler(e)} ref={selectAlInput} /> <span className={classes.checkmark}> </span>
											<span className='txt'>Tất cả ({cart.items.length} sản phẩm)</span>
										</label>
									</p>
									<p className={classes['col-2']}>Đơn giá </p> <p className={classes['col-3']}> Số lượng </p> <p className={classes['col-4']}>Thành tiền </p>
									<p className={classes['col-5']}>
										<span className='icon-trash-bin' title='Xoá các mục đã chọn' onClick={removeCartHandler}></span>
									</p>
								</div>
								<ul className={`${classes['cart-list']} ${classes.box}`}>
									{cart.items.length > 0 &&
										cart.items.map((item) => <CartItem key={item.product_id} isSelectAll={isSelectAll} item={item} checkInputSelect={checkInputSelectHandler} />)}
								</ul>
							</div>
							<div className={classes.right}>
								{userData && (
									<div className={classes.block}>
										<div className={`${classes['wrap-ctm-info']} ${classes['block-inner']}`}>
											<div className={classes.head}>
												<span> Giao tới </span>
												<a href='/#' onClick={showAddressModalHandler}>Thay đổi</a>
											</div>
											{customerInfo ? (
												<Fragment>
													<div className={classes['ctm-info']}>
														{customerInfo.name} <var> | </var>
														{customerInfo.phone}
													</div>
													<div className={classes.address}>
														{`${customerInfo.address}${customerInfo.ward && `, ${customerInfo.ward.name}`}${customerInfo.district && `, ${customerInfo.district.name}`}${
															customerInfo.city && `, ${customerInfo.city.name}`
														}`}
													</div>
												</Fragment>
											) : null}
										</div>
									</div>
								)}
								<div className={classes.block}>
									<div className={classes['block-inner']}>
										<div className={classes.head}>
											<span>Khuyến mãi (tối đa 2)</span>
										</div>
										<SelectedCoupons
											showCouponModalHandler={showCouponModalHandler}
											// addCoupon={onAddCoupon}
										/>
									</div>
								</div>
								<div className={classes.block}>
									<div className={`${classes['price-items']} ${classes['block-inner']}`}>
										<p>
											<span>Tạm tính: </span>
											<strong>
												{formatCurrency(cart.totalPrice)}
												<small>đ</small>
											</strong>
										</p>
										<p>
											<span>Giảm giá: </span>
											<strong>
												{cart.discount > 0 ? `-${formatCurrency(cart.discount)}` : formatCurrency(cart.discount)}
												<small>đ</small>
											</strong>
										</p>
									</div>
									<div className={`${classes.total} ${classes['block-inner']}`}>
										Tổng cộng:
										{cart.totalPrice > 0 ? (
											<span className={classes.lg}>
												{formatCurrency(cart.totalPrice - cart.discount)}
												<small>đ</small>
											</span>
										) : (
											<span className={classes.sm}>Vui lòng chọn sản phẩm</span>
										)}
									</div>
								</div>
								<button className={classes['cart-btn']} onClick={goToCartConfirm} disabled={cart.finalItems.length > 0 ? false : true}>
									Mua hàng ({cart.finalItems.length})
								</button>
							</div>
						</div>
					</Fragment>
				) : (
					<div className={classes.empty}>
						<p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
						<Link to='/'>Tiếp tục mua sắm</Link>
					</div>
				)}
			</Fragment>

			<CouponModal
				showCouponModal={showCouponModal}
				showCouponPopup={showCouponPopup}
				setShowCouponPopup={setShowCouponPopup}
				showCouponModalHandler={showCouponModalHandler}
				closeCouponModalHandler={closeCouponModalHandler}
				// selectedCoupons={selectedCoupons} setSelectedCoupons={setSelectedCoupons} addCoupon={onAddCoupon}
			/>

			<AddressModal showAddressModal={showAddressModal} closeAddModalHandler={closeAddressModalHandler} />
		</div>
	);
};

export default CartPage;
