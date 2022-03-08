import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { convertProductLink, formatCurrency } from '../../helpers/helpers';
import { cartActions } from '../../store/cart';
import { useSelector, useDispatch } from 'react-redux';
import classes from '../../scss/CartItem.module.scss';
import Swal from 'sweetalert2';

const CartItem = (props) => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    const { item } = props;
    const [isAddToCart, setIsAddToCart] = useState(false);

    const inputRef = useRef();

    useEffect(() => {
        props.checkInputSelect();
    }, [cart.finalItems]);

    // useEffect(() => {
    //     if (isAddToCart) {
    //         dispatch(cartActions.confirmChooseCart({
    //             type: 'ADD', item
    //         }));  
    //     } else {
    //         dispatch(cartActions.confirmChooseCart({
    //             type: 'REMOVE', item
    //         })); 
    //     }
    // }, [isAddToCart]);

    useEffect(() => {
        let isExist = cart.finalItems.filter(val => val._id === item._id).length > 0;;

        if (isExist) {
            inputRef.current.checked = true;
        } else {
            inputRef.current.checked = false;
        }
    }, [cart.finalItems]);

    const increaseQuantityHandler = () => {
        if (item.quantity < 5) {
            dispatch(cartActions.addItemToCart({
                _id: item._id,
                price: item.price
            }));  
            if (inputRef.current.checked) {
                dispatch(cartActions.confirmChooseCart({
                    type: 'INCREASE', item
                }));  
            }
        } else {
            Swal.fire({
                icon: 'warning',
                html: `<p>Bạn chỉ có thể chọn tối đa 5 sản phẩm !</p>`,
                confirmButtonColor: '#2f80ed',
            });
        }
    };

    const decreaseQuantityHandler = () => {
        if (item.quantity !== 1) {
            dispatch(cartActions.decreaseCartQuantity(item._id));
            if (inputRef.current.checked) {
                dispatch(cartActions.confirmChooseCart({
                    type: 'DECREASE', item
                }));  
            }
        } else {
            let confirm = window.confirm("Bạn có chắc muốn xóa sản phẩm này ?");
            if (confirm) {
                dispatch(cartActions.decreaseCartQuantity(item._id));
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
                    _id: item._id, quantity: parseInt(value)
                }));
                if (inputRef.current.checked) {
                    dispatch(cartActions.confirmChooseCart({
                        type: 'CHANGE', item
                    }));  
                }
            }
        } else {
            Swal.fire({
                icon: 'warning',
                html: `<p>Bạn chỉ có thể chọn tối đa 5 sản phẩm !</p>`,
                confirmButtonColor: '#2f80ed',
            });
        }
    };

    const removeItemCartHandler = () => {
        Swal.fire({
            icon: 'warning',
            html: `<p>Bạn có chắc muốn xoá sản phẩm này ?</p>`,
            confirmButtonText: 'Xoá',
            confirmButtonColor: '#2f80ed',
            showCancelButton: true,
            cancelButtonText: 'Huỷ',
            cancelButtonColor: '#dc3741'
        }).then(result => {
            if (result.isConfirmed) {
                dispatch(cartActions.removeCartItem(item._id));
                dispatch(cartActions.confirmChooseCart({
                    type: 'REMOVE', item
                }));  
            }
        });        
    };

    const checkCartHandler = (e) => {
        if (e.target.checked) {
            // setIsAddToCart(true);
            dispatch(cartActions.confirmChooseCart({
                type: 'ADD', item
            }));  
        } else {
            // setIsAddToCart(false);
            dispatch(cartActions.confirmChooseCart({
                type: 'REMOVE', item
            }));
        }
    };

    const checkItemIsChecked = useCallback(() => {
        let isExist = false;

        if (item.color) {
            isExist = cart.finalItems.filter(val => (val.color === item.color && val._id === item._id)).length > 0;
        } else {
            isExist = cart.finalItems.filter(val => val._id === item._id).length > 0;
        }

        if (isExist) {
            return true;
        }

        return false;
    }, [cart.finalItems]);

    const cartItemChecked = useMemo(() => checkItemIsChecked(), [checkItemIsChecked]);

    return (
        <li className={classes['cart-item']}>
            <div className={classes['col-1']}>
                <label className={classes.checkbox}>
                    <input type="checkbox" onChange={(e) => checkCartHandler(e)} ref={inputRef} />
                    {/* checked={cartItemChecked} */}
                    <span className={classes.checkmark}></span>&nbsp;
                </label>
                <span className={classes.img}><img src={item.img} alt={item.name} /></span>
                <div className={classes['wrap-name']}>
                    <a href={`/${item.category === 'smartphone' ? 'dien-thoai' : 'may-tinh-bang'}/${convertProductLink(item.name)}`} className={classes.name}>
                        {item.name}{ item.color && ` - ${item.color}` }
                    </a>
                </div>
            </div>
            <div className={classes['col-2']}>
            {
                item.sale ? (
                    <p className={classes.price}>
                        <del>{formatCurrency(item.price + item.sale)}đ</del>
                        {formatCurrency(item.price)}đ
                    </p>
                ) : <p className={classes.price}>{formatCurrency(item.price)}đ</p>
            }
            </div>
            <div className={classes['col-3']}>
                <div className={classes['wrap-quantity']}>
                    <span className={classes.input} onClick={decreaseQuantityHandler}>-</span>
                    <input className={classes.quantity} type="text" value={item.quantity} onChange={e => changeQuantityHandler(e)}/>
                    <span className={classes.input} onClick={increaseQuantityHandler}>+</span>
                </div>
            </div>
            <div className={classes['col-4']}>
                <span className={classes.totalPrice}>{formatCurrency(item.totalPrice)}<small>đ</small></span>
            </div>
            <div className={classes['col-5']}>
                <span className={classes.remove} onClick={removeItemCartHandler}>Xóa</span>
            </div>
        </li>
    )
}

export default CartItem;