import { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cartActions } from '../store/cart';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency, convertProductLink, 
    convertCardNumber, convertCardExpiry, shippingFee, fastShippingFee } from '../helpers/helpers';
import useFetch from '../hooks/useFetch';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import SelectedCoupons from '../components/UI/SelectedCoupons';
import AddressModal from '../components/UI/AddressModal';
import iconShipping from '../assets/images/icon-shipping.svg';
import iconFastShipping from '../assets/images/icon-fast-shipping.svg';
import classes from '../scss/CartConfirm.module.scss';
import CouponModal from '../components/UI/CouponModal';
import imgCvv from '../assets/images/img-cvv.jpeg';
import iconVisa from '../assets/images/icon-visa.png';
import Swal from 'sweetalert2';

const listPayment = [
    {
        id: 'p1',
        type: 'payment',
        discount: 0,
        code: null,
        text: 'Thanh toán khi nhận hàng',
        condition: 0,
        date: 'XXX'
    },
    {
        id: 'p2',
        type: 'payment',
        discount: 10,
        code: 'ZALOPAY10K',
        text: 'Thanh toán bằng ví ZaloPay',
        condition: 0,
        date: 'XXX'
    },
    {
        id: 'p3',
        type: 'payment',
        discount: 0,
        code: null,
        text: 'Thanh toán bằng thẻ quốc tế Visa, Master, JCB',
        condition: 0,
        date: 'XXX'
    },
];

const cardErrors = {
    'card_name_empty': 'Vui lòng nhập Tên in trên thẻ',
    'card_number_empty': 'Vui lòng nhập Số thẻ',
    'card_number_invalid': 'Số thẻ không hợp lệ',
    'card_expiry_empty': 'Vui lòng nhập Ngày hết hạn',
    'card_expiry_invalid': 'Ngày hết hạn không hợp lệ',
    'card_cvv_empty': 'Vui lòng nhập Mã bảo mật',
    'card_cvv_invalid': 'Mã bảo mật không hợp lệ'
};

const CartConfirmPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [customerInfo, setCustomerInfo] = useState(null);
    const [selectedCoupons, setSelectedCoupons] = useState([]);
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [showCouponPopup, setShowCouponPopup] = useState(false);
    const [showInfoProducts, setShowInfoProducts] = useState(false);
    const [shippingMethod, setShippingMethod] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('p1');
    const [isShowCardForm, setIsShowCardForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(null);
    const [cardInfo, setCardInfo] = useState({});
    const [cardError, setCardError] = useState({});
    const [isBlur, setIsBlur] = useState({})
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [cardIsValid, setCardIsValid] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);

    const cart = useSelector((state) => state.cart);
	const userData = useSelector((state) => state.auth.userData);
	const shippingInfo = useSelector((state) => state.auth.shippingInfo);

    const { fetchData: submitOrder } = useFetch();

    const calculateDiscount = useCallback(() => {
        let total = 0;

        if (cart.appliedCoupons.length) {    
            cart.appliedCoupons.forEach(obj => {
                if (obj.type !== 'shipping') {
                    total += obj.discount * 1000;
                }
            })  
        }
        
        return total;
    }, [cart.appliedCoupons]);
    const totalDiscountExcludeShipping = useMemo(() => calculateDiscount(), [calculateDiscount]);

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
        if (userData && userData.listAddress && userData.listAddress.length) {
            const index = userData.listAddress.findIndex(val => val.default === true);
            setCustomerInfo(userData.listAddress[index]);
        }
    }, [userData, shippingInfo]);

    useEffect(() => {
        let totalPrice = cart.totalPrice;
        if (shippingMethod === 1) {
            totalPrice += fastShippingFee;
            dispatch(cartActions.setFinalPrice(totalPrice));
        } else if (shippingMethod === 2) {
            totalPrice += shippingFee;
            dispatch(cartActions.setFinalPrice(totalPrice));
        }

        if (cart.discount > 0) {
            totalPrice = totalPrice - cart.discount;
            dispatch(cartActions.setFinalPrice(totalPrice));
        }
    }, [shippingMethod, cart.discount]);

    useEffect(() => {
        let totalDiscount = 0;

        if (cart.appliedCoupons.length) {    
            cart.appliedCoupons.forEach(obj => {
                totalDiscount += obj.discount * 1000;
            })  
        }
        dispatch(cartActions.setDiscount(totalDiscount));
    }, [paymentMethod, cart.appliedCoupons]);

    useEffect(() => {
        let timer;

        if (!isLoading && paymentMethod === 'p3') {
            setIsShowCardForm(true);
        } else {
            setIsShowCardForm(false);
        }

        if (isLoading) {
            timer = setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }

        return () => clearTimeout(timer);
    }, [isLoading, paymentMethod]);

    const showCouponModalHandler = () => {
        setShowCouponModal(true);
    };

    const closeCouponModalHandler = () => {
        setShowCouponModal(false);
    };

    const onAddCoupon = (item) => {
        const appliedCoupons = cart.appliedCoupons;
        const index = appliedCoupons.findIndex(val => val.id === item.id);
        let updatedCoupons = [...appliedCoupons];
        updatedCoupons.splice(index, 1);
        dispatch(cartActions.setAppliedCoupons(updatedCoupons));
    };

    const onChangeShippingMethod = (e) => {
        setShippingMethod(parseInt(e.target.value));
    };

    const onChangePaymentMethod = (e) => {
        const index = listPayment.findIndex(val => val.id === e.target.value);
        let coupons = [...cart.appliedCoupons];

        if (listPayment[index].discount > 0) {
            coupons.push(listPayment[index]);
            dispatch(cartActions.setAppliedCoupons(coupons));
        } else {
            const couponIndex = coupons.findIndex(val => val.type === 'payment');
            if (couponIndex >= 0) {
                coupons.splice(couponIndex, 1);
                dispatch(cartActions.setAppliedCoupons(coupons));
            }        
        }

        setIsLoading(true);
        setPaymentMethod(e.target.value);
    };

    const focusCardInput = (e) => {
        if (e.target.name) {
            setIsFocused(e.target.name);
        }
    };

    const validateInput = (name, value) => {
        let error = null;

        if (!value.length) {
            error = `${name}_empty`;
            setCardError(data => data = {...data, [name]: cardErrors[error] });
        } else {
            setCardError(data => data = {...data, [name]: null });
        }

        switch (name) {
            case 'card_number':
                const length = value.replace( /\s/g, '').length;
                if (length > 0 && length < 16) {
                    error = `${name}_invalid`;
                    setCardError(data => data = {...data, [name]: cardErrors[error] });
                } else if (length === 16) {
                    setCardError(data => data = {...data, [name]: null });
                }
                break;
            case 'card_name': 
                break;
            case 'card_expiry': 
                // let year = parseInt(num) + (1 - Math.round(parseInt(num)/100))*2000 + Math.round(parseInt(num)/100)*1900;
                let cardExpiry = value.replace(/\//g, '').substr(0, 4);
                const currentYear = (new Date().getFullYear()).toString().slice(2, 4);
                let month = parseInt(cardExpiry.substr(0,2));
                let year = parseInt(cardExpiry.slice(2,4));
                
                const monthIsValid = month > 0 && month <= 12;
                const yearIsValid = year >= parseInt(currentYear);

                if (cardExpiry.length > 0) {
                    if (monthIsValid && yearIsValid) {
                        setCardError(data => data = {...data, [name]: null });
                    }
                    if (!monthIsValid || !yearIsValid) {
                        error = `${name}_invalid`;
                        setCardError(data => data = {...data, [name]: cardErrors[error] });
                    }
                }

                break;
            case 'card_cvv': 
                if (value.length > 0 && value.length < 3) {
                    error = `${name}_invalid`;
                    setCardError(data => data = {...data, [name]: cardErrors[error] });
                }
                break;
            default: break;
        };
    };

    const onBlurInput = (e) => {
        const { name, value } = e.target;
        setIsBlur(data => data = {...data, [name]: true});
        validateInput(name, value);
    };

    const onChangeCardInput = (e) => {
        const { name, value } = e.target;

        if (name === 'card_number') {
            const inputVal = e.target.value.replace(/ /g, '');
            let inputNumbersOnly = inputVal.replace(/\D/g, '');

            if (inputNumbersOnly.length > 16) {
                inputNumbersOnly = inputNumbersOnly.substr(0, 16);
            }

            const splits = inputNumbersOnly.match(/.{1,4}/g);

            let spacedNumber = '';
            if (splits) {
                spacedNumber = splits.join(' ');
            }

            setCardInfo(data => data = {...data, [name]: spacedNumber});
        } else if (name === 'card_expiry') {
            const inputVal = e.target.value.replace(/ /g, '');
            let inputNumbersOnly = inputVal.replace(/\D/g, '');

            if (inputNumbersOnly.length > 4) {
                inputNumbersOnly = inputNumbersOnly.substr(0, 4);
            }

            const splits = inputNumbersOnly.match(/.{1,2}/g);

            let spacedNumber = '';
            if (splits) {
                spacedNumber = splits.join('/');
            }
            
            setCardInfo(data => data = {...data, [name]: spacedNumber});
        } else {
            setCardInfo(data => data = {...data, [name]: value});
        }

        if (isBlur[name] || isSubmitted) {
            validateInput(name, value);
        }
    };

    const onSubmitCard = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        const { card_name, card_number, card_expiry, card_cvv } = cardInfo;

        if (!card_name) {
            setCardError(data => data = {...data, 'card_name': cardErrors['card_name_empty']});
        }

        if (!card_number) {
            setCardError(data => data = {...data, 'card_number': cardErrors['card_number_empty']});
        }

        if (!card_expiry) {
            setCardError(data => data = {...data, 'card_expiry': cardErrors['card_expiry_empty']});
        }

        if (!card_cvv) {
            setCardError(data => data = {...data, 'card_cvv': cardErrors['card_cvv_empty']});
        }
        
        if (cardError['card_name'] === null && cardError['card_number'] === null && cardError['card_expiry'] === null && cardError['card_cvv'] === null) {
            setIsLoading(true);
            setTimeout(() => {
                setCardIsValid(true);
                setIsLoading(false);
            }, 500);
        }
    };

    const confirmBooking = () => {
        setIsLoading(true);
        const address = `${customerInfo.address}${customerInfo.ward && `, ${customerInfo.ward.name}`}${customerInfo.district && `, ${customerInfo.district.name}`}${customerInfo.city && `, ${customerInfo.city.name}`}`;
        const submitOrderHandler = (orderData) => {
            submitOrder({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                url: `${process.env.REACT_APP_API_URL}/submitOrder`,
                body: orderData
            }, data => {
                const payment = paymentMethod === 'p3' ? {
                    id: paymentMethod,
                    card: `**********${cardInfo['card_number'].slice(-4)}`
                } : {
                    id: paymentMethod
                };
                
                if (data && data.message) {
                    setIsLoading(false);
                    dispatch(cartActions.updateCartItems({
                        type: 'booking',
                        items: cart.finalItems
                    }));
                    navigate('/orderDetail/' + data.orderId, {
                        state: {
                            orderId: data.orderId,
                            products: cart.finalItems,
                            customerInfo: {
                                name: customerInfo.name,
                                phone: customerInfo.phone,
                                address: address
                            },
                            orderDate: new Date().getTime(),
                            shippingMethod: shippingMethod,
                            paymentMethod: payment,
                            discount: cart.discount,
                            totalPrice: cart.totalPrice,
                            finalPrice: cart.finalPrice
                        }
                    });
                }
            });
        };

        let products = [];

        if (cart.finalItems.length > 0) {
            products = cart.finalItems;
        }

        if (shippingMethod && paymentMethod) {
            if (paymentMethod === 'p3') {
                if (cardIsValid) {
                    const orderData = {
                        products: products,
                        customerId: userData.uuid ? userData.uuid : '',
                        customerName: customerInfo ? customerInfo.name : '',
                        address: customerInfo ? address : '',
                        phone: customerInfo ? customerInfo.phone : '',
                        orderDate: new Date(),
                        shippingFee: shippingMethod === 1 ? fastShippingFee : shippingFee,
                        shippingMethod: shippingMethod,
                        paymentMethod: {
                            id: paymentMethod,
                            card: `**********${cardInfo['card_number'].slice(-4)}`
                        },
                        discount: cart.discount,
                        totalPrice: cart.totalPrice,
                        finalPrice: cart.finalPrice
                    };

                    submitOrderHandler(orderData);
                } else {
                    setIsLoading(false);
                    Swal.fire({
                        icon: 'warning',
                        html: '<p style="font-size: 16px;font-weight:500;">Bạn cần nhập thông tin thẻ tính dụng.</p>',
                        confirmButtonColor: '#2f80ed',
                        confirmButtonText: 'Đã hiểu'
                    });
                }
            } else {
                const orderData = {
                    products: products,
                    customerId: userData.uuid ? userData.uuid : '',
                    customerName: customerInfo ? customerInfo.name : '',
                    address: customerInfo ? address : '',
                    phone: customerInfo ? customerInfo.phone : '',
                    orderDate: new Date(),
                    shippingFee: shippingMethod === 1 ? fastShippingFee : shippingFee,
                    shippingMethod: shippingMethod,
                    paymentMethod: paymentMethod,
                    discount: cart.discount,
                    totalPrice: cart.totalPrice,
                    finalPrice: cart.finalPrice
                };

                submitOrderHandler(orderData);
            }
        } else {
            setIsLoading(false);
            Swal.fire({
                icon: 'warning',
                html: '<p style="font-size: 16px;font-weight:500;">Bạn cần kiểm tra lại phương thức giao hàng và thanh toán !</p>',
                confirmButtonColor: '#2f80ed',
                confirmButtonText: 'Đã hiểu'
            });
        }
    };

    const showAddressModalHandler = (e) =>{
        e.preventDefault();
        setShowAddressModal(true);
    };

    const closeAddressModalHandler = (e) =>{
        setShowAddressModal(false);
    };

    return (
        <div className='container'>
            { isLoading && <div className='overlay'><LoadingIndicator type='fixed'/></div> }
            <Fragment>
                {
                    cart.finalItems.length > 0 ? (
                        <div className={classes['wrap-cart-confirm']}>
                            <div className={classes.left}>
                                <h3 className={classes.title}>1. Chọn hình thức giao hàng</h3>
                                <div className={classes.box}>
                                    <div className={classes['wrap-shipping']}>
                                        <div className={classes['shipping-method']}>
                                            <label className={classes.checkbox}>
                                                <input type='radio' name='shipping_method' value='1' defaultChecked={shippingMethod}
                                                    onChange={onChangeShippingMethod}
                                                />
                                                <img src={iconFastShipping} className={classes.fast} alt='fast-shipping' />
                                                <span className={classes.checkmark}></span>Giao siêu tốc
                                            </label>
                                            <label className={classes.checkbox}>
                                                <input type='radio' name='shipping_method' value='2'  onChange={onChangeShippingMethod}/>
                                                <img src={iconShipping} className={classes.standard} alt='standard-shipping' />
                                                <span className={classes.checkmark}></span>Giao tiết kiệm
                                            </label>
                                        </div>
                                        <div className={classes['shipping-products']}>
                                            {
                                                cart.finalItems.length > 0 && (
                                                    cart.finalItems.map((item, index) => (
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
                                                                <p className={classes.time}>
                                                                    {shippingMethod === 1 ? 'Giao trước 11:59 sáng mai' : 'Giao vào ...'}  
                                                                </p>
                                                                <p>
                                                                    {
                                                                        shippingMethod === 1 ? <img src={iconFastShipping} className={classes.fast} alt='fast-shipping'/> : 
                                                                            <img src={iconShipping} className={classes.standard} alt='standard-shipping'/>
                                                                    }
                                                                    <span>{shippingMethod === 1 ? 'Giao siêu tốc' : 'Giao tiết kiệm'}</span>
                                                                </p>
                                                            </div>
                                                            {
                                                                index === 0 && (
                                                                    <div className={`${classes['shipping-fee']} ${classes.all}`}>
                                                                        {shippingMethod === 1 ? `${formatCurrency(fastShippingFee)}đ` : 
                                                                            <Fragment>
                                                                                <var>{formatCurrency(fastShippingFee)}đ</var><br/>
                                                                                {formatCurrency(shippingFee)}đ
                                                                            </Fragment>
                                                                        }
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    ))
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                <h3 className={classes.title}>2. Chọn hình thức thanh toán</h3>
                                <div className={classes.box}>
                                    <ul className={classes['list-payment']}>
                                        {
                                            listPayment.map(item => (
                                                <li key={item.id}>
                                                     <label className={classes.checkbox}>
                                                        <input type='radio' name='payment_method' value={item.id} defaultChecked={item.id === paymentMethod ? true : false}
                                                            onChange={onChangePaymentMethod}
                                                        />
                                                        <span className={`${classes.icon} ${classes[`${item.id}`]}`}></span>
                                                        <span className={classes.checkmark}></span>{item.text}
                                                        {
                                                            item.discount !== 0 && <span className={classes.discount}>Giảm {item.discount}K</span>
                                                        }
                                                    </label>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    {
                                        isShowCardForm && (
                                            cardIsValid ? (
                                                <div className={classes['card-info']}>
                                                    <img src={iconVisa} alt="visa" />
                                                    {
                                                        cardError['card_number'] === null && <span>••••{cardInfo['card_number']?.slice(-4)}</span>
                                                    }
                                                </div>
                                            ) : (
                                                <Fragment>
                                                    <form className={classes['card-form']} onSubmit={onSubmitCard}>
                                                        <h5 className={classes['card-title']}>Thêm Thẻ Tín Dụng/ Ghi Nợ Quốc Tế</h5>
                                                        <div className={classes['form-left']}>
                                                            <div className={classes['input-group']}>
                                                                <label>Số thẻ:</label>
                                                                <input type='text' name='card_number' placeholder='VD: 4123 4567 8901 2345' 
                                                                    onFocus={focusCardInput} onChange={onChangeCardInput} onBlur={onBlurInput}
                                                                    value={cardInfo['card_number'] || ''} className={cardError['card_number'] ? classes.invalid : null}               
                                                                />
                                                                {cardError['card_number'] ? <p className={classes.invalid}>{cardError['card_number']}</p> : null}
                                                            </div>
                                                            <div className={classes['input-group']}>
                                                                <label>Tên in trên thẻ:</label>
                                                                <input type='text' name='card_name' placeholder='VD: NGUYEN VAN A' maxLength="50" className={cardError['card_name'] ? classes.invalid : null}
                                                                    onFocus={focusCardInput} onChange={onChangeCardInput} onBlur={onBlurInput} value={cardInfo['card_name']?.toUpperCase() || ''}
                                                                />
                                                                {cardError['card_name'] ? <p className={classes.invalid}>{cardError['card_name']}</p> : null}
                                                            </div>
                                                            <div className={classes['input-group']}>
                                                                <label>Ngày hết hạn:</label>
                                                                <input type='text' name='card_expiry' className={`${classes.short} ${cardError['card_expiry'] ? classes.invalid : null}`} placeholder='MM/YY' 
                                                                    onFocus={focusCardInput} onChange={onChangeCardInput} value={cardInfo['card_expiry'] || ''}
                                                                    onBlur={onBlurInput}
                                                                />
                                                                {cardError['card_expiry'] ? <p className={classes.invalid}>{cardError['card_expiry']}</p> : null}
                                                            </div>
                                                            <div className={classes['input-group']}>
                                                                <label>Mã bảo mật (CVV):</label>
                                                                <input type='text' name='card_cvv' className={`${classes.short} ${cardError['card_cvv'] ? classes.invalid : null}`} placeholder='VD: 123' 
                                                                    onFocus={focusCardInput} onChange={onChangeCardInput} onBlur={onBlurInput} value={cardInfo['card_cvv'] || ''}
                                                                    onKeyPress={(e) => {
                                                                            e.target.value.replace(/\D/g, '');
                                                                            if (e.target.value.length >= 3 || !/[0-9]/.test(e.key)) e.preventDefault();
                                                                        }
                                                                    }
                                                                />
                                                                <img src={imgCvv} alt='cvv' />
                                                                {cardError['card_cvv'] ? <p className={classes.invalid}>{cardError['card_cvv']}</p> : null}
                                                            </div>
                                                        </div>
                                                        <div className={classes['form-right']}>
                                                            <div className={classes.card}>
                                                                <div className={`${classes.inner} ${isFocused === 'card_cvv' && classes.flipped}`}>
                                                                    <div className={`${classes.content} ${classes.front}`}>
                                                                        <div className={`${classes.background} ${cardInfo['card_number']?.replace( /\s/g, '').length === 16 && classes.visa}`}></div>
                                                                        <div className={classes.chip}></div>
                                                                        <div className={`${classes.number} ${isFocused === 'card_number' && classes.focused}`}>  
                                                                            {cardInfo['card_number'] ? convertCardNumber(cardInfo['card_number'].replace( /\s/g, '')) : '•••• •••• •••• ••••'}
                                                                        </div>
                                                                        <div className={classes.bottom}>
                                                                            <div className={`${classes.name} ${isFocused === 'card_name' && classes.focused}`}>
                                                                                {cardInfo['card_name'] ? cardInfo['card_name'] : 'Tên chủ thẻ'}    
                                                                            </div>
                                                                            <div className={`${classes.expiry} ${isFocused === 'card_expiry' && classes.focused}`}>
                                                                                <p className={classes.valid}>Hiệu lực đến</p>
                                                                                <p className={classes.value}>
                                                                                    {cardInfo['card_expiry'] ? convertCardExpiry(cardInfo['card_expiry'].replace(/\//g, '')) : '••/••'}  
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className={`${classes.content} ${classes.back}`}>
                                                                        <div className={`${classes.background} ${cardInfo['card_number']?.replace( /\s/g, '').length === 16 && classes.visa}`}></div>
                                                                        <div className={classes.stripe}></div>
                                                                        <div className={classes.signature}>{cardInfo['card_cvv']}</div>
                                                                        <div className={classes.img}></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={classes['wrap-btn']}>
                                                            <button className={classes.confirm} type='submit'>Xác nhận</button>
                                                        </div>
                                                    </form>
                                                </Fragment>
                                            )
                                            
                                        )
                                    }
                                </div>
                                <button className={classes['btn-booking']} onClick={confirmBooking}>ĐẶT MUA</button>
                            </div> 
                            <div className={classes.right}>
                                <div className={classes.block}>
                                    <div className={classes['wrap-ctm-info']}>
                                        <div className={classes.head}>
                                            <span>Địa chỉ giao hàng</span>
                                            <a href="/#" onClick={showAddressModalHandler}>Sửa</a>
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
                                        <SelectedCoupons showCouponModalHandler={showCouponModalHandler} addCoupon={onAddCoupon} />
                                    </div>
                                </div>
                                <div className={classes.block}>
                                    <div className={classes['wrap-summary']}>
                                        <div className={classes.head}>
                                            <div className={classes['head-title']}>
                                                <b>Đơn hàng</b>
                                                <p>{cart.finalItems.length} sản phẩm.&nbsp;
                                                    <span className={`${classes['show-more']} ${showInfoProducts ? classes.active : ''}`} onClick={() => setShowInfoProducts(prev => !prev)}>
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
                                                <span>
                                                    {shippingMethod === 1 ? formatCurrency(fastShippingFee) : formatCurrency(shippingFee)}đ  
                                                </span>
                                            </p>
                                            {
                                                cart.appliedCoupons.filter(val => val.type === 'shipping').map(item => (
                                                    <p key={item.id}>
                                                        <span>Khuyến mãi vận chuyển</span>
                                                        <span className={classes.discount}>-{formatCurrency(item.discount * 1000)}đ</span>
                                                    </p>  
                                                ))
                                            }
                                            {
                                                totalDiscountExcludeShipping > 0 && (
                                                    <p>
                                                        <span>Giảm giá</span>
                                                        <span className={classes.discount}>-{formatCurrency(totalDiscountExcludeShipping)}đ</span>              
                                                    </p>
                                                )
                                            }
                                            <p className={classes['total-price']}>
                                                <span>Thành tiền:</span>
                                                <span className={classes.total}>
                                                    {cart.finalPrice > 0 ? formatCurrency(cart.finalPrice) : formatCurrency(cart.totalPrice)} ₫
                                                </span>
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
            
            <CouponModal showCouponModal={showCouponModal} showCouponPopup={showCouponPopup} setShowCouponPopup={setShowCouponPopup}
                showCouponModalHandler={showCouponModalHandler} closeCouponModalHandler={closeCouponModalHandler} addCoupon={onAddCoupon}
                selectedCoupons={selectedCoupons} setSelectedCoupons={setSelectedCoupons}
            />

            <AddressModal showAddressModal={showAddressModal} closeAddModalHandler={closeAddressModalHandler} />

        </div>
    );
};

export default CartConfirmPage;