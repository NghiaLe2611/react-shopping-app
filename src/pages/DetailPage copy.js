import { useState, useEffect, Fragment } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import classes from '../scss/ProductDetail.module.scss';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { capitalizeFirstLetter, formatCurrency, convertProductLink } from '../helpers/helpers';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSelector, useDispatch } from 'react-redux';
import { cartActions } from '../store/cart';
import { useDelayUnmount } from '../hooks/useDelayUnmount';
import Modal from '../components/UI/Modal';
import iconAdd from '../assets/images/icon-add.png';

function BoxThumbnail({ children }) {
    return (
        <div
            style={{
                height: 65,
                width: 65,
                margin: '0 4px'
            }}
        >
            {children}
        </div>
    )
}

const DetailPage = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const cart = useSelector((state) => state.cart);
    // const showCart = useSelector(state => state.cart.isShowCart);

    const [product, setProduct] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const [selectedColor, setSelectedColor] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [tabContent, setTabContent] = useState([]);
    const [isComparing, setIsComparing] = useState(false);
    const [listCompare, setListCompare] = useState([{}, {}, {}]);
    const [showModalCompare, setShowModalCompare] = useState(false);

    const { isLoading, error, fetchData: fetchProducts } = useFetch();

    const shouldRenderModal = useDelayUnmount(showModalCompare, 300);
    // const mountedModalStyle = { animation: 'fadeIn 200ms ease-in' };
	// const unmountedModalStyle = {
	// 	animation: 'fadeOut 20ms ease-out',
	// 	animationFillMode: 'forwards',
	// };

    useEffect(() => {
        fetchProducts({
            url: "http://localhost:5000/product/" + productId
        }, data => {
            // console.log(data);
            if (data) {
                setProduct(data);
            }
        });
    }, [fetchProducts, productId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchKey) {
                fetchProducts({
                    url: `http://localhost:5000/productSearch?category=${product.category}&name=${searchKey.toLowerCase()}`
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
    }, [searchKey, product]);

    useEffect(() => {
        const list = [...listCompare];
        const found = list.findIndex(item => item._id);
        if (found === -1) {
            setIsComparing(false);
        }
    }, [listCompare])

    // useEffect(() => {

    //     if (showModalCompare) {
    //         document.querySelector('html').classList.add('modal-open');
    //         document.body.classList.add('modal-open');
    //     } else {
    //         document.querySelector('html').classList.remove('modal-open');
    //         document.body.classList.remove('modal-open');
    //     }

    // }, [showModalCompare]);

    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <button
                className={`${className} ${classes.arrow} ${classes.next}`}
                style={{ ...style }}
                onClick={onClick}
            />
        );
    }
    
    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <button
                className={`${className} ${classes.arrow} ${classes.prev}`}
                style={{ ...style }}
                onClick={onClick}
            />
        );
    }

    const settings = {
        dots: false,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        className: classes['wrap-slider'],
        nextArrow: <SampleNextArrow/>,
        prevArrow: <SamplePrevArrow/>
    };

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

    const handleSelectThumbnail = (item, index) => {
        if (item) {
            setActiveTab(index + 1);
            const itemIndex = tabContent.findIndex(val => val.color === item.color);
            if (itemIndex < 0) {
                setTabContent(content => content = [...content, item]);
            }
        } else {
            setActiveTab(0);
        }
    };

    const addToCartHandler = () => {
        dispatch(cartActions.addItemToCart({
            _id: product._id, 
            quantity: 1, 
            img: product.img, 
            name: product.name, 
            price: product.price, 
            sale: product.sale ? product.sale : 0
        }));

        setTimeout(() => {
            dispatch(cartActions.showCartPopup(true));
        }, 200);
    };

    const addToCompare = () => {
        setShowModalCompare(true);
    };

    const addItemToCompare = (product) => {
        setIsComparing(true);

        const list = [...listCompare];
        const found = list.findIndex(val => val._id === product._id);
       
        if (found >= 0) {
            removeItemCompare(product._id);
        } else {
            list.some((item, index) => {
                if (!item._id) {
                    list[index] = product;
                    setListCompare(list);
                    return true;
                }
            });
        }
    };

    const removeItemCompare = (id) => {
        const list = [...listCompare]; 
        const index = list.findIndex(item => item._id === id);

        if (index !== -1) {
            list.splice(index, 1);
            list.push({});
            setListCompare(list);
        }
    };

    const closeModalCompare = () => {
        setShowModalCompare(false);
        setSuggestions([]);
        setSearchKey('');
    };

    const confirmCompare = () => {
        const list = [...listCompare].filter(item => item._id);
        if (list.length < 2) {
            alert ("Bạn phải chọn ít nhất 2 sản phẩm !");
        } else {
            let link = '';
            
            for (const val of list) {
                const index = list.findIndex(item => item._id === val._id);
                link += `id=${val._id}`;
                if (index < list.length - 1) {
                    link += '&';
                }
            }

            navigate('/so-sanh?' + link);
        }
    };

    const onSearchProduct = (e) => {
        setSearchKey(e.target.value);
    };

    let productContent = isLoading && (
        <Fragment>
            <div className={classes['wrap-product-img']}>
                <div className={classes['img-skeleton']}>
                    <Skeleton height={'100%'} />
                </div>
                <div className={classes['thumb-skeleton']}>
                    {
                        Array(5).fill().map((item ,index) => (
                            <BoxThumbnail key={index}>
                                <Skeleton height={'100%'} />
                            </BoxThumbnail>
                        ))
                    }
                </div>
            </div>
            <div className={classes['product-detail']}>
                <Skeleton className={classes['title-skeleton']}/>
                <Skeleton className={classes['price-skeleton']}/>
                <Skeleton className={classes['button-skeleton']}/>
                <Skeleton count={8} height={35}/>
            </div>
        </Fragment>
    );
    let breadcrumbsCate;

    const productTab = product && (
        <div className={classes['product-tab']}>
            {
                product.featureImgs && (
                    <div className={`${classes.item} ${activeTab === 0 ? classes.selected : ''}`} onClick={() => handleSelectThumbnail()}>
                        <div className={classes.img}>
                            <span className={`${classes.icon} icon-star`}></span>
                        </div>
                        <span>Điểm nổi bật</span>
                    </div>
                )
            }
            {
                product.variations && product.variations.colors.length && (
                    product.variations.colors.map((item, index) => (
                        <div key={item.color} className={`${classes.item} ${activeTab === index + 1 ? classes.selected : ''}`} 
                            onClick={() => handleSelectThumbnail(item, index)}
                        >
                                <div className={classes.img}>
                                <img src={item.thumbnail} alt={product.name + '-' + item.color} /> 
                            </div>
                            <span>{item.color}</span>
                        </div>
                    ))
                )
            }
        </div>
    )

    let sliderContent;
 
    if (product) {
        sliderContent = (
            <div className={classes['wrap-product-img']}>
                <div className={`${classes.tab} ${activeTab === 0 ? classes.show : ''}`} id='tab-1'>
                    {
                        product.featureImgs.length >= 2 ? (
                            <Slider {...settings}>
                                {
                                    product.featureImgs.map((image, index) => (
                                        <div className="item" key={index}>
                                            <img src={image} alt="" />
                                        </div>
                                    ))
                                }
                            </Slider>
                        ) : <img src={product.featureImgs[0]} alt={product.name} />
                    }
                    
                </div>
                {
                    tabContent.length > 0 && (
                        tabContent.map((item, index) => (
                            <div key={item.color} className={`${classes.tab} ${activeTab === index + 1 ? classes.show : ''}`} id={`tab-${index + 2}`}>
                                <Slider {...settings}>
                                    {
                                        item.images.map((image, index) => (
                                            <div className="item" key={index}>
                                                <img src={image} alt={product.name + '-' + item.color} />
                                            </div>
                                        ))
                                    }
                                </Slider>
                            </div>
                        ))
                    )
                }
                {productTab}
            </div>
        )
    }

    if (!error && product) {

        productContent = (
            <Fragment>
                {sliderContent}
                <div className={classes['product-detail']}>
                    <div className={classes['wrap-name']}>
                        <h1 className={classes['product-name']}>{product.name}</h1>
                        <p className={classes.txt} onClick={() => addItemToCompare(product)}>
                            {
                                 
                                listCompare.findIndex(val => val._id === product._id) !== -1 ? (
                                    <Fragment>
                                        <span className='icon-check-circle'></span>Đã thêm so sánh
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <span className='icon-add'></span>So sánh       
                                    </Fragment>
                                )
                            }
                        </p>
                    </div>
                    {
                        product.variations && (
                            <Fragment>
                                <ul className={classes['list-variation']}>
                                    {
                                        product.variations.storage && product.variations.storage.map((item) => (
                                            <li key={item} className={`${item === product.specs.rom ? classes.selected : ''}`}>
                                                <Link to={`${product.category === 'smartphone' ? `/dien-thoai/` : product.category === 'tablet' ? `/may-tinh-bang/` : '/'}${convertProductLink(product.parent)}-${item}${item >= 16 ? 'GB' : 'TB'}`}>
                                                    {item} {item >= 32 ? 'GB' : 'TB'}
                                                </Link>
                                            </li>
                                        ))
                                    }
                                </ul>
                                <ul className={classes['list-variation']}>
                                    {
                                        product.variations.colors && product.variations.colors.map((item, index) => (
                                            <li key={item.color} className={`${index === selectedColor ? classes.selected : ''}`} 
                                                onClick={() => handleSelectColor(index)}>
                                                <span>{item.color}</span>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </Fragment>
                        )
                    }
                    {
                        product.sale ? (
                            <Fragment>
                                <p className={classes.price}>
                                    {formatCurrency(product.price - product.sale)}₫
                                    <small>{formatCurrency(product.price)}₫</small>
                                </p>
                            </Fragment>
                        ) : <p className={classes.price}>{formatCurrency(product.price)}₫</p>
                    }
                    <button className={classes['cart-btn']} onClick={addToCartHandler}>MUA NGAY</button>
                    <div className={classes['product-specs']}>
                        <h4>Cấu hình {getCategoryName(product.category)} {product.name}</h4>
                        <ul>
                            <li>
                                <p className={classes.left}>Màn hình</p>
                                <p className={classes.right}>{product.specs.display}</p>
                            </li>
                            <li>
                                <p className={classes.left}>Hệ điều hành</p>
                                <p className={classes.right}>{product.specs.os}</p>
                            </li>
                            <li>
                                <p className={classes.left}>Camera</p>
                                <p className={classes.right}>{product.specs.camera}</p>
                            </li>
                            <li>
                                <p className={classes.left}>Ram</p>
                                <p className={classes.right}>{product.specs.ram} GB</p>
                            </li>
                            <li>
                                <p className={classes.left}>Bộ nhớ trong</p>
                                <p className={classes.right}>{product.specs.rom} GB</p>
                            </li>
                            <li>
                                <p className={classes.left}>Chip</p>
                                <p className={classes.right}>{product.specs.chip}</p>
                            </li>
                            <li>
                                <p className={classes.left}>SIM</p>
                                <p className={classes.right}>{product.specs.sim}</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </Fragment>
        )

        switch(product.category) {
            case 'smartphone':
                breadcrumbsCate =  <Link to="/dien-thoai">Điện thoại</Link>;
                break;
            case 'tablet':
                breadcrumbsCate =  <Link to="/may-tinh-bang">Máy tính bảng</Link>;
                break;
            default:
                return
        }
    }
    
    return (
		<Fragment>
			<div className='container'>
				{product ? (
					<ul className='breadcrumbs'>
						<li>
							<Link to='/'>Trang chủ</Link>
						</li>
						<li>{breadcrumbsCate}</li>
						<li>
							<Link
								to={
									product.category === 'smartphone'
										? `/dien-thoai/hang/${product.brand}`
										: product.category === 'tablet'
										? `/may-tinh-bang/hang/${product.brand}`
										: '/'
								}
							>
								{product.category === 'smartphone'
									? 'Điện thoại ' +
									  capitalizeFirstLetter(product.brand)
									: product.category === 'tablet'
									? 'Máy tính bảng ' +
									  capitalizeFirstLetter(product.brand)
									: null}
							</Link>
						</li>
					</ul>
				) : (
					<div style={{ padding: '15px 0' }}>
						<Skeleton height={25} />
					</div>
				)}
				<div className={`card ${classes['wrap-product-detail']}`}>
					{productContent}
				</div>
			</div>
			{product && (
				<Fragment>
					<div className={classes['compare-modal']}
						style={{ display: isComparing ? 'block' : 'none' }}>
						<div className={classes['wrap-compare']}>
							<ul className={classes['list-compare']}>
								{
                                    listCompare.map((item, index) =>
                                        item._id ? (
                                            <li key={item._id}>
                                                <div className={classes.img}>
                                                    <img src={item.img} alt='' />
                                                </div>
                                                <p className={classes.txt}>{item.name}</p>
                                                <span onClick={() => removeItemCompare(item._id)}>&times;</span>
                                            </li>
                                        ) : (
                                            <li key={index}>
                                                <div className={classes.img} onClick={() => addToCompare()}>
                                                    <img src={iconAdd} alt='' />
                                                    <p className={classes.txt}>Thêm sản phẩm</p>
                                                </div>
                                            </li>
                                        )
                                    )
                                }
							</ul>
							<div className={classes['close-compare']}>
								<span className={classes['btn-compare']} onClick={confirmCompare}>
									So sánh
								</span>
								<span className={classes['btn-remove']}>
									Xóa tất cả sản phẩm
								</span>
							</div>
						</div>
                        <span className={classes.close} 
                            onClick={() => {setIsComparing(false)}}
                        >Đóng &times;</span>
					</div>

					{shouldRenderModal && (
						<Modal isShowModal={showModalCompare}
							closeModal={closeModalCompare}
						>
							<div className={classes['list-compare-modal']}>
								<p>Danh sách được thêm vào so sánh</p>
								<ul className={classes.list}>
                                    {
                                        listCompare.map((item, index) =>
                                            item._id && (
                                                <li key={item._id}>
                                                    <div className={classes.img}>
                                                        <img src={item.img} alt={item.name} />
                                                    </div>
                                                    <h3 className={classes.name}>{item.name}</h3>
                                                    {
                                                        item.sale ? (
                                                            <Fragment>
                                                                <p className={classes.price}>
                                                                    <small>{formatCurrency(item.price)}₫</small><br/>
                                                                    {formatCurrency(item.price - item.sale)}₫
                                                                </p>
                                                            </Fragment>
                                                        ) : <p className={classes.price}>{formatCurrency(item.price)}₫</p>
                                                    }
                                                    {
                                                        listCompare.findIndex(val => val._id === item._id) !== -1 && (
                                                            <p className={classes.txt}><span className='icon-check-circle'></span>Đã thêm so sánh</p>
                                                        )
                                                    }
                                                </li>
                                            )
                                        )
                                    }
								</ul>
                                <button className={classes.compare} onClick={confirmCompare}>So sánh</button>
                                <p>Nhập tên để tìm</p>
                                <div className={classes['wrap-search-ip']}>
                                    <input type="text" placeholder="Nhập tên sản phẩm để tìm" spellCheck="false"
                                        onChange={onSearchProduct} value={searchKey}
                                    />
                                </div>
                                <ul className={classes['suggestion-list']} style={{display: suggestions.length > 0 ? 'block' : 'none'}}>
                                    {
                                        suggestions.length > 0 && suggestions.map(item => (
                                            <li key={item._id} onClick={() => addItemToCompare(item)}>
                                                <div className={classes.img}>
                                                    <img src={item.img} alt={item.name} />
                                                </div>
                                                <div className={classes.info}>
                                                    <h3 className={classes.name}>{item.name}</h3>
                                                    {
                                                        item.sale ? (
                                                            <Fragment>
                                                                <p className={classes.price}>
                                                                    <small>{formatCurrency(item.price)}₫</small><br/>
                                                                    {formatCurrency(item.price - item.sale)}₫
                                                                </p>
                                                            </Fragment>
                                                        ) : <p className={classes.price}>{formatCurrency(item.price)}₫</p>
                                                    }
                                                    <span>Thêm so sánh</span>
                                                </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                                
							</div>
						</Modal>
					)}
				</Fragment>
			)}
		</Fragment>
	);
}

export default DetailPage;