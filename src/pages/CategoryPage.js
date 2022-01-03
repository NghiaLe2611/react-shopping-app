import { useState, useEffect, Fragment } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'; // Redirect -> Navigate in v6
import useFetch from '../hooks/useFetch';
import ProductItem from '../components/ProductItem';
import SkeletonElement from '../components/UI/Skeleton';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Filter from '../components/Filter';
import FilterSidebar from '../components/FilterSidebar';
import Slides from '../components/Slides';
import { removeQueryParam } from '../helpers/helpers';
import NotiSearch from '../assets/images/noti-search.png';
import useCheckMobile from '../hooks/useCheckMobile';
import classes from '../scss/CategoryPage.module.scss';

const slides = [
    {
        url: "https://images.fpt.shop/unsafe/fit-in/1200x300/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/12/19/637755081215868035_F-C1_1200x300.png"
    },
    {
        url: "https://images.fpt.shop/unsafe/fit-in/1200x300/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/12/6/637744092768205488_F-C1_1200x300.png"
    },
    {
        url: "https://images.fpt.shop/unsafe/fit-in/1200x300/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/11/30/637739054941210872_F-C1_1200x300.png"
    },
    {
        url: "https://images.fpt.shop/unsafe/fit-in/1200x300/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/12/20/637755572319268071_F-C1_1200x300.png"
    },
    {
        url: "https://images.fpt.shop/unsafe/fit-in/1200x300/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2021/12/22/637757669268923947_F-C1_1200x300.png"
    }
];

const CategoryPage = () => {
    const { category } = useParams();
    const navigate = useNavigate();  
    const location = useLocation();

    const categoryName = category === 'dien-thoai' ? 'smartphone' : category === 'may-tinh-bang' ? 'tablet' : null;

    const [products, setProducts] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [viewBy, setViewBy] = useState('GRID');
    const [filterUrl, setFilterUrl] = useState(`http://localhost:5000/products?category=${categoryName}`);
    const [filter, setFilter] = useState({
        brand: 'all',
        price: 'all',
        battery: 'all',
        sort: null
    });
    const [isFiltering, setIsFiltering] = useState(null);
    const [isShowFilter, setIsShowFilter] = useState(false);
    const { isLoading, error, fetchData: fetchProducts } = useFetch();
    const { isMobile } = useCheckMobile();

    useEffect(() => {
        if (!categoryName) {
           navigate('/not-found');
        }
    }, [categoryName]);

    useEffect(() => {
        fetchProducts({
            url: filterUrl
        }, data => {
            if (data) {
                if (data.results.length > 0) {
                    setProducts(data.results);
                } else {
                    setProducts(null);
                }
            } 
        });
    }, [fetchProducts, navigate, filterUrl]); 

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        let url = new URL(filterUrl);
        let params = new URLSearchParams(url.search);
        setIsSorting(true);

        if (isFiltering === 'brand') {
            const brand = query.get('hang-san-xuat');
            if (brand) {
                if (!params.has('brand')) {
                    setFilterUrl(filterUrl + `&brand=${brand}`);
                } else {
                    setFilterUrl(removeQueryParam('brand', filterUrl) + `&brand=${brand}`);
                }
            } else {
                setFilterUrl(removeQueryParam('brand', filterUrl));
            }
        } else if (isFiltering === 'price') {
            const price = query.get('gia');
            if (price) {
                if (!params.has('price')) {
                    setFilterUrl(filterUrl + `&price=${price}`);
                } else {
                    setFilterUrl(removeQueryParam('price', filterUrl) + `&price=${price}`);
                }
            } else {
                setFilterUrl(removeQueryParam('price', filterUrl));
            }
        } else if (isFiltering === 'battery') {
            const battery = query.get('pin');
            if (battery) {
                if (!params.has('battery')) {
                    setFilterUrl(filterUrl + `&battery=${battery}`);
                } else {
                    setFilterUrl(removeQueryParam('battery', filterUrl) + `&battery=${battery}`);
                }
            } else {
                setFilterUrl(removeQueryParam('battery', filterUrl));
            }
        } else if (isFiltering === 'sort') {
            const sort = query.get('sort');
            if (sort) {
                if (!params.has('sort')) {
                    setFilterUrl(filterUrl + `&sort=${sort}`);
                } else {
                    setFilterUrl(removeQueryParam('sort', filterUrl) + `&sort=${sort}`);
                }
            } else {
                setFilterUrl(removeQueryParam('sort', filterUrl));
            }
        }

        const timeout = setTimeout(() => setIsSorting(false), 300);
       
        return () => {
            clearTimeout(timeout);
        }

    }, [isFiltering, filter, location.search]);
    
    useEffect(() => {
        if (isShowFilter) {
            document.querySelector('html').classList.add('modal-open');
            document.body.classList.add('modal-open');
        } else {
            document.querySelector('html').classList.remove('modal-open');
            document.body.classList.remove('modal-open');
        }
    }, [isShowFilter]);


    // const setFilterProducts = (data) => {    
    //     setTimeout(() => {
    //         setProducts(data);
    //         setIsSorting(false);
    //     }, 300);
    // };

    const sortProductsHandler = (val) => {
        setIsSorting(true);

        if (val === 0) {
            // navigate('?sort=priceAscending');
            setFilter({...filter, sort: 'priceAscending'});
        } else if (val === 1) {
            // navigate('?sort=priceDescending');
            setFilter({...filter, sort: 'priceDescending'});
        } else {
            // navigate('');
            setFilter({...filter, sort: null});
        }

        setTimeout(() => {
            setIsSorting(false);
        }, 300);
    };

    const showFilterSidebar = () => {
        setIsShowFilter(true);
    };

    const setViewProductsHandler = (val) => {
        setIsSorting(true);
        setTimeout(() => {
            setViewBy(val);
            setIsSorting(false);
        }, 300);
    };

    let breadcrumbsCate;
    let content = isLoading && (
        Array(20).fill().map((item ,index) => (
            <div key={index} className={`${classes['item']} ${classes['product-item']}`}>
                <SkeletonElement type="image" />
                <SkeletonElement type="title" />
                <SkeletonElement type="text" />
                <SkeletonElement type="desc" />
            </div>
        ))
    );

    if (error) {
        content = <p className='error'>{error}</p>;
    }

    if (!error) {
        if (!products) {
            content = <div className='error' style={{textAlign: 'center', width: '100%'}}>
                <img src={NotiSearch} alt="not-found" />
                <p>Rất tiếc chúng tôi không tìm thấy kết quả theo yêu cầu của bạn. Vui lòng thử lại.</p>
            </div>
        }
        
        if (products && products.length) {
            content = (
                products.map(item => (
                    <ProductItem key={item._id} showInfo={true} col={4} display={viewBy}
                        item={item}
                    />
                ))
            );
    
            switch(categoryName) {
                case 'smartphone':
                    breadcrumbsCate =  <Link to="/dien-thoai">Điện thoại</Link>;
                    break;
                case 'tablet':
                    breadcrumbsCate =  <Link to="/tablet">Máy tính bảng</Link>;
                    break;
                default:
                    return
            }
        }
    }

    return (
        <Fragment>
            {isShowFilter && <div className='overlay' onClick={() => setIsShowFilter(false)}></div>}
            {
                isMobile && (
                    <div className={`${classes['wrap-filter-sidebar']} ${isShowFilter ? classes.active : ''}`}>
                        { isMobile && <span className={classes.close} onClick={() => setIsShowFilter(false)}>×</span>}
                        <FilterSidebar category={categoryName}
                            filter={filter} setFilter={setFilter} 
                            setIsFiltering={setIsFiltering}
                        />
                    </div>
                )
            }
            <div className='container'>
                {
                    products && products.length ? (
                        <ul className="breadcrumbs">
                            <li>
                                <Link to="/">Trang chủ</Link>
                            </li>
                            <li>{breadcrumbsCate}</li>
                        </ul>
                    ) : ( 
                        <div style={{padding: '15px 0'}}>
                            <Skeleton height={20}/>
                        </div>
                    )
                }
                <div style={{marginTop: '-30px'}}>
                    <Slides slides={slides} full={true} />
                </div>
                
                <div className={classes['wrap-category']}>
                    {
                        !isMobile && (
                            <FilterSidebar category={categoryName}
                                filter={filter} setFilter={setFilter} 
                                setIsFiltering={setIsFiltering}
                                setIsSorting={setIsSorting} 
                            />
                        )
                    }
                    
                    <div className={`card ${isSorting ? 'is-sorting' : ''}`}>
                        {
                            categoryName && (
                                <h2 className={classes.title}>{categoryName === 'smartphone' ? 'Điện thoại' : categoryName === 'tablet' ? 'Máy tính bảng' : ''}</h2>
                            )
                        }
                        <Filter viewBy={viewBy} setIsFiltering={setIsFiltering} isMobile={isMobile}
                            sortProducts={sortProductsHandler} showFilterSidebar={showFilterSidebar}
                            setViewProducts={setViewProductsHandler}
                        />
                        {
                            categoryName && (
                                <div className={`${classes['product-list']} ${viewBy === 'LIST' ? classes['list-view'] : ''}`}>
                                    {content}
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default CategoryPage;