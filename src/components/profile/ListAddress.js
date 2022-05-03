import { Fragment, useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useFetch from '../../hooks/useFetch';
import { authActions } from '../../store/auth';
import Swal from 'sweetalert2';
import classes from '../../scss/Profile.module.scss';

const ListAddress = (props) => {
    const navigate = useNavigate();
	const dispatch = useDispatch();

	const { userData, cities } = props;
    const [isAddAddress, setIsAddAddress] = useState(false);
	const [addresses, setAddresses] = useState(() => {
        if (userData?.addresses) return userData.addresses;
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

    const { fetchData: fetchUser } = useFetch();
    const { fetchData: getAddresses } = useFetch();
    const { fetchData: updateUser } = useFetch();
	const { fetchData: fetchDistricts } = useFetch();
	const { fetchData: fetchWards } = useFetch();
    const { fetchData: removeAddress } = useFetch();

    const cityRef = useRef('');
	const districtRef = useRef('');
	const wardRef = useRef('');
	
	const slug = useLocation().pathname;

    const fetchAddresses = useCallback(() => {
        getAddresses(
            {
                url: `${process.env.REACT_APP_API_URL}/api/v1/me/addresses`,
            }, (data) => {
                if (data) {
                    setAddresses(data);
                }
            }
        );        
    }, [getAddresses]);

	useEffect(() => {
		setIsAddAddress(false);
	}, [slug]);

    useEffect(() => {
        if (!userData?.addresses) {
            fetchAddresses();
        }
    }, [fetchAddresses]);

    useEffect(() => {
        const newUserData = {...userData, addresses};
        dispatch(authActions.updateState({
            userData: newUserData
        }));
    }, [addresses]);

    const onAddNewAddress = () => {
        if (addresses && addresses.length < 5) {
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
					url: `${process.env.REACT_APP_API_URL}/api/v1/me/account`,
					body: { newAddress },
				}, (data) => {
					if (data && data.message) {
						// const userDataStorage = JSON.parse(localStorage.getItem('userData'));
						// let updatedDataStorage = {...userDataStorage};

						// updatedDataStorage = {...updatedDataStorage, listAddress: [...updatedDataStorage.listAddress, newAddress]};
	
						// dispatch(authActions.updateState({
						// 	userData: updatedDataStorage
						// }));

						Swal.fire({
							icon: 'success',
							html: `<p>Thêm địa chỉ thành công<p>`,
							confirmButtonText: 'OK',
							confirmButtonColor: '#2f80ed'
						});

                        fetchAddresses();

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
		setAddressInfo({...addressInfo, [name]: value});
	};

    const editAddress = (item) => {
        navigate(`dia-chi/cap-nhat`, {
			state: { addressId: item._id }
		});
        // setItemOnEdit(item);
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
						url: `${process.env.REACT_APP_API_URL}/api/v1/me/address/${id}`,
						body: { address_id: id },
					},
					(data) => {
						if (data && data.success) {
                            fetchAddresses();

							// const userDataStorage = JSON.parse(localStorage.getItem('userData'));

							// const userDataObj = {
							// 	uuid: userDataStorage.uuid,
							// 	displayName: userDataStorage.displayName,
							// 	email: userDataStorage.email,
							// 	photoURL: userDataStorage.photoURL,
							// 	emailVerified: userDataStorage.emailVerified,
							// };

							// fetchUser(
							// 	{
							// 		url: `${process.env.REACT_APP_API_URL}/api/v1/me/account`
							// 	},
							// 	(data) => {
							// 		if (data) {
							// 			const cloneData = (({ uuid, displayName, email, photoURL, emailVerified, ...val }) => val)(data);
							// 			dispatch(
							// 				authActions.updateState({
							// 					userData: { ...userDataObj, ...cloneData },
							// 				})
							// 			);
							// 		}
							// 	}
							// );
						}
					}
				);
			}
		});
	};

    return (
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
                        <button type='submit' className={`${classes.update} ${classes.btn}`}>Cập nhật</button>
                        <span className={`${classes.cancel} ${classes.btn}`} onClick={() => setIsAddAddress(false)}>Huỷ</span>
                    </div>
                </div>
            </form>
            {addresses && addresses.length > 0 ? (
                <ul className={classes['list-address']} style={{ display: isAddAddress ? 'none' : 'block' }}>
                    {addresses.map((item) => (
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
    )
};

export default ListAddress;