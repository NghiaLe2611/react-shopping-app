import { useState, useEffect, useRef, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cartActions } from '../store/cart';
import CartItem from '../components/cart/CartItem';
import classes from '../scss/Cart.module.scss';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../helpers/helpers';
import Modal from '../components/UI/Modal';
import { useDelayUnmount } from '../hooks/useDelayUnmount';
import couponImg from '../assets/images/coupon.svg';
import freeshipImg from '../assets/images/freeship.png';

const CartPage = () => {
    const dispatch = useDispatch();
    const [customerInfo, setCustomerInfo] = useState(null);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [showCouponModal, setShowCouponModal] = useState(false);
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
        
            if (r) {
                cart.finalItems.forEach(item => {
                    // dispatch(cartActions.removeCartItem({
                    //     type: 'REMOVE', item
                    // }));
                    dispatch(cartActions.removeCartItem(item._id));
                });
            }
        } else {
            alert('Vui lòng chọn sản phẩm để xoá');
        }
    };

    const showCouponModalHandler = () => {
        setShowCouponModal(true);
    };

    const closeCouponModalHandler = () => {
        setShowCouponModal(false);
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
                                        <div class={`${classes['wrap-ctm-info']} ${classes['block-inner']}`}>
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
                                                <img src={couponImg} alt="coupon" />Chọn hoặc nhập Khuyến mãi khác
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
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.2803 14.7803L14.7803 10.2803C15.0732 9.98744 15.0732 9.51256 14.7803 9.21967C14.4874 8.92678 14.0126 8.92678 13.7197 9.21967L9.21967 13.7197C8.92678 14.0126 8.92678 14.4874 9.21967 14.7803C9.51256 15.0732 9.98744 15.0732 10.2803 14.7803Z" fill="#808089"></path><path d="M10.125 10.5C10.7463 10.5 11.25 9.99632 11.25 9.375C11.25 8.75368 10.7463 8.25 10.125 8.25C9.50368 8.25 9 8.75368 9 9.375C9 9.99632 9.50368 10.5 10.125 10.5Z" fill="#808089"></path><path d="M15 14.625C15 15.2463 14.4963 15.75 13.875 15.75C13.2537 15.75 12.75 15.2463 12.75 14.625C12.75 14.0037 13.2537 13.5 13.875 13.5C14.4963 13.5 15 14.0037 15 14.625Z" fill="#808089"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 5.25C3.33579 5.25 3 5.58579 3 6V9.75C3 10.1642 3.33579 10.5 3.75 10.5C4.61079 10.5 5.25 11.1392 5.25 12C5.25 12.8608 4.61079 13.5 3.75 13.5C3.33579 13.5 3 13.8358 3 14.25V18C3 18.4142 3.33579 18.75 3.75 18.75H20.25C20.6642 18.75 21 18.4142 21 18V14.25C21 13.8358 20.6642 13.5 20.25 13.5C19.3892 13.5 18.75 12.8608 18.75 12C18.75 11.1392 19.3892 10.5 20.25 10.5C20.6642 10.5 21 10.1642 21 9.75V6C21 5.58579 20.6642 5.25 20.25 5.25H3.75ZM4.5 9.08983V6.75H19.5V9.08983C18.1882 9.41265 17.25 10.5709 17.25 12C17.25 13.4291 18.1882 14.5874 19.5 14.9102V17.25H4.5V14.9102C5.81181 14.5874 6.75 13.4291 6.75 12C6.75 10.5709 5.81181 9.41265 4.5 9.08983Z" fill="#808089"></path></svg>
                                    <input type='text' placeholder='Nhập mã giảm giá'/>
                                </div>
                                <button>Áp dụng</button>
                            </div>
                            <div className={classes['coupon-list-wrapper']}>
                                <div className={classes['group-header']}>Mã giảm giá</div>
                                <div className={classes['coupon-list']}>
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 431 132" className={classes['coupon-bg']}><g fill="none" fill-rule="evenodd"><g><g><g><g><g><g transform="translate(-3160 -2828) translate(3118 80) translate(42 2487) translate(0 140) translate(0 85) translate(0 36)"><path fill="#FFF" d="M423 0c4.418 0 8 3.582 8 8v116c0 4.418-3.582 8-8 8H140.5c0-4.419-3.582-8-8-8s-8 3.581-8 8H8c-4.418 0-8-3.582-8-8V8c0-4.418 3.582-8 8-8h116.5c0 4.418 3.582 8 8 8s8-3.582 8-8H392z"></path><g stroke="#EEE" stroke-dasharray="2 4" stroke-linecap="square" mask="url(#14s2l20tnb)"><path d="M0.5 0L0.5 114" transform="translate(132 11)"></path></g></g></g></g></g></g></g></g></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 431 132" class={classes['coupon-bg']}><g fill="none" fill-rule="evenodd"><g><g><g><g><g><g transform="translate(-3160 -3100) translate(3118 80) translate(42 2487) translate(0 449) translate(0 48) translate(0 36)"><path stroke="#017FFF" fill="#E5F2FF" d="M 423 0.5 c 2.071 0 3.946 0.84 5.303 2.197 c 1.358 1.357 2.197 3.232 2.197 5.303 h 0 v 116 c 0 2.071 -0.84 3.946 -2.197 5.303 c -1.357 1.358 -3.232 2.197 -5.303 2.197 h 0 H 140.986 c -0.125 -2.148 -1.047 -4.082 -2.475 -5.51 c -1.539 -1.54 -3.664 -2.49 -6.011 -2.49 s -4.472 0.95 -6.01 2.489 c -1.429 1.428 -2.35 3.362 -2.476 5.51 h 0 l -116.014 0.001 c -2.071 0 -3.946 -0.84 -5.303 -2.197 c -1.358 -1.357 -2.197 -3.232 -2.197 -5.303 h 0 V 8 c 0 -2.071 0.84 -3.946 2.197 -5.303 c 1.357 -1.358 3.232 -2.197 5.303 -2.197 h 116.014 c 0.125 2.148 1.047 4.082 2.476 5.51 c 1.538 1.539 3.663 2.49 6.01 2.49 s 4.472 -0.951 6.01 -2.49 c 1.429 -1.428 2.35 -3.362 2.476 -5.51 H 140.986 z"></path><g stroke="#017FFF" stroke-dasharray="2 4" stroke-linecap="square" mask="url(#2nm5hm2qlb)"><path d="M0.5 0L0.5 114" transform="translate(132 11)"></path></g></g></g></g></g></g></g></g></svg>
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