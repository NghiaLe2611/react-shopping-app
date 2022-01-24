
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { capitalizeFirstLetter, convertProductLink, removeAccents } from '../helpers/helpers';
import useFetch from '../hooks/useFetch';
import classes from '../scss/FilterSidebar.module.scss';

const priceList = [
    "Dưới 2 triệu", "Từ 2-5 triệu", "Từ 5-10 triệu", "Từ 10-20 triệu", "Trên 20 triệu"
];

const batteryList = [
    "Dưới 3000 mah", "Từ 3000-4000 mah", "Trên 4000 mah"
];

const FilterSidebar = (props) => {
    const navigate = useNavigate();
    
    const { filter, setFilter, category } = props;
    const [brandList, setBrandList] = useState([]);
    const [queryUrl, setQueryUrl] = useState('');
    const { fetchData: fetchBrandList } = useFetch();
      
    useEffect(() => {
        if (category) {
            fetchBrandList({
                url: `${process.env.REACT_APP_API_URL}/getBrandList?category=${category}`
            }, data => {
                if (data) {
                    setBrandList(data);
                }
            });
        }
    }, [category, fetchBrandList]);

    useEffect(() => {
        const params = new URLSearchParams(queryUrl);
        if (filter.sort !== null) {
            if (queryUrl.includes('?')) {
                if (params.has('sort')) {
                    params.delete('sort');
                    params.append('sort', filter.sort);
                    setQueryUrl(`?${params.toString()}`);
                } else {
                    params.append('sort', filter.sort);
                    setQueryUrl(`?${params.toString()}`);
                }
            } else {
                setQueryUrl(`?sort=${filter.sort}`);
            }
        } else {
            params.delete('sort');
            setQueryUrl('?' + params.toString());
        }
    }, [filter.sort]);

    useEffect(() => {
        const params = new URLSearchParams(queryUrl);
        if (filter.brand !== 'all') {
            if (queryUrl.includes('?')) {
                if (params.has('hang-san-xuat')) {
                    params.delete('hang-san-xuat');
                    params.append('hang-san-xuat', filter.brand.toString());
                    setQueryUrl(`?${params.toString()}`);
                } else {
                    params.append('hang-san-xuat', filter.brand.toString());
                    setQueryUrl(`?${params.toString()}`);
                }
            } else {
                setQueryUrl(`?hang-san-xuat=${filter.brand.toString()}`);
            }
        } else {
            params.delete('hang-san-xuat');
            setQueryUrl('?' + params.toString());
        }
    }, [filter.brand]);

    useEffect(() => {
        const params = new URLSearchParams(queryUrl);
        if (filter.price !== 'all') {
            if (queryUrl.includes('?')) {
                if (params.has('gia')) {
                    params.delete('gia');
                    params.append('gia', filter.price.toString());
                    setQueryUrl(`?${params.toString()}`);
                } else {
                    params.append('gia', filter.price.toString());
                    setQueryUrl(`?${params.toString()}`);
                }
            } else {
                setQueryUrl(`?gia=${filter.price.toString()}`);
            }
        } else {
            params.delete('gia');
            setQueryUrl('?' + params.toString());
        }
    }, [filter.price]);

    useEffect(() => {
        const params = new URLSearchParams(queryUrl);
        if (filter.battery !== 'all') {
            if (queryUrl.includes('?')) {
                if (params.has('pin')) {
                    params.delete('pin');
                    params.append('pin', filter.battery.toString());
                    setQueryUrl(`?${params.toString()}`);
                } else {
                    params.append('pin', filter.battery.toString());
                    setQueryUrl(`?${params.toString()}`);
                }
            } else {
                setQueryUrl(`?pin=${filter.battery.toString()}`); 
            }
        } else {
            const params = new URLSearchParams(queryUrl);
            params.delete('pin');
            setQueryUrl('?' + params.toString());
        }
    }, [filter.battery]);

    useEffect(() => {
        navigate(queryUrl);
    }, [queryUrl, navigate]);

    const filterHandler = (type, e) => {
        const value = e.target.value;
        if (e.target.checked) {
            if (filter[type] === 'all') {
                setFilter({...filter, [type]: [...[], value]});
            } else {
                if (value === 'all') {
                    setFilter({...filter, [type]: 'all'});
                } else {
                    setFilter({...filter, [type]: [...filter[type], value]});
                }
            }
        } else {
            if (value !== 'all') {
                const array = [...filter[type]]; 
                const index = filter[type].indexOf(value);
                if (index !== -1) {
                    array.splice(index, 1);
                    if (filter[type].length === 1) {
                        setFilter({...filter, [type]: 'all'});
                    } else {
                        setFilter({...filter, [type]: array});
                    }
                }
            } 
        }
    };

    const filterByBrand = (e) => {
        props.setIsFiltering('brand');
        filterHandler('brand', e);
    };

    const filterByPrice = (e) => {
        props.setIsFiltering('price');
        filterHandler('price', e);
    };
    
    const filterByBattery = (e) => {
        props.setIsFiltering('battery');
        filterHandler('battery', e);
    };

    return (
        <div className={classes['wrap-sidebar']}>
            <div className={classes['filter-box']}>
                <p className={classes['filter-title']}>Hãng sản xuất</p>
                <ul className={classes['filter-list']}>
                    <li className={classes.col}>
                        <label className={classes.checkbox}>
                            <input type="checkbox" checked={filter.brand === 'all' ? true : false} onChange={filterByBrand} value="all" />
                            <span className={classes.checkmark}></span>Tất cả
                        </label>
                    </li>
                    {
                        brandList.length > 0 && (
                            brandList.map(item => (
                                <li key={item} className={classes.col}>
                                    <label className={classes.checkbox}>
                                        <input type="checkbox" checked={filter.brand.includes(item)} onChange={filterByBrand} value={item}/>
                                        <span className={classes.checkmark}></span>{capitalizeFirstLetter(item)}
                                    </label>
                                </li>
                            ))
                        )
                    }
                </ul>
            </div>
            <div className={classes['filter-box']}>
                <p className={classes['filter-title']}>Giá</p>
                <ul className={classes['filter-list']}>
                    <li>
                        <label className={classes.checkbox}>
                            <input type="checkbox" checked={filter.price === 'all' ? true : false} onChange={filterByPrice} value="all"/>
                            <span className={classes.checkmark}></span>Tất cả
                        </label>
                    </li>
                    {
                        priceList.map(item => (
                            <li key={item}>
                                <label className={classes.checkbox}>
                                    <input type="checkbox" checked={filter.price.includes(removeAccents(convertProductLink(item)))}
                                        onChange={filterByPrice} value={removeAccents(convertProductLink(item))}/>
                                    <span className={classes.checkmark}></span>{item}
                                </label>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className={classes['filter-box']}>
                <p className={classes['filter-title']}>Dung lượng pin</p>
                <ul className={classes['filter-list']}>
                    <li>
                        <label className={classes.checkbox}>
                            <input type="checkbox" checked={filter.battery === 'all' ? true : false} onChange={filterByBattery} value="all"/>
                            <span className={classes.checkmark}></span>Tất cả
                        </label>
                    </li>
                    {
                        batteryList.map(item => (
                            <li key={item}>
                                <label className={classes.checkbox}>
                                    <input type="checkbox" checked={filter.battery.includes(removeAccents(convertProductLink(item)))}
                                        onChange={filterByBattery} value={removeAccents(convertProductLink(item))}/>
                                    <span className={classes.checkmark}></span>{item}
                                </label>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}

export default FilterSidebar;