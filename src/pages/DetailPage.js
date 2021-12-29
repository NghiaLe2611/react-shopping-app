import { useState, useEffect, useRef, useMemo, useCallback, Fragment } from 'react'
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
import ModalSlides from '../components/slides/ModalSlides';

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

const starArr = [1,2,3,4,5];

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
    const [reviews, setReviews] = useState([]);
    const [isWriteReview, setIsWriteReview] = useState(false);
    const [ratingPoint, setRatingPoint] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewImgs, setReviewImgs] = useState([]);
    const [submitReviewForm, setSubmitReviewForm] = useState(false);
    const [formIsValid, setFormIsValid] = useState(false);

    const { isLoading, error, fetchData: fetchProducts } = useFetch();
    const { loadingReview, reviewError, fetchData: fetchReviews } = useFetch();
    const { fetchData: postReview } = useFetch();

    const shouldRenderInfoModal = useDelayUnmount(showInfoModal, 300);
    const shouldRenderWriteReviewModal = useDelayUnmount(isWriteReview, 300);

    const mountedBtnStyle = { animation: "fadeIn 250ms ease-out forwards" };
    const unmountedBtnStyle = { animation: "fadeOut 250ms ease-out forwards" };

    const compareModalRef = useRef();
    const starRating = useRef([]);
    const reviewFormRef = useRef({
        name: '',
        phone: '',
        email: ''
    });

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
        if (product) {
            fetchReviews({
                url: `http://localhost:5000/product/${product._id}/reviews`
            }, data => {
                if (data) {
                    setReviews(data.reviews);
                }
            });
        }
    }, [fetchReviews, product]);

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
        if (isWriteReview) {
            document.querySelector('html').classList.add('modal-open');
            document.body.classList.add('modal-open');
        } else {
            document.querySelector('html').classList.remove('modal-open');
            document.body.classList.remove('modal-open');
        }

    }, [isWriteReview]);

    useEffect(() => {
        if (activeModalTab) {
            setIsComparing(false);
            setshowInfoModal(true);
        }
    }, [activeModalTab]);

    useEffect(() => {
        if (formIsValid) {
            const reviewData = { 
                customerName: reviewFormRef.current.name.value,
                star: ratingPoint,
                comment: comment
            };
            
            postReview({
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                url: "http://localhost:5000/submitReview/" + product._id,
                body: reviewData
            }, data => {
                if (data) {
                    console.log(22222,data);
                }
            });
        }
    }, [formIsValid, postReview]);

    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <button style={{ ...style }} onClick={onClick} 
                className={`${className} ${classes.arrow} ${classes.next}`}
            />
        );
    };
    
    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <button style={{ ...style }} onClick={onClick}
                className={`${className} ${classes.arrow} ${classes.prev}`}
            />
        );
    };

    const settings = {
        dots: false,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
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
        const color = product.variations && product.variations.colors ? product.variations.colors[selectedColor].color : null;
        let img = product.img;

        if (color) {
            const mapItem = product.variations.colors.find(val => val.color === color);
            img = mapItem.thumbnail;
        }
   
        dispatch(cartActions.addItemToCart({
            _id: color ? product._id + '-' + color : product._id,
            category: product.category,
            quantity: 1, 
            img: img, 
            name: product.name, 
            price: product.sale ? product.price - product.sale : product.price, 
            sale: product.sale ? product.sale : 0,
            color: color
        }));

        setTimeout(() => {
            dispatch(cartActions.showCartPopup(true));
        }, 200);
    };

    const addItemToCompare = (product) => {
        if (!isComparing) {
            setIsComparing(true);
        }
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
    };

    const calculatePercentReview = (rating) => {
        const total = reviews.length;
        const amount = reviews.filter(val => val.star === rating).length;

        return parseFloat(amount/total * 100).toFixed(0)  + "%";
    };
    
    // Get review's average point
    const calculateAveragePoint = useCallback(() => {
        const sum = reviews.reduce((n, {star}) => n + star, 0);
        return parseFloat(sum/reviews.length).toFixed(1); 
    }, [reviews]);
    const averagePoint = useMemo(() => calculateAveragePoint(), [calculateAveragePoint]);

    const hoverOnStarHandler = (rating) => {
        for (let val of starArr) {
            if (val <= rating) {
                starRating.current[val].classList.add(classes.hovered);
            }
        }
    };

    const hoverOutStarHandler = (rating) => {
        for (let val of starArr) {
            if (val <= rating) {
                if (val <= rating) {
                    starRating.current[val].classList.remove(classes.hovered);
                }
            }
        }
    };

    const setRatingHandler = (rating) => {
        if (rating !== ratingPoint) {
            setRatingPoint(rating);
        } else {
            setRatingPoint(0);
        }
    };

    const onTypeReview = (e) => {
        setComment(e.target.value);
        if (e.target.value.length > 0) {
            e.target.classList.remove(classes.invalid);
        } else {
            e.target.classList.add(classes.invalid);
        }
    };

    const writeReviewHandler = (e) => {
        e.preventDefault();
        setIsWriteReview(true);
    };

    const closeWriteReviewModal = () => {
        setIsWriteReview(false);
        setSubmitReviewForm(false);
        setComment('');
    };

    const chooseImage = (e) => {
        // const nameWithoutExt = e.target.files[0].name.replace(/\.[^/.]+$/, '');

        let images = [];

		for (let i = 0; i < e.target.files.length; i++) {
			images.push(e.target.files[i]);
		}
		if (images.length > 0) {
			setReviewImgs(images);
		}

    };

    const removeReviewImg = (index) => {
        const imgs = [...reviewImgs];
        imgs.splice(index, 1)
        setReviewImgs(imgs);
    };

    const handleChangeInput = (e) => {
        if (e.target.value.length > 0) {
            e.target.classList.remove(classes.invalid);
        } else {
            e.target.classList.add(classes.invalid);
        }
    };

    const submitReview = (e) => {
        e.preventDefault();
        setSubmitReviewForm(true);
    
        if (reviewFormRef.current.name.value.length === 0) {
            reviewFormRef.current.name.classList.add(classes.invalid);
        }

        if (comment === '' || comment.length === 0) {
            reviewFormRef.current.comment.classList.add(classes.invalid);
        }

        if (ratingPoint !== 0 && reviewFormRef.current.name.value.length > 0 && comment.length >= 80) {
            setFormIsValid(true);
        } else {
            setFormIsValid(false);
        }
    };

    let reviewsContent = (
        <Fragment>
            <Skeleton width={'50%'} height={30} style={{marginBottom: 25}}/>
            <Skeleton count={5} width={'40%'} height={10} style={{marginBottom: 5}}/>
            <ul className={classes['list-review']}>
                {
                    Array(5).fill().map((item ,index) => (
                        <li key={index}>
                            <Skeleton height={20} style={{marginBottom: 10}}/>
                            <Skeleton height={20} style={{marginBottom: 10}}/>
                            <Skeleton height={25} style={{marginBottom: 10}}/>
                        </li>
                    ))
                }
            </ul>
        </Fragment>
    );

    let productContent = isLoading && (
        <Fragment>
            <div className={classes.left}>
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
                <div className={classes['wrap-reviews']}>
                    {reviewsContent}
                </div>
            </div>
            <div className={classes['product-detail']}>
                <Skeleton className={classes['title-skeleton']}/>
                <Skeleton className={classes['price-skeleton']}/>
                <Skeleton className={classes['price-skeleton']}/>
                <Skeleton className={classes['button-skeleton']}/>
                <Skeleton className={classes['title-skeleton']}/>
                <Skeleton count={8} height={35}/>
                <Skeleton height={35} style={{display: 'block', width: '70%', margin: '20px auto'}}/>
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
    );

    let sliderContent, infoModalContent;
    
    if (product) {
        if (reviews) {
            reviewsContent= (
                <Fragment>
                    <div className={classes['wrap-reviews']}>
                        <h5>Đánh giá {product.category === 'smartphone' ? 'Điện thoại ' : 
                            product.category === 'tablet' ? 'Máy tính bảng ' : null} {product.name}
                        </h5>
                        {
                            reviews.length ? (
                                <Fragment>
                                    <div className={classes['rating-overview']}>
                                        <div className={classes['rating-top']}>
                                            <span className={classes.point}>
                                                {averagePoint}
                                                {/* {calculateAveragePoint()} */}
                                            </span>
                                            <div className={classes['list-star']}>
                                                {
                                                    Array(5).fill().map((item, index) => (
                                                        <span key={index} className={`icon-star ${classes.inner} 
                                                            ${index + 1 <= Math.round(averagePoint) ? classes.selected : ''}`}>
                                                            <i className={`icon-star ${classes.border}`}></i>
                                                        </span>
                                                    ))
                                                }
                                            </div>
                                            <span className={classes.txt}>{reviews.length} đánh giá</span>
                                        </div>
                                        <ul className={classes['rating-list']}>
                                            {
                                                [...starArr].reverse().map(item => (
                                                    <li key={item}>
                                                        <span className={classes.star}>
                                                            {item}<i className='icon-star'></i>
                                                        </span>
                                                        <div className={classes['timeline-star']}>
                                                            <p style={{width: calculatePercentReview(item)}}></p>
                                                        </div>
                                                        <span className={classes.percent}>{calculatePercentReview(item)}</span>
                                                    </li>
                                                ))
                                            }  
                                        </ul>
                                    </div>
                                    <ul className={classes['list-review']}>
                                        {
                                            reviews.map(item => (
                                                <li key={item._id}>
                                                    <strong>{item.customerName}</strong>
                                                    <p className={classes.rating}>
                                                        {
                                                            Array(item.star).fill().map((item, index) => (
                                                                <i key={index} className='icon-star'></i>
                                                            ))
                                                        }
                                                        { item.star < 5 && (
                                                            Array(5 - item.star).fill().map((item, index) => (
                                                                <i key={index} className={`icon-star ${classes.black}`}></i>
                                                            ))
                                                        ) }
                                                    </p>
                                                    <p className={classes.comment}>{item.comment}</p>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    <div className={classes['wrap-btn']}>
                                        <a href="/#" className={classes['write-review']} onClick={writeReviewHandler}>Viết đánh giá</a>
                                        <a href="/#" className={classes['show-reviews']}>Xem tất cả đánh giả</a>
                                    </div>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <p className={classes.empty}>Chưa có nhận xét nào. Hãy để lại nhận xét của bạn.</p>
                                    <div className={classes['wrap-btn']}>
                                        <a href="/#" className={classes['write-review']} onClick={writeReviewHandler}>Viết đánh giá</a>
                                        <a href="/#" className={classes['show-reviews']}>Xem tất cả đánh giả</a>
                                    </div>
                                </Fragment>
                            )
                        }
                    </div>
                    {
                        shouldRenderWriteReviewModal && (
                            <Modal isShowModal={isWriteReview} closeModal={closeWriteReviewModal} animation='none' contentClass={classes.reviewModal}>
                                <div className={classes['wrap-review-modal']}>
                                    <h5>Đánh giá {product.category === 'smartphone' ? 'Điện thoại ' : 
                                        product.category === 'tablet' ? 'Máy tính bảng ' : null} {product.name}
                                    </h5>
                                    <form>
                                        <input type="hidden" name="ratingPoint" id="ratingPoint" value={ratingPoint} />
                                        <div className={classes['wrap-ratings']}>
                                            <p>Bạn cảm thấy sản phẩm này như thế nào ?</p>
                                            <div className={classes.ratings}>
                                                <ul className={classes['list-star']}>
                                                    {
                                                        starArr.map(item => (
                                                            <li key={item} className={item <= ratingPoint ? classes.selected : ''}
                                                                onMouseEnter={() => hoverOnStarHandler(item)} 
                                                                onMouseLeave ={() => hoverOutStarHandler(item)}
                                                                onClick={() => setRatingHandler(item)}
                                                                ref={ref => starRating.current[item] = ref}>
                                                                <span className={`icon-star ${classes.inner}`}>
                                                                    <i className={`icon-star ${classes.border}`}></i>
                                                                </span>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                            {
                                                submitReviewForm && ratingPoint === 0 && (
                                                    <p className={classes.error}>Bạn chưa đánh giá điểm sao, vui lòng đánh giá.</p>
                                                )
                                            }
                                        </div>
                                        <div className={classes['wrap-ip']}>
                                            <div className={classes.required}>
                                                <input className={classes.input} type='text' name='name' placeholder='Họ và tên' spellCheck='false'
                                                    onChange={handleChangeInput}
                                                    onBlur={handleChangeInput}
                                                    ref={ref => reviewFormRef.current.name = ref}/>
                                            </div>
                                            <div>
                                                <input className={classes.input} type='text' name='phone' placeholder='Số điện thoại' spellCheck="false"
                                                    ref={ref => reviewFormRef.current.phone = ref}/>
                                            </div>
                                            <div>
                                                <input className={classes.input} type='text' name='email' placeholder='Email' spellCheck="false"
                                                    ref={ref => reviewFormRef.current.email = ref}/>
                                            </div>
                                        </div>
                                        <div className={classes.required}>
                                            <textarea className={classes.input} name='comment' id='comment' rows='8' spellCheck="false"
                                                ref={ref => reviewFormRef.current.comment = ref}
                                                placeholder='Viết nhận xét...' 
                                                onChange={onTypeReview}
                                                onBlur={handleChangeInput}
                                            >
                                            </textarea>
                                            {
                                                submitReviewForm && comment.length < 80 && (
                                                    <p className={classes.error}>Nội dung đánh giá quá ít. Vui lòng nhập thêm nội dung đánh giá về sản phẩm.</p>
                                                )
                                            }
                                        </div>
                                        <div className={classes.bottom}>
                                            <label htmlFor="image-upload" className={classes.upload}>
                                                <i className="icon-camera"></i>Thêm hình ảnh
                                                <input id="image-upload" type="file" multiple={true} onChange={chooseImage}/> 
                                            </label>
                                            <p className={classes.characters} style={{display: comment.length >= 80 ? 'none' : 'block'}}>
                                                {comment.length} ký tự (tối thiểu 80)
                                            </p>
                                            {
                                                reviewImgs.length > 0 && (
                                                    <ul className={classes['list-img']}>
                                                        {
                                                            reviewImgs.map((item, index) => (
                                                                <li key={index}>
                                                                    <img src={URL.createObjectURL(item)} alt={item.name} />
                                                                    <span onClick={() => removeReviewImg(index)}>Xóa</span>
                                                                </li>
                                                            ))
                                                        }
                                                    </ul>
                                                )
                                            }
                                        </div>
                                        <button className={classes.send} onClick={submitReview}>Gửi đánh giá</button>
                                    </form>                         
                                </div>
                            </Modal>
                        )
                    }
                </Fragment>
            );
        }
        sliderContent = (
            <div className={classes.left}>
                <div className={classes['wrap-product-img']}>
                    <div className={`${classes.tab} ${activeTab === 0 ? classes.show : ''}`} id='tab-1'>
                        {
                            product.featureImgs.length >= 2 ? (
                                <Slider {...settings}>
                                    {
                                        product.featureImgs.map((image, index) => (
                                            <div key={index} onClick={() => setActiveModalTab('highlight')}>
                                                <img src={image} alt=""/>
                                            </div>
                                        ))
                                    }
                                </Slider>
                            ) : <img src={product.featureImgs[0]} alt={product.name} onClick={() => setActiveModalTab('highlight')}/>
                        }      
                    </div>
                    {
                        tabContent.length > 0 && (
                            tabContent.map((item, index) => (
                                <div key={item.color} className={`${classes.tab} ${activeTab === index + 1 ? classes.show : ''}`} id={`tab-${index + 2}`}>
                                    <Slider {...settings}>
                                        {
                                            item.images.map((image, index) => (
                                                <div key={index} onClick={() => setActiveModalTab(`color-${item.color}`)}>
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
                {reviewsContent}
            </div>
        );
    };

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
                        <h4>Cấu hình {getCategoryName(product.category)} {product.name}</h4>
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
                            product.featureImgs && (
                                <div className={`${classes['modal-tab']} ${activeModalTab === 'highlight' ? classes.show : ''}`} id='highlight'>
                                    <ModalSlides featureImgs={product.featureImgs} name={product.name}/>
                                </div>
                            )
                        }
                        {
                            product.variations && product.variations.colors.length ? (
                                product.variations.colors.map((item, colorIndex) => (
                                    <div key={item.color} className={`${classes['modal-tab']} ${activeModalTab === `color-${item.color}` ? classes.show : ''}`} id={`color-${item.color}`}>
                                        <ModalSlides images={item.images} color={item.color} />
                                    </div>
                                ))
                            ) : null
                        }
                        <div className={`${classes['modal-tab']} ${activeModalTab === 'thong-so' ? classes.show : ''}`} id={classes['thong-so']}>
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
                            <p className={classes.desc}>
                                {
                                    product.description ? product.description : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam, saepe! Ea, labore suscipit! Inventore incidunt mollitia error nemo atque placeat cumque reiciendis rerum deleniti, distinctio cum animi quasi quam? Modi aperiam suscipit fugiat voluptatum similique, placeat vitae! Consectetur voluptate recusandae in corrupti, eligendi ipsum laborum quasi magni placeat officia natus.'
                                }
                            </p>
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
    };

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
				<div className='card'>
                    <div className={classes['wrap-product-detail']}>
					    {productContent}
                    </div>
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