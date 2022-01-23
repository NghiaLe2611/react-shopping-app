import { Fragment, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import classes from '../scss/Profile.module.scss';
import iconFacebook from '../assets/images/icon-fb.png';
import iconGoogle from '../assets/images/icon-google.png';
import { useSelector, useDispatch } from 'react-redux';
import useFetch from '../hooks/useFetch';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import { timeSince } from '../helpers/helpers';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { authApp, firebaseAuth } from '../firebase/config';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { authActions } from '../store/auth';

const profileNav = [
	{
		icon: 'icon-user',
		link: '/tai-khoan',
		slug: 'tai-khoan',
		name: 'Thông tin tài khoản',
	},
	{
		icon: 'icon-cart',
		link: '/tai-khoan/don-hang',
		slug: 'don-hang',
		name: 'Quản lý đơn hàng',
	},
	{
		icon: 'icon-heart',
		link: '/tai-khoan/yeu-thich',
		slug: 'yeu-thich',
		name: 'Sản phẩm yêu thích',
	},
	{
		icon: 'icon-star-half',
		link: '/tai-khoan/nhan-xet',
		slug: 'nhan-xet',
		name: 'Nhận xét của tôi',
	},
];
const yearList = Array.from(Array(new Date().getFullYear() - 1899), (_, i) => (i + 1900).toString()).reverse();
function getDaysInMonth(month, year) {
	return new Date(year, month, 0).getDate();
}

const ProfilePage = (props) => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.auth.userData);
	const { displayName, photoURL, uuid, email, emailVerified, fullName, phone, birthday } = userData ? userData : {};

	const [userInfo, setUserInfo] = useState({
		fullname: fullName ? fullName : '',
		nickname: displayName ? displayName : '',
		phone: phone ? phone : '',
		avatar: photoURL ? photoURL : '',
        birthday: birthday ? birthday : ''
	});
	const [selectedDay, setSelectedDay] = useState(() => {
		if (birthday) {
			return new Date(birthday).getDate();
		}
		return 0;
	});
	const [selectedMonth, setSelectedMonth] = useState(() => {
		if (birthday) {
			return new Date(birthday).getMonth() + 1;
		}
		return 0;
	});
	const [selectedYear, setSelectedYear] = useState(() => {
		if (birthday) {
			return new Date(birthday).getFullYear();
		}
		return 0;
	});
	const [daysInMonth, setDaysInMonth] = useState('');
	const [userReviews, setUserReviews] = useState([]);
    const [imgUpload, setImgUpload] = useState(false);

	const slug = location.pathname.split('/').pop();

	const { isLoading: isLoadingReviews, error: reviewsError, fetchData: fetchReviews } = useFetch();
	const { fetchData: updateUser } = useFetch();

	const imgRef = useRef('');

    let updatedData = {};

    useEffect(() => {
        console.log('imgUpload', imgUpload);
        if (imgUpload) {
            updatedData['photoURL'] = userInfo.avatar;
        }
    }, [imgUpload, userInfo.avatar]);

	useEffect(() => {
		if (parseInt(selectedMonth) !== 0 && parseInt(selectedYear) !== 0) {
			setDaysInMonth(getDaysInMonth(selectedMonth, selectedYear));
		}
	}, [selectedMonth, selectedYear]);

	useEffect(() => {
		if (selectedDay !== 0 && selectedMonth !== 0 && selectedYear !== 0) {
			const day = parseInt(selectedDay);
			const month = parseInt(selectedMonth);
			const year = parseInt(selectedYear);
			setUserInfo({
				...userInfo,
				birthday: new Date(year, month - 1, day),
			});
		}
	}, [selectedDay, selectedMonth, selectedYear]);

	useEffect(() => {
		if (uuid) {
			if (slug === 'nhan-xet') {
				fetchReviews(
					{
						url: `${process.env.REACT_APP_API_URL}/${uuid}/reviews`,
					}, (data) => {
						// console.log(data);
						if (data) {
							setUserReviews(data);
						}
					}
				);
			}
		}
	}, [fetchReviews, uuid, slug]);

	const onChangeDay = (e) => {
		console.log(e.target.value);
		setSelectedDay(e.target.value);
	};

	const onChangeMonth = (e) => {
		console.log(e.target.value);
		setSelectedMonth(e.target.value);
	};

	const onChangeYear = (e) => {
		console.log(e.target.value);
		setSelectedYear(e.target.value);
	};

	const onChangeInput = (e) => {
		const { name } = e.target;
		const { value } = e.target;
		setUserInfo({ ...userInfo, [name]: value });
	};

	const updateUserData = (e) => {
		e.preventDefault();
        const file = imgRef.current.files[0];

        // Check if new info is different than the old, update it, if not do nothing

		if (userInfo.fullname && userInfo.fullname !== fullName) {
			updatedData['fullName'] = userInfo.fullname;
		}

        if (!emailVerified && userInfo.nickname && userInfo.nickname !== displayName) {
			updatedData['displayName'] = userInfo.nickname;
		}

		if (userInfo.phone && userInfo.phone !== phone) {
			updatedData['phone'] = userInfo.phone;
		}

        const oldBirthday = new Date(birthday);
        const newBirthday = new Date(userInfo.birthday);

		if (userInfo.birthday && oldBirthday.getTime() !== newBirthday.getTime()) {
			updatedData['birthday'] = newBirthday;
		}

        const updateProfile = () => {
            if (Object.keys(updatedData).length > 0) {
                // console.log('update user', updatedData);
                updateUser(
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        url: `${process.env.REACT_APP_API_URL}/updateUserData/${uuid}`,
                        body: updatedData,
                    }, (data) => {
                        console.log(123, data);
                        if (data) {
                            const userDataStorage = JSON.parse(localStorage.getItem('userData'));
                            let updatedDataStorage = {...userDataStorage};
    
                            if (updatedData.fullName) updatedDataStorage = {...updatedDataStorage, fullName: updatedData.fullName}
                            if (updatedData.displayName) updatedDataStorage = {...updatedDataStorage, displayName: updatedData.displayName}
                            if (updatedData.phone) updatedDataStorage = {...updatedDataStorage, phone: updatedData.phone}
                            if (updatedData.birthday) updatedDataStorage = {...updatedDataStorage, birthday: updatedData.birthday}
                            if (updatedData.photoURL) updatedDataStorage = {...updatedDataStorage, photoURL: updatedData.photoURL}
    
                            console.log(updatedDataStorage);
    
                            dispatch(authActions.updateState({
                                userData: updatedDataStorage
                            }));
    
                            Swal.fire({
                                icon: 'success',
                                html: `<p>Cập nhật thành công<p>`,
                                confirmButtonText: 'OK',
                                confirmButtonColor: '#2f80ed'
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                html: `<p>Có lỗi xảy ra. Vui lòng thử lại.</p>`,
                                confirmButtonText: 'OK',
                                confirmButtonColor: '#dc3741'
                            });
                        }
                    }
                );
            }
        }

        if (file) {
            let updatedUrl = '';

            const user = authApp.currentUser;
            // Create a root reference
            const storage = getStorage();

            // Create a reference to image's path
            const storageRef = ref(storage, `${uuid}/profilePicture/${file.name}`);

            function uploadFunc(){
                return new Promise((resolve, reject) => {
                    resolve(uploadBytes(storageRef, file).then(async () => {
                        return await getDownloadURL(storageRef);
                    }));
                })
            };

            uploadFunc().then(url => {
                console.log(url);
                if (url) {
                    updatedData['photoURL'] = url;
                    updateProfile();
                }
            }).catch(err => {
                console.log(err);
            });
        } else {
            updateProfile();
        }

        // return;
	};

	const onChangePhoto = (e) => {
		const file = e.target.files[0];
		if (file) {
			const newPhoto = URL.createObjectURL(file);
			setUserInfo({...userInfo, avatar: newPhoto});
		}
	};

	let profileContent, reviewsContent;

	if (isLoadingReviews) {
		if (userReviews.length === 0) {
			reviewsContent = <LoadingIndicator />;
		} else {
			reviewsContent = (
				<ul className={classes['list-reviews']}>
					{userReviews.map((item) => (
						<li key={item._id}>
							<div className={classes.overview}>
								<p className={classes.rating}>
									{Array(item.star).fill()
										.map((item, index) => (
											<i key={index} className='icon-star'></i>
										))}
									{
										item.star < 5 && Array(5 - item.star).fill().map((item, index) => 
											<i key={index} className={`icon-star ${classes.black}`}></i>
										)
									}
								</p>
								<span className={classes.time}>{timeSince(item.createdAt)}</span>
							</div>
							<p className={classes.comment}>{item.comment}</p>
						</li>
					))}
				</ul>
			);
		}
	}

	if (!isLoadingReviews && !reviewsError) {
		if (userReviews.length > 0) {
			reviewsContent = (
				<ul className={classes['list-reviews']}>
					{userReviews.map((item) => (
						<li key={item._id}>
							<div className={classes.overview}>
								<p className={classes.rating}>
									{Array(item.star).fill()
										.map((item, index) => (
											<i key={index} className='icon-star'></i>
										))}
									{item.star < 5 &&
										Array(5 - item.star).fill()
											.map((item, index) => <i key={index} className={`icon-star ${classes.black}`}></i>)}
								</p>
								<span className={classes.time}>{timeSince(item.createdAt)}</span>
							</div>
							<p className={classes.comment}>{item.comment}</p>
						</li>
					))}
				</ul>
			);
		} else {
			reviewsContent = <p>Bạn chưa có nhận xét nào</p>;
		}
	}

	switch (slug) {
		case 'don-hang': {
			profileContent = (
				<Fragment>
					<h3>Đơn hàng của tôi</h3>
				</Fragment>
			);
			break;
		}
		case 'yeu-thich': {
			profileContent = (
				<Fragment>
					<h3>Danh sách yêu thích</h3>
				</Fragment>
			);
			break;
		}
		case 'nhan-xet': {
			profileContent = (
				<Fragment>
					<h3>Nhận xét của tôi</h3>
					<div className={classes.content}>{reviewsContent}</div>
				</Fragment>
			);
			break;
		}
		default: {
			profileContent = (
				<Fragment>
					<h3>Thông tin tài khoản</h3>
					<div className={classes.content}>
						<div className={classes.left}>
							<div className={classes.group}>
								<h4>Thông tin cá nhân</h4>
								<form onSubmit={updateUserData}>
									<div className={classes['input-group']}>
										<label>Họ và tên</label>
										<div className={classes['wrap-ip']}>
											<input type='text' name='fullname' placeholder='Họ tên' value={userInfo.fullname} onChange={onChangeInput} />
										</div>
									</div>
									<div className={classes['input-group']}>
										<label>Tên đăng nhập</label>
										<div className={classes['wrap-ip']}>
											{emailVerified ? (
												<input type='text' name='nickname' placeholder={displayName} value={displayName} disabled />
											) : (
												<input type='text' name='nickname' onChange={onChangeInput} value={userInfo.nickname} placeholder='Nickname' />
											)}
										</div>
									</div>
									<div className={classes['input-group']}>
										<label>Email</label>
										<div className={classes['wrap-ip']}>
											<input type='text' name='email' placeholder={email} value={email} disabled />
										</div>
									</div>
									<div className={classes['input-group']}>
										<label>Số điện thoại</label>
										<div className={classes['wrap-ip']}>
											<input
												type='text'
												name='phone'
												placeholder='Thêm số điện thoại'
												onChange={onChangeInput}
												value={userInfo.phone}
												onKeyPress={(e) => {
													if (!/[0-9]/.test(e.key)) {
														e.preventDefault();
													}
												}}
											/>
										</div>
									</div>
									<div className={classes['input-group']}>
										<label>Ngày sinh</label>
										<div className={classes['wrap-ip']}>
											<select name='day' id='select-day' aria-labelledby='day' onChange={onChangeDay} value={selectedDay}>
												<option value='0'>Ngày</option>
												{daysInMonth > 0 &&
													Array(daysInMonth)
														.fill()
														.map((item, index) => (
															<option key={index + 1} value={index + 1}>
																{index + 1}
															</option>
														))}
											</select>
											<select name='month' id='select-month' aria-labelledby='month' onChange={onChangeMonth} value={selectedMonth}>
												<option value='0'>Tháng</option>
												{Array(12)
													.fill()
													.map((item, index) => (
														<option key={index + 1} value={index + 1}>
															{index + 1}
														</option>
													))}
											</select>
											<select name='year' aria-labelledby='year' onChange={onChangeYear} value={selectedYear}>
												<option value='0'>Năm</option>
												{yearList.map((item) => (
													<option key={item} value={item}>
														{item}
													</option>
												))}
											</select>
										</div>
									</div>
									<button type='submit' className={classes.save}>
										Lưu thay đổi
									</button>
								</form>
							</div>
							<div className={classes.group}>
								<h4>Bảo mật</h4>
								<div className={classes.item}>
									<div className={classes.left}>
										<i className='icon-lock'></i>
										<span>Đổi mật khẩu</span>
									</div>
									<button className={classes.update}>Cập nhật</button>
								</div>
							</div>
							<div className={classes.group}>
								<h4>Liên kết mạng xã hội</h4>
								<div className={classes.item}>
									<div className={classes.left}>
										<img src={iconFacebook} alt='icon-facebook' />
										<span>Facebook</span>
									</div>
									<button className={classes.update}>Liên kết</button>
								</div>
								<div className={classes.item}>
									<div className={classes.left}>
										<img src={iconGoogle} alt='icon-google' />
										<span>Google</span>
									</div>
									{emailVerified ? (
										<button className={`${classes.update} ${classes.active}`}>Đã liên kết</button>
									) : (
										<button className={classes.update}>Liên kết</button>
									)}
								</div>
							</div>
						</div>
						<div className={classes.right}>
							<div className={classes.avatar}>{photoURL ? <img src={userInfo.avatar} alt='avatar' /> : <i className='icon-user'></i>}</div>
							<div className={classes['choose-avatar']}>
								<label htmlFor='upload-avatar'>Chọn ảnh</label>
								<input type='file' name='avatar' id='upload-avatar' onChange={onChangePhoto} ref={imgRef} />
							</div>
						</div>
					</div>
				</Fragment>
			);
		}
	}

	return (
		userData && (
			<div className='container'>
				<div className={classes['wrap-profile']}>
					<aside>
						<div className={classes['wrap-avatar']}>
							<div className={classes.avatar}>{photoURL ? <img src={photoURL} alt='avatar' /> : <i className='icon-user'></i>}</div>
							<span className={classes.username}>{displayName ? displayName : email}</span>
						</div>
						<ul className={classes['account-nav']}>
							{profileNav.map((item) => (
								<li key={item.name} className={`${item.slug === slug ? classes.active : ''}`}>
									<Link to={item.link}>
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
//         setUserInfo({...userInfo, avatar: updatedUrl});
//         setImgUpload(true);
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

