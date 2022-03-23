import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useFetch from '../../hooks/useFetch';
import { authActions } from '../../store/auth';
import { formatCurrency, convertProductLink } from '../../helpers/helpers';
import Swal from 'sweetalert2';
import classes from '../../scss/Profile.module.scss';

const ListFavourite = (props) => {
    const dispatch = useDispatch;
    const { userData } = props;
    const { favorite, uuid } = userData ? userData : {};

    const { fetchData: removeFav } = useFetch();
    const { fetchData: fetchUser } = useFetch();

    const removeFromWishlist = (id) => {
        if (favorite && favorite.length < 10) {
            removeFav({
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                url: `${process.env.REACT_APP_API_URL}/addToWishlist/${uuid}/${id}`,
                body: { type: 0 }
            }, data => {
                if(data.message) {
                    const userDataStorage = JSON.parse(localStorage.getItem('userData'));
                    const userDataObj = {
                        uuid: userDataStorage.uuid,
                        displayName: userDataStorage.displayName,
                        email: userDataStorage.email,
                        photoURL: userDataStorage.photoURL,
                        emailVerified: userDataStorage.emailVerified
                    };
        
                    fetchUser({
                        url: `${process.env.REACT_APP_API_URL}/getUserData/${userDataObj.uuid}` 
                    }, data => {
                        if (data) {
                            const cloneData = (({ uuid, displayName, email, photoURL, emailVerified, ...val }) => val)(data);
                            dispatch(authActions.updateState({
                                userData: {...userDataObj, ...cloneData}
                            }));
                        }
                    });
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                html: `<p>Bạn chỉ có thể có tối đa 10 yêu thích !</p>`,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3741'
            });
        }
	};

    return (
        <Fragment>
            <h3>Danh sách yêu thích</h3>
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
                                                    item.averagePoint ? (
                                                        (item.averagePoint - Math.floor(item.averagePoint)).toFixed(1) === 0.5 ? (
                                                            <span key={index} className={`icon-star ${classes.inner} ${index + 1 === Math.round(item.averagePoint) ? 'icon-star-half' : index + 1 < Math.round(item.averagePoint) ? classes.selected : ''}`}>
                                                                {index + 1 !== Math.round(item.averagePoint) && <i className={`icon-star ${classes.border}`}></i>}
                                                            </span>
                                                        ) : (
                                                            <span key={index} className={`icon-star ${classes.inner} ${index + 1 <= Math.round(item.averagePoint) ? classes.selected : ''}`}>
                                                                <i className={`icon-star ${classes.border}`}></i>
                                                            </span>
                                                        )
                                                    ) : <span key={index} className={`icon-star ${classes.inner} ${classes.none}`}></span>
                                                ))
                                            }
                                        </div>
                                        <p className={classes.txt}>({item.totalReviews} nhận xét)</p>
                                    </div>
                                </div>
                                {
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
                                }
                                <span className={classes['remove-fav']} onClick={() => removeFromWishlist(item._id)}>×</span>
                            </li>
                        ))
                    )
                }
            </ul>
        </Fragment>
    )
};

export default ListFavourite;