import { useState, useEffect } from 'react';
import ProductItem from './ProductItem';
import SkeletonElement from '../UI/Skeleton';
import classes from '../../scss/Products.module.scss';
import useFetch from '../../hooks/useFetch';

const Products = () => {

    const [products, setProducts] = useState([]);

    const { isLoading, error, fetchData: fetchProducts } = useFetch();

    useEffect(() => {
        fetchProducts({
            url: `${process.env.REACT_APP_API_URL}/getProducts`
        }, data => {
            if (data) {
                setProducts(data.results);
            }
        });
    }, [fetchProducts]);

    let smartphonesContent = isLoading && (
        Array(10).fill().map((item ,index) => (
            <div key={index} className={classes.item}>
                <SkeletonElement type="image" />
                <SkeletonElement type="title" />
                <SkeletonElement type="text" />
            </div>
        ))
    );

    let tabletsContent = isLoading && (
        Array(10).fill().map((item ,index) => (
            <div key={index} className={classes.item}>
                <SkeletonElement type="image" />
                <SkeletonElement type="title" />
                <SkeletonElement type="text" />
            </div>
        ))
    );

    if (error) {
        smartphonesContent = <p className='error'>{error}</p>;
        tabletsContent = <p className='error'>{error}</p>
    }

    if (products.length > 0) {
        smartphonesContent = (
            products.filter(product => product.category === 'smartphone').map((item) => (
                <ProductItem key={item._id}
                    item={item}
                />
            ))
        );

        tabletsContent = (
            products.filter(product => product.category === 'tablet').map((item) => (
                <ProductItem key={item._id}
                    item={item}
                />
            ))
        )
    }

    return (
		<section className='products-section'>
			<div className='card' style={{marginBottom: '40px'}}>
                <div className={classes['wrap-title']}>
					<h2 className={classes.title} id='smartphone'>
						Điện thoại nổi bật
					</h2>
					{/* <Filter products='smartphone' setFilterProducts={handleSetFilter}/> */}
				</div>
				<div className={classes['product-list']}>
					{smartphonesContent}
				</div>
			</div>
            <div className="card">
                <div className={classes['wrap-title']}>
					<h2 className={classes.title} id='tablet'>
						Tablet nổi bật
					</h2>
					{/* <Filter products='tablet'/> */}
				</div>
				<div className={classes['product-list']}>{tabletsContent}</div>
            </div>
		</section>
	);
}

export default Products;