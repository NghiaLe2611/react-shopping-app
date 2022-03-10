import { useSelector, useDispatch } from 'react-redux';
import { cartActions } from '../../store/cart';
import classes from '../../scss/SelectedCoupons.module.scss';
import couponIcon from '../../assets/images/coupon-icon.svg';
import couponImg2 from '../../assets/images/coupon2.svg';
import couponBgSm from '../../assets/images/coupon-bg-sm.svg';
import freeshipCoupon from '../../assets/images/freeship.png';
import { readPrice } from '../../helpers/helpers';

const SelectedCoupons = (props) => {
    const dispatch = useDispatch();
    const { showCouponModalHandler } = props;
    const cart = useSelector((state) => state.cart);

    const addCoupon = (item) => {
        dispatch(cartActions.addCoupon(item));
    };

    return (
        <div className={classes['applied-coupons']}>
        {
            cart.appliedCoupons.length > 0 && (
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
                                        { item.type === 'special' && <span className='icon-star'></span> }
                                    </div>
                                    <div className={classes.right}>
                                        <div className={classes['coupon-info']}>
                                            <div className={classes.sale}>
                                                {item.type === 'shipping' && `Giảm ${item.discount}K phí vận chuyển`}
                                                {item.type === 'discount' && `Giảm ${item.discount}K cho đơn hàng từ ${readPrice(item.condition)}`}
                                                {item.type === 'special' && `Giảm ${item.discount}K (đặc biệt)`}
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
    );
};

export default SelectedCoupons;