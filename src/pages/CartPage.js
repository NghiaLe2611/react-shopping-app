import { useState, useEffect, useRef, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cartActions } from '../store/cart';
import CartItem from '../components/cart/CartItem';
import classes from '../scss/Cart.module.scss';
import { Link } from 'react-router-dom';
import { formatCurrency, readPrice } from '../helpers/helpers';
import Modal from '../components/UI/Modal';
import { useDelayUnmount } from '../hooks/useDelayUnmount';
import couponImg1 from '../assets/images/coupon1.svg';
import couponImg2 from '../assets/images/coupon2.svg';
import couponIcon from '../assets/images/coupon-icon.svg';
import couponBg from '../assets/images/coupon-bg.svg';
import couponCondition from '../assets/images/coupon-condition.svg';
import couponActive from '../assets/images/coupon-active.svg';
import freeshipCoupon from '../assets/images/freeship.png';
import Swal from 'sweetalert2';

const couponList = [
    {
        id: 1,
        type: 'discount',
        discount: 500,
        condition: 16000000,
        date: '10/03/2022'
    },
    {
        id: 2,
        type: 'discount',
        discount: 300,
        condition: 9000000,
        date: '10/03/2022'
    },
    {
        id: 3,
        type: 'discount',
        discount: 200,
        condition: 5000000,
        date: '10/03/2022'
    },
    {
        type: 'discount',
        discount: 100,
        condition: 2000000,
        date: '10/03/2022'
    },
    {
        id: 4,
        discount: 20,
        condition: 500000,
        date: '10/03/2022'
    },
    {
        id: 5,
        type: 'shipping',
        discount: 30,
        condition: 5000000,
        date: '20/03/2022'
    }
];

const CartPage = () => {
    const dispatch = useDispatch();
    const [customerInfo, setCustomerInfo] = useState(null);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [selectedCoupons, setSelectedCoupons] = useState([]);

    const showCart = useSelector(state => state.cart.isShowCart);
    const cart = useSelector((state) => state.cart);
	const userData = useSelector((state) => state.auth.userData);
    const selectAlInput = useRef();

    const shouldRenderCouponModal = useDelayUnmount(showCouponModal, 300);

    useEffect(() => {
        if (showCart) {
            dispatch(cartActions.showCartPopup(false));
        }
    }, []);

    useEffect(() => {
        if (showCouponModal) {
            document.querySelector('html').classList.add('modal-open');
            document.body.classList.add('modal-open');
        } else {
            document.querySelector('html').classList.remove('modal-open');
            document.body.classList.remove('modal-open');
        }

    }, [showCouponModal]);

    useEffect(() => {
        if (userData.listAddress && userData.listAddress.length) {
            const index = userData.listAddress.findIndex(val => val.default === true);
            setCustomerInfo(userData.listAddress[index]);
        }
    }, [userData]);

    useEffect(() => {
        if (isSelectAll) {
            dispatch(cartActions.updateCartItems({
                updatedItems: cart.items
            })); 
        }

        if (cart.items.length > 0) {
            localStorage.setItem('cartItems', JSON.stringify(cart.items));
        } else {
            localStorage.removeItem('cartItems');
        }
    }, [cart.items]);

    const checkInputSelectHandler = () => {
        if (cart.finalItems.length === cart.items.length) {
            selectAlInput.current.checked = true;
        } else if ( cart.finalItems.length === 0 || cart.finalItems.length < cart.items.length) {
            selectAlInput.current.checked = false;
        }
    };

    const selectAllHandler = (e) => {
        
        if (e.target.checked) {
            setIsSelectAll(true);
            for (let i = 0; i < cart.items.length; i++) {
                const item = cart.items[i];
                let isExist = cart.finalItems.filter(val => val._id === item._id).length > 0;;

                // if (item.color) {
                //     isExist = cart.finalItems.filter(val => (val.color === item.color && val._id === item._id)).length > 0;
                // } else {
                //     isExist = cart.finalItems.filter(val => val._id === item._id).length > 0;
                // }

                if (isExist) {
                    continue;
                }
                dispatch(cartActions.confirmChooseCart({
                    type: 'ADD', item
                }));
            }
        } else {
            setIsSelectAll(false);
            cart.items.forEach(item => {
                dispatch(cartActions.confirmChooseCart({
                    type: 'REMOVE', item
                })); 
            });
        }
    };

    const removeCartHandler = () => {
        if (cart.finalItems.length > 0) {
            let r = window.confirm("Bạn có chắc muốn xóa sản phẩm này ?");
            
            Swal.fire({
                icon: 'warning',
                html: `<p>Bạn có chắc muốn xoá những sản phẩm này ?</p>`,
                confirmButtonText: 'Xoá',
                confirmButtonColor: '#2f80ed',
                showCancelButton: true,
                cancelButtonText: 'Huỷ',
                cancelButtonColor: '#dc3741'
            }).then(result => {
                if (result.isConfirmed) {
                    cart.finalItems.forEach(item => {
                        // dispatch(cartActions.removeCartItem({
                        //     type: 'REMOVE', item
                        // }));
                        dispatch(cartActions.removeCartItem(item._id));
                    });
                }
                return;
            });
        } else {
            const Toast = Swal.mixin({
				toast: true,
				showConfirmButton: false,
				timer: 2000,
                background: 'rgba(0,0,0,0.8)'
			});

			Toast.fire({
				html: `<p style="color: #fff">Vui lòng chọn sản phẩm để xoá !</p>`
			});
        }
    };

    const showCouponModalHandler = () => {
        setShowCouponModal(true);
    };

    const closeCouponModalHandler = () => {
        setShowCouponModal(false);
    };

    const addCoupon = (item) => {
        const index = selectedCoupons.findIndex(val => val === item.id);

        if (index < 0) {
            const coupons = [...selectedCoupons, item.id];
            setSelectedCoupons(coupons);
        } else {
            let coupons = [...selectedCoupons]
            coupons.splice(index, 1);
            setSelectedCoupons(coupons);
        }
    };
    
    return (
        <div className="container">
            <Fragment>
                <h2>GIỎ HÀNG</h2>
                {
                    cart.items.length > 0 ? (
                        <Fragment>
                            <div className={classes['wrap-cart']}>
                                <div className={classes.left}>
                                    <div className={`${classes['cart-heading']} ${classes.box}`}>
                                        <p className={classes['col-1']}>
                                            <label className={classes.checkbox}>
                                                <input type="checkbox" onChange={(e) => selectAllHandler(e)} ref={selectAlInput} />
                                                <span className={classes.checkmark}></span>
                                                <span className="txt">Tất cả ({cart.items.length} sản phẩm)</span>
                                            </label>
                                        </p>
                                        <p className={classes['col-2']}>Đơn giá</p>
                                        <p className={classes['col-3']}>Số lượng</p>
                                        <p className={classes['col-4']}>Thành tiền</p>
                                        <p className={classes['col-5']}>
                                            <span className='icon-trash-bin' title='Xoá các mục đã chọn' onClick={removeCartHandler}></span>
                                        </p>
                                    </div>
                                    <ul className={`${classes['cart-list']} ${classes.box}`}>
                                        {
                                            cart.items.length > 0 && cart.items.map((item) => (
                                                <CartItem key={item._id} isSelectAll={isSelectAll}
                                                    item={item} checkInputSelect={checkInputSelectHandler}
                                                />
                                            ))
                                            
                                        }
                                    </ul>
                                </div>
                                <div className={classes.right}>
                                    <div className={classes.block}>
                                        <div className={`${classes['wrap-ctm-info']} ${classes['block-inner']}`}>
                                            <div className={classes.head}>
                                                <span>Giao tới</span>
                                                <a href="/#">Thay đổi</a>
                                            </div>
                                            {
                                                customerInfo ? (
                                                <Fragment>
                                                        <div className={classes['ctm-info']}>
                                                            {customerInfo.name}<var>|</var>{customerInfo.phone}
                                                        </div>
                                                        <div className={classes.address}>
                                                            {`${customerInfo.address}${customerInfo.ward && `, ${customerInfo.ward.name}`}${customerInfo.district && `, ${customerInfo.district.name}`}${customerInfo.city && `, ${customerInfo.city.name}`}`}
                                                        </div>
                                                </Fragment>
                                                ) : null
                                            } 
                                        </div>
                                    </div>
                                    <div className={classes.block}>
                                        <div className={classes['block-inner']}>
                                            <p className={classes['coupon-txt']} onClick={showCouponModalHandler}>
                                                <img src={couponImg2} alt="coupon" />Chọn hoặc nhập Khuyến mãi khác
                                            </p>
                                        </div>
                                    </div>
                                    <div className={classes.block}>
                                        <div className={`${classes['price-items']} ${classes['block-inner']}`}>
                                            <p>
                                                <span>Tạm tính: </span>
                                                <strong>{formatCurrency(cart.totalPrice)}<small>đ</small></strong>
                                            </p>
                                            <p>
                                                <span>Giảm giá: </span>
                                                <strong>0<small>đ</small></strong>
                                            </p>
                                        </div>
                                        <div className={`${classes.total} ${classes['block-inner']}`}>
                                            Tổng cộng: 
                                            {cart.totalPrice > 0 ? (
                                                <span className={classes.lg}>{formatCurrency(cart.totalPrice)}<small>đ</small></span>
                                            ) : <span className={classes.sm}>Vui lòng chọn sản phẩm</span>}               
                                        </div> 
                                    </div>
                                    <button className={classes['cart-btn']}>Mua hàng ({cart.finalItems.length})</button>
                                </div>
                            </div>
                        </Fragment>
                        
                    ) : (
                        <div className={classes.empty}>
                            <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
                            <Link to='/'>Tiếp tục mua sắm</Link>
                        </div>
                    )
                }
            </Fragment>

            {
                shouldRenderCouponModal && (
                    <Modal isShowModal={showCouponModalHandler} animation='none' contentClass={classes.couponModal}
                        closeModal={closeCouponModalHandler}>
                        <div className={classes['wrap-coupon-modal']}>
                            <div className={classes.header}>Khuyến mãi</div>
                            <div className={classes['wrap-coupon']}>
                                <div className={classes['wrap-ip']}>
                                <img src={couponImg1} alt="coupon" />
                                    <input type='text' placeholder='Nhập mã giảm giá'/>
                                </div>
                                <button disabled={selectedCoupons.length > 0 ? false : true}>Áp dụng</button>
                            </div>
                            <div className={classes['body-scroll']}>
                            <div className={classes['coupon-list-wrapper']}>
                                <div className={classes['group-header']}>Mã giảm giá</div>
                                    <div className={classes['coupon-list']}>
                                        {
                                            [...couponList].sort(val => val.condition <= cart.totalPrice ? -1 : 1).map((item, index) => (
                                                <div key={index} className={`${classes['coupon-bg']} ${cart.totalPrice < item.condition ? classes.disabled : ''}`}>
                                                    {
                                                        selectedCoupons.includes(item.id) ? <img src={couponActive} alt='coupon-active' /> : <img src={couponBg} alt="coupon-bg" />
                                                    }
                                                    <div className={classes['coupon-content']}>
                                                        <div className={classes.left}>
                                                            {
                                                                item.type === 'shipping' ? <img src={freeshipCoupon} alt='freeship'/> :
                                                                <img src={couponIcon} alt='coupon-icon'/>
                                                            }
                                                        </div>
                                                        <div className={classes.right}>
                                                            <div className={classes['coupon-info']}>
                                                                <h5 className={classes.sale}>
                                                                    {item.type === 'shipping' ? `Giảm ${item.discount}K phí vận chuyển` : `Giảm ${item.discount}K`}
                                                                </h5>
                                                                <p>Cho đơn hàng từ {readPrice(item.condition)}</p>
                                                            </div>
                                                            <div className={classes['coupon-action']}>
                                                                <p className={classes.expire}>HSD: {item.date}</p>
                                                                {
                                                                    cart.totalPrice >= item.condition ? (
                                                                        selectedCoupons.includes(item.id) ? <button className={classes.apply} onClick={() => addCoupon(item)}>Bỏ Chọn</button> : 
                                                                            <button className={classes.apply} onClick={() => addCoupon(item)}>Áp Dụng</button>
                                                                    ) : <img src={couponCondition} alt='condition' />
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )
            }
        </div>
    )
}

export default CartPage;