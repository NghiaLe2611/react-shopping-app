import { useState } from 'react'
import { formatCurrency } from '../helpers/helpers';
import { cartActions } from '../store/cart';
import { useDispatch } from 'react-redux';
import classes from '../scss/CartItem.module.scss';

const CartItem = (props) => {
    const dispatch = useDispatch();

    const { item } = props;
    const [isAddToCart, setIsAddToCart] = useState(false);

    console.log(item);

    const increaseQuantityHandler = () => {
        if (item.quantity < 5) {
            dispatch(cartActions.addItemToCart({
                id: item.id,
                price: item.price
            }));  
            if (isAddToCart) {
                dispatch(cartActions.confirmChooseCart({
                    type: 'INCREASE', item
                }));  
            }
        } else {
            alert("Bạn chỉ có thể chọn tối đa 5 sản phẩm !");
        }
    };

    const decreaseQuantityHandler = () => {
        if (item.quantity !== 1) {
            dispatch(cartActions.decreaseCartQuantity(item.id));
            if (isAddToCart) {
                dispatch(cartActions.confirmChooseCart({
                    type: 'DECREASE', item
                }));  
            }
        } else {
            let confirm = window.confirm("Bạn có chắc muốn xóa sản phẩm này ?");
            if (confirm) {
                dispatch(cartActions.decreaseCartQuantity(item.id));
                dispatch(cartActions.confirmChooseCart({
                    type: 'REMOVE', item
                }));  
            } 
        }
    };

    const changeQuantityHandler = (e) => {
        const value = e.target.value;
        if (e.which < 48 || e.which > 57) {
            e.preventDefault();
        }
        
        if (parseInt(value) <= 5) {
            if (value.length !== 0 && parseInt(value) !== 0) {
                dispatch(cartActions.changeQuantity({
                    id: item.id, quantity: parseInt(value)
                }));
                if (isAddToCart) {
                    dispatch(cartActions.confirmChooseCart({
                        type: 'CHANGE', item
                    }));  
                }
            }
        } else {
            alert("Bạn chỉ có thể chọn tối đa 5 sản phẩm !");
        }
    };

    const removeItemCartHandler = () => {
        let r = window.confirm("Bạn có chắc muốn xóa sản phẩm này ?");
        if (r) {
            dispatch(cartActions.removeCartItem(item.id));
            dispatch(cartActions.confirmChooseCart({
                type: 'REMOVE', item
            }));  
        } 
    };

    const checkCartHandler = (e) => {
        if (e.target.checked) {
            setIsAddToCart(true);
            dispatch(cartActions.confirmChooseCart({
                type: 'ADD', item
            }));  
        } else {
            setIsAddToCart(false);
            dispatch(cartActions.confirmChooseCart({
                type: 'REMOVE', item
            })); 
        }
    };

    return (
        <li className={classes['cart-item']}>
            <label className={classes.checkbox}>
                <input type="checkbox" onChange={(e) => checkCartHandler(e)}/>
                <span className={classes.checkmark}></span>&nbsp;
            </label>
            <span className={classes.img}><img src={item.img} alt={item.name} /></span>
            <div className={classes['wrap-name']}>
                <span className={classes.name}>{item.name}</span>
                { item.color !== null && <span className={classes.color}>Màu: {item.color}</span> }
            </div>
            <span className={classes.price}>{formatCurrency(item.totalPrice)}<small>đ</small></span>
            <div className={classes['wrap-quantity']}>
                <span className={classes.input} onClick={decreaseQuantityHandler}>-</span>
                <input className={classes.quantity} type="text" value={item.quantity} onChange={e => changeQuantityHandler(e)}/>
                <span className={classes.input} onClick={increaseQuantityHandler}>+</span>
            </div>
            <span className={classes.remove} onClick={removeItemCartHandler}>Xóa</span>
        </li>
    )
}

export default CartItem;