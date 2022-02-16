import { Fragment, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import classes from '../scss/Profile.module.scss';
import iconFacebook from '../assets/images/icon-fb.png';
import iconGoogle from '../assets/images/icon-google.png';
import { useSelector, useDispatch } from 'react-redux';
import useFetch from '../hooks/useFetch';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import { formatCurrency, convertProductLink, timeSince } from '../helpers/helpers';
import Swal from 'sweetalert2';
import { authApp } from '../firebase/config';
// import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { authActions } from '../store/auth';
import userAvatar from '../assets/images/avatar.png';
import EditAddress from '../components/profile/EditAddress';

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
	{
		icon: 'icon-card',
		slug: '/tai-khoan/thanh-toan',
		name: 'Thông tin thanh toán',
	},
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
const yearList = Array.from(Array(new Date().getFullYear() - 1899), (_, i) => (i + 1900).toString()).reverse();
function getDaysInMonth(month, year) {
	return new Date(year, month, 0).getDate();
}

const ProfilePage = () => {
	const location = useLocation();
    const navigate = useNavigate();
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.auth.userData);
	const { displayName, photoURL, uuid, email, emailVerified, 
		fullName, phone, birthday, listAddress, favorite } = userData ? userData : {};

	const [userInfo, setUserInfo] = useState({
		fullname: fullName ? fullName : '',
		nickname: displayName ? displayName : '',
		phone: phone ? phone : '',
		avatar: photoURL ? photoURL : userAvatar,
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
	const [isAddAddress, setIsAddAddress] = useState(false);
	const [cities, setCities] = useState(() => {
        const storage = localStorage.getItem('storage_citi');
        if (storage) {
            return JSON.parse(storage);
        }

        return [];
    });
	const [districts, setDistricts] = useState([]);
	const [wards, setWards] = useState([]);
	const [addressInfo, setAddressInfo] = useState({
		add_name: null,
		add_phone: null,
		add_city: { id: 0 },
		add_district: { id: 0 },
		add_ward: { id: 0 },
		add_address: null,
		isDefault: false
	});
	const [formIsValid, setFormIsValid] = useState({});
	const [itemOnEdit, setItemOnEdit] = useState(null);

	const slug = location.pathname;
	
	const { isLoading: isLoadingReviews, error: reviewsError, fetchData: fetchReviews } = useFetch();
	const { fetchData: updateUser } = useFetch();
	const { fetchData: fetchCities } = useFetch();
	const { fetchData: fetchDistricts } = useFetch();
	const { fetchData: fetchWards } = useFetch();
    const { fetchData: removeFav } = useFetch();
    const { fetchData: fetchUser } = useFetch();
    const { fetchData: removeAddress } = useFetch();

	const imgRef = useRef('');
	const cityRef = useRef('');
	const districtRef = useRef('');
	const wardRef = useRef('');
    const addCityRef = useRef('');
    const addDistrictRef = useRef('');

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
			if (slug === '/tai-khoan/nhan-xet') {
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

	useEffect(() => {
		if (slug === '/tai-khoan/dia-chi' && cities.length === 0) {
			fetchCities(
				{
					url: `${process.env.REACT_APP_API_URL}/cities`,
				}, (data) => {
					// console.log(data);
					if (data) {
						setCities(data);
                        localStorage.setItem('storage_citi', JSON.stringify(data));
					}
				}
			);
		}
	}, [slug, fetchCities, cities]);

	const onChangeDay = (e) => {
		// console.log(e.target.value);
		setSelectedDay(e.target.value);
	};

	const onChangeMonth = (e) => {
		// console.log(e.target.value);
		setSelectedMonth(e.target.value);
	};

	const onChangeYear = (e) => {
		// console.log(e.target.value);
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
		let updatedData = {};
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

		if (selectedDay && selectedMonth && selectedYear && oldBirthday.getTime() !== newBirthday.getTime()) {
			updatedData['birthday'] = newBirthday;
		}

        const updateProfileData = () => {
            if (Object.keys(updatedData).length > 0) {
                // console.log('update user', updatedData);
                updateUser(
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        url: `${process.env.REACT_APP_API_URL}/updateUserData/${uuid}`,
                        body: updatedData,
                    }, (data) => {
                        // console.log('update successfull', data);
                        if (data && data.message) {
                            const userDataStorage = JSON.parse(localStorage.getItem('userData'));
                            let updatedDataStorage = {...userDataStorage};
    
                            if (updatedData.fullName) updatedDataStorage = {...updatedDataStorage, fullName: updatedData.fullName}
                            if (updatedData.displayName) updatedDataStorage = {...updatedDataStorage, displayName: updatedData.displayName}
                            if (updatedData.phone) updatedDataStorage = {...updatedDataStorage, phone: updatedData.phone}
                            if (updatedData.birthday) updatedDataStorage = {...updatedDataStorage, birthday: updatedData.birthday}
                            if (updatedData.photoURL) updatedDataStorage = {...updatedDataStorage, photoURL: updatedData.photoURL}
        
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
                if (url) {
                    updatedData['photoURL'] = url;
					user.updateProfile({ photoURL: url }).then(() => {
						console.log('photo uploaded! ', url);
						updateProfileData();
					}).catch((err) => {
						console.log(err);
					});
                }
            }).catch(err => {
                console.log(err);
            });
        } else {
            updateProfileData();
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

	const clearPhoto = () => {
		const user = authApp.currentUser;

		const clearPhotoHandler = () => {
			user.updateProfile({ photoURL: '' }).then(() => {
				console.log('clear profile photo', user);
				updateUser(
					{
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						url: `${process.env.REACT_APP_API_URL}/updateUserData/${uuid}`,
						body: { photoURL: null},
					}, (data) => {
						if (data) {
							console.log(111, data);
							const userDataStorage = JSON.parse(localStorage.getItem('userData'));
							setUserInfo({...userInfo, avatar: ''});
							dispatch(authActions.updateState({
								userData: {...userDataStorage, photoURL: null}
							}));
							Swal.fire({
								icon: 'success',
								html: `<p>Xóa ảnh đại diện thành công<p>`,
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
			}).catch((err) => {
				console.log(err);
			});
		};

		Swal.fire({
			html: '<h5 style="font-size: 16px;">Bạn có chắc muốn xóa ảnh đại diện này ?</h5>',
			showCancelButton: true,
			confirmButtonText: 'Xóa',
			confirmButtonColor: '#2f80ed',
			cancelButtonText: 'Không'
		}).then((result) => {
			if (result.isConfirmed) {
				const storage = getStorage();
				const photoRef = ref(storage, photoURL);
				console.log(photoRef);
				deleteObject(photoRef).then(() => {
					// File deleted successfully
					clearPhotoHandler();
				}).catch(err => {
					console.log(err);
				})
			}
		});
	};

	const onChangeCity = (e) => {
		const { options, value, name } = e.target; // value is index
		const id = parseInt(e.target.value);
		setAddressInfo({...addressInfo, [name]: {
			id: id, name: options[value].innerHTML
		}});
		if (id !== 0) {
			fetchDistricts(
				{
					url: `${process.env.REACT_APP_API_URL}/districts/${id}`,
				}, (data) => {
					if (data) {
						setDistricts(data);
						setWards([]);
					}
				}
			);
		} else {
			setDistricts([]);
			setWards([]);
		}
	};

	const onChangeDistrict = (e) => {
		const { options, value, name, selectedIndex } = e.target;
		const cityId = parseInt(cityRef.current.value);
		const districtId = parseInt(value);

		setAddressInfo({...addressInfo, [name]: {
			id: districtId, name: options[selectedIndex].innerHTML
		}});

		if (cityId && districtId) {
			fetchWards(
				{
					url: `${process.env.REACT_APP_API_URL}/wards?city=${cityId}&district=${districtId}`,
				}, (data) => {
					if (data) {
						setWards(data);
					}
				}
			);
		}
	};

	const onChangeWard = (e) => {
		const { options, name, selectedIndex } = e.target;
		setAddressInfo({...addressInfo, [name]: {
			id: parseInt(e.target.value), name: options[selectedIndex].innerHTML
		}});
	};

	const onChangeAddressInput = (e) => {
		const { name, value } = e.target;
		setAddressInfo({...addressInfo, [name]: value})
	};

    const onAddNewAddress = () => {
        if (listAddress && listAddress.length < 5) {
            setIsAddAddress(true);
        } else {
            Swal.fire({
                icon: 'error',
                html: `<p>Bạn chỉ có thể có tối đa 5 địa chỉ !</p>`,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3741'
            });
        }
    };

	const submitAddNewAddress = (e) => {
		e.preventDefault();
		
		if (!addressInfo.add_name) {
			setFormIsValid(data => data = {...data, add_name: false});
		}
		if (!addressInfo.add_phone) {
			setFormIsValid(data => data = {...data, add_phone: false});
		}
		if (!addressInfo.add_address) {
			setFormIsValid(data => data = {...data, add_address: false});
		}
		if (!addressInfo.add_city.id) {
			setFormIsValid(data => data = {...data, add_city: false});
		}
		
		if (addressInfo.add_name && addressInfo.add_phone && addressInfo.add_address && addressInfo.add_city.id) {
			const newAddress = {
				name: addressInfo.add_name,
				phone: addressInfo.add_phone,
				city: {
					id: addressInfo.add_city.id,
					name: addressInfo.add_city.name
				},
				district: {
					id: addressInfo.add_district.id ? addressInfo.add_district.id : 0,
					name: addressInfo.add_district.name ? addressInfo.add_district.name : ''
				},
				ward: {
					id: addressInfo.add_ward.id ? addressInfo.add_ward.id : 0,
					name: addressInfo.add_ward.name ? addressInfo.add_ward.name : ''
				},
				address: addressInfo.add_address,
				default: addressInfo.isDefault
			};

			updateUser(
				{
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					url: `${process.env.REACT_APP_API_URL}/updateUserData/${uuid}`,
					body: { newAddress },
				}, (data) => {
					console.log('add address', data);
					if (data && data.message) {
						const userDataStorage = JSON.parse(localStorage.getItem('userData'));
						let updatedDataStorage = {...userDataStorage};

						updatedDataStorage = {...updatedDataStorage, listAddress: [...updatedDataStorage.listAddress, newAddress]};
	
						dispatch(authActions.updateState({
							userData: updatedDataStorage
						}));


						Swal.fire({
							icon: 'success',
							html: `<p>Thêm địa chỉ thành công<p>`,
							confirmButtonText: 'OK',
							confirmButtonColor: '#2f80ed'
						});

						setIsAddAddress(false);
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
	};

	const editAddress = (item) => {
        navigate(`dia-chi/cap-nhat/${item._id}`);
        setItemOnEdit(item);
	};

	const onRemoveAddress = (id) => {
		Swal.fire({
			icon: 'warning',
			html: `<p>Bạn có chắc muốn xoá địa chỉ này ?</p>`,
			confirmButtonText: 'Xoá',
			confirmButtonColor: '#2f80ed',
			showCancelButton: true,
			cancelButtonText: 'Không',
			cancelButtonColor: '#dc3741'
		}).then(result => {
		   	if (result.isConfirmed) {
				removeAddress(
					{
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						url: `${process.env.REACT_APP_API_URL}/updateUserAddress/${userData.uuid}/${id}`,
						body: { removeAddressId: id },
					},
					(data) => {
						if (data && data.message) {
							const userDataStorage = JSON.parse(localStorage.getItem('userData'));

							const userDataObj = {
								uuid: userDataStorage.uuid,
								displayName: userDataStorage.displayName,
								email: userDataStorage.email,
								photoURL: userDataStorage.photoURL,
								emailVerified: userDataStorage.emailVerified,
							};

							fetchUser(
								{
									url: `${process.env.REACT_APP_API_URL}/getUserData/${userData.uuid}`,
								},
								(data) => {
									if (data) {
										const cloneData = (({ uuid, displayName, email, photoURL, emailVerified, ...val }) => val)(data);
										dispatch(
											authActions.updateState({
												userData: { ...userDataObj, ...cloneData },
											})
										);
									}
								}
							);
						}
					}
				);
			}
		});
	};

	const removeFromWishlist = (id) => {
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
	};

    const exitEdit = (e) => {
        e.preventDefault();
        setItemOnEdit(null);
        setDistricts([]);
        setWards([]);
    }

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
		case '/tai-khoan/don-hang': {
			profileContent = (
				<Fragment>
					<h3>Đơn hàng của tôi</h3>
				</Fragment>
			);
			break;
		}
		case '/tai-khoan/dia-chi': {
			profileContent = (
				<Fragment>
					<h3>Danh sách địa chỉ</h3>
					<div className={classes['new-address']} onClick={onAddNewAddress}>
						<span>+</span>Thêm địa chỉ mới
					</div>
					<form className={classes['form-address']} style={{ display: isAddAddress ? 'block' : 'none' }}
						onSubmit={submitAddNewAddress}
					>
						<div className={classes['input-group']}>
							<label>Họ và tên</label>
							<div className={classes['wrap-ip']}>
								<input type='text' name='add_name' placeholder='Nhập họ tên' defaultValue={addressInfo.add_name || ''}
									className={formIsValid.add_name === false ? classes.invalid : ''}
									onChange={onChangeAddressInput}
								/>
							</div>
						</div>
						<div className={classes['input-group']}>
							<label>Số điện thoại</label>
							<div className={classes['wrap-ip']}>
								<input type='text' name='add_phone' placeholder='Nhập số điện thoại' defaultValue={addressInfo.add_phone || ''}
									className={formIsValid.add_phone === false  ? classes.invalid : ''} 
									onChange={onChangeAddressInput}
								/>
							</div>
						</div>
						<div className={classes['input-group']}>
							<label>Tỉnh/Thành phố</label>
							<div className={classes['wrap-ip']}>
								<select name='add_city' id='city' onChange={onChangeCity} ref={cityRef} 
									value={addressInfo['add_city'].id} className={formIsValid.add_city === false  ? classes.invalid : ''}
								>
									<option value="0">Chọn Tỉnh/Thành phố</option>
									{
										cities.length > 0 && (
											cities.map(item => (
												<option key={item.id} value={item.id}>{item.name}</option>
											))
										)
									}
								</select>
							</div>
						</div>
						<div className={classes['input-group']}>
							<label>Quận huyện</label>
							<div className={classes['wrap-ip']}>
								<select name='add_district' id='district' onChange={onChangeDistrict} ref={districtRef}
									value={addressInfo['add_district'].id}
								>
									<option value="0">Chọn Quận/Huyện</option>
									{
										districts.length > 0 && (
											districts.map(item => (
												<option key={item.id} value={item.id}>{item.name}</option>
											))
										)
									}
								</select>
							</div>
						</div>
						<div className={classes['input-group']} ref={wardRef}>
							<label>Phường xã</label>
							<div className={classes['wrap-ip']}>
								<select name='add_ward' id='ward' onChange={onChangeWard}
									value={addressInfo['add_ward'].id}
								>
									<option value="0">Chọn Phường/Xã</option>
									{
										wards.length > 0 && (
											wards.map(item => (
												<option key={item.id} value={item.id}>{item.name}</option>
											))
										)
									}
								</select>
							</div>
						</div>
						<div className={classes['input-group']}>
							<label>Địa chỉ</label>
							<div className={classes['wrap-ip']}>
								<textarea name='add_address' rows='5' placeholder='Nhập địa chỉ' defaultValue={addressInfo.add_address || ''}
									onChange={onChangeAddressInput} className={formIsValid.add_address === false ? classes.invalid : ''}>
								</textarea>
							</div>
						</div>
						<div className={classes['input-group']}>
							<label></label>
							<div className={classes['wrap-ip']}>
								<label className={classes.checkbox}>
									<input type='checkbox' name='isDefault'
										value={addressInfo.isDefault}
										onChange={() => setAddressInfo({...addressInfo, isDefault: !addressInfo.isDefault})}
									/>
									<span className={classes.checkmark}></span>Đặt làm địa chỉ mặc định
								</label>
							</div>
						</div>
						<div className={classes['input-group']}>
							<label></label>
							<div className={classes['wrap-ip']}>
								<button type='submit' className={classes.update}>Cập nhật</button>
							</div>
						</div>
					</form>
					{listAddress && listAddress.length > 0 ? (
						<ul className={classes['list-address']}>
							{listAddress.map((item) => (
								<li key={item._id}>
									<div className={classes['wrap-address']}>
										<div className={classes.info}>
											<p className={classes.name}>
												{item.name}
												{item.default && <span><i className='icon-check-circle'></i>Địa chỉ mặc định</span>}
											</p>
											<p className={classes.address}>
												<span>Địa chỉ: </span>
												{`${item.address}${item.ward && `, ${item.ward.name}`}${item.district && `, ${item.district.name}`}${item.city && `, ${item.city.name}`}`}
											</p>
											<p className={classes.phone}><span>Điện thoại: </span>{item.phone}</p>
										</div>
										<div className={classes.action}>
											<button className={classes.edit} onClick={() => editAddress(item)}>Chỉnh sửa</button>
											{!item.default && <button className={classes.remove} onClick={() => onRemoveAddress(item._id)}>Xóa</button>}
										</div>
									</div>
								</li>
							))}
						</ul>
					) : null}
				</Fragment>
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
		case '/tai-khoan/thanh-toan': {
			profileContent = (
				<Fragment>
					<h3>Thông tin thanh toán</h3>
					
				</Fragment>
			);
			break;
		}
		case '/tai-khoan/yeu-thich': {
			profileContent = (
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
												<p className={classes.rating}>
													{
														Array(5).fill().map((val, index) => (	
															(item.averagePoint - Math.floor(item.averagePoint)).toFixed(1) === 0.5 ? (
																<span key={index} className={`icon-star ${classes.inner} ${index + 1 === Math.round(item.averagePoint) ? 'icon-star-half' : index + 1 < Math.round(item.averagePoint) ? classes.selected : ''}`}>
																	{index + 1 !== Math.round(item.averagePoint) && <i className={`icon-star ${classes.border}`}></i>}
																</span>
															) : (
																<span key={index} className={`icon-star ${classes.inner} ${index + 1 <= Math.round(item.averagePoint) ? classes.selected : ''}`}>
																	<i className={`icon-star ${classes.border}`}></i>
																</span>
															)
														))
													}
												</p>
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
			);
			break;
		}
		case '/tai-khoan/nhan-xet': {
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
													Array(daysInMonth).fill()
														.map((item, index) => (
															<option key={index + 1} value={index + 1}>
																{index + 1}
															</option>
														))}
											</select>
											<select name='month' id='select-month' aria-labelledby='month' onChange={onChangeMonth} value={selectedMonth}>
												<option value='0'>Tháng</option>
												{Array(12).fill()
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
									<button type='submit' className={classes.save}>Lưu thay đổi</button>
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
							<div className={classes.avatar}>
								{photoURL && <span className={classes['remove-img']} onClick={clearPhoto}>&times;</span>}
								<img src={userInfo.avatar} alt='avatar' />
								{/* {photoURL || userInfo.avatar ? <img src={userInfo.avatar} alt='avatar' /> : <i className='icon-user'></i>} */}
							</div>
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

