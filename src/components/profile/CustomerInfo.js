import { Fragment, useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { authApp } from '../../firebase/config';

import useFetch from '../../hooks/useFetch';
import { authActions } from '../../store/auth';

import Swal from 'sweetalert2';
import classes from '../../scss/Profile.module.scss';
import iconFacebook from '../../assets/images/icon-fb.png';
import iconGoogle from '../../assets/images/icon-google.png';
import userAvatar from '../../assets/images/avatar.png';

const yearList = Array.from(Array(new Date().getFullYear() - 1899), (_, i) => (i + 1900).toString()).reverse();
function getDaysInMonth(month, year) {
	return new Date(year, month, 0).getDate();
};

const CustomerInfo = (props) => {
    // const location = useLocation();
    // const navigate = useNavigate();
	const dispatch = useDispatch();
	const userData = props.userData;

    const { displayName, photoURL, uuid, email, emailVerified, 
		fullName, phone, birthday } = userData ? userData : {};
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

    const imgRef = useRef('');
    const { fetchData: updateUser } = useFetch();

    useEffect(() => {
        setUserInfo({
            ...userInfo,
            fullname: fullName ? fullName : '',
            phone: phone ? phone : '',
            birthday: birthday ? birthday : ''
        });
    }, [userData]);

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

    return (
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
                                            Array(daysInMonth).fill().map((item, index) => (
                                                <option key={index + 1} value={index + 1}>
                                                    {index + 1}
                                                </option>
                                            ))}
                                    </select>
                                    <select name='month' id='select-month' aria-labelledby='month' onChange={onChangeMonth} value={selectedMonth}>
                                        <option value='0'>Tháng</option>
                                        {Array(12).fill().map((item, index) => (
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
    )
};

export default CustomerInfo;