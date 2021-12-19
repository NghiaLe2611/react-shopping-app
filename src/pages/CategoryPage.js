import { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'; // Redirect -> Navigate in v6
import useFetch from '../hooks/useFetch';
import ProductItem from '../components/ProductItem';
import SkeletonElement from '../components/UI/Skeleton';
import classes from '../scss/ProductItem.module.scss';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Filter from '../components/Filter';

const CategoryPage = () => {
    const { category } = useParams();
    const navigate = useNavigate();  
    const location = useLocation();

    const categoryName = category === 'dien-thoai' ? 'smartphone' : category === 'may-tinh-bang' ? 'tablet' : null;

    const [products, setProducts] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [viewBy, setViewBy] = useState('GRID');

    const { isLoading, error, fetchData: fetchProducts } = useFetch();

    useEffect(() => {
        const query = new URLSearchParams(location.search);

        let url = "http://localhost:5000/products?category=" + categoryName;
        if (query.get('sort')) {
            url += `&sort=${query.get('sort')}`
        }
        if (categoryName) {
            fetchProducts({
                url: url
            }, data => {
                if (data) {
                    setProducts(data.results);
                }
            });
        } else {
            navigate('/not-found');
        }
    }, [fetchProducts, categoryName, location]);

    const sortProductsHandler = (val) => {
        setIsSorting(true);

        if (val === 0) {
            navigate('?sort=priceAscending');
        } else if (val === 1) {
            navigate('?sort=priceDescending');
        } else {
            navigate('');
        }

        setTimeout(() => {
            setIsSorting(false);
        }, 300);
    }

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
            </div>
        ))
    );

    if (error) {
        content = <p>{error}</p>;
    }

    if (!error && products.length) {
        content = (
            products.map(item => (
                <ProductItem key={item._id} showInfo={true}
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

    return (
        <div className='container'>
            {
                products.length ? (
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
            <div className={`card ${isSorting ? 'is-sorting' : ''}`}>
                {
                    categoryName && (
                        <h2 className={classes.title}>{categoryName === 'smartphone' ? 'Điện thoại' : categoryName === 'tablet' ? 'Máy tính bảng' : ''}</h2>
                    )
                }
                <Filter viewBy={viewBy}
                    sortProducts={sortProductsHandler} 
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
    )
}

export default CategoryPage;