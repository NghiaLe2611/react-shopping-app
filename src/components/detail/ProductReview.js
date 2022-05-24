import { useState, useEffect, Fragment } from 'react';
import { timeSince } from '../../helpers/helpers';
import useFetch from '../../hooks/useFetch';
import ReviewModal from './ReviewModal';
import Skeleton from 'react-loading-skeleton';
import classes from '../../scss/ProductDetail.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const starArr = [1,2,3,4,5];

const ProductReview = (props) => {
    const {product, writeReviewHandler, showAllReviews, 
        isShowAllReviews, setIsShowAllReviews,
        isWriteReview, setIsWriteReview
    } = props;
    const [reviews, setReviews] = useState(null);
	const [arrayPercent, setArrayPercent] = useState([]);

    const { isLoading, error, fetchData: fetchReviews } = useFetch();

    useEffect(() => {
		if (product) {
			fetchReviews({
				url: `${process.env.REACT_APP_API_URL}/api/v1/reviews?product_id=${product._id}&page=1`
			}, data => {
				if (data) {
					setReviews(data.reviews);
					setArrayPercent(data.pointPercent);
					// setAveragePoint(data.rating_average);
					// setReviewsCount(data.reviews_count);
				}
			});
		}
	}, [fetchReviews, product]);

    let content = '';

    if (isLoading) {
        content = (
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
    } else {
        if (reviews && !reviews.length) {
            content = (
                <Fragment>
                    <p className={classes.empty}>Chưa có nhận xét nào. Hãy để lại nhận xét của bạn.</p>
                    <div className={classes['wrap-btn']}>
                        <a href='/#' className={classes['write-review']} onClick={writeReviewHandler}>
                            Viết đánh giá
                        </a>
                    </div>
                </Fragment>
            );
        }
    }

    if (reviews) {
        if (reviews.length) {
            content = (
                <Fragment>
                    <div className={classes['wrap-reviews']}>
                        <h5>
                            Đánh giá {product.category === 'smartphone' ? 'Điện thoại ' : product.category === 'tablet' ? 'Máy tính bảng ' : null} {product.name}
                        </h5>
                        <Fragment>
                                <div className={classes['rating-overview']}>
                                    <div className={classes['rating-top']}>
                                        <span className={classes.point}>{product.rating_average}</span>
                                        <div className={classes['list-star']}>
                                            {Array(5).fill().map((item, index) =>
                                                (product.rating_average - Math.floor(product.rating_average)).toFixed(1) === 0.5 ? (
                                                    <span
                                                        key={index}
                                                        className={`icon-star ${classes.inner} ${
                                                            index + 1 === Math.round(product.rating_average)
                                                                ? 'icon-star-half'
                                                                : index + 1 < Math.round(product.rating_average)
                                                                ? classes.selected
                                                                : ''
                                                        }`}>
                                                        {index + 1 !== Math.round(product.rating_average) && <i className={`icon-star ${classes.border}`}></i>}
                                                    </span>
                                                ) : (
                                                    <span key={index} className={`icon-star ${classes.inner} ${index + 1 <= Math.round(product.rating_average) ? classes.selected : ''}`}>
                                                        <i className={`icon-star ${classes.border}`}></i>
                                                    </span>
                                                )
                                            )}
                                        </div>
                                        <span className={classes.txt}>{product.review_count} đánh giá</span>
                                    </div>
                                    <ul className={classes['rating-list']}>
                                        {[...starArr].reverse().map((item, index) => (
                                            <li key={item}>
                                                <span className={classes.star}>
                                                    {item}
                                                    <i className='icon-star'></i>
                                                </span>
                                                <div className={classes['timeline-star']}>
                                                    <p style={{width: arrayPercent && `${arrayPercent[index]}%`}}></p>
                                                </div>
                                                <span className={classes.percent}>{arrayPercent && arrayPercent[index]}%</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <ul className={classes['list-review']}>
                                    {reviews.map((item) => (
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
                                <div className={classes['wrap-btn']}>
                                    <a href='/#' className={classes['write-review']} onClick={writeReviewHandler}>
                                        Viết đánh giá
                                    </a>
                                    <a href='/#' className={classes['show-reviews']} onClick={showAllReviews}>
                                        Xem tất cả đánh giá ({product.review_count})
                                    </a>
                                </div>
                        </Fragment>
                    </div>
                </Fragment>
            );
        }
    }

	return (
        <Fragment>
            {content}
            <ReviewModal product={product} reviews={reviews} isWriteReview={isWriteReview}
                isShowAllReviews={isShowAllReviews} setIsWriteReview={setIsWriteReview}
                setIsShowAllReviews={setIsShowAllReviews}
            />
        </Fragment>
    );
}

export default ProductReview; 
