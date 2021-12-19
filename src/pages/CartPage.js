import { useState, useEffect, Fragment } from 'react';
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

    useEffect(() => {
        if (showCart) {
            dispatch(cartActions.showCartPopup(false));
        }
    }, []);
    
    return (
        <div className="container" style={{marginTop: 30}}>
            <div className="card">
                <h2>GIỎ HÀNG</h2>
                {
                    cart.items.length > 0 ? (
                        <Fragment>
                            <div className={classes['wrap-cart']}>
                                <div className={classes.left}>
                                    <ul className={classes['cart-list']}>
                                        {
                                            cart.items.length > 0 && cart.items.map((item) => (
                                                <CartItem key={item._id}
                                                    item={item}
                                                />
                                            ))
                                            
                                        }
                                    </ul>
                                    
                                </div>
                                <div className={classes.right}>
                                    <div className={classes.total}>
                                        Tổng cộng: <span>{formatCurrency(cart.totalPrice)}<small>đ</small></span>
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
                
            </div>
        </div>
    )
}

export default CartPage;