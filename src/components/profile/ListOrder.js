import { Fragment, useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useFetch from '../../hooks/useFetch';
import { cartActions } from '../../store/cart';
import Pagination from '../UI/Pagination';
import { usePrevious, formatCurrency, getOrderStatus } from '../../helpers/helpers';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../scss/SlickSlider.scss';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import classes from '../../scss/Profile.module.scss';
import noOrderImg from '../../assets/images/no-order.png';

const pageSize = 5;
const statusList = [
	{
		id: 0, text: 'Tất cả đơn'
	},
	{
		id: 1, text: 'Đang xử lý'
	},
	{
		id: 2, text: 'Đang vận chuyển'
	},
	{
		id: 3, text: 'Đã giao'
	},
	{
		id: 4, text: 'Đã huỷ'
	}
];

const ListOrder = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userData } = props;
    const [orderList, setOrderList] = useState({});
	const [orderStatus, setOrderStatus] = useState(0);
	const [orderCount, setOrderCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchKey, setSearchKey] = useState('');

    const slug = useLocation().pathname;

    const { isLoading, error: ordersError, fetchData: getOrders } = useFetch();
	const { fetchData: searchOrders } = useFetch();

    const slider = useRef({});
	const inputSearchRef = useRef('');

    let prevSearchKey = usePrevious(searchKey);

    useEffect(() => {
		const randomStr = Math.random().toString(36).substring(2, 16);
		
		if (slug === '/tai-khoan/don-hang') {
			let url = `${process.env.REACT_APP_API_URL}/orders?page=${currentPage}${orderStatus !== 0 ? `&status=${orderStatus}` : ''}`;
		
			if (searchKey) {
				url = `${process.env.REACT_APP_API_URL}/orders/search?page=${currentPage}${orderStatus !== 0 ? `&status=${orderStatus}` : ''}&text=${searchKey}`;
			}
			getOrders({
				url: url,
				headers: { 'x-request-id': randomStr + '_' + userData?._id }
			}, (data) => {
				if (data) {
					setOrderList(list => list = {...list, [orderStatus]: data.results});
					setOrderCount(data.count);
				}
			});
		}
	}, [slug, getOrders, orderStatus, currentPage]);

    const onSearchOrder = (e) => {
        e.preventDefault();
    
        if (searchKey) {
            const randomStr = Math.random().toString(36).substring(2, 16);
            const url = orderStatus === 0 ? `${process.env.REACT_APP_API_URL}/orders/search?text=${searchKey.toLowerCase()}` :
            `${process.env.REACT_APP_API_URL}/orders/search?status=${orderStatus}&text=${searchKey.toLowerCase()}`;
    
            if(prevSearchKey !== searchKey) {
                searchOrders({
                    url: url,
                    headers: { 'x-request-id': randomStr + '_' + userData?._id }
                }, data => {
                    if (data) {
                        setOrderList(list => list = {...list, [orderStatus]: data.results});
                        setOrderCount(data.count);
                        prevSearchKey = searchKey;
                    }
                });
            }		
        }
    };
    
    const setActiveTab = (id) => {
        setOrderStatus(id);
        setCurrentPage(1);
        slider.current.slickGoTo(id, true);
    };

	const paginate = (e, pageNumber) => {
        e.preventDefault();

        if (pageNumber === 'prev') {
            setCurrentPage(currentPage - 1);
        } else if (pageNumber === 'next') {
            setCurrentPage(currentPage + 1);
        } else {
            setCurrentPage(pageNumber);
        }

        document.querySelector('h3').scrollIntoView({behavior: 'smooth'});
    };

    const reBuy = (item) => {
        console.log(item);
        for (let i in item.products) {
            const product = item.products[i];
            console.log(product);

            dispatch(cartActions.addItemToCart({
                _id: product._id,
                category: product.category,
                quantity: product.quantity, 
                img: product.img, 
                name: product.name, 
                price: product.price, 
                sale: product.sale ? product.sale : 0,
                color: product.color
            }));
        }
        
        setTimeout(() => {
            navigate('/cart');
        }, 500);
    };

    const seeDetail = (item) => {
        navigate(`/order/${item._id}`)
    };

    const settings = {
		dots: false,
		arrows: false,
		infinite: false,
		speed: 400,
		slidesToShow: 1,
		slidesToScroll: 1,
		draggable: false,
		adaptiveHeight: true,
		className: classes['order-slides']
	};

    return (
        <Fragment>
            <h3>Đơn hàng của tôi</h3>
            <div className={classes['order-tab']}>
                {
                    statusList.map(item => (
                        <div key={item.id} className={orderStatus === item.id ? classes.active : ''}
                            onClick={() => setActiveTab(item.id)}
                        >{item.text}</div>
                    ))
                }
            </div>
            <form className={classes['order-search']} onSubmit={onSearchOrder}>
                <span className='icon-search'></span>
                <input name='search' placeholder='Tìm đơn hàng theo Mã đơn hàng hoặc Tên sản phẩm' type='search' autoComplete='off'
                    onChange={(e) => { setSearchKey(e.target.value); }} ref={inputSearchRef}
                />
                <button className={classes.search} type='submit'>Tìm đơn hàng</button>
            </form>                        
            <Slider {...settings} ref={slider}>
                {
                    statusList.map(item => (
                        <div className={classes['order-content']} key={item.id}>
                            {
                                orderList[item.id] && orderList[item.id].length > 0 ? orderList[item.id].map(item => (
                                    <div className={classes['order-item']} key={item._id}>
                                        <p className={classes.status}>{getOrderStatus(item.status)}</p>
                                        {
                                            item.products && item.products.map(prod => (
                                                <div className={classes.product} key={prod._id} onClick={() => seeDetail(item)}>
                                                    <div className={classes.detail}>
                                                        <div className={classes.img}>
                                                            <img src={prod.img} alt={prod.name} />
                                                            <span className={classes.quantity}>x{prod.quantity}</span>
                                                        </div>
                                                        <h4 className={classes.name}>
                                                            {prod.category === 'smartphone' ? 'Điện thoại' : 'Máy tính bảng'} {prod.name}
                                                        </h4>
                                                    </div>
                                                    <div className={classes.price}>{formatCurrency(prod.price)} ₫</div>
                                                </div>
                                            ))
                                        }
                                        <div className={classes.total}>
                                            <span className={classes.lbl}>Tổng tiền: </span>
                                            <span className={classes.price}>{formatCurrency(item.finalPrice)} ₫</span>
                                        </div>
                                        <div className={classes['btn-group']}>
                                            <span onClick={() => reBuy(item)}>Mua lại</span>
                                            <span onClick={() => seeDetail(item)}>Xem chi tiết</span>
                                        </div>
                                    </div>
                                )) : (
                                    isLoading ? (
                                        <div className={classes['wrap-item-loading']} style={{minHeight: 400, marginBottom: 200}}>
                                            <Skeleton height={20} style={{ marginBottom: 10 }}/>
                                            <div className={classes['item-loading']}>
                                                <Skeleton width={80} height={80} style={{ marginRight: 10 }}/>
                                                <div style={{flex: 1}}>
                                                    <Skeleton height={20} style={{ margin: '10px 0' }}/>
                                                    <Skeleton width={'70%'} height={20}/>
                                                </div>
                                                <div style={{margin: '10px 0', display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                                                    <Skeleton height={30} width={300}/>
                                                </div>
                                                <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                                                    <Skeleton width={100} height={30} style={{ marginRight: 10 }}/>
                                                    <Skeleton width={100} height={30}/>
                                                </div>
                                            </div>
                                        </div>     
                                    ) : (
                                        <div className={classes['empty-order']}>
                                            <img src={noOrderImg} alt='empty-order'/>
                                            <p>Chưa có đơn hàng</p>
                                        </div>
                                    )
                                )
                            }
                        </div>
                    ))
                }
            </Slider>
            {
                orderCount > pageSize && (
                    <Pagination style={{marginTop: 30}} right={true}
                        pageSize={pageSize} currentPage={currentPage}
                        totalCount={orderCount} paginate={paginate}
                    />
                )
            }
        </Fragment>
    )
};

export default ListOrder;