import { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { convertProductLink } from '../../helpers/helpers';
import LoadingIndicator from '../UI/LoadingIndicator';
import Pagination from '../UI/Pagination';
import classes from '../../scss/Profile.module.scss';
import { current } from '@reduxjs/toolkit';

const pageSize = 5;

const ListReview = (props) => {
    const { uuid } = props.userData;

    const [userReviews, setUserReviews] = useState([]);
	const [reviewCount, setreviewCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
    const { isLoading: isLoadingReviews, error: reviewsError, fetchData: fetchReviews } = useFetch();

    useEffect(() => {
		if (uuid) {
            fetchReviews(
                {
                    url: currentPage >= 1 ? `${process.env.REACT_APP_API_URL}/${uuid}/reviews?page=${currentPage}` : 
						`${process.env.REACT_APP_API_URL}/${uuid}/reviews`,
                }, (data) => {
                    if (data) {
                        setUserReviews(data.results);
						setreviewCount(data.count);
                    }
                }
            );
		}
	}, [fetchReviews, uuid, currentPage]);

	const paginate = (e, pageNumber) => {
        e.preventDefault();

        if (pageNumber === 'prev') {
            setCurrentPage(currentPage - 1);
        } else if (pageNumber === 'next') {
            setCurrentPage(currentPage + 1);
        } else {
            setCurrentPage(pageNumber);
        }

        // document.querySelector('h3').scrollIntoView({behavior: 'smooth'});
    };

    let reviewsContent;

	if (isLoadingReviews) {
		if (userReviews.length === 0) {
			reviewsContent = <LoadingIndicator />;
		} else {
			reviewsContent = (
				<ul className={classes['list-reviews']}>
					{userReviews.map((item) => (
						<li key={item._id}>
                            <div className={classes.img}>
                                <Link className={classes.img} to={`${item.product_category === 'smartphone' ? '/dien-thoai/' : 
                                    item.product_category === 'tablet' ? '/may-tinh-bang/' : ''}${convertProductLink(item.product_name)}`}>
                                    <img src={item.thumbnail_url} alt={item.product_name} />
                                </Link>
                            </div>
							<div className={classes.info}>  
                                <div className={classes.overview}>
                                    <Link className={classes.name} to={`${item.product_category === 'smartphone' ? '/dien-thoai/' : 
                                        item.product_category === 'tablet' ? '/may-tinh-bang/' : ''}${convertProductLink(item.product_name)}`}>
                                        {item.product_name}
                                    </Link>
                                    <p className={classes.rating}>
                                        ({Array(item.star).fill().map((item, index) => (
											<i key={index} className='icon-star'></i>
										))}
                                        {
                                            item.star < 5 && Array(5 - item.star).fill().map((item, index) => 
                                                <i key={index} className={`icon-star ${classes.black}`}></i>
                                            )
                                        })
                                    </p>
                                    {/* <span className={classes.time}>{timeSince(item.createdAt)}</span> */}
                                </div>
                                <p className={classes.comment}>{item.comment}</p>
                            </div>
						</li>
					))}
				</ul>
			);
		}
	}

	if (!isLoadingReviews && !reviewsError) {
		if (userReviews.length > 0) {
			reviewsContent = (
				<Fragment>
					<ul className={classes['list-reviews']}>
						{userReviews.map((item) => (
							<li key={item._id}>
								<div className={classes.img}>
									<Link className={classes.img} to={`${item.product_category === 'smartphone' ? '/dien-thoai/' : 
										item.product_category === 'tablet' ? '/may-tinh-bang/' : ''}${convertProductLink(item.product_name)}`}>
										<img src={item.thumbnail_url} alt={item.product_name} />
									</Link>
								</div>
								<div className={classes.info}>
									<div className={classes.overview}>
										<Link className={classes.name} to={`${item.product_category === 'smartphone' ? '/dien-thoai/' : 
											item.product_category === 'tablet' ? '/may-tinh-bang/' : ''}${convertProductLink(item.product_name)}`}>
											{item.product_name}
										</Link>
										<p className={classes.rating}>
											({Array(item.star).fill().map((item, index) => (
												<i key={index} className='icon-star'></i>
											))}
											{
												item.star < 5 && Array(5 - item.star).fill().map((item, index) => 
													<i key={index} className={`icon-star ${classes.black}`}></i>
												)
											})
										</p>
										{/* <span className={classes.time}>{timeSince(item.createdAt)}</span> */}
									</div>
									<p className={classes.comment}>{item.comment}</p>
								</div>
							</li>
						))}
					</ul>
					{reviewCount}
					{
						reviewCount > pageSize && (
							<Pagination style={{width: '100%', marginTop: 50}} right={true}
								pageSize={pageSize} currentPage={currentPage}
								totalCount={reviewCount} paginate={paginate}
							/>
						)
					}
				</Fragment>
			);
		} else {
			reviewsContent = <p>Bạn chưa có nhận xét nào</p>;
		}
	}

    return (
        <Fragment>
            <h3>Nhận xét của tôi</h3>
            <div className={classes.content}>{reviewsContent}</div>
        </Fragment>
    )
};

export default ListReview;