import { useState, useRef, useEffect } from "react";
import classes from '../scss/Filter.module.scss';
import { useLocation } from "react-router";

const Filter = (props) => {
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);
    const [sortBy, setSortBy] = useState(() => {
        const query = new URLSearchParams(location.search).get('sort');
        const name = query === 'priceAscending' ? 'Giá thấp' : query === 'priceDescending' ? 'Giá cao' : null;
        return name;
    });

    const componentRef = useRef();

    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
        function handleClick(e) {
            if(componentRef && componentRef.current){
                const ref = componentRef.current;
                
                if(!ref.contains(e.target)){
                    setShowDropdown(false);
                }
            }
        }
    }, [showDropdown]);

    const dropdownHandler = () => {
        setShowDropdown(val => !val);
    }

    const sortHandler = (e, val) => {
        props.setIsFiltering('sort');
        setSortBy(e.target.innerText);
        setShowDropdown(false);
        props.sortProducts(val);
    }

    const setViewHandler = (val) => {
        props.setViewProducts(val);
    }

    return (
        <div className={classes.filter}>
            {
                props.isMobile && (
                    <div className={classes['wrap-select']}>
                        <p className={classes['filter-txt']} onClick={props.showFilterSidebar}>Bộ lọc</p>
                    </div>
                )
            }
            <div className={`${classes['wrap-select']} ${showDropdown ? classes.selected : ''}`} ref={componentRef}>
                <p onClick={dropdownHandler}>{sortBy ? sortBy : 'Sắp xếp theo'}</p>
                <ul className={classes.list}>
                    <li onClick={(e) => sortHandler(e, -1)}>Bán chạy nhất</li>
                    <li onClick={(e) => sortHandler(e, 0)}>Giá thấp</li>
                    <li onClick={(e) => sortHandler(e, 1)}>Giá cao</li>
                </ul>
            </div>
            <div className={classes['wrap-filter']}>
                <span onClick={() => setViewHandler('GRID')} 
                    className={`icon-grid ${props.viewBy === 'GRID' ? classes.selected : ''}`}>
                </span>
                <span onClick={() => setViewHandler('LIST')} 
                    className={`icon-list ${props.viewBy === 'LIST' ? classes.selected : ''}`}>
                </span>
            </div>
        </div>
    )
}

export default Filter;