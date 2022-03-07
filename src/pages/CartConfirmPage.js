import { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../components/UI/Modal';
import { formatCurrency, convertProductLink, readPrice } from '../helpers/helpers';
import couponImg1 from '../assets/images/coupon1.svg';
import couponImg2 from '../assets/images/coupon2.svg';
import couponIcon from '../assets/images/coupon-icon.svg';
import couponBg from '../assets/images/coupon-bg.svg';
import couponBgSm from '../assets/images/coupon-bg-sm.svg';
import couponCondition from '../assets/images/coupon-condition.svg';
import couponActive from '../assets/images/coupon-active.svg';
import freeshipCoupon from '../assets/images/freeship.png';
import iconCopy from '../assets/images/icon-copy.svg';
import iconShipping from '../assets/images/icon-shipping.svg';
import iconFastShipping from '../assets/images/icon-fast-shipping.svg';
import classes from '../scss/CartConfirm.module.scss';

const shippingFee = 15000;
const fastShippingFee = 30000;

const listPayment = [
    {
        id: 1,
        text: 'Thanh toán khi nhận hàng'
    },
    {
        id: 2,
        text: 'Thanh toán bằng ví ZaloPay',
        discount: 10
    },
    {
        id: 3,
        text: 'Thanh toán bằng thẻ quốc tế Visa, Master, JCB'
    },
];

const CartConfirmPage = () => {
    const dispatch = useDispatch();

    const [customerInfo, setCustomerInfo] = useState(null);
    const [showInfoProducts, setShowInfoProducts] = useState(false);
    const [shippingMethod, setShippingMethod] = useState('1');
    const [paymentMethod, setPaymentMethod] = useState(0);

    const cart = useSelector((state) => state.cart);
	const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        if (userData.listAddress && userData.listAddress.length) {
            const index = userData.listAddress.findIndex(val => val.default === true);
            setCustomerInfo(userData.listAddress[index]);
        }
    }, [userData]);

    const addCoupon = () => {

    };

    const showCouponModalHandler = () => {

    };

    const onChangeShippingMethod = (e) => {
        setShippingMethod(e.target.value);
    };

    const onChangePaymentMethod = (e) => {
        setPaymentMethod(e.target.value);
    };

    return (
        <div className='container'>
             <Fragment>
                {
                    cart.finalItems.length > 0 ? (
                        <div className={classes['wrap-cart-confirm']}>
                            <div className={classes.left}>
                                <h3 class={classes.title}>1. Chọn hình thức giao hàng</h3>
                                <div className={classes.box}>
                                    <div className={classes['wrap-shipping']}>
                                        <div className={classes['shipping-method']}>
                                            <label className={classes.checkbox}>
                                                <input type="radio" name='shipping_method' value='1' defaultChecked={shippingMethod}
                                                    onChange={onChangeShippingMethod}
                                                />
                                                <img src={iconFastShipping} className={classes.fast} alt='fast-shipping' />
                                                <span className={classes.checkmark}></span>Giao siêu tốc
                                            </label>
                                            <label className={classes.checkbox}>
                                                <input type="radio" name='shipping_method' value='2'  onChange={onChangeShippingMethod}/>
                                                <img src={iconShipping} className={classes.standard} alt='standard-shipping' />
                                                <span className={classes.checkmark}></span>Giao tiết kiệm
                                            </label>
                                        </div>
                                        <div className={classes['shipping-products']}>
                                            {
                                                cart.finalItems.length > 0 && (
                                                    cart.finalItems.map(item => (
                                                        <div key={item._id} className={classes.item}>
                                                            <div className={classes.img}>
                                                                <img src={item.img} alt={item.name} />
                                                            </div>
                                                            <div className={classes['wrap-info']}>
                                                                <p className={classes.name}>
                                                                    {item.category === 'smartphone' ? 'Điện thoại' : 'Máy tính bảng'} {item.name}
                                                                </p>
                                                                <div className={classes['sub-info']}>
                                                                    <p className={classes.qty}>SL: {item.quantity}</p>
                                                                    <p className={classes.price}>{formatCurrency(item.price)}đ</p>
                                                                </div>
                                                            </div>
                                                            <div className={classes['shipping-info']}>
                                                                <p class={classes.time}>
                                                                    {shippingMethod === '1' ? 'Giao trước 11:59 sáng mai' : 'Giao vào ...'}  
                                                                </p>
                                                                <p>
                                                                    {
                                                                        shippingMethod === '1' ? <img src={iconFastShipping} className={classes.fast} alt='fast-shipping'/> : 
                                                                            <img src={iconShipping} className={classes.standard} alt='standard-shipping'/>
                                                                    }
                                                                    <span>
                                                                        {shippingMethod === '1' ? 'Giao siêu tốc' : 'Giao tiết kiệm'}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div className={classes['shipping-fee']}>
                                                                {shippingMethod === '1' ? `${formatCurrency(fastShippingFee)}đ` : 
                                                                    <Fragment>
                                                                        <var>{formatCurrency(fastShippingFee)}đ</var><br/>
                                                                        {formatCurrency(shippingFee)}đ
                                                                    </Fragment>
                                                                }
                                                            </div>
                                                        </div>
                                                    ))
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                <h3 class={classes.title}>2. Chọn hình thức thanh toán</h3>
                                <div className={classes.box}>
                                    <ul className={classes['list-payment']}>
                                        {
                                            listPayment.map(item => (
                                                <li key={item.id}>
                                                     <label className={classes.checkbox}>
                                                        <input type="radio" name='payment_method' value={item.id}
                                                            onChange={onChangePaymentMethod}
                                                        />
                                                        <span className={`${classes.icon} ${classes[`payment-0${item.id}`]}`}></span>
                                                        <span className={classes.checkmark}></span>{item.text}
                                                        {
                                                            item.discount && <span className={classes.discount}>Giảm {item.discount}K</span>
                                                        }
                                                    </label>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div> 
                            <div className={classes.right}>
                                <div className={classes.block}>
                                    <div className={classes['wrap-ctm-info']}>
                                        <div className={classes.head}>
                                            <span>Địa chỉ giao hàng</span>
                                            <a href='/#'>Sửa</a>
                                        </div>
                                       {
                                            customerInfo ? (
                                            <Fragment>
                                                <div className={classes['ctm-info']}>
                                                    <p className={classes.name}>{customerInfo.name}</p>
                                                    <p className={classes.address}>
                                                        {`${customerInfo.address}${customerInfo.ward && `, ${customerInfo.ward.name}`}${customerInfo.district && `, ${customerInfo.district.name}`}${customerInfo.city && `, ${customerInfo.city.name}`}`}
                                                    </p>
                                                    <p className={classes.phone}>Điện thoại: {customerInfo.phone}</p>
                                                </div>
                                                
                                            </Fragment>
                                            ) : null
                                        }
                                    </div>
                                </div>
                                <div className={classes.block}>
                                    <div className={classes['wrap-coupon']}>
                                        <div className={classes.head}>
                                            <span>Khuyến mãi (có thể chọn 2)</span>
                                        </div>
                                        <div className={classes['applied-coupons']}>
                                            {
                                                cart.appliedCoupons && cart.appliedCoupons.length > 0 && (
                                                    <ul>
                                                        {
                                                            cart.appliedCoupons.map(item => (
                                                                <li key={item.id} className={classes['coupon-bg']}>
                                                                    <img src={couponBgSm} alt='coupon-bg-sm' /> 
                                                                    <div className={classes['coupon-content']}>
                                                                        <div className={classes.left}>
                                                                            {
                                                                                item.type === 'shipping' ? <img src={freeshipCoupon} alt='freeship'/> :
                                                                                <img src={couponIcon} alt='coupon-icon'/>
                                                                            }
                                                                            {/* { item.type === 'special' && <span className='icon-star'></span> } */}
                                                                        </div>
                                                                        <div className={classes.right}>
                                                                            <div className={classes['coupon-info']}>
                                                                                <div className={classes.sale}>
                                                                                    {item.type === 'shipping' && `Giảm ${item.discount}K phí vận chuyển`}
                                                                                    {item.type === 'discount' && `Giảm ${item.discount}K`}
                                                                                    {/* {item.type === 'special' && `Giảm ${item.discount}K (đặc biệt)`} */}
                                                                                </div>
                                                                            </div>
                                                                            <div className={classes['coupon-action']}>
                                                                                <button className={classes.apply} onClick={() => addCoupon(item)}>Bỏ Chọn</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))
                                                        }
                                                    </ul>
                                                )
                                            }
                                            <p className={classes['coupon-txt']} onClick={showCouponModalHandler}>
                                                <img src={couponImg2} alt="coupon" />Chọn hoặc nhập Khuyến mãi khác
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.block}>
                                    <div className={classes['wrap-summary']}>
                                        <div className={classes.head}>
                                            <div className={classes['head-title']}>
                                                <b>Đơn hàng</b>
                                                <p>{cart.finalItems.length} sản phẩm.&nbsp;
                                                    <span class={`${classes['show-more']} ${showInfoProducts ? classes.active : ''}`} onClick={() => setShowInfoProducts(prev => !prev)}>
                                                        {setShowInfoProducts ? 'Xem thông tin' : 'Thu gọn'}    
                                                    </span>
                                                </p>
                                            </div>
                                            <Link to='/cart'>Sửa</Link>
                                        </div>
                                        <div className={`${classes.products} ${showInfoProducts ? classes.show : ''}`}>
                                            <div className={classes.content}>
                                                {
                                                    cart.finalItems.length && (
                                                        cart.finalItems.map(item => (
                                                            <div className={classes.item} key={item._id}>
                                                                <div className={classes.info}>
                                                                    <strong>{item.quantity} x</strong>
                                                                    <Link to={`/${item.category === 'smartphone' ? 'dien-thoai' : 'may-tinh-bang'}/${convertProductLink(item.name)}`}>
                                                                        {item.category === 'smartphone' ? 'Điện thoại' : 'Máy tính bảng'} {item.name}
                                                                    </Link>
                                                                </div>
                                                                <div className={classes.price}>{formatCurrency(item.price)} ₫</div>
                                                            </div>
                                                        ))
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className={classes['price-summary']}>
                                            <p>
                                                <span>Tạm tính</span>
                                                <span>{formatCurrency(cart.totalPrice)}đ</span>
                                            </p>
                                            <p>
                                                <span>Phí vận chuyển</span>
                                                <span>{formatCurrency(shippingFee)}đ</span>
                                            </p>
                                            <p className={classes['total-price']}>
                                                <span>Thành tiền:</span>
                                                <span className={classes.total}>{formatCurrency(cart.totalPrice)} ₫</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    ) : (
                        <div className={classes.empty}>
                            <p>Giỏ hàng rỗng. Vui lòng thêm sản phẩm để mua hàng.</p>
                            <Link to='/cart'>Tiếp tục mua sắm</Link>
                        </div>
                    )
                }
            </Fragment>
            
        </div>
    );
};

export default CartConfirmPage;