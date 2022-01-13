import { useEffect, useState, Fragment } from 'react';
import Modal from '../UI/Modal';
import { useDelayUnmount } from '../../hooks/useDelayUnmount';
import { convertProductLink, formatCurrency } from '../../helpers/helpers';
import iconCheked from '../../assets/images/icon-check.svg';
import { useNavigate  } from 'react-router-dom';
import classes from '../../scss/ProductItem.module.scss';

const ProductItem = (props) => {
    const navigate = useNavigate ();

    const { _id, name, category, img, price, specs, sale } = props.item;
   
    const [addToCartSuccess, setAddToCartSuccess] = useState(false);

    const shouldRenderAlert = useDelayUnmount(addToCartSuccess, 350);

    useEffect(() => {
        let timerAlert;

        if (addToCartSuccess) {
            timerAlert = setTimeout(() => setAddToCartSuccess(false), 2000);
        }

        return () => {
            clearTimeout(timerAlert);
        };

    }, [addToCartSuccess]);


    const navigateDetail = (e, name) => {
        e.preventDefault();
        if (category === 'smartphone') {
            navigate(`/dien-thoai/${convertProductLink(name)}`, {
                replace: false,
                state: {
                    productId: _id
                }
            })
        } else if (category === 'tablet') {
            navigate(`/may-tinh-bang/${convertProductLink(name)}`, {
                replace: false,
                state: {
                    productId: _id
                }
            })
        }
        
    }

    const alertPopup = (
        shouldRenderAlert && (
            <Modal backdrop={false} isShowModal={addToCartSuccess} type='alert'>
                <div className={classes.alert}>
                    <span className={classes.icon}><img src={iconCheked} alt="" /></span>
                    Sản phẩm đã được thêm vào giỏ hàng
                </div>
            </Modal>
        )
    );

    return (
		<div className={`${classes['product-item']} ${props.col ? classes[`col-${props.col}`] : ''} ${props.display === 'LIST' ? classes['item-list'] : ''}`}>
			<a
				href={`${
					category === 'smartphone'
						? '/dien-thoai/'
						: category === 'tablet'
						? '/may-tinh-bang/'
						: ''
				}${convertProductLink(name)}`}
				onClick={(e) => navigateDetail(e, name)}
			>
				<img src={img} alt={name} onError={(e)=>{e.target.onError = null; e.target.src=`https://dummyimage.com/600x600/4a4a4a/ffffff&text=No+Image`}}/>
				<div className={classes.desc}>
					<h3 className={classes['product-name']}>{name}</h3>
					{price &&
						(sale ? (
							<Fragment>
								<p className={classes['main-price']}>
									{formatCurrency(price)}
									<small>đ</small>
								</p>
								<p className={classes['product-price']}>
									{formatCurrency(price - sale)}
									<small>đ</small>
								</p>
							</Fragment>
						) : (
							<p className={classes['product-price']}>
								{formatCurrency(price)}
								<small>đ</small>
							</p>
						))}
					{props.showInfo && (
						<ul className={classes.specs}>
							{specs.display && (
								<li>
									<i className='icon-phone'></i>
									<span>{specs.display.size} inches</span>
								</li>
							)}
							{specs.memory.ram && (
								<li>
									<i className='icon-ram'></i>
									<span>{`${specs.memory.ram} ${
										specs.memory.ram > 128 ? 'MB' : 'GB'
									}`}</span>
								</li>
							)}
							{specs.memory.rom && (
								<li>
									<i className='icon-storage'></i>
									<span>{specs.memory.rom} GB</span>
								</li>
							)}
						</ul>
					)}
				</div>
			</a>
			{alertPopup}
		</div>
	);
}

export default ProductItem;