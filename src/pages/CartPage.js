import { useState, useEffect, useRef, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cartActions } from '../store/cart';
import CartItem from '../components/cart/CartItem';
import { Link, useNavigate } from 'react-router-dom';
import CouponModal from '../components/UI/CouponModal';
import SelectedCoupons from '../components/UI/SelectedCoupons';
import AddressModal from '../components/UI/AddressModal';
import { formatCurrency } from '../helpers/helpers';
import Swal from 'sweetalert2';
import classes from '../scss/Cart.module.scss';

// function convertCouponByDate(date) {
//     let day = date.getDate();
//     let month = date.getMonth() + 1;
//     const year = date.getFullYear();

//     if (day.toString().length < 2) {
//         day = '0' + day;
//     }

//     if (month.toString().length < 2) {
//         month = '0' + month;
//     }

//     return day + month + year;
// }

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [customerInfo, setCustomerInfo] = useState(null);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [showCouponPopup, setShowCouponPopup] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    // const [selectedCoupons, setSelectedCoupons] = useState([]);

    const showCart = useSelector(state => state.cart.isShowCart);
    const cart = useSelector((state) => state.cart);
	const userData = useSelector((state) => state.auth.userData);
	const shippingInfo = useSelector((state) => state.auth.shippingInfo);

    const selectAlInput = useRef();

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
    }, [showCouponModal]);

    useEffect(() => {   
        if (shippingInfo) {
            setCustomerInfo(shippingInfo);
            return;
        }
        if (userData.listAddress && userData.listAddress.length) {
            const index = userData.listAddress.findIndex(val => val.default === true);
            setCustomerInfo(userData.listAddress[index]);
        }
    }, [userData, shippingInfo]);

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

    // const onAddCoupon = (item) => {
    //     const index = selectedCoupons.findIndex(val => val.id === item.id);
    //     let coupons = [...selectedCoupons, item];

    //     if (index < 0) { 
    //         const discountExistIndex = selectedCoupons.findIndex(val => val.type === 'discount');
            
    //         if (discountExistIndex >= 0) {
    //             if (item.type === 'shipping') {
    //                 setSelectedCoupons(coupons);
    //             } else {
    //                 coupons.splice(discountExistIndex, 1);
    //                 setSelectedCoupons(coupons);
    //             }
    //         }

    //         if (selectedCoupons.length < 2) {
    //             setSelectedCoupons(coupons);
    //         }
    //     } else {
    //         let updatedCoupons = [...selectedCoupons]
    //         updatedCoupons.splice(index, 1);
    //         setSelectedCoupons(updatedCoupons);
    //     }
    // };

    const showCouponModalHandler = () => {
        setShowCouponModal(true);
    };

    const closeCouponModalHandler = () => {
        setShowCouponModal(false);
    };

    const showAddressModalHandler = (e) =>{
        e.preventDefault();
        setShowAddressModal(true);
    };

    const closeAddressModalHandler = (e) =>{
        setShowAddressModal(false);
    };

    const goToCartConfirm = () => {
        if (cart.finalItems.length > 0) {
            navigate('/cartConfirm');
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
                                                <a href="/#" onClick={showAddressModalHandler}>Thay đổi</a>
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
                                            <div className={classes.head}>
                                                <span>Khuyến mãi (tối đa 2)</span>
                                            </div>
                                            <SelectedCoupons showCouponModalHandler={showCouponModalHandler} 
                                                // addCoupon={onAddCoupon} 
                                            />
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
                                                <strong>
                                                    { cart.discount > 0 ? `-${formatCurrency(cart.discount)}` : formatCurrency(cart.discount)}
                                                    <small>đ</small>
                                                </strong>
                                            </p>
                                        </div>
                                        <div className={`${classes.total} ${classes['block-inner']}`}>
                                            Tổng cộng: 
                                            {cart.totalPrice > 0 ? (
                                                <span className={classes.lg}>{formatCurrency(cart.totalPrice - cart.discount)}<small>đ</small></span>
                                            ) : <span className={classes.sm}>Vui lòng chọn sản phẩm</span>}               
                                        </div> 
                                    </div>
                                    <button className={classes['cart-btn']} onClick={goToCartConfirm}
                                        disabled={cart.finalItems.length > 0 ? false : true}>Mua hàng ({cart.finalItems.length})
                                    </button>
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
            
            <CouponModal showCouponModal={showCouponModal} showCouponPopup={showCouponPopup} setShowCouponPopup={setShowCouponPopup}
                showCouponModalHandler={showCouponModalHandler} closeCouponModalHandler={closeCouponModalHandler} 
                // selectedCoupons={selectedCoupons} setSelectedCoupons={setSelectedCoupons} addCoupon={onAddCoupon}
            />

            <AddressModal showAddressModal={showAddressModal} closeAddModalHandler={closeAddressModalHandler} />

            {/* {
                shouldRenderCouponModal && (
                    <Modal isShowModal={showCouponModalHandler} closeModal={closeCouponModalHandler} 
                        animation='none' contentClass={classes.couponModal}>
                        <div className={classes['wrap-coupon-modal']}>
                            <div className={classes.header}>Khuyến mãi</div>
                            <div className={classes['wrap-coupon']}>
                                <div className={classes['wrap-ip']}>
                                    <img src={couponImg1} alt="coupon" />
                                    <input type='text' placeholder='Nhập mã giảm giá' onChange={onChangeCoupon} value={couponCode || ''} />
                                    <span className={classes.clear} style={{display: couponCode.length ? 'flex' : 'none'}} 
                                        onClick={() => setCouponCode('')}>&times;</span>
                                </div>
                                <button disabled={couponCode.length ? false : true} onClick={applyCouponCode}>Áp dụng</button>   
                                {
                                    codeStatus && (
                                        <p style={{color: 'red', fontSize: 12, width: '100%', marginTop: 10}}>
                                            { 
                                                codeStatus === 1 ? 'Bạn cần chọn sản phẩm trước khi dùng mã giảm giá' : 
                                                codeStatus === 2 ? 'Mã giảm giá không hợp lệ' : codeStatus === 3 ? 'Bạn chưa đủ điều kiện để áp dụng mã' : null
                                            }
                                        </p>
                                    )
                                }
                            </div>
                            <div className={classes['body-scroll']}>
                            <div className={classes['coupon-list-wrapper']}>
                                <div className={classes['group-header']}>Mã giảm giá</div>
                                    <div className={classes['coupon-list']}>
                                        {
                                            [...couponList].sort(val => val.condition <= cart.totalPrice ? -1 : 1).map((item, index) => (
                                                <div key={item.id} className={`${classes['coupon-bg']} ${cart.totalPrice < item.condition ? classes.disabled : ''}`}>
                                                    {
                                                        selectedCoupons.some(val => val.id === item.id) ? <img src={couponActive} alt='coupon-active' /> : <img src={couponBg} alt="coupon-bg" />
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
                                                                <button className={classes['btn-info']} onMouseEnter={(e) => showInfoCoupon(e, item)}
                                                                    // onMouseLeave={hideInfoCoupon}
                                                                >
                                                                    
                                                                    <span className={classes.info}>i</span>
                                                                </button>          
                                                            </div>
                                                            <div className={classes['coupon-action']}>
                                                                <p className={classes.expire}>HSD: {item.date}</p>
                                                                {
                                                                    cart.totalPrice >= item.condition ? (
                                                                        selectedCoupons.some(val => val.id === item.id) ? <button className={classes.apply} onClick={() => addCoupon(item)}>Bỏ Chọn</button> : 
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

            {
                shouldRenderCouponPopup && activeInfoCoupon && (
                    <Modal isShowModal={showCouponPopup && activeInfoCoupon} closeModal={hideInfoCoupon} backdrop={false} type='popup' 
                        position='fixed' modalStyles={modalStylesInline} contentClass={`${classes['modal-info-coupon']}`}>
                        <div className={classes['wrap-info-coupon']}>
                                <p>
                                <span>Mã</span>
                                <span>
                                    {activeInfoCoupon.code}
                                    <var onClick={copyCode}>
                                        <img src={iconCopy} alt='copy-code' />
                                    </var>
                                </span>
                            </p>
                            <p>
                                <span>Hạn sử dụng</span>
                                <span>{activeInfoCoupon.date}</span>
                            </p>
                            <p>
                                <span>Điều kiện</span>
                                <span>•&nbsp;
                                    {activeInfoCoupon.type === 'shipping' && `Giảm ${activeInfoCoupon.discount}K phí vận chuyển`}
                                    {activeInfoCoupon.type === 'discount' && `Giảm ${activeInfoCoupon.discount}K cho đơn hàng từ ${readPrice(activeInfoCoupon.condition)}`}
                                    {activeInfoCoupon.type === 'special' && `Giảm ${activeInfoCoupon.discount}K (mã đặc biệt)`}
                                </span>
                            </p>
                        </div>
                    </Modal>
                )
            } */}



        </div>
    )
}

export default CartPage;