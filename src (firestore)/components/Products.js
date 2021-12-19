import { useState, useEffect, useCallback } from 'react';
// import { fetchProducts } from '../hooks/useHttp';
import ProductItem from './ProductItem';
import classes from '../scss/Products.module.scss';
import SkeletonElement from './UI/Skeleton';
import Filter from './Filter';
import { db } from '../firebase/config';

const Products = () => {

    const [smartphones, setSmartphones] = useState([]);
    const [filteredSmartphones, setFilteredSmartphones] = useState([]);

    const [tablets, setTablets] = useState([]);

    const getProducts = async () => {
        const products = [];
        db.collection('products').get()
            .then(snapshot => {
                snapshot.docs.forEach(doc => {
                    products.push(doc.data());
                });
            setSmartphones(prevProducts => prevProducts = products.filter(item => item.category === 'smartphone'));
            setTablets(prevProducts => prevProducts = products.filter(item => item.category === 'tablet'));
        });
    }

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        setFilteredSmartphones(prevProducts => prevProducts = smartphones);
    }, [smartphones]);

    const handleSetFilter = useCallback(async (action) => {
        console.log('ACTION', action);

        const filteredProducts = [];
        const productsRef = db.collection('products');
        let brandQueryRes = '';


        brandQueryRes = action.brandList.length ? 
            await productsRef.where('category', '==', 'smartphone').where('brand', 'in', action.brandList).get() :
            await productsRef.where('category', '==', 'smartphone').get();

        for (const q of [brandQueryRes]) {
            q.forEach(doc => {
                filteredProducts.push(doc.data());
                console.log(doc.data());
            });
        }

        setFilteredSmartphones(prevArr => filteredProducts);

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
        smartphonesContent = (
            filteredSmartphones.length !== 0  ? (
                filteredSmartphones.map((item) => (
                    <ProductItem key={item.id}
                        item={item}
                    />
                ))
            ) : <p className={classes['not-found']}>Rất tiếc, không tìm thấy sản phẩm phù hợp với lựa chọn của bạn</p>
        )
    }

    if (tablets.length > 0) {
        tabletsContent = tablets.map((item) => (
            <ProductItem key={item.id}
                item={item}
            />
        ))
    }

    return (
        <section>
            <div className="container">
                <div className={classes['wrap-title']}>
                    <h2 className={classes.title} id="smartphone">Điện thoại</h2>
                    <Filter products='smartphone' setFilterProducts={handleSetFilter}/>
                </div>
                <div className={classes['product-list']}>
                    {smartphonesContent}
                </div>
                <div className={classes['wrap-title']}>
                    <h2 className={classes.title} id="tablet">Máy tính bảng</h2>
                    {/* <Filter products='tablet'/> */}
                </div>
                <div className={classes['product-list']}>
                    {tabletsContent}
                </div>
            </div>
        </section>
        
    )
}

export default Products;