import { Fragment, useState, useEffect } from 'react'
import Modal from './Modal';
import classes from '../../scss/ComparePopup.module.scss';
import { formatCurrency } from '../../helpers/helpers';
import { useParams, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

const CompareListPopup = (props) => {
    const params = useParams();
    const navigate = useNavigate();

    const category = params.category === 'dien-thoai' ? 'smartphone' : 'tablet';
    const { showCompareModal, closeModalCompare } = props;
    const [listCompare, setListCompare] = useState([]);
    const [isComparing, setIsComparing] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const { isLoading, error, fetchData: fetchProducts } = useFetch();

    // useEffect(() => {
    //     setListCompare(props.listCompare);
    // }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchKey) {
                fetchProducts({
                    url: `${process.env.REACT_APP_API_URL}/api/v1/products/search?category=${category}&name=${searchKey.toLowerCase()}`
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
    }, [searchKey, category]);

    const onSearchProduct = (e) => {
        setSearchKey(e.target.value);
    };

    const addItemToCompare = (product) => {
        console.log(product);
        setIsComparing(true);

        const list = [...listCompare];
        const found = list.findIndex(val => val._id === product._id);
       
        if (found >= 0) {
            removeItemCompare(product._id);
        } else {
            // list.some((item, index) => {
            //     if (!item._id) {
            //         list[index] = product;
            //         setListCompare(list);
            //         return true;
            //     }
            // });
            setListCompare(val => [...val, product]);
        }
    };

    const removeItemCompare = (id) => {
        const list = [...listCompare]; 
        const index = list.findIndex(item => item._id === id);

        if (index !== -1) {
            list.splice(index, 1);
            list.push({});
            setListCompare(list);
        }
    };

    const confirmCompare = () => {
        const list = [...listCompare].filter(item => item._id);

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

            navigate(`/so-sanh/${params.category}?${link}`);
            closeModalCompare();
        }
    };

	return (
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
                        ))
                    }
                </ul>
                
            </div>
        </Modal>
    );
};

export default CompareListPopup;
