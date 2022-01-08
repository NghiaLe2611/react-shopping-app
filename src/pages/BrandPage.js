import { useState, useEffect, Fragment } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import ProductItem from '../components/ProductItem';
import classes from '../scss/ProductItem.module.scss';
import { capitalizeFirstLetter } from '../helpers/helpers';
import SkeletonElement from '../components/UI/Skeleton';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BrandPage = () => {
    const { brand } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [imgLoaded, setImgLoaded] = useState(false);

    const { isLoading, error, fetchData: fetchProducts } = useFetch();

    const category = location.pathname.includes('dien-thoai') ? 'smartphone' : location.pathname.includes('may-tinh-bang') ? 'tablet' : '';

    useEffect(() => {
        const timer = setTimeout(() => {
            setImgLoaded(true);
        }, 500);

        return () => {
            clearTimeout(timer);
            setImgLoaded(false);
        }

    }, [brand]);

    useEffect(() => {

        fetchProducts({
            url: `${process.env.REACT_APP_API_URL}/products?brand=` + brand + '&category=' + category
        }, data => {
            if (data) {
                if (data) {
                    if (data.results.length) {
                        setProducts(data.results);
                    } else {
                        navigate('/not-found');
                    }
                }
            }
        });
    }, [fetchProducts, navigate, category, brand]);

    let breadcrumbsCate;

    let content = isLoading && (
        Array(10).fill().map((item ,index) => (
            <div key={index} className={`${classes['item']} ${classes['product-item']}`}>
                <SkeletonElement type="image" />
                <SkeletonElement type="title" />
                <SkeletonElement type="text" />
            </div>
        ))
    );

    if (error) {
        content = <p className='error'>{error}</p>;
    }

    if (!isLoading && !error && products.length) {
        content = (
            products.map(item => (
                <ProductItem key={item._id}
                    item={item}
                />
            ))
        );

        if (location.pathname.includes('dien-thoai')) {
            breadcrumbsCate = <Fragment>
                <li>
                    <Link to="/">Trang chủ</Link>
                </li>
                <li>
                    <Link to="/dien-thoai">Điện thoại</Link>
                </li>
                <li>
                    <Link to={`/dien-thoai/hang/${brand}`}>
                        {capitalizeFirstLetter(brand)}
                    </Link>
                </li>
            </Fragment>;
        } else if (location.pathname.includes('may-tinh-bang')) {
            breadcrumbsCate = <Fragment>
                <li>
                    <Link to="/">Trang chủ</Link>
                </li>
                <li>
                    <Link to="/may-tinh-bang">Máy tính bảng</Link>
                </li>
                <li>
                    <Link to={`/may-tinh-bang/hang/${brand}`}>
                        {capitalizeFirstLetter(brand)}
                    </Link>
                </li>
            </Fragment>;
        }
    }

    return (
        <div className='container'>
            {
                !isLoading ? (
                    <ul className="breadcrumbs">
                        {breadcrumbsCate}
                    </ul>
                ) : <div style={{padding: '15px 0'}}>
                    <Skeleton height={25}/>
                </div>
            }
            
            <div className={classes.banner}>
                {
                    imgLoaded ? (
                        <img src={`/images/banner-${brand}.jpg`} alt="" 
                            onError={(e)=>{e.target.onError = null; e.target.src=`https://dummyimage.com/1200x300/000/fff` }}
                        />
                    ) :  <Skeleton height={'100%'}/>
                }
            </div>
            <div className='card'>
                <div className={classes['product-list']}>
                    {content}
                </div>
            </div>
        </div>
    )
}

export default BrandPage;