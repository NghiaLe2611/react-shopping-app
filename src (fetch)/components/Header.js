import { useState } from 'react'
import classes from '../scss/Header.module.scss';
import iconCart from '../assets/icon-cart.svg';
import iconMobile from '../assets/icon-mobile.svg';
import Modal from './UI/Modal';
import CartItem from './CartItem';

import { useSelector } from 'react-redux';
import { useDelayUnmount } from '../hooks/useDelayUnmount';
import { formatCurrency } from '../helpers/helpers';
import { useDispatch } from 'react-redux';
import { cartActions } from '../store/cart';
import { useCheckMobile } from '../hooks/useCheckMobile';

const Header = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    const [showCart, setShowCart] = useState(false);
    const shouldRenderModal = useDelayUnmount(showCart, 350);

    const showCartHandler = () => {
        if (cart.items.length > 0) setShowCart(true);
    };

    const closeCartHandler = () => {
        setShowCart(false);
        dispatch(cartActions.confirmChooseCart({
            type: 'CLEAR'
        }));
    };

    const cartModal = (
        shouldRenderModal && (
            <Modal closeModal={closeCartHandler} isShowModal={showCart} backdrop={false} type='popup' position='absolute'>
                <ul className={classes.list}>
                    {
                        cart.items.length === 0 ? (
                            <div className={classes.empty}>
                                Không có sản phẩm nào trong giỏ hàng của bạn <br/>
                                <button className={classes.btn} onClick={closeCartHandler}>Tiếp tục mua sắm</button>
                            </div>
                        ) : (
                            cart.items.map((item) => (
                                <CartItem key={item.id}
                                    item={item}
                                />
                            ))
                        )
                        
                    }
                </ul>
                { cart.items.length > 0 && <div className={classes.total}>Tổng cộng: <span>{formatCurrency(cart.totalPrice)}<small>đ</small></span></div> }
            </Modal>
        )
    );

    const headerPC = (
        <div className={classes['wrap-header']}>
            <div className={classes.logo}>
                <a href="/#">
                    <span>
                        <img src={iconMobile} alt="" />
                    </span>
                    Redux Shopping Cart
                </a>
            </div>
            <ul className={classes.menu}>
                <li>
                    <a href="#smartphone">Điện thoại</a>
                    <a href="#tablet">Máy tính bảng</a>
                    <a href="/#">Laptop</a>
                    <a href="/#">Phụ kiện</a>
                    <a href="/#">Tin tức</a>
                </li>
            </ul>
            <div className={classes.cart} onClick={showCartHandler}>
                <span>
                    <img src={iconCart} alt="" />
                </span>
                <span className={classes.quantity}>{cart.totalQuantity}</span>
            </div>
            {cartModal}
        </div>
    );

    const headerSP = (
        <div className={classes['wrap-header']}>
            <div className={classes.logo}>
                <a href="/#">
                    <span>
                        <img src={iconMobile} alt="" />
                    </span>Redux Shopping Cart
                </a>
            </div>
            {/* <ul className={classes.menu}>
                <li>
                    <a href="#smartphone">Điện thoại</a>
                    <a href="#tablet">Máy tính bảng</a>
                    <a href="/#">Laptop</a>
                    <a href="/#">Phụ kiện</a>
                    <a href="/#">Tin tức</a>
                </li>
            </ul> */}
            <div className={classes.cart} onClick={showCartHandler}>
                <span>
                    <img src={iconCart} alt="" />
                </span>
                <span className={classes.quantity}>{cart.totalQuantity}</span>
            </div>
            {cartModal}
        </div>
    );

    return (
        <div className={classes.header}>
            <div className="container">
                { useCheckMobile() && headerSP }
                { !useCheckMobile() && headerPC }
            </div>
        </div>
    )
}

export default Header;