import { useState, useEffect, useRef } from 'react';
import classes from '../scss/Filter.module.scss';
import iconFilter from '../assets/icon-filter.svg';
import logoIphone from '../assets/logo-iphone.png';
import logoSamsung from '../assets/logo-samsung.png';
import logoXiaomi from '../assets/logo-xiaomi.png';
import logoSony from '../assets/logo-sony.png';
import logoNokia from '../assets/logo-nokia.jpg';
import logoOppo from '../assets/logo-oppo.jpg';

import { useStateCallback } from '../hooks/useStateCallback';

const brandSmartphone = [
    {
        brand: 'Apple',
        image: logoIphone
    },
    {
        brand: 'Samsung',
        image: logoSamsung
    },
    {
        brand: 'Sony',
        image: logoSony
    },
    {
        brand: 'Xiaomi',
        image: logoXiaomi
    },
    {
        brand: 'Nokia',
        image: logoNokia
    },
    {
        brand: 'Oppo',
        image: logoOppo
    }
];

const brandTablet = [
    {
        brand: 'Apple',
        image: logoIphone
    },
    {
        brand: 'Samsung',
        image: logoSamsung
    }
];

const osList = [
    'Android', 'iOS', 'Khác'
];

const Filter = (props) => {
    const { setFilterProducts } = props;

    const [filter, setFilter] = useStateCallback({
        brandList: [],
        os: null,
        price: {}
    });
    const [activeFilter, setActiveFilter] = useState(null);

    const componentRef = useRef();

    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
        function handleClick(e) {
            if(componentRef && componentRef.current){
                const ref = componentRef.current;
                
                if(!ref.contains(e.target)){
                    setActiveFilter(null);
                }
            }
        }
    }, [filter]);
    
    // useEffect(() => {
    //     setFilterProducts({
    //         brandList: filter.brand,
    //         operation: filter.os,
    //         osList,
    //         price: filter.price
    //     });

    //     // setFilterProducts({
    //     //     filter,
    //     //     osList
    //     // });
    // }, [setFilterProducts, filter]);

    const showFilter = (filterName) => {
        setActiveFilter(filterName);
    };

    const handleFilterBrand = (e, brandName) => {
        e.preventDefault();

        setFilter(obj => 
            obj = filter.brandList.includes(brandName) ? 
                {...obj, brandList: obj.brandList.filter(item => item !== brandName)} : 
                {...obj, brandList: [...obj.brandList, brandName]},
                filterData => {
                    setFilterProducts({
                        brandList: filterData.brandList,
                        operation: filter.os,
                        osList,
                        price: filter.price
                    })
                }
        );
        
        setActiveFilter(null);
       
    };

    const handleFilterOs = (e, operation) => {
        e.preventDefault();

        // if (filter.os.includes(operation)) {
        //     setFilter(arr => arr = {...arr, os: arr.os.filter(item => item !== operation)});
        // } else {
        //     setFilter(arr => arr = {...arr, os: [...arr.os, operation]});
        // }

        if (filter.os === operation) {
            setFilter(arr => arr = {...arr, os: null});
        } else {
            setFilter(arr => arr = {...arr, os: operation});
        }
        
        setActiveFilter(null);
    };

    const handleFilterPrice = (e, type) => {
        e.preventDefault();
        if (filter.price.type === type) {
            setFilter(obj => obj = {...obj, price: {}});
        } else {
            setFilter(obj => obj = {...obj, price: {
                label: e.target.textContent,
                type: type
            }});
        }

        setActiveFilter(null);
    };

    const filterStyle = (filterName) => {
        return {
            opacity: activeFilter === filterName ? 1 : 0,
            visibility: activeFilter === filterName ? 'visible' : 'hidden',
            transition: "all 0.2s ease"
        }
    };

    const filterClassCriteria = (filterName) => {
        switch (filterName) {
            case 'brand': 
                return {
                    borderColor: filter.brandList.length || activeFilter === filterName ? '#ee4d2d' : ''
                }
            case 'os': 
                return {
                    borderColor: filter.os || activeFilter === filterName ? '#ee4d2d' : ''
                }
            case 'price': 
                return {
                    borderColor: filter.price.type || activeFilter === filterName ? '#ee4d2d' : ''
                }
            default:
                return;
        }
    };

    let filterBrandContent, filterOsContent;

    if (props.products === 'smartphone') {
        filterBrandContent = (
            <ul className={`${classes['filter-list']} ${classes['list-img']}`}>
                {
                    brandSmartphone.map((item) => (
                        <li key={item.brand} className={filter.brandList.includes(item.brand) ? classes.active : ''}>
                            <a href="/#" onClick={(e) => handleFilterBrand(e, item.brand)}>
                                <img src={item.image} alt={`Logo-${item.brand}`} />
                            </a>
                        </li>
                    ))
                }
            </ul>
        );

        filterOsContent = (
            <ul className={classes['filter-list']}>
                {
                    osList.map((item) => (
                        <li key={item} className={filter.os === item ? classes.active : ''}>
                            <a href="/#" onClick={(e) => handleFilterOs(e, item)}>{item}</a>
                        </li>
                    ))
                }
            </ul>
        );

    } else if (props.products === 'tablet') {
        filterBrandContent = (
            <ul className={`${classes['filter-list']} ${classes['list-img']}`}>
                {
                    brandTablet.map((item) => (
                        <li key={item.brandList}>'
                            <a href="/#">
                                <img src={item.image} alt={`Logo-${item.brandList}`} />
                            </a>
                        </li>
                    ))
                }
            </ul>
        )
    }

    return (
        <div className={classes.filter} ref={componentRef}>
            <span className={classes.icon}>
                <img src={iconFilter} alt="" />
            </span>
            <div className={classes['filter-item']}>
                <span className={classes.name} style={filterClassCriteria('brand')} onClick={() => showFilter('brand')}>
                    { !filter.brandList.length && 'Hãng' }
                    { filter.brandList.length === 1 && filter.brandList[0]}
                    { filter.brandList.length > 1 && `${filter.brandList[0]},...`}
                </span>
                <div className={classes['filter-show']} style={filterStyle('brand')}>
                    {filterBrandContent}
                </div>
            </div>
            <div className={classes['filter-item']}>
                <span className={classes.name} style={filterClassCriteria('os')} onClick={() => showFilter('os')}>
                    { !filter.os ? 'Hệ điều hành' : filter.os }
                </span>
                <div className={classes['filter-show']} style={filterStyle('os')}>
                    {filterOsContent}
                </div>
            </div>
            <div className={classes['filter-item']}>
                <span className={classes.name} style={filterClassCriteria('price')} onClick={() => showFilter('price')}>
                    { !filter.price.type ? 'Giá' : filter.price.label }
                </span>
                <div className={classes['filter-show']} style={filterStyle('price')}>
                    <ul className={classes['filter-list']}>
                        <li className={filter.price.type === 1 ? classes.active : ''}>
                            <a href="/#" onClick={(e) => handleFilterPrice(e, 1)}>Dưới 2 triệu</a>
                        </li>
                        <li className={filter.price.type === 2 ? classes.active : ''}>
                            <a href="/#" onClick={(e) => handleFilterPrice(e, 2)}>Từ 3-10 triệu</a>
                        </li>
                        <li className={filter.price.type === 3 ? classes.active : ''}>
                            <a href="/#" onClick={(e) => handleFilterPrice(e, 3)}>Từ 10-20 triệu</a>
                        </li>
                        <li className={filter.price.type === 4 ? classes.active : ''}>
                            <a href="/#" onClick={(e) => handleFilterPrice(e, 4)}>Trên 20 triệu</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Filter;