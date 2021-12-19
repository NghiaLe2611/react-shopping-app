import { useState, useEffect, useRef, Fragment } from 'react'
import { Link, useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import classes from '../scss/ProductDetail.module.scss';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { capitalizeFirstLetter, formatCurrency, convertProductLink } from '../helpers/helpers';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useDispatch } from 'react-redux';
import { cartActions } from '../store/cart';
import { useDelayUnmount } from '../hooks/useDelayUnmount';
import Modal from '../components/UI/Modal';
import CompareModalWrapper from '../components/UI/CompareModalWrapper';

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

    // const cart = useSelector((state) => state.cart);
    // const showCart = useSelector(state => state.cart.isShowCart);

    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [tabContent, setTabContent] = useState([]);
    const [isComparing, setIsComparing] = useState(false);
    const [listCompare, setListCompare] = useState([{}, {}, {}]);
    const [showInfoModal, setshowInfoModal] = useState(false);
    const [activeModalTab, setActiveModalTab] = useState('');

    const { isLoading, error, fetchData: fetchProducts } = useFetch();

    const shouldRenderInfoModal = useDelayUnmount(showInfoModal, 300);

    const mountedBtnStyle = { animation: "fadeIn 250ms ease-out forwards" };
    const unmountedBtnStyle = { animation: "fadeOut 250ms ease-out forwards" };

    const compareModalRef = useRef();

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
        if (showInfoModal) {
            document.querySelector('html').classList.add('modal-open');
            document.body.classList.add('modal-open');
        } else {
            document.querySelector('html').classList.remove('modal-open');
            document.body.classList.remove('modal-open');
        }

    }, [showInfoModal]);

    useEffect(() => {
        if (activeModalTab) {
            setshowInfoModal(true);
        }
    }, [activeModalTab]);

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
        // accessibility: false,
        // focusOnSelect: false,
        className: classes['wrap-slider'],
        nextArrow: <SampleNextArrow/>,
        prevArrow: <SamplePrevArrow/>
    };

    const getListCompare = (data) => {
        setListCompare(data);
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

    const addItemToCompare = (product) => {
        setIsComparing(true);
        compareModalRef.current.addItemToCompare(product);
    };
  
    const showMoreSpecs = (e) => {
        e.preventDefault();   
        setActiveModalTab('thong-so');
    };

    const showModalTab = (tab) => {
        setActiveModalTab(tab);
    };

    const closeModalInfo = () => {
        setshowInfoModal(false);
        setActiveModalTab('');
    }

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

    let sliderContent, infoModalContent;
    
    if (product) {
        sliderContent = (
            <div className={classes['wrap-product-img']}>
                <div className={`${classes.tab} ${activeTab === 0 ? classes.show : ''}`} id='tab-1'>
                    {
                        product.featureImgs.length >= 2 ? (
                            <Slider {...settings}>
                                {
                                    product.featureImgs.map((image, index) => (
                                        <div className="item" key={index} onClick={() => setActiveModalTab('highlight')}>
                                            <img src={image} alt=""/>
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
                                            <div className="item" key={index} onClick={() => setActiveModalTab(`color-${item.color}`)}>
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
        );
    }

    if (!error && product) {
        const specs = product.specs;
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
                                            <li key={item} className={`${item === specs.memory.rom ? classes.selected : ''}`}>
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
                        <h4>Cấu hình {getCategoryName(product.category)}{product.name}</h4>
                        <ul>
                            <li>
                                <p className={classes.left}>Màn hình</p>
                                <p className={classes.right}>{specs.display.type}, {specs.display.size}", {specs.display.resolution}</p>
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
                        <a href="/#" className={classes['show-more']} onClick={showMoreSpecs}>Xem thêm cấu hình chi tiết</a>
                    </div>
                </div>
            </Fragment>
        );

        infoModalContent = (
            shouldRenderInfoModal && (
                <Modal isShowModal={showInfoModal} animation='slide' contentClass={classes.infoModal} 
                    close={<span className={classes['close-specs']} onClick={closeModalInfo} style={showInfoModal ? mountedBtnStyle : unmountedBtnStyle}>Đóng</span>}
                    closeModal={closeModalInfo}>
                    <div className={classes['wrap-info-modal']}>
                        <div className={classes['fixed-tab']}>
                            <ul>
                                {
                                    product.featureImgs.length > 0 && <li className={`${activeModalTab === 'highlight' ? classes.selected : ''}`}
                                        onClick={(e) => showModalTab('highlight')}>Điểm nổi bật</li>
                                }
                                {
                                    product.variations && product.variations.colors.length ? (
                                        product.variations.colors.map(item => (
                                            <li key={item.color} className={`${activeModalTab === `color-${item.color}` ? classes.selected : ''}`}
                                                onClick={(e) => showModalTab(`color-${item.color}`)}>{item.color}</li>
                                        ))
                                    ) : null
                                }
                                <li className={`${activeModalTab === 'thong-so' ? classes.selected : ''}`} onClick={(e) => showModalTab('thong-so')}>Thông số kỹ thuật</li>
                                <li className={`${activeModalTab === 'danh-gia' ? classes.selected : ''}`} onClick={(e) => showModalTab('danh-gia')}>Bài viết đánh giá</li>
                            </ul>
                        </div>
                        {
                            product.featureImgs.length > 0 && (
                                <div className={`${classes['modal-tab']} ${activeModalTab === 'highlight' ? classes.show : ''}`} id='highlight'>
                                    Điểm nổi bật
                                </div>
                            )
                        }
                        {
                            product.variations && product.variations.colors.length ? (
                                product.variations.colors.map(item => (
                                    <div key={item.color} className={`${classes['modal-tab']} ${activeModalTab === `color-${item.color}` ? classes.show : ''}`} id={`color-${item.color}`}>
                                        {item.color}
                                    </div>
                                ))
                            ) : null
                        }
                        <div className={`${classes['modal-tab']} ${activeModalTab === 'thong-so' ? classes.show : ''}`} id='thong-so'>
                            <div className={classes.item}>
                                <p className={classes.specs}>Màn hình</p>
                                <ul className={classes.list}>
                                    <li>
                                        <span className={classes.lbl}>Công nghệ màn hình:</span>
                                        <p className={classes.info}>{specs.display.type}</p>
                                    </li>
                                    <li>
                                        <span className={classes.lbl}>Độ phân giải:</span>
                                        <p className={classes.info}>{specs.display.resolution}</p>
                                    </li>
                                    <li>
                                        <span className={classes.lbl}>Màn hình rộng:</span>
                                        <p className={classes.info}>{specs.display.size}"</p>
                                    </li>
                                    <li>
                                        <span className={classes.lbl}>Mặt kính cảm ứng:</span>
                                        {
                                            specs.display.glass ? <p className={classes.info}>{specs.display.glass}</p> : <p className={classes.info}>-</p>
                                        }
                                    </li>
                                </ul>
                            </div>
                            <div className={classes.item}>
                                <p className={classes.specs}>Hệ điều hành & CPU</p>
                                <ul className={classes.list}>
                                    <li>
                                        <span className={classes.lbl}>Hệ điều hành:</span>
                                        <p className={classes.info}>{specs.platform.os}</p>
                                    </li>
                                    <li>
                                        <span className={classes.lbl}>Chip xử lý (CPU):</span>
                                        <p className={classes.info}>{specs.platform.chip}</p>
                                    </li>
                                    <li>
                                        <span className={classes.lbl}>Tốc độ CPU:</span>
                                        <p className={classes.info}>{specs.platform.cpu}</p>
                                    </li>
                                    <li>
                                        <span className={classes.lbl}>Chip đồ họa (GPU):</span>
                                        <p className={classes.info}>{specs.platform.gpu}</p>
                                    </li>
                                </ul>
                            </div>
                            <div className={classes.item}>
                                <p className={classes.specs}>Bộ nhớ & Lưu trữ</p>
                                <ul className={classes.list}>
                                    <li>
                                        <span className={classes.lbl}>RAM:</span>
                                        <p className={classes.info}>{specs.memory.ram} GB</p>
                                    </li>
                                    <li>
                                        <span className={classes.lbl}>Bộ nhớ trong:</span>
                                        <p className={classes.info}>{specs.memory.rom} GB</p>
                                    </li>
                                    <li>
                                        <span className={classes.lbl}>Thẻ nhớ:</span>
                                        <p className={classes.info}>{specs.memory.card_slot}</p>
                                    </li>
                                </ul>
                            </div>
                            <div className={classes.item}>
                                <p className={classes.specs}>Camera sau</p>
                                <ul className={classes.list}>
                                    <li>
                                        <span className={classes.lbl}>Độ phân giải:</span>
                                        <p className={classes.info}>{specs.camera.back.resolution}</p>
                                    </li>
                                    {
                                        specs.camera.back.video && (
                                            <li>
                                                <span className={classes.lbl}>Quay phim:</span>
                                                <p className={classes.info}>{specs.camera.back.video}</p>
                                            </li>
                                        )
                                    }
                                    {
                                        specs.camera.back.features && (
                                            <li>
                                                <span className={classes.lbl}>Tính năng:</span>
                                                <p className={classes.info}>
                                                    {
                                                        specs.camera.back.features.map(item => (
                                                            <span key={item}>{item}</span>
                                                        ))
                                                    }
                                                </p>
                                            </li>
                                        )
                                    } 
                                </ul>
                            </div>
                            {
                                specs.camera.front !== "Không" && (
                                    <div className={classes.item}>
                                        <p className={classes.specs}>Camera trước</p>
                                        <ul className={classes.list}>
                                            <li>
                                                <span className={classes.lbl}>Độ phân giải:</span>
                                                <p className={classes.info}>{specs.camera.front.resolution}</p>
                                            </li>
                                            <li>
                                                <span className={classes.lbl}>Tính năng:</span>
                                                {
                                                    specs.camera.front.features && (
                                                        <p className={classes.info}>
                                                        {
                                                            specs.camera.front.features.map(item => (
                                                                <span key={item}>{item}</span>
                                                            ))
                                                        }
                                                    </p>
                                                    )
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                )
                            }
    
                            <div className={classes.item}>
                                <p className={classes.specs}>Kết nối</p>
                                <ul className={classes.list}>
                                    <li>
                                        <span className={classes.lbl}>Wifi:</span>
                                        <p className={classes.info}>{specs.connectivity.wifi}</p>
                                    </li>
                                    <li>
                                        <span className={classes.lbl}>Bluetooth:</span>
                                        <p className={classes.info}>{specs.connectivity.bluetooth}</p>
                                    </li>
                                    <li>
                                        <span className={classes.lbl}>USB:</span>
                                        <p className={classes.info}>{specs.connectivity.usb}</p>
                                    </li>
                                    <li>
                                        <span className={classes.lbl}>Jack tai nghe:</span>
                                        <p className={classes.info}>{specs.connectivity.audio ? specs.connectivity.audio : '-'}</p>
                                    </li>
                                    <li>
                                        <span className={classes.lbl}>Radio:</span>
                                        <p className={classes.info}>{specs.connectivity.radio ? specs.connectivity.radio : '-'}</p>
                                    </li>
                                </ul>
                            </div>
                            <div className={classes.item}>
                                <p className={classes.specs}>Pin & sạc</p>
                                <ul className={classes.list}>
                                    <li>
                                        <span className={classes.lbl}>Dung lượng pin:</span>
                                        <p className={classes.info}>{specs.pin} mah</p>
                                    </li>
                                </ul>
                            </div>
                            <div className={classes.item}>
                                <p className={classes.specs}>Thông tin khác</p>
                                <ul className={classes.list}>
                                    <li>
                                        <span className={classes.lbl}>Kích thước:</span>
                                        <p className={classes.info}>{specs.body.dimensions}</p>
                                    </li>
                                    <li>
                                        <span className={classes.lbl}>Nặng:</span>
                                        <p className={classes.info}>{specs.body.weight} g</p>
                                    </li>
                                    <li>
                                        <span className={classes.lbl}>Thời điểm ra mắt:</span>
                                        <p className={classes.info}>{product.released}</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={`${classes['modal-tab']} ${activeModalTab === 'danh-gia' ? classes.show : ''}`} id='danh-gia'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                            Et, suscipit molestiae praesentium autem eos ex qui illum fugiat ullam dignissimos rem hic, eligendi officia illo nisi placeat ratione commodi ad!
                        </div>
                    </div>
                </Modal>
            )
        );

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

            {infoModalContent}
            
            <CompareModalWrapper ref={compareModalRef} product={product} showBottomModal={true}
                addItemToCompare={addItemToCompare}
                isComparing={isComparing} 
                setIsComparing={setIsComparing}
                getListCompare={getListCompare}
            />
		</Fragment>
	);
}

export default DetailPage;