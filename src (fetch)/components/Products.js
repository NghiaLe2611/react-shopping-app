import { useState, useEffect } from 'react';
import { fetchProducts } from '../hooks/useHttp';
import ProductItem from './ProductItem';
import classes from '../scss/Products.module.scss';
import SkeletonElement from './UI/Skeleton';
import Filter from './Filter';

const Products = () => {

    const [smartphones, setSmartphones] = useState([]);
    const [filteredSmartphones, setFilteredSmartphones] = useState([]);

    const [tablets, setTablets] = useState([]);

    useEffect(() => {
        // console.log('fetch smartphones');
        fetchProducts({
            url: 'smartphones.json' // ?orderBy="brand"&equalTo="Samsung"
        }, data => {
            if (data) {
                console.log(data);
                setSmartphones(prevProducts => prevProducts = data);
            }
        });
    }, []);

    useEffect(() => {
        // console.log('fetch tablets');
        fetchProducts({
            url: 'tablets.json'
        }, data => {
            if (data) {
                setTablets(prevProducts => prevProducts = data);
            }
        });
    }, []);

    useEffect(() => {
        setFilteredSmartphones(prevProducts => prevProducts = smartphones);
    }, [smartphones]);

    const handleSetFilter = (action) => {
        // console.log(action);
        // if (action.brandList.length) {
        //     setFilteredSmartphones(filteredArr => smartphones.filter(item => {
        //         return action.brandList.includes(item.brand);
        //     }));
        // } else {
        //     setFilteredSmartphones(smartphones);
        // } 

        function filterBrand(item) {
            return !action.brandList.length || action.brandList.includes(item.brand);
        }

        function filterOperation(item) {
            // return !action.operationList.length || action.operationList.includes(item.specs.os.split(" ")[0]); // filter array
            if (action.operation !== 'Khác') {
                return !action.operation || action.operation.includes(item.specs.os.split(" ")[0]);
            } else {
                let exceptionArr = action.osList.filter(os => os !== action.operation);
                return !action.operation || !exceptionArr.includes(item.specs.os.split(" ")[0]);
            }
        }

        function filterPrice(item) {
            if (action.price.type) {
                switch (action.price.type) {
                    case 1: 
                        return (item.price * 23000 <= 2000000)
                    case 2: 
                        return (item.price * 23000 >= 3000000 && item.price * 23000 <= 10000000)
                    case 3: 
                        return (item.price * 23000 >= 10000000 && item.price * 23000 <= 20000000)
                    case 4: 
                        return (item.price * 23000 > 20000000)
                    default: return;
                }
            } else {
                return item;
            }
        }

        let finalFilteredSmartphones = smartphones.filter(filterBrand).filter(filterOperation).filter(filterPrice);
        if (!action.brandList.length && !action.operation && !action.price.type) {
            finalFilteredSmartphones = smartphones;
        }

        setFilteredSmartphones(prevArr => finalFilteredSmartphones);
        
    };

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
                    <Filter products='smartphone' setFilter={handleSetFilter}/>
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