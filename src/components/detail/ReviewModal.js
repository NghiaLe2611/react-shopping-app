import { Fragment, useEffect, useState, useRef } from 'react';
import Modal from '../UI/Modal';
import { useDelayUnmount } from '../../hooks/useDelayUnmount';
import Pagination from '../UI/Pagination';
import useFetch from '../../hooks/useFetch';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import classes from '../../scss/ProductDetail.module.scss';
import { timeSince } from '../../helpers/helpers';

const reviewPageSize = 5;
const starArr = [1,2,3,4,5];
const reviewSwal = withReactContent(Swal);

const ReviewModal = (props) => {
	const {product, isWriteReview, setIsWriteReview, reviews,
		isShowAllReviews, setIsShowAllReviews, writeReviewHandler} = props;

	const userData = useSelector(state => state.auth.userData);
	const { displayName, uuid, email } = userData ? userData : {};

	const [allReviews, setAllReviews] = useState([]);
	const [ratingPoint, setRatingPoint] = useState(0);
	const [comment, setComment] = useState('');
	const [reviewImgs, setReviewImgs] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [submitReviewForm, setSubmitReviewForm] = useState(false);

	const shouldRenderWriteReviewModal = useDelayUnmount(isWriteReview, 300);
    const shouldRenderReviewsModal = useDelayUnmount(isShowAllReviews, 300);

	const starRating = useRef([]);
	const reviewFormRef = useRef({
		name: '',
		phone: '',
		email: ''
	});

	const { fetchData: postReview } = useFetch();
	const { fetchData: fetchReviews } = useFetch();

	useEffect(() => {
		if (product) {
			if (currentPage === 1) {
				setAllReviews(reviews);
				return;
			}

			if (isShowAllReviews) {
				fetchReviews({
					url: `${process.env.REACT_APP_API_URL}/api/v1/reviews?product_id=${product._id}&page=${currentPage}`
				}, data => {
					if (data) {
						setAllReviews(data.reviews);
					}
				});
			}
		}
	}, [fetchReviews, reviews, product, currentPage, isShowAllReviews]);

	const closeWriteReviewModal = () => {
		setIsWriteReview(false);
		setTimeout(() => {
			setSubmitReviewForm(false);
			setComment('');
		}, 300);
	};

	const setRatingHandler = (rating) => {
        if (rating !== ratingPoint) {
            setRatingPoint(rating);
        } else {
            setRatingPoint(0);
        }
    };

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

	const chooseImage = (e) => {
		// const nameWithoutExt = e.target.files[0].name.replace(/\.[^/.]+$/, '');

		let images = [];

		for (let i = 0; i < e.target.files.length; i++) {
			if (images.length < 4) {
				images.push(e.target.files[i]);
			}
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

	const onTypeReview = (e) => {
		setComment(e.target.value);
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
			const reviewData = {
				userId: uuid ? uuid : null, 
				customerName: reviewFormRef.current.name.value,
				star: ratingPoint,
				comment: comment,
				createdAt: Date.now()
			};
			
			postReview({
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				url: `${process.env.REACT_APP_API_URL}/api/v1/reviews/submit/${product._id}`,
				body: reviewData
			}, data => {
				closeWriteReviewModal();
				setTimeout(() => {
					if (data.message) {
						reviewSwal.fire({
							html: '<p style="font-size: 14px;">Nhận xét của bạn đã được ghi nhận và đang trong quá trình kiểm duyệt.</p>',
							confirmButtonColor: '#2f80ed'
						});
					} else {
						reviewSwal.fire({
							icon: 'error',
							html: '<p style="font-size: 14px;">Đã có lỗi xảy ra. Vui lòng thử lại.</p>',
							confirmButtonColor: '#2f80ed'
						})
					}
				}, 1000);
			});
		}
	};

	const paginate = (e, pageNumber) => {
		e.preventDefault();

		if (pageNumber === 'prev') {
			setCurrentPage(currentPage - 1);
		} else if (pageNumber === 'next') {
			setCurrentPage(currentPage + 1);
		} else {
			setCurrentPage(pageNumber);
		}
	};

	return (
		<Fragment>
			{shouldRenderWriteReviewModal && (
				<Modal isShowModal={isWriteReview} closeModal={closeWriteReviewModal} animation='none' contentClass={classes.reviewModal}>
					<div className={classes['wrap-review-modal']}>
						<h5>
							Đánh giá {product.category === 'smartphone' ? 'Điện thoại ' : product.category === 'tablet' ? 'Máy tính bảng ' : null} {product.name}
						</h5>
						<form>
							<input type='hidden' name='ratingPoint' id='ratingPoint' value={ratingPoint} />
							<div className={classes['wrap-ratings']}>
								<p>Bạn cảm thấy sản phẩm này như thế nào ?</p>
								<div className={classes.ratings}>
									<ul className={classes['list-star']}>
										{starArr.map((item) => (
											<li
												key={item}
												className={item <= ratingPoint ? classes.selected : ''}
												onMouseEnter={() => hoverOnStarHandler(item)}
												onMouseLeave={() => hoverOutStarHandler(item)}
												onClick={() => setRatingHandler(item)}
												ref={(ref) => (starRating.current[item] = ref)}>
												<span className={`icon-star ${classes.inner}`}>
													<i className={`icon-star ${classes.border}`}></i>
												</span>
											</li>
										))}
									</ul>
								</div>
								{submitReviewForm && ratingPoint === 0 && <p className={classes.error}>Bạn chưa đánh giá điểm sao, vui lòng đánh giá.</p>}
							</div>
							<div className={classes['wrap-ip']}>
								<div className={classes.required}>
									<input
										className={classes.input}
										type='text'
										name='name'
										placeholder='Họ và tên'
										spellCheck='false'
										onChange={handleChangeInput}
										defaultValue={displayName || ''}
										onBlur={handleChangeInput}
										disabled={displayName ? 'disabled' : ''}
										ref={(ref) => (reviewFormRef.current.name = ref)}
									/>
								</div>
								<div>
									<input className={classes.input} type='text' name='phone' placeholder='Số điện thoại' spellCheck='false' ref={(ref) => (reviewFormRef.current.phone = ref)} />
								</div>
								<div>
									<input
										className={classes.input}
										type='text'
										name='email'
										placeholder='Email'
										spellCheck='false'
										defaultValue={email || ''}
										disabled={email ? 'disabled' : ''}
										ref={(ref) => (reviewFormRef.current.email = ref)}
									/>
								</div>
							</div>
							<div className={classes.required}>
								<textarea
									className={classes.input}
									name='comment'
									id='comment'
									rows='8'
									spellCheck='false'
									ref={(ref) => (reviewFormRef.current.comment = ref)}
									placeholder='Viết nhận xét...'
									onChange={onTypeReview}
									onBlur={handleChangeInput}></textarea>
								{submitReviewForm && comment.length < 80 && <p className={classes.error}>Nội dung đánh giá quá ít. Vui lòng nhập thêm nội dung đánh giá về sản phẩm.</p>}
							</div>
							<div className={classes.bottom}>
								<label htmlFor='image-upload' className={classes.upload}>
									<i className='icon-camera'></i>Thêm hình ảnh (tối đa 4)
									<input id='image-upload' type='file' multiple={true} onChange={chooseImage} />
								</label>
								<p className={classes.characters} style={{display: comment.length >= 80 ? 'none' : 'block'}}>
									{comment.length} ký tự (tối thiểu 80)
								</p>
								{reviewImgs.length > 0 && (
									<ul className={classes['list-img']}>
										{reviewImgs.map((item, index) => (
											<li key={index}>
												<img src={URL.createObjectURL(item)} alt={item.name} />
												<span onClick={() => removeReviewImg(index)}>Xóa</span>
											</li>
										))}
									</ul>
								)}
							</div>
							<button className={classes.send} onClick={submitReview}>
								Gửi đánh giá
							</button>
						</form>
					</div>
				</Modal>
			)}
			{shouldRenderReviewsModal && (
				<Modal isShowModal={isShowAllReviews} closeModal={() => setIsShowAllReviews(false)} animation='none' contentClass={classes.reviewModal}>
					<div className={classes['wrap-review-modal']}>
						<h5>
							{product.review_count} đánh giá {product.category === 'smartphone' ? 'Điện thoại ' : product.category === 'tablet' ? 'Máy tính bảng ' : null} {product.name}
						</h5>
						<div className={classes['wrap-reviews']}>
							{allReviews.length ? (
								<Fragment>
									<ul className={classes['list-review']}>
										{allReviews.map((item) => (
											<li key={item._id}>
												<p className={classes['ctm-name']}>
													<strong>{item.customerName}</strong>
													<span>{timeSince(item.createdAt)}</span>
												</p>
												<p className={classes.rating}>
													{Array(item.star)
														.fill()
														.map((item, index) => (
															<i key={index} className='icon-star'></i>
														))}
													{item.star < 5 &&
														Array(5 - item.star)
															.fill()
															.map((item, index) => <i key={index} className={`icon-star ${classes.black}`}></i>)}
												</p>
												<p className={classes.comment}>{item.comment}</p>
											</li>
										))}
									</ul>
								</Fragment>
							) : (
								<Fragment>
									<p className={classes.empty}>Chưa có nhận xét nào. Hãy để lại nhận xét của bạn.</p>
									<div className={classes['wrap-btn']}>
										<a href='/#' className={classes['write-review']} onClick={writeReviewHandler}>
											Viết đánh giá
										</a>
									</div>
								</Fragment>
							)}
							{product.review_count > reviewPageSize ? (
								<Pagination style={{marginTop: 30}} pageSize={reviewPageSize} currentPage={currentPage} totalCount={product.review_count} paginate={paginate} />
							) : null}
						</div>
					</div>
				</Modal>
			)}
		</Fragment>
	);
};

export default ReviewModal;
