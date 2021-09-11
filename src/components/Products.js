import { useState, useEffect } from 'react';
import { fetchProducts } from '../hooks/useHttp';
import ProductItem from './ProductItem';
import classes from '../scss/Products.module.scss';
import SkeletonElement from './UI/Skeleton';

const Products = () => {

    const [smartphones, setSmartphones] = useState([]);
    const [tablets, setTablets] = useState([]);

    useEffect(() => {
        console.log('fetch smartphones');
        fetchProducts({
            url: 'smartphones.json'
        }, data => {
            if (data) {
                setSmartphones(prevProducts => prevProducts = data);
            }
        })
    }, []);

    useEffect(() => {
        console.log('fetch tablets');
        fetchProducts({
            url: 'tablets.json'
        }, data => {
            if (data) {
                setTablets(prevProducts => prevProducts = data);
            }
        })
    }, []);

    let smartphonesContent = [1,2,3,4,5].map((item, index) => (
        <div key={index} className={`${classes['item']} ${classes['product-item']}`}>
            <SkeletonElement type="image" />
            <SkeletonElement type="title" />
            <SkeletonElement type="text" />
        </div>
    ));

    let tabletsContent = [1,2,3,4,5].map((item, index) => (
        <div key={index} className={`${classes['item']} ${classes['product-item']}`}>
            <SkeletonElement type="image" />
            <SkeletonElement type="title" />
            <SkeletonElement type="text" />
        </div>
    ));

    if (smartphones.length > 0) {
        smartphonesContent = smartphones.map((item, index) => (
            <ProductItem key={item.id}
                // index={index}
                id={item.id}
                name={item.name}
                price={item.price}
                img={item.img}
                colors={item.colors}
            />
        ))
    }

    if (tablets.length > 0) {
        tabletsContent = tablets.map((item, index) => (
            <ProductItem key={item.id}
                // index={index}
                id={item.id}
                name={item.name}
                price={item.price}
                img={item.img}
                colors={item.colors}
            />
        ))
    }

    return (
        <section>
            <div className="container">
                <h2 className={classes.title} id="smartphone">Điện thoại</h2>
                <div className={classes['product-list']}>
                    {smartphonesContent}
                </div>
                <h2 className={classes.title} id="tablet">Máy tính bảng</h2>
                <div className={classes['product-list']}>
                    {tabletsContent}
                </div>
            </div>
        </section>
        
    )
}

export default Products;