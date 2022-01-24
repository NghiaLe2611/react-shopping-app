import { useState, useEffect, Fragment, forwardRef, useImperativeHandle  } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDelayUnmount } from '../../hooks/useDelayUnmount';
import useFetch from '../../hooks/useFetch';
import Modal from './Modal';
import classes from '../../scss/ComparePopup.module.scss';
import iconAdd from '../../assets/images/icon-add.png';
import { formatCurrency } from '../../helpers/helpers';

const CompareModalWrapper = forwardRef((props, ref) => {
    const navigate = useNavigate();
    const params = useParams();
    const { isComparing, setIsComparing, addItemToCompare, getListCompare, product, showBottomModal } = props;
    const categoryName = product ? product.category : (
        params.category === 'dien-thoai' ? 'smartphone' : 'tablet'
    );

    const [showCompareModal, setshowCompareModal] = useState(false);
    const [listCompare, setListCompare] = useState([{}, {}, {}]);
    const [searchKey, setSearchKey] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const shouldRenderCompareModal = useDelayUnmount(showCompareModal, 300);

    const { isLoading, error, fetchData: fetchProducts } = useFetch();

    useEffect(() => {
        
        const timer = setTimeout(() => {
            if (searchKey) {
                fetchProducts({
                    url: `${process.env.REACT_APP_API_URL}/productSearch?category=${categoryName}&name=${searchKey.toLowerCase()}`
                }, data => {
                    if (data) {
                        setSuggestions(data.results);
                    }
                });
            } else {
                setSuggestions([]);
            }
        }, 1000);

        return () => {
            clearTimeout(timer);
        }
    }, [fetchProducts, searchKey, categoryName]);

    useEffect(() => {
        const list = [...listCompare];
        const found = list.findIndex(item => item._id);
        if (found === -1) {
            setIsComparing(false);
        }

        if (getListCompare) {
            getListCompare(listCompare); 
        } 

    }, [listCompare]);

    useEffect(() => {
        if (props.listCompare) {
            setListCompare(props.listCompare);
        }
    }, [props.listCompare]);

    const removeItemCompare = (id) => {
        const list = [...listCompare]; 
        const index = list.findIndex(item => item._id === id);

        if (index !== -1) {
            list.splice(index, 1);
            list.push({});
            setListCompare(list);
        }
    };

    const closeModalCompare = () => {
        setshowCompareModal(false);
        setSuggestions([]);
        setSearchKey('');
    };

    const confirmCompare = () => {
        const list = [...listCompare].filter(item => item._id);
        const cateLink = product ? (product.category === 'smartphone' ? 'dien-thoai' : 'may-tinh-bang') : params.category
        if (list.length < 2) {
            alert ("Vui lòng chọn ít nhất 2 sản phẩm !");
        } else {
            let link = '';
            
            for (const val of list) {
                const index = list.findIndex(item => item._id === val._id);
                link += `id=${val._id}`;
                if (index < list.length - 1) {
                    link += '&';
                }
            }

            navigate(`/so-sanh/${cateLink}?${link}`);
            closeModalCompare();
        }
    };

    const onSearchProduct = (e) => {
        setSearchKey(e.target.value);
    };

    const addToCompare = () => {
        setshowCompareModal(true);
    };

    useImperativeHandle(ref, () => ({
        addItemToCompare(product) {
           
            const list = [...listCompare];
            const found = list.findIndex(val => val._id === product._id);
           
            if (found >= 0) {
                if (isComparing) {
                    removeItemCompare(product._id);
                }
                // alert('Sản phẩm đã đc được so sánh. Vui lòng chọn lại.');
            } else {
                if (getListCompare) {
                    list.some((item, index) => {
                        if (!item._id) {
                            list[index] = product;
                            setListCompare(list);
                            return true;
                        }
                        return false;
                    });
                } else {
                    if (listCompare.length < 3) {
                        list.push(product);
                        setListCompare(list);
                    }
                }
            }
        },
        addToCompare() {
            setshowCompareModal(true);
        }
    }));

	return (
        <Fragment>
            {
                showBottomModal === true && (
                    <div className={classes['compare-modal']}
                        style={{ display: isComparing ? 'block' : 'none' }}
                    >
                        <div className={classes['wrap-compare']}>
                            <ul className={classes['list-compare']}>
                                {listCompare.map((item, index) =>
                                    item._id ? (
                                        <li key={item._id}>
                                            <div className={classes.img}>
                                                <img src={item.img} alt='' />
                                            </div>
                                            <p className={classes.txt}>{item.name}</p>
                                            <span
                                                onClick={() => removeItemCompare(item._id)}
                                            >
                                                &times;
                                            </span>
                                        </li>
                                    ) : (
                                        <li key={index}>
                                            <div
                                                className={classes.img}
                                                onClick={() => addToCompare()}
                                            >
                                                <img src={iconAdd} alt='' />
                                                <p className={classes.txt}>Thêm sản phẩm</p>
                                            </div>
                                        </li>
                                    )
                                )}
                            </ul>
                            <div className={classes['close-compare']}>
                                <span
                                    className={classes['btn-compare']}
                                    onClick={confirmCompare}
                                >
                                    So sánh
                                </span>
                                <span className={classes['btn-remove']}>
                                    Xóa tất cả sản phẩm
                                </span>
                            </div>
                        </div>
                        <span
                            className={classes.close}
                            onClick={() => {
                                setIsComparing(false);
                            }}
                        >
                            Đóng &times;
                        </span>
                    </div>
                )   
            }

            {shouldRenderCompareModal && (
                    <Modal isShowModal={showCompareModal}
                        closeModal={closeModalCompare}
                    >
                        <div className={classes['list-compare-modal']}>
                            <p>Danh sách được thêm vào so sánh</p>
                            <ul className={classes.list}>
                                {
                                    listCompare.map((item, index) =>
                                        item._id && (
                                            <li key={item._id}>
                                                <div className={classes.img}>
                                                    <img src={item.img} alt={item.name} />
                                                </div>
                                                <h3 className={classes.name}>{item.name}</h3>
                                                {
                                                    item.sale ? (
                                                        <Fragment>
                                                            <p className={classes.price}>
                                                                <small>{formatCurrency(item.price)}₫</small><br/>
                                                                {formatCurrency(item.price - item.sale)}₫
                                                            </p>
                                                        </Fragment>
                                                    ) : <p className={classes.price}>{formatCurrency(item.price)}₫</p>
                                                }
                                                {
                                                    listCompare.findIndex(val => val._id === item._id) !== -1 && (
                                                        <p className={classes.txt}><span className='icon-check-circle'></span>Đã thêm so sánh</p>
                                                    )
                                                }
                                            </li>
                                        )
                                    )
                                }
                            </ul>
                            <button className={classes.compare} onClick={confirmCompare}>So sánh</button>
                            <p>Nhập tên để tìm</p>
                            <div className={classes['wrap-search-ip']}>
                                <input type="text" placeholder="Nhập tên sản phẩm để tìm" spellCheck="false"
                                    onChange={onSearchProduct} value={searchKey}
                                />
                            </div>
                            <ul className={classes['suggestion-list']} style={{display: suggestions.length > 0 ? 'block' : 'none'}}>
                                {
                                    suggestions.length > 0 && suggestions.map(item => (
                                        listCompare.filter(val => val._id === item._id).length > 0 ? (
                                            <li key={item._id}>
                                                <div className={classes.img}>
                                                    <img src={item.img} alt={item.name} />
                                                </div>
                                                <div className={classes.info}>
                                                    <h3 className={classes.name}>{item.name}</h3>
                                                    {
                                                        item.sale ? (
                                                            <Fragment>
                                                                <p className={classes.price}>
                                                                    <small>{formatCurrency(item.price)}₫</small><br/>
                                                                    {formatCurrency(item.price - item.sale)}₫
                                                                </p>
                                                            </Fragment>
                                                        ) : <p className={classes.price}>{formatCurrency(item.price)}₫</p>
                                                    }
                                                    <span><i className='icon-check-circle'></i>Đã thêm so sánh</span>
                                                </div>
                                            </li>
                                        ) : (
                                            <li key={item._id} onClick={() => addItemToCompare(item)}>
                                                <div className={classes.img}>
                                                    <img src={item.img} alt={item.name} />
                                                </div>
                                                <div className={classes.info}>
                                                    <h3 className={classes.name}>{item.name}</h3>
                                                    {
                                                        item.sale ? (
                                                            <Fragment>
                                                                <p className={classes.price}>
                                                                    <small>{formatCurrency(item.price)}₫</small><br/>
                                                                    {formatCurrency(item.price - item.sale)}₫
                                                                </p>
                                                            </Fragment>
                                                        ) : <p className={classes.price}>{formatCurrency(item.price)}₫</p>
                                                    }
                                                    <span>Thêm so sánh</span>
                                                </div>
                                            </li>
                                        )    
                                    ))
                                }
                            </ul>
                            
                        </div>
                    </Modal>
                )}
        </Fragment>
    );
})

CompareModalWrapper.displayName = 'CompareModalWrapper';

export default CompareModalWrapper;
