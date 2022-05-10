import { useState, useEffect, useRef, Fragment } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Skeleton from 'react-loading-skeleton';
import ProductInfo from '../components/detail/ProductInfo';
import ProductSlider from '../components/detail/ProductSlider';
import ProductModal from '../components/detail/ProductModal';
import { useSelector } from 'react-redux';
import { useDelayUnmount } from '../hooks/useDelayUnmount';
import CompareModalWrapper from '../components/UI/CompareModalWrapper';
import { capitalizeFirstLetter } from '../helpers/helpers';
import NotFound from './NotFound';
import ProductReview from '../components/detail/ProductReview';
import RecentlyViewedProducts from '../components/detail/RecentlyViewedProducts';
import { FacebookShareButton, FacebookMessengerShareButton, TwitterShareButton } from 'react-share';
import { FacebookIcon, FacebookMessengerIcon, TwitterIcon } from 'react-share';
import useCheckMobile from '../hooks/useCheckMobile';
import Swal from 'sweetalert2';
import classes from '../scss/ProductDetail.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

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
	const navigate = useNavigate();    
	const userData = useSelector(state => state.auth.userData);

	const [product, setProduct] = useState(null);
	const [isLiked, setIsLiked] = useState(false);
	// const [selectedColor, setSelectedColor] = useState(0);
	const [isComparing, setIsComparing] = useState(false);
	const [listCompare, setListCompare] = useState([{}, {}, {}]);
	const [showInfoModal, setshowInfoModal] = useState(false);
	const [activeModalTab, setActiveModalTab] = useState('');
	// const [reviewsCount, setReviewsCount] = useState(0);
	// const [averagePoint, setAveragePoint] = useState(0);
	const [isWriteReview, setIsWriteReview] = useState(false);
	const [isShowAllReviews, setIsShowAllReviews] = useState(false);
	const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);

	const { isMobile } = useCheckMobile();

	const { isLoading, error, fetchData: fetchProducts } = useFetch();
	const { fetchData: addToFav } = useFetch();
	const { fetchData: removeFav } = useFetch();
	const { fetchData: checkProductIsLiked } = useFetch();
	const { fetchData: updateViewedProduct } = useFetch();
	const { fetchData: fetchRecentlyProducts } = useFetch();

	const shouldRenderInfoModal = useDelayUnmount(showInfoModal, 300);
	const compareModalRef = useRef();

	let convertedProductId = productId;
	const strHasParentheses = productId.match(/\(([^)]+)\)/);
	if (strHasParentheses) {
		convertedProductId = productId.replace(/ *\([^)]*\) */g, strHasParentheses[0].replace('-', '%2F'));
	};

	useEffect(() => {
		if (product && userData) {
			updateViewedProduct({
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				url: `${process.env.REACT_APP_API_URL}/api/v1/me/recently`,
				body: {
					product_id: product._id
				}
			}, data => {
				if (data.success) {
					fetchRecentlyProducts({
						url: `${process.env.REACT_APP_API_URL}/api/v1/me/recently`,
					}, res => {
						setRecentlyViewedProducts(res);
					});
				}
			});
		}
	}, [product, updateViewedProduct, fetchRecentlyProducts]);

	useEffect(() => {
		if (product) {
			if (userData) {
				checkProductIsLiked({
					url: `${process.env.REACT_APP_API_URL}/api/v1/me/wishlist/${product._id}/liked` 
				}, data => {
					if (data.liked) {
						setIsLiked(true);
					}
				});
			}
		}
	}, [checkProductIsLiked, product]);

	useEffect(() => {
		fetchProducts({
			url: `${process.env.REACT_APP_API_URL}/api/v1/products/${convertedProductId}` 
		}, data => {
			if (data) {
				setProduct(data);
			}
		});
	}, [fetchProducts, convertedProductId]);

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
		if (isShowAllReviews) {
			document.querySelector('html').classList.add('modal-open');
			document.body.classList.add('modal-open');
		} else {
			document.querySelector('html').classList.remove('modal-open');
			document.body.classList.remove('modal-open');
		}
	}, [isShowAllReviews]);

	useEffect(() => {
		if (activeModalTab) {
			setIsComparing(false);
			setshowInfoModal(true);
		}
	}, [activeModalTab]);

	const getListCompare = (data) => {
		setListCompare(data);
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

	const closeModalInfo = () => {
		setshowInfoModal(false);
		setActiveModalTab('');
	};

	// const calculatePercentReview = (rating) => {
	//     const total = reviews.length;
	//     const amount = reviews.filter(val => val.star === rating).length;

	//     return parseFloat(amount/total * 100).toFixed(0)  + "%";
	// };
	
	// Get review's average point
	// const calculateAveragePoint = useCallback(() => {
	//     const sum = reviews.reduce((n, {star}) => n + star, 0);
	//     return parseFloat(sum/reviews.length).toFixed(1); 
	// }, [reviews]);
	// const averagePoint = useMemo(() => calculateAveragePoint(), [calculateAveragePoint]);

	const writeReviewHandler = (e) => {
		e.preventDefault();
		setIsWriteReview(true);
	};

	const showAllReviews = (e) => {
		e.preventDefault();
		setIsShowAllReviews(true);
	};

	const addToWishlist = (id) => {
		if (userData) {
			addToFav({
				method: 'PUT',
				url: `${process.env.REACT_APP_API_URL}/api/v1/me/wishlist/${id}`
			}, data => {
				if (data.success) {
					data.status === 1 ? setIsLiked(true) : setIsLiked(false);
				}
			});
		} else {
			Swal.fire({
				icon: 'warning',
				html: `<p>Bạn phải đăng nhập để thực hiện tính năng này!</p>`,
				confirmButtonText: 'OK',
				confirmButtonColor: '#f49f54'
			}).then(() => {
				navigate('/dang-nhap');
			});
			
		}
	};

	const removeFromWishlist = (id) => {
		removeFav({
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			url: `${process.env.REACT_APP_API_URL}/api/v1/me/wishlist/delete/${id}`
		});
	};

	let reviewsContent = (
		<ProductReview product={product}
			writeReviewHandler={writeReviewHandler} showAllReviews={showAllReviews} 
			isShowAllReviews={isShowAllReviews} setIsShowAllReviews={setIsShowAllReviews}
			isWriteReview={isWriteReview} setIsWriteReview={setIsWriteReview}
		/>
	);

	let productContent, breadcrumbsCate,
		leftContent, infoModalContent;
	
	if (isLoading) {
		productContent = (
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
					<Skeleton height={35} style={{display: 'block', width: '100%', marginBottom: 50}}/>
					{reviewsContent}
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
		)
	}

	if (product) {
		leftContent = (
			<div className={classes.left}>
				<ProductSlider product={product} setActiveModalTab={setActiveModalTab} />
				<div className={classes['wrap-action']}>
					<div className={classes.sharing}>
						<span>Chia sẻ: </span>
						<ul>
							<li>
								<FacebookShareButton
									url={window.location.href}
									className={classes['share-btn']}
								>
									<FacebookIcon size={30} round />
								</FacebookShareButton>
							</li>
							<li>
								<FacebookMessengerShareButton
									url={window.location.href}
									className={classes['share-btn']}
								>
									<FacebookMessengerIcon size={30} round />
								</FacebookMessengerShareButton>
							</li>
							<li>
								<TwitterShareButton
									url={window.location.href}
									className={classes['share-btn']}
								>
									<TwitterIcon size={30} round />
								</TwitterShareButton>
							</li>
						</ul>
					</div>
					{
						// favorite && favorite.some(item => item._id === product._id)
						isLiked ? (
							<button className={`${classes['fav-btn']} ${classes.liked}`} onClick={() => removeFromWishlist(product._id)}>
								<i className='icon-heart'></i>Đã thích
							</button>
						) : (
							<button className={classes['fav-btn']} onClick={() => addToWishlist(product._id)}>
							<i className='icon-heart-o'></i>Thích
						</button>
						)
					}
				</div>
				{!isMobile && reviewsContent}
			</div>
		);
	};

	if (!isLoading && !error) {
	   
		if (product) {
			productContent = (
				<Fragment>
					{leftContent}
					<ProductInfo product={product} listCompare={listCompare}
						addItemToCompare={addItemToCompare} showMoreSpecs={showMoreSpecs}
					/>
					{isMobile && reviewsContent}
				</Fragment>
			);

			infoModalContent = (
				shouldRenderInfoModal && (
					<ProductModal product={product} showInfoModal={showInfoModal} closeModalInfo={closeModalInfo}
						activeModalTab={activeModalTab} setActiveModalTab={setActiveModalTab}
					/>
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
		} else {
			productContent = <NotFound/>;
		}
	}

	if (error) {
		productContent = <div>{error}</div>;
	}

	return (
		<Fragment>
			<div className='container'>
				{
					product ? (
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
						isLoading ? (
							<div style={{ padding: '15px 0' }}>
								<Skeleton height={25} />
							</div>
						) : <div style={{ padding: '15px 0' }}></div>
					)
				}
				<div className={`card ${classes.mb}`}>
					<div className={classes['wrap-product-detail']}>
						{productContent}
					</div>
				</div>
				{
					recentlyViewedProducts.length > 0 ? (
						<div className={`card ${classes.mb}`}><RecentlyViewedProducts data={recentlyViewedProducts}/></div>
					) : null
				}
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