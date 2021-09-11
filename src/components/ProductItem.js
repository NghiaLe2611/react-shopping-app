import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { cartActions } from '../store/cart';
import classes from '../scss/Products.module.scss';
import Modal from './UI/Modal';
import { useDelayUnmount } from '../hooks/useDelayUnmount';
import { formatCurrency } from '../helpers/helpers';
import iconCheked from '../assets/icon-check.svg';

// import { fetchProducts } from '../hooks/useHttp';

const ProductItem = (props) => {
    const dispatch = useDispatch();

    const { id, name, img, price, colors } = props;
    const [showModal, setShowModal] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null); // colors ? colors[0] : null
    const [isAddToCart, setIsAddToCart] = useState(false);
    const [addToCartSuccess, setAddToCartSuccess] = useState(false);
    const [activeImage, setActiveImage] = useState(img);

    const shouldRenderModal = useDelayUnmount(showModal, 350);
    const shouldRenderAlert = useDelayUnmount(addToCartSuccess, 350);

    useEffect(() => {
        const timer = setTimeout(() => setIsAddToCart(false), 500);

        if (showModal) {
            document.querySelector('html').classList.add('modal-open');
            document.body.classList.add('modal-open');
        } else {
            document.querySelector('html').classList.remove('modal-open');
            document.body.classList.remove('modal-open');
        }

        return () => {
            clearTimeout(timer);
        };
    }, [showModal]);

    useEffect(() => {
        let timerAlert;

        if (addToCartSuccess) {
            timerAlert = setTimeout(() => setAddToCartSuccess(false), 2000);
        }

        return () => {
            clearTimeout(timerAlert);
        };

    }, [addToCartSuccess]);


    const showProduct = (e, id) => {
        e.preventDefault();
        setShowModal(true);

        // if (activeProductId !== index) {
        //     fetchProducts({
        //         url: `smartphones/${index}.json`
        //     }, data => {
        //         if (data) {
        //             setActiveProduct(data);
        //         }
        //     });
        // }
        
    };

    const closeModalHandler = () => {
        setShowModal(false);

        // Reset to initial
        // setSelectedColor(prevColor => prevColor = colors ? colors[0] : null);
        setSelectedColor(prevColor => prevColor = null);
        setActiveImage(prevImage => prevImage = img);
    };

    const selectColor = (item) => {
        setSelectedColor(prevColor => prevColor = item.color);
        setActiveImage(prevImage => prevImage = item.img);
    };

    const addToCartHandler = () => {
        setIsAddToCart(true);
        if (colors) {
            if (selectedColor) {
                dispatch(cartActions.addItemToCart({
                    id, img, name, price, quantity: 1, color: selectedColor
                }));
                showAlertPopup();
            }
        } else {
            dispatch(cartActions.addItemToCart({
                id, img, name, price, quantity: 1
            }));
            showAlertPopup();
        }
    };

    const showAlertPopup = () => {
        setShowModal(false);
        setTimeout(() => {
            setAddToCartSuccess(true);
        }, 500);
    }

    const productModal = (
        shouldRenderModal && 
        <Modal closeModal={closeModalHandler} isShowModal={showModal}>
            <div className={classes['product-modal']}>
                <div className={classes['product-img']}>
                    <img src= {activeImage} alt={name} />
                </div>
                <div className={classes['product-detail']}>
                    <div className={classes['wrap-name']}>
                        <h3 className={classes.name}>{name}</h3>
                        <p className={classes.price}>{formatCurrency(price)}<small>đ</small></p>
                    </div>
                    {
                        colors && (
                            <ul className={classes['list-color']}>
                                { 
                                    colors.map((item) => (
                                        <li key={item.color} className={selectedColor === item.color ? classes.selected : null} onClick={() => selectColor(item)}>
                                            <div className={classes.img}><img src={item.img} alt={item.color} /></div>
                                            <p className={classes.txt}>{item.color}</p>
                                        </li>
                                    ))
                                }
                            </ul>
                        )
                    }
                    { isAddToCart && colors && selectedColor === null && <p className={classes.error}>Vui lòng chọn màu sản phẩm</p>}
                    <button className={classes['cart-btn']} onClick={addToCartHandler}>MUA NGAY</button>
                </div>
                <div className={classes['product-specs']}>

                </div>
            </div>
        </Modal>
    );

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
        <div className={classes['product-item']}>
            <div className={classes.img}>
                <a href="#" onClick={(e) => showProduct(e, id)}><img src={img} alt={name} /></a>
            </div>
            <h3 className={classes['product-name']}>{name}</h3>
            <p className={classes['product-price']}>{formatCurrency(price)}<small>đ</small></p>
            {productModal}
            {alertPopup}
        </div>
    )
}

export default ProductItem;