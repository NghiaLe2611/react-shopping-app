import { useState, useEffect, useRef, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cartActions } from '../store/cart';
import CartItem from '../components/cart/CartItem';
import { formatCurrency } from '../helpers/helpers';
import classes from '../scss/Cart.module.scss';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const dispatch = useDispatch();
    const showCart = useSelector(state => state.cart.isShowCart);
    const cart = useSelector((state) => state.cart);
    const selectAlInput = useRef();

    useEffect(() => {
        if (showCart) {
            dispatch(cartActions.showCartPopup(false));
        }
    }, []);

    const checkInputSelectHandler = () => {
        // if (cart.finalItems.length === 0) {
        //     selectAlInput.current.checked = false;
        // } else {
        //     if (cart.finalItems.length === cart.items.length) {
        //         selectAlInput.current.checked = true;
        //     } else if (cart.finalItems.length < cart.items.length) {
        //         selectAlInput.current.checked = false;
        //     }
        // }

        if (cart.finalItems.length === cart.items.length) {
            selectAlInput.current.checked = true;
        } else if ( cart.finalItems.length === 0 || cart.finalItems.length < cart.items.length) {
            selectAlInput.current.checked = false;
        }
    };

    const selectAllHandler = (e) => {
        
        if (e.target.checked) {
            for (let i = 0; i < cart.items.length; i++) {
                const item = cart.items[i];
                const isExist = cart.finalItems.filter(val => val._id === item._id).length > 0;
                if (isExist) {
                    continue;
                }
                dispatch(cartActions.confirmChooseCart({
                    type: 'ADD', item
                }));
            }
        } else {
            cart.items.forEach(item => {
                dispatch(cartActions.confirmChooseCart({
                    type: 'REMOVE', item
                })); 
            });
        }
    };

    const removeCartHandler = () => {
        let r = window.confirm("Bạn có chắc muốn xóa sản phẩm này ?");
        
        if (r) {
            // cart.finalItems.forEach(item => {
            //     dispatch(cartActions.confirmChooseCart({
            //         type: 'REMOVE', item
            //     }));
            // });
        }
    };

    const test = () => {
        console.log(1, cart.items);
        console.log(2, cart.finalItems);
    }
    
    return (
        <div className="container" style={{marginTop: 30}}>
            <Fragment>
                <h2 onClick={test}>GIỎ HÀNG</h2>
                {
                    cart.items.length > 0 ? (
                        <Fragment>
                            <div className={classes['wrap-cart']}>
                                <div className={classes.left}>
                                    <div className={`${classes['cart-heading']} ${classes.box}`}>
                                        <p className={classes['col-1']}>
                                            <label className={classes.checkbox}>
                                                <input type="checkbox" onChange={(e) => selectAllHandler(e)} ref={selectAlInput}/>
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
                                                <CartItem key={item._id}
                                                    item={item} checkInputSelect={checkInputSelectHandler}
                                                />
                                            ))
                                            
                                        }
                                    </ul>
                                    
                                </div>
                                <div className={classes.right}>
                                    <div className={classes['box-price']}>
                                        <div className={classes['price-items']}>
                                            <p>
                                                <span>Tạm tính: </span>
                                                <strong>{formatCurrency(cart.totalPrice)}<small>đ</small></strong>
                                            </p>
                                            <p>
                                                <span>Giảm giá: </span>
                                                <strong>0<small>đ</small></strong>
                                            </p>
                                        </div>
                                        <div className={classes.total}>
                                            Tổng cộng: 
                                            {cart.totalPrice > 0 ? (
                                                <span className={classes.lg}>{formatCurrency(cart.totalPrice)}<small>đ</small></span>
                                            ) : <span className={classes.sm}>Vui lòng chọn sản phẩm</span>}               
                                        </div> 
                                    </div>
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
        </div>
    )
}

export default CartPage;