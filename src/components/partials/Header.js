import { useState, useEffect, Fragment } from 'react'
import Modal from '../UI/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cartActions } from '../../store/cart';
// import { authActions } from '../../store/auth';
import useCheckMobile from '../../hooks/useCheckMobile';
import { useDelayUnmount } from '../../hooks/useDelayUnmount';
import useFetch from '../../hooks/useFetch';
import { authService } from '../../api/auth-service';
import { capitalizeFirstLetter, formatCurrency, convertProductLink } from '../../helpers/helpers';
import classes from '../../scss/Header.module.scss';
import iconCheked from '../../assets/images/icon-check.svg';

const brandList = [
    "apple",
    "nokia",
    "oppo",
    "samsung",
    "sony",
    "xiaomi"
];

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const cart = useSelector((state) => state.cart);
    const showCart = useSelector(state => state.cart.isShowCart);
    const userData = useSelector(state => state.auth.userData);
    

    const [hoverMenu, setHoverMenu] = useState(false);
    const [hoverProfile, setHoverProfile] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const shouldRenderModal = useDelayUnmount(showCart, 350);
    const { fetchData: fetchSuggestProducts } = useFetch();
    const { isMobile } = useCheckMobile();

    useEffect(() => {
        setHoverMenu(false);
        setShowMenu(false);
        setHoverProfile(false);
        setSearchKey('');
        setSuggestions([]);
    }, [location]);

    useEffect(() => {
        if (showMenu) {
            document.querySelector('html').classList.add('modal-open');
            document.body.classList.add('modal-open');
        } else {
            document.querySelector('html').classList.remove('modal-open');
            document.body.classList.remove('modal-open');
        }
    }, [showMenu]);

    useEffect(() => {
        
        const timer = setTimeout(() => {
            if (searchKey) {
                fetchSuggestProducts({
                    url: `${process.env.REACT_APP_API_URL}/productSearch?name=${searchKey.toLowerCase()}`
                }, data => {
                    if (data) {
                        setSuggestions(data.results);
                    }
                });
            } else {
                setSuggestions([]);
            }
        }, 1000);

        return () => {
            clearTimeout(timer);
        }
    }, [fetchSuggestProducts, searchKey]);

    const showCartHandler = () => {
        if (cart.items.length > 0) {
            dispatch(cartActions.showCartPopup(true));
        }
    };

    const closeCartHandler = () => {
        dispatch(cartActions.showCartPopup(false));
        dispatch(cartActions.confirmChooseCart({
            type: 'CLEAR'
        }));
    };

    const onSearchProduct = (e) => {
        setSearchKey(e.target.value);
    };

    const logOutHandler = async (e) => {    
        e.preventDefault() ;
        
        authService.logout(() => {
            setTimeout(() => {
                console.log('Log out');
                navigate('/');
            }, 500);
        });

        // try {
        //     await authService.logout().then(() => {
        //         setTimeout(() => {
        //             dispatch(authActions.updateState({
        //                 userData: null
        //             }));
        //             navigate('/');
        //         }, 1000);
        //     });
        // } catch(err) {
        //     console.log(err);
        // }

        // authApp.signOut()
        // firebase.auth().signOut()
    };

    const cartModal = (
        shouldRenderModal && (
            <Modal closeModal={closeCartHandler} isShowModal={showCart} backdrop={false} type='popup' position='absolute'>
                <div className={classes.alert}>
                    <div className={classes.txt}>
                        <span className={classes.icon}><img src={iconCheked} alt=""/></span>Thêm vào giỏ hàng thành công!
                    </div>
                    <Link className={classes['view-cart']} to='/cart'>Xem giỏ hàng và thanh toán</Link>
                    <span className={classes['btn-close']} onClick={closeCartHandler}>&times;</span>
                </div>
            </Modal>
        )
    );

    const headerPC = (
        <div className={classes['wrap-header']}>
            <div className={classes.logo}>
                <Link to="/">
                    <span className="icon-phone"></span>React Mobile
                </Link>
            </div>
            <ul className={classes.menu}>
                <li onMouseEnter={() => setHoverMenu(1)}
                    onMouseLeave={() => setHoverMenu(false)}
                    className={`${hoverMenu === 1 ? classes.active : ''}`}
                >
                    <Link to="/dien-thoai">Điện thoại</Link>
                    <div className={classes['sub-menu']}>
                        <ul>
                            {
                                brandList.map(item => (
                                    <li key={item}>
                                        <Link to={`/dien-thoai/hang/${item}`}>{capitalizeFirstLetter(item)}</Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </li>
                <li onMouseEnter={() => setHoverMenu(2)}
                    onMouseLeave={() => setHoverMenu(false)}
                    className={`${hoverMenu === 2 ? classes.active : ''}`}
                >
                    <Link to="/may-tinh-bang">Máy tính bảng</Link>
                    <div className={classes['sub-menu']}>
                        <ul>
                            <li>
                                <Link to="/may-tinh-bang/hang/apple">Apple</Link>
                            </li>
                            <li>
                                <Link to="/may-tinh-bang/hang/samsung">Samsung</Link>
                            </li>
                            <li>
                                <Link to="/may-tinh-bang/hang/xiaomi">Xiaomi</Link>
                            </li>
                        </ul>
                    </div>
                </li>
                <li><Link to="/phu-kien">Phụ kiện</Link></li>
                <li><Link to="/tin-tuc">Tin tức</Link></li>
            </ul>
            <div className={classes['wrap-search']}>
                <input type="text" placeholder="Nhập tên sản phẩm cần tìm" onChange={onSearchProduct} value={searchKey} spellCheck="false"/>
                <ul className={classes['suggestion-list']} style={{display: suggestions.length > 0 ? 'block' : 'none'}}>
                    {
                        suggestions.length > 0 && suggestions.map(item => (
                            <li key={item._id}>
                                <Link to={`/${item.category === 'smartphone' ? 'dien-thoai' : 'may-tinh-bang'}/${convertProductLink(item.name)}`}>
                                    <div className={classes.img}>
                                        <img src={item.img} alt={item.name} />
                                    </div>
                                    <div className={classes.info}>
                                        <h3 className={classes.name}>{item.name}</h3>
                                        {
                                            item.sale ? (
                                                <Fragment>
                                                    <p className={classes.price}>
                                                        <small>{formatCurrency(item.price)}₫</small>
                                                        {formatCurrency(item.price - item.sale)}₫
                                                    </p>
                                                </Fragment>
                                            ) : <p className={classes.price}>{formatCurrency(item.price)}₫</p>
                                        }
                                    </div>
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
            {
                userData ? (
                    <div className={`${classes['wrap-user']} ${hoverProfile ? classes.hovered : ''}`}
                        onMouseEnter={() => setHoverProfile(true)}
                        onMouseLeave={() => setHoverProfile(false)}
                    >
                        <div className={classes.user}>
                            <span className={classes.avatar}>
                                {
                                    userData.photoURL ? (
                                        <img src={userData.photoURL} alt={userData.displayName} />
                                    ) : (
                                        <i className='icon-user'></i>
                                    )
                                }
                            </span>
                            <p>{userData.displayName ? userData.displayName : userData.email}</p>
                        </div>
                        <div className={classes['user-dropdown']}>
                            <Link to='/tai-khoan'>Tài khoản của tôi</Link>
                            <Link to='/tai-khoan/don-hang'>Đơn hàng của tôi</Link>
                            <Link to='/dang-xuat' onClick={logOutHandler}>Đăng xuất</Link>
                        </div>
                    </div>
                ) : (
                    <div className={classes['wrap-user']}>
                        <Link to='/dang-nhap' className={classes.user}>
                            <i className='icon-user'></i>
                            <p>Đăng nhập</p>
                        </Link>
                    </div>   
                )
            }
            
            <div className={classes['wrap-cart']} onClick={showCartHandler}>
                <div className={classes.cart}>
                    <span className='icon-cart'></span>
                    <span className={classes.quantity}>{cart.totalQuantity}</span>
                </div>
                <span className={classes.txt}>Giỏ hàng</span>
            </div>
            {cartModal}
        </div>
    );

    const headerSP = (
        <Fragment>
            <div className={classes['wrap-header']}>
                <div className={classes.toggle} onClick={() => setShowMenu(true)}>
                    <div className={classes.bar1}></div>
                    <div className={classes.bar2}></div>
                    <div className={classes.bar3}></div>
                </div>
                <div className={classes.logo}>
                    <Link to="/">
                        <span className="icon-phone"></span>React Mobile
                    </Link>
                </div>
                <div className={classes['wrap-cart']} onClick={showCartHandler}>
                    <div className={classes.cart}>
                        <span className='icon-cart'></span>
                        <span className={classes.quantity}>{cart.totalQuantity}</span>
                    </div>
                </div>
                {cartModal}
            </div>
            <div className={`${classes['wrap-menu']} ${showMenu ? classes.active : ''}`}>
                <span className={classes.close} onClick={() => setShowMenu(false)}>&times;</span>
                <div className={classes.logo}>
                    <a href="/#">
                        <span className="icon-phone"></span>React Mobile
                    </a>
                </div>
                <ul className={classes.menu}>
                    <li className={`${hoverMenu === 1 ? classes.active : ''}`}>
                        <div className={classes.link}>
                            <Link to="/dien-thoai">Điện thoại</Link>
                            <span className={classes.arrow} onClick={() => setHoverMenu(prev => prev === 1 ? false : 1)}></span>
                        </div>
                        <div className={classes['sub-menu']}>
                            <ul>
                                {
                                    brandList.map(item => (
                                        <li key={item}>
                                            <Link to={`/dien-thoai/hang/${item}`}>{capitalizeFirstLetter(item)}</Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </li>
                    <li className={`${hoverMenu === 2 ? classes.active : ''}`}>
                        <div className={classes.link}>
                            <Link to="/may-tinh-bang">Máy tính bảng</Link>
                            <span className={classes.arrow} onClick={() => setHoverMenu(prev => prev === 2 ? false : 2)}></span>
                        </div>
                        <div className={classes['sub-menu']}>
                            <ul>
                                <li>
                                    <Link to="/may-tinh-bang/hang/apple">Apple</Link>
                                </li>
                                <li>
                                    <Link to="/may-tinh-bang/hang/samsung">Samsung</Link>
                                </li>
                                <li>
                                    <Link to="/may-tinh-bang/hang/xiaomi">Xiaomi</Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li><Link to="/phu-kien" className={classes.link}>Phụ kiện</Link></li>
                    <li><Link to="/tin-tuc" className={classes.link}>Tin tức</Link></li>
                </ul>
            </div>
        </Fragment>
    );

    return (
        <Fragment>
            <div className={classes.header}>
                <div className="container">
                    { isMobile && headerSP }
                    { !isMobile && headerPC }
                </div>
            </div>
            {showMenu && <div className="overlay" onClick={() => setShowMenu(false)}></div>}
        </Fragment>
    )
}

export default Header;