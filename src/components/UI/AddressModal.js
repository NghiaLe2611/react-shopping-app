import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from './Modal';
import classes from '../../scss/AddressModal.module.scss';
import { useDelayUnmount } from '../../hooks/useDelayUnmount';
import { authActions } from '../../store/auth';
import AddressForm from './AddressForm';

const AddressModal = (props) => {
    const dispatch = useDispatch();

    const { showAddressModal, showAddModalHandler, closeAddModalHandler } = props;

    const shouldRenderModal = useDelayUnmount(showAddressModal, 300);
	const userData = useSelector((state) => state.auth.userData);
    const { addresses } = userData ? userData : {};

    const setShippingAddress = (item) => {
        dispatch(authActions.setShippingAddress(item));
        closeAddModalHandler();
    };

    return (
        shouldRenderModal && (
            <Modal isShowModal={showAddModalHandler} closeModal={closeAddModalHandler} 
                animation='none' contentClass={classes.addressModal}
            >
                <div className={classes['address-modal']}>
                    {
                        userData ? (
                            <Fragment>
                                <h5>Chọn địa chỉ giao hàng có sẵn bên dưới:</h5>
                                {addresses && addresses.length > 0 ? (
                                    <ul className={classes['list-address']}>
                                        {addresses.map((item) => (
                                            <li key={item._id} className={`${item.default ? classes.selected : ''}`}>
                                                <div className={classes['wrap-address']}>
                                                    <div className={classes.info}>
                                                        <p className={classes.name}>
                                                            {item.name}
                                                            {item.default && <span>Mặc định</span>}
                                                        </p>
                                                        <p className={classes.address}>
                                                            <span>Địa chỉ: </span>
                                                            {`${item.address}${item.ward && `, ${item.ward.name}`}${item.district && `, ${item.district.name}`}${item.city && `, ${item.city.name}`}`}
                                                        </p>
                                                        <p className={classes.phone}><span>Điện thoại: </span>{item.phone}</p>
                                                        <p>
                                                            <button onClick={() => setShippingAddress(item)}>Giao đến địa chỉ này</button>
                                                        </p>
                                                    </div> 
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p>Bạn chưa có địa chỉ nào</p>}
                            </Fragment>
                        ) : (
                            <AddressForm closeModal={closeAddModalHandler}/>
                        )
                    }
                </div>
            </Modal>
        )
    )
};

export default AddressModal;