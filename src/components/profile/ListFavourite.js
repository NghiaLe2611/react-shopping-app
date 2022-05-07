import { Fragment, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { formatCurrency, convertProductLink } from '../../helpers/helpers';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import classes from '../../scss/Profile.module.scss';
import useCheckMobile from '../../hooks/useCheckMobile';

const ListFavourite = (props) => {
    const [favorite, setFavorite] = useState([]);
    // const { favorite, uuid } = userData ? userData : {};

    const { isLoading, fetchData: fetchFavList } = useFetch();
    const { fetchData: removeFav } = useFetch();
    const {isMobile} = useCheckMobile();

    const getFavoriteList = useCallback(() => {
        fetchFavList({
            url: `${process.env.REACT_APP_API_URL}/api/v1/me/wishlist`,
        }, data => {
            setFavorite(data);
        });
    }, [fetchFavList]);

    useEffect(() => {
        getFavoriteList();
    }, [getFavoriteList]);

    const removeFromWishlist = (id) => {
        removeFav({
            method: 'PUT',
            url: `${process.env.REACT_APP_API_URL}/api/v1/me/wishlist/delete/${id}`
        }, data => {
            if (data) {
                getFavoriteList();
            }
        });
    };

    let favoriteContent;

    if (favorite.length > 0) {
		favoriteContent = (
			<ul className={classes['list-fav']}>
                {
                    (favorite && favorite.length > 0) && (
                        favorite.map(item => (
                            <li key={item._id}>
                                <Link className={classes.img} to={`${item.category === 'smartphone' ? '/dien-thoai/' : 
                                        item.category === 'tablet' ? '/may-tinh-bang/' : ''}${convertProductLink(item.name)}`}>
                                        <img src={item.img} alt={item.name} />
                                </Link>
                                <div className={classes.info}>
                                    <Link className={classes.name} to={`${item.category === 'smartphone' ? '/dien-thoai/' : 
                                        item.category === 'tablet' ? '/may-tinh-bang/' : ''}${convertProductLink(item.name)}`}>{item.name}
                                    </Link>
                                    <div className={classes['wrap-review']}>
                                        <div className={classes['list-star']}> 
                                            {
                                                Array(5).fill().map((val, index) => (
                                                    item.rating_average ? (
                                                        (item.rating_average - Math.floor(item.rating_average)).toFixed(1) === 0.5 ? (
                                                            <span key={index} className={`icon-star ${classes.inner} ${index + 1 === Math.round(item.rating_average) ? 'icon-star-half' : index + 1 < Math.round(item.rating_average) ? classes.selected : ''}`}>
                                                                {index + 1 !== Math.round(item.rating_average) && <i className={`icon-star ${classes.border}`}></i>}
                                                            </span>
                                                        ) : (
                                                            <span key={index} className={`icon-star ${classes.inner} ${index + 1 <= Math.round(item.rating_average) ? classes.selected : ''}`}>
                                                                <i className={`icon-star ${classes.border}`}></i>
                                                            </span>
                                                        )
                                                    ) : <span key={index} className={`icon-star ${classes.inner} ${classes.none}`}></span>
                                                ))
                                            }
                                        </div>
                                        <p className={classes.txt}>({item.review_count} nhận xét)</p>
                                    </div>
                                    {
                                        isMobile && (
                                            item.sale ? (
                                                <div className={classes['wrap-price']}>
                                                    <div className={classes.price}>{formatCurrency(item.price - item.sale)}đ</div>
                                                    <div className={classes['wrap-sub-price']}>
                                                        <span className={classes['sub-price']}>{formatCurrency(item.price)}đ</span>
                                                        <span className={classes.discount}>{Math.round((item.sale * 100)/item.price)}%</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={classes.price}>{formatCurrency(item.price)}đ</div>
                                            )
                                        )
                                    }
                                </div>
                                {
                                        !isMobile && (
                                            item.sale ? (
                                                <div className={classes['wrap-price']}>
                                                    <div className={classes.price}>{formatCurrency(item.price - item.sale)}đ</div>
                                                    <div className={classes['wrap-sub-price']}>
                                                        <span className={classes['sub-price']}>{formatCurrency(item.price)}đ</span>
                                                        <span className={classes.discount}>{Math.round((item.sale * 100)/item.price)}%</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={classes.price}>{formatCurrency(item.price)}đ</div>
                                            )
                                        )
                                    }
                                <span className={classes['remove-fav']} onClick={() => removeFromWishlist(item.product_id)}>×</span>
                            </li>
                        ))
                    )
                }
            </ul>
		);
	} else {
		if (isLoading) {
			favoriteContent = (
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
			favoriteContent = <p>Bạn chưa có nhận xét nào</p>;
		}
	}

    return (
        <Fragment>
            <h3>Danh sách yêu thích</h3>
            {favoriteContent}
        </Fragment>
    )
};

export default ListFavourite;