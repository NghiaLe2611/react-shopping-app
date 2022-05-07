import { useState, useEffect, useRef, Fragment} from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatCurrency, convertProductLink, colorCodeList } from '../../helpers/helpers';
import { cartActions } from '../../store/cart';
import classes from '../../scss/ProductDetail.module.scss';

const ProductInfo = (props) => {
    const dispatch = useDispatch();
	const {product, addItemToCompare, listCompare, showMoreSpecs } = props;
    const specs = product.specs;

    const [selectedColor, setSelectedColor] = useState(0);

    const showPopupRef = useRef(null);

    useEffect(() => {
        return () => {
            if (showPopupRef.current) {
                clearTimeout(showPopupRef.current);
            }
        }
    }, []);

    const handleSelectColor = (index) => {
        setSelectedColor(index);
    };

    const getCategoryName = (category) => {
        switch(category) {
            case 'smartphone':
                return 'Điện Thoại'
            case 'tablet':
                return 'Điện Thoại'
            default :
                return ''
        }
    };

    const addToCartHandler = () => {
        const color = product.variations && product.variations.colors ? product.variations.colors[selectedColor].color : null;
        let img = product.img;

        if (color) {
            const mapItem = product.variations.colors.find(val => val.color === color);
            img = mapItem.thumbnail;
        }
   
        dispatch(cartActions.addItemToCart({
            _id: product._id,
            product_id: color ? product._id + '-00' + (parseInt(colorCodeList.indexOf(color)) + 1) : product._id,
            category: product.category,
            quantity: 1, 
            img: img, 
            name: product.name, 
            price: product.sale ? product.price - product.sale : product.price, 
            sale: product.sale ? product.sale : 0,
            color: color
        }));

        showPopupRef.current = setTimeout(() => {
            dispatch(cartActions.showCartPopup(true));
        }, 200);
    };

	return (
        product ? (
            <div className={classes['product-detail']}>
                <div className={classes['wrap-name']}>
                    <h1 className={classes['product-name']}>{product.name}</h1>
                    <p className={classes.txt} onClick={() => addItemToCompare(product)}>
                        {listCompare.findIndex((val) => val._id === product._id) !== -1 ? (
                            <Fragment>
                                <span className='icon-check-circle'></span>Đã thêm so sánh
                            </Fragment>
                        ) : (
                            <Fragment>
                                <span className='icon-add'></span>So sánh
                            </Fragment>
                        )}
                    </p>
                </div>
                {product.variations && (
                    <Fragment>
                        <ul className={classes['list-variation']}>
                            {product.variations.storage &&
                                product.variations.storage.map((item) => (
                                    <li key={item} className={`${item === specs.memory.rom ? classes.selected : ''}`}>
                                        <Link
                                            to={`${product.category === 'smartphone' ? `/dien-thoai/` : product.category === 'tablet' ? `/may-tinh-bang/` : '/'}${convertProductLink(
                                                product.parent
                                            )}-${item}${item >= 16 ? 'GB' : 'TB'}`}>
                                            {item} {item >= 32 ? 'GB' : 'TB'}
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                        <ul className={classes['list-variation']}>
                            {product.variations.colors &&
                                product.variations.colors.map((item, index) => (
                                    <li key={item.color} className={`${index === selectedColor ? classes.selected : ''}`} onClick={() => handleSelectColor(index)}>
                                        <span>{item.color}</span>
                                    </li>
                                ))}
                        </ul>
                    </Fragment>
                )}
                {product.sale ? (
                    <Fragment>
                        <p className={classes.price}>
                            {formatCurrency(product.price - product.sale)}₫<small>{formatCurrency(product.price)}₫</small>
                        </p>
                    </Fragment>
                ) : (
                    <p className={classes.price}>{formatCurrency(product.price)}₫</p>
                )}
                <button className={classes['cart-btn']} onClick={addToCartHandler}>
                    MUA NGAY
                </button>
                <div className={classes['product-specs']}>
                    <h4>
                        Cấu hình {getCategoryName(product.category)} {product.name}
                    </h4>
                    <ul>
                        <li>
                            <p className={classes.left}>Màn hình</p>
                            <p className={classes.right}>
                                {specs.display.type}, {specs.display.size}", {specs.display.resolution}
                            </p>
                        </li>
                        <li>
                            <p className={classes.left}>Hệ điều hành</p>
                            <p className={classes.right}>{specs.platform.os}</p>
                        </li>
                        <li>
                            <p className={classes.left}>Camera sau</p>
                            <p className={classes.right}>{specs.camera.back.resolution}</p>
                        </li>
                        <li>
                            <p className={classes.left}>Camera trước</p>
                            <p className={classes.right}>{specs.camera.front.resolution}</p>
                        </li>
                        <li>
                            <p className={classes.left}>Ram</p>
                            <p className={classes.right}>{specs.memory.ram} GB</p>
                        </li>
                        <li>
                            <p className={classes.left}>Bộ nhớ trong</p>
                            <p className={classes.right}>{specs.memory.rom} GB</p>
                        </li>
                        <li>
                            <p className={classes.left}>Chip</p>
                            <p className={classes.right}>{specs.platform.chip}</p>
                        </li>
                        <li>
                            <p className={classes.left}>SIM</p>
                            <p className={classes.right}>{specs.sim}</p>
                        </li>
                    </ul>
                    <a href='/#' className={classes['show-more']} onClick={showMoreSpecs}>
                        Xem thêm cấu hình chi tiết
                    </a>
                </div>
            </div>
        ) : null
	);
};

export default ProductInfo;
