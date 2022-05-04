import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from '../../hooks/useFetch';
import { authActions } from '../../store/auth';
import Swal from 'sweetalert2';
import classes from '../../scss/AddressForm.module.scss';

const AddressForm = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData);
    const shippingInfo = useSelector((state) => state.auth.shippingInfo);
    const [addressInfo, setAddressInfo] = useState({
		name: null,
		phone: null,
		city: { id: 0 },
		district: { id: 0 },
		ward: { id: 0 },
		address: null
	});
    const [cities, setCities] = useState(() => {
        const storage = localStorage.getItem('storage_citi');
        if (storage) {
            return JSON.parse(storage);
        }

        return [];
    });
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [formIsValid, setFormIsValid] = useState({});

    const { fetchData: fetchCities } = useFetch();
    const { fetchData: fetchDistricts } = useFetch();
    const { fetchData: fetchWards } = useFetch();

    useEffect(() => {
		if (!cities.length) {
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
	}, [fetchCities, cities]);

    useEffect(() => {
		if (!userData) {
            if (shippingInfo) {
                setAddressInfo(shippingInfo);
                return;
            }
        }
	}, [shippingInfo]);

    const onChangeAddressInput = (e) => {
		const { name, value } = e.target;
        setAddressInfo({...addressInfo, [name]: value});

        if (!value) {
            setFormIsValid({...formIsValid, [name]: false});
        } else {
            let cloneObj = {...formIsValid};
            delete cloneObj[name];
            setFormIsValid(cloneObj);
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
		const cityId = addressInfo.city.id;
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

    const submitAddress = (e) => {
		e.preventDefault();
		
		if (!addressInfo.name) {
			setFormIsValid(data => data = {...data, name: false});
		}
		if (!addressInfo.phone) {
			setFormIsValid(data => data = {...data, phone: false});
		}
		if (!addressInfo.address) {
			setFormIsValid(data => data = {...data, address: false});
		}
		if (!addressInfo.city.id) {
			setFormIsValid(data => data = {...data, city: false});
		}
		
		if (addressInfo.name && addressInfo.phone && addressInfo.address && addressInfo.city.id) {
			const newAddress = {
				name: addressInfo.name,
				phone: addressInfo.phone,
				city: {
					id: addressInfo.city.id,
					name: addressInfo.city.name
				},
				district: {
					id: addressInfo.district.id ? addressInfo.district.id : 0,
					name: addressInfo.district.name ? addressInfo.district.name : ''
				},
				ward: {
					id: addressInfo.ward.id ? addressInfo.ward.id : 0,
					name: addressInfo.ward.name ? addressInfo.ward.name : ''
				},
				address: addressInfo.address,
				default: addressInfo.isDefault
			};

            dispatch(authActions.setShippingAddress(newAddress));
            Swal.fire({
                icon: 'success',
                html: `<p>Cập nhật địa chỉ thành công</p>`,
                confirmButtonText: 'OK',
                confirmButtonColor: '#2f80ed'
            });
		} else {
            Swal.fire({
                icon: 'error',
                html: `<p>Thông tin địa chỉ không được trống</p>`,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3741'
            });
        }
	};

	return (
		<form className={classes['form-address']} onSubmit={submitAddress}>
			<div className={classes['input-group']}>
				<label>Họ và tên</label>
				<div className={classes['wrap-ip']}>
					<input type='text' name='name' placeholder='Nhập họ tên' className={formIsValid.name === false ? classes.invalid : ''} 
                        onChange={onChangeAddressInput} defaultValue={addressInfo.name}
                    />
				</div>
			</div>
			<div className={classes['input-group']}>
				<label>Số điện thoại</label>
				<div className={classes['wrap-ip']}>
					<input className={formIsValid.phone === false ? classes.invalid : ''}
						type='text' name='phone' defaultValue={addressInfo.phone}
						placeholder='Nhập số điện thoại'
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
					<select name='city' id='city' onChange={onChangeCity} value={addressInfo['city'].id}
                        className={formIsValid.city === false ? classes.invalid : ''} defaultValue={addressInfo.city.id}
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
					<select name='district' id='district' onChange={onChangeDistrict} value={addressInfo['district'].id}>
						<option value='0'>Chọn Quận/Huyện</option>
						{districts.length > 0 &&
							districts.map((item) => (
								<option key={item.id} value={item.id}>
									{item.name}
								</option>
							))}
					</select>
				</div>
			</div>
			<div className={classes['input-group']}>
				<label>Phường xã</label>
				<div className={classes['wrap-ip']}>
					<select name='ward' id='ward' onChange={onChangeWard} value={addressInfo['ward'].id}>
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
					<textarea name='address' rows='5' placeholder='Nhập địa chỉ' onChange={onChangeAddressInput}
                        className={formIsValid.address === false ? classes.invalid : ''} defaultValue={addressInfo.address}
                    ></textarea>
				</div>
			</div>
			<div className={classes['input-group']}>
				<label></label>
				<div className={classes['wrap-ip']}>
					<button type='submit' className={`${classes.update} ${classes.btn}`}>Xác nhận</button>
				</div>
			</div>
		</form>
	);
};

export default AddressForm;
