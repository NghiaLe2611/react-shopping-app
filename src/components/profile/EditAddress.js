import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { authActions } from '../../store/auth';
import Swal from 'sweetalert2';

const EditAddress = (props) => {
	const { classes, cities } = props;
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData);
	const { listAddress } = userData;
    const location = useLocation();
    const navigate = useNavigate();

    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [newAddress, setNewAddress] = useState(null);

    const { fetchData: fetchDistricts } = useFetch();
    const { fetchData: fetchWards } = useFetch();
    const { fetchData: updateAddressData } = useFetch();
    const { fetchData: fetchUser } = useFetch();

    // const { fetchData: fetchAddress } = useFetch();

    useEffect(() => {
        // const addressId = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
        
        if (listAddress) {
            if (location.state && location.state.addressId) {
                const currentAdd = listAddress.find(item => {
                    return item._id === location.state.addressId;
                });
                setCurrentAddress(currentAdd);
                setNewAddress(currentAdd);
            } 
        }

    }, [listAddress, location]);

    useEffect(() => {
        if (currentAddress) {
            if (currentAddress.city.id) {
                fetchDistricts(
                    { url: `${process.env.REACT_APP_API_URL}/districts/${currentAddress.city.id}` }, 
                    (data) => {
                        if (data) {
                            setDistricts(data);
                        }
                    }
                );
            }
        }
    }, [currentAddress, fetchDistricts]);

    useEffect(() => {
        if (currentAddress) {
            if (currentAddress.city.id && currentAddress.district.id) {
                fetchWards(
                    { url: `${process.env.REACT_APP_API_URL}/wards?city=${currentAddress.city.id}&district=${currentAddress.district.id}`}, 
                    (data) => {
                        if (data) {
                            setWards(data);
                        }
                    }
                );
            }
        }
    }, [currentAddress, fetchWards]);

    const onChangeAddressInput = (e) => {
		const { name, value } = e.target;
        setNewAddress(data => data = {...data, [name]: value})
	};

    const onChangeCity = (e) => {
		const { options, value, name } = e.target; // value is index
		const id = parseInt(e.target.value);
		setNewAddress({...newAddress, [name]: {
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
		const cityId = setNewAddress.city.id;
		const districtId = parseInt(value);

		setNewAddress({...newAddress, [name]: {
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
		setNewAddress({...newAddress, [name]: {
			id: parseInt(e.target.value), name: options[selectedIndex].innerHTML
		}});
	};

    const exitEdit = (e) => {
        e.preventDefault();
        navigate('/tai-khoan/dia-chi');
    };

    const updateAddress = (e) => {
        e.preventDefault();

        if (newAddress.name && newAddress.phone && newAddress.address && newAddress.city.id) {
            const updatedAddress = {
                _id: newAddress._id,
				name: newAddress.name,
				phone: newAddress.phone,
				city: {
					id: newAddress.city.id,
					name: newAddress.city.name
				},
				district: {
					id: newAddress.district.id ? newAddress.district.id : 0,
					name: newAddress.district.name ? newAddress.district.name : ''
				},
				ward: {
					id: newAddress.ward.id ? newAddress.ward.id : 0,
					name: newAddress.ward.name ? newAddress.ward.name : ''
				},
				address: newAddress.address,
				default: newAddress.default
			};

            updateAddressData(
				{
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					url: `${process.env.REACT_APP_API_URL}/updateUserAddress/${userData.uuid}/${newAddress._id}`,
					body: { updatedAddress },
				}, (data) => {
                    if (data && data.message) {
                        const userDataStorage = JSON.parse(localStorage.getItem('userData'));

                        const userDataObj = {
                            uuid: userDataStorage.uuid,
                            displayName: userDataStorage.displayName,
                            email: userDataStorage.email,
                            photoURL: userDataStorage.photoURL,
                            emailVerified: userDataStorage.emailVerified
                        };
            
                        fetchUser({
                            url: `${process.env.REACT_APP_API_URL}/getUserData/${userData.uuid}` 
                        }, data => {
                            if (data) {
                                const cloneData = (({ uuid, displayName, email, photoURL, emailVerified, ...val }) => val)(data);
                                dispatch(authActions.updateState({
                                    userData: {...userDataObj, ...cloneData}
                                }));
                            }
                        });

                        Swal.fire({
                            icon: 'success',
                            html: `<p>Cập nhật địa chỉ thành công<p>`,
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#2f80ed'
                        }).then(() => {
                            navigate('/tai-khoan/dia-chi');
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

        } else {
            Swal.fire({
                icon: 'error',
                html: `<p>Thông tin cần nhập không được trống !</p>`,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3741'
            });
        }

    };

	return (
        newAddress ? (
            <div className={classes['form-edit']}>
                <h3>Cập nhật địa chỉ</h3>
                <form className={classes['form-address']} onSubmit={updateAddress}>
                    <div className={classes['input-group']}>
                        <label>Họ và tên</label>
                        <div className={classes['wrap-ip']}>
                            <input type='text' name='name' placeholder='Nhập họ tên' defaultValue={newAddress.name} 
                                onChange={onChangeAddressInput}
                            />
                        </div>
                    </div>
                    <div className={classes['input-group']}>
                        <label>Số điện thoại</label>
                        <div className={classes['wrap-ip']}>
                            <input type='text' name='phone' placeholder='Nhập số điện thoại' defaultValue={newAddress.phone} 
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key)) {
                                      e.preventDefault();
                                    }
                                }}
                                onChange={onChangeAddressInput}
                            />
                        </div>
                    </div>
                    <div className={classes['input-group']}>
                        <label>Tỉnh/Thành phố</label>
                        <div className={classes['wrap-ip']}>
                            <select name='city' id='city' defaultValue={newAddress.city.id}
                                onChange={onChangeCity}
                            >
                                <option value='0'>Chọn Tỉnh/Thành phố</option>
                                {cities.length > 0 &&
                                    cities.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                    <div className={classes['input-group']}>
                        <label>Quận huyện</label>
                        <div className={classes['wrap-ip']}>
                            <select name='district' id='district'onChange={onChangeDistrict} 
                                key={`${Math.floor((Math.random() * 1000))}-district`}
                                defaultValue={newAddress.district.id}
                            >
                                <option value='0'>Chọn Quận/Huyện</option>
                                {
                                    districts.length > 0 && (
                                        districts.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))
                                    )
                                }
                            </select>
                        </div>
                    </div>
                    <div className={classes['input-group']}>
                        <label>Phường xã</label>
                        <div className={classes['wrap-ip']}>
                            <select name='ward' id='ward' onChange={onChangeWard} 
                                key={`${Math.floor((Math.random() * 1000))}-ward`}
                                defaultValue={newAddress.ward.id}
                            >
                                <option value='0'>Chọn Phường/Xã</option>
                                {wards.length > 0 &&
                                    wards.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                    <div className={classes['input-group']}>
                        <label>Địa chỉ</label>
                        <div className={classes['wrap-ip']}>
                            <textarea name='address' rows='5' placeholder='Nhập địa chỉ' defaultValue={newAddress.address}
                                onChange={onChangeAddressInput}
                            ></textarea>
                        </div>
                    </div>
                    {
                        !currentAddress.default && (
                            <div className={classes['input-group']}>
                                <label></label>
                                <div className={classes['wrap-ip']}>
                                    <label className={classes.checkbox}>
                                        
                                        <input type='checkbox' name='isDefault' defaultChecked={currentAddress.default} 
                                            onChange={() => {
                                                setNewAddress(data => data = {...data, default: !newAddress.default});
                                            }}
                                        />
                                        <span className={classes.checkmark}></span>Đặt làm địa chỉ mặc định
                                    </label>
                                </div>
                            </div>
                        )
                    }   

                    {/* <div className={classes['input-group']}>
                        <label></label>
                        <div className={classes['wrap-ip']}>
                            <label className={classes.checkbox}>
                                
                                <input type='checkbox' name='isDefault' defaultChecked={currentAddress.default} 
                                    onChange={() => {
                                        setNewAddress(data => data = {...data, default: !newAddress.default});
                                    }}
                                />
                                <span className={classes.checkmark}></span>Đặt làm địa chỉ mặc định
                            </label>
                        </div>
                    </div> */}
                    
                    <div className={classes['input-group']}>
                        <label></label>
                        <div className={classes['wrap-ip']}>
                            <button className={`${classes.back} ${classes.btn}`} onClick={exitEdit}>Quay lại</button>
                            <button type='submit' className={`${classes.update} ${classes.btn}`}>Cập nhật</button>
                        </div>
                    </div>
                </form>
            </div>
        ) : null
	);
};

export default EditAddress;
