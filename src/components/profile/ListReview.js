import { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { convertProductLink } from '../../helpers/helpers';
import Pagination from '../UI/Pagination';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import classes from '../../scss/Profile.module.scss';

const pageSize = 5;

const ListReview = (props) => {
    const { uuid } = props.userData;

    const [userReviews, setUserReviews] = useState([]);
	const [reviewCount, setreviewCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
    const { isLoading, error: reviewsError, fetchData: fetchReviews } = useFetch();

    useEffect(() => {
		if (uuid) {
            fetchReviews(
                {
                    url: currentPage >= 1 ? `${process.env.REACT_APP_API_URL}/api/v1/me/reviews?id=${uuid}&page=${currentPage}` : 
						`${process.env.REACT_APP_API_URL}/api/v1/me/reviews?id=${uuid}`,
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

        document.querySelector('h3').scrollIntoView({behavior: 'smooth'});
    };

    let reviewsContent;

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
				<Pagination style={{width: '100%', marginTop: 50}} right={true}
					pageSize={pageSize} currentPage={currentPage}
					totalCount={reviewCount} paginate={paginate}
				/>
			</Fragment>
		);
	} else {
		if (isLoading) {
			reviewsContent = (
				Array(3).fill().map((item ,index) => (
					<div className={classes['wrap-item-loading']} key={index}>
						<div className={classes['item-loading']}>
							<Skeleton width={80} height={80} style={{ marginRight: 5 }}/>
							<div style={{flex: 1}}>
								<Skeleton width={'60%'} height={20} style={{ margin: '6px 0' }}/>
								<Skeleton height={20}/>
							</div>
						</div>
					</div>
				))
			)
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