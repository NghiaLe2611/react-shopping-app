import { Fragment, useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useFetch from '../hooks/useFetch';
import CustomerInfo from '../components/profile/CustomerInfo';
import ListAddress from '../components/profile/ListAddress';
import EditAddress from '../components/profile/EditAddress';
import ListFavourite from '../components/profile/ListFavourite';
import ListReview from '../components/profile/ListReview';
import ListOrder from '../components/profile/ListOrder';
import OrderDetail from '../components/profile/OrderDetail';
import classes from '../scss/Profile.module.scss';
// import { updateProfile } from 'firebase/auth';

const profileNav = [
	{
		icon: 'icon-user',
		slug: '/tai-khoan',
		name: 'Thông tin tài khoản',
	},
	{
		icon: 'icon-cart',
		slug: '/tai-khoan/don-hang',
		name: 'Quản lý đơn hàng',
	},
	{
		icon: 'icon-map',
		slug: '/tai-khoan/dia-chi',
		name: 'Sổ địa chỉ',
	},
	// {
	// 	icon: 'icon-card',
	// 	slug: '/tai-khoan/thanh-toan',
	// 	name: 'Thông tin thanh toán',
	// },
	{
		icon: 'icon-heart',
		link: '/tai-khoan/yeu-thich',
		slug: '/tai-khoan/yeu-thich',
		name: 'Sản phẩm yêu thích',
	},
	{
		icon: 'icon-star-half',
		link: '/tai-khoan/nhan-xet',
		slug: 'nhan-xet',
		name: 'Nhận xét của tôi',
	},
];

const ProfilePage = () => {
	const location = useLocation();
	const userData = useSelector((state) => state.auth.userData);
	const { displayName, photoURL, email, listAddress } = userData ? userData : {};

	const [cities, setCities] = useState(() => {
        const storage = localStorage.getItem('storage_citi');
        if (storage) {
            return JSON.parse(storage);
        }

        return [];
    });

	const { fetchData: fetchCities } = useFetch();
	const slug = location.pathname;
	
	useEffect(() => {
		if (slug === '/tai-khoan/dia-chi' && cities.length === 0) {
			fetchCities(
				{
					url: `${process.env.REACT_APP_API_URL}/cities`
				}, (data) => {
					if (data) {
						setCities(data);
                        localStorage.setItem('storage_citi', JSON.stringify(data));
					}
				}
			);
		}
	}, [slug, fetchCities, cities]);

	let profileContent;

	switch (slug) {
		case '/tai-khoan/don-hang': {
			profileContent = (
				<ListOrder userData={userData}/>
			);
			break;
		}
		case (slug.match(/order\/*/)?.input) : {
			profileContent = (
				<OrderDetail userData={userData}/>
			);
			break;
		}
		case '/tai-khoan/dia-chi': {
			profileContent = (
				<ListAddress userData={userData} cities={cities}/>
			);
			break;
		}
        case (slug.match(/tai-khoan\/dia-chi\/cap-nhat\/*/)?.input) : {
			profileContent = (
				<Fragment>
                    <EditAddress classes={classes} cities={cities} listAddress={listAddress}/>
                </Fragment>
			);
			break;
		}
		// case '/tai-khoan/thanh-toan': {
		// 	profileContent = (
		// 		<Fragment>
		// 			<h3>Thông tin thanh toán</h3>
					
		// 		</Fragment>
		// 	);
		// 	break;
		// }
		case '/tai-khoan/yeu-thich': {
			profileContent = (
				<ListFavourite userData={userData}/>
			);
			break;
		}
		case '/tai-khoan/nhan-xet': {
			profileContent = (
				<ListReview userData={userData}/>
			);
			break;
		}
		default: {
			profileContent = (
				<CustomerInfo userData={userData}/>
			);
		}
	}

	return (
		userData && (
			<div className='container'>
				<div className={classes['wrap-profile']}>
					<aside>
						<div className={classes['wrap-avatar']}>
							<div className={classes.avatar}>
								{photoURL ? <img src={photoURL} alt='avatar' /> : <i className='icon-user'></i>}
							</div>
							<span className={classes.username}>{displayName ? displayName : email}</span>
						</div>
						<ul className={classes['account-nav']}>
							{profileNav.map((item) => (
								<li key={item.name} className={`${item.slug === slug ? classes.active : ''}`}>
									<Link to={item.slug}>
										<i className={item.icon}></i>
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</aside>
					<div className={classes['wrap-profile-content']}>{profileContent}</div>
				</div>
			</div>
		)
	);
};

export default ProfilePage;


// uploadBytes(storageRef, file).then(async (snapshot) => {
//     // console.log(snapshot);
//     updatedUrl = await getDownloadURL(storageRef);

//     user.updateProfile({ photoURL: updatedUrl }).then(() => {
//         console.log('photo uploaded! ', updatedUrl);
//     }).catch((err) => {
//         console.log(err);
//     });

//     /*
//     getDownloadURL(storageRef).then(function (url) {
//         // update ...
//         user.updateProfile({ photoURL: url })
//             .then(() => {
//                 console.log('photo uploaded! ', url);
//                 setUserInfo({...userInfo, avatar: url});
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     }).catch(function (err) {
//         console.log(err);
//     });
//     */
// });
