import { useState, useEffect, useRef, Fragment } from 'react';
import { useLocation } from 'react-router';
import useFetch from '../hooks/useFetch';
import iconAdd from '../assets/images/icon-add.png';
import { convertProductLink, capitalizeFirstLetter, formatCurrency } from '../helpers/helpers';
import CompareModalWrapper from '../components/UI/CompareModalWrapper';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import classes from '../scss/Compare.module.scss';

const ComparePage = () => {
	const location = useLocation();

    const { isLoading, error, fetchData: fetchProducts } = useFetch();
    const [arrayId, setArrayId] = useState([]);
    const [listCompare, setListCompare] = useState([]);
    const [isComparing, setIsComparing] = useState(false);
    const compareModalRef = useRef();

	useEffect(() => {
        const query = new URLSearchParams(location.search);
        let array = [];
        
        for (const param of query) {
            if (param[0] === 'id') {
                array.push(param[1]);
                setArrayId(array);
            }
        }
    }, [location]);

    useEffect(() => {
        const list = [...listCompare];
        
		if (arrayId.length > 0) {
            for (const val of arrayId) {
                fetchProducts({ 
                    url: `${process.env.REACT_APP_API_URL}/product/` + val
                }, data => {
                        if (data) {
                            const found = list.findIndex(val => val._id === data._id);
                            if (found < 0) {
                                setListCompare(arr => [...arr, data] ); 
                            }                            
                        }
                    }
                );
            } 
		}
	}, [fetchProducts, arrayId]);

    const addToCompare = () => {
        compareModalRef.current.addToCompare();
    };

    const addItemToCompare = (product) => {
        setIsComparing(true);
        compareModalRef.current.addItemToCompare(product);
    };

	return (
        <Fragment>
            <div className='container' style={{marginTop: 30}}>
                <div className="card">
                    <h2>So Sánh</h2>
                    {isLoading && <LoadingIndicator/>}
                    {
                        !isLoading && !error && listCompare.length > 0 ? (
                            <div className={classes['wrap-compare']}>
                                <ul className={classes.list}>
                                    {
                                        Array(3).fill().map((item, index) => (
                                            listCompare[index] ? (
                                                <li key={listCompare[index]._id}>
                                                    <a href={`${listCompare[index].category === 'smartphone' ? '/dien-thoai/' : 
                                                        listCompare[index].category === 'tablet' ? '/may-tinh-bang/' : ''}${convertProductLink(listCompare[index].name)}`}
                                                        onClick={(e) => console.log(e)}
                                                    >
                                                        <div className={classes.img}>
                                                            <img src={listCompare[index].img} alt="" />
                                                            
                                                        </div>
                                                        <h3 className={classes.name}>{capitalizeFirstLetter(listCompare[index].name)}</h3>
                                                        {
                                                            listCompare[index].sale ? (
                                                                <Fragment>
                                                                    <p className={classes.price}>
                                                                        <span>{formatCurrency(listCompare[index].price)}₫</span>
                                                                        {formatCurrency(listCompare[index].price - listCompare[index].sale)}₫     
                                                                    </p>
                                                                </Fragment>
                                                            ) : <p className={classes.price}>{formatCurrency(listCompare[index].price)}₫</p>
                                                        }
                                                    </a>
                                                </li>
                                            ) : (
                                                <li key={index} onClick={addToCompare}>
                                                    <div className={classes.add}>
                                                        <img src={iconAdd} alt="" />
                                                        <span>Thêm sản phẩm so sánh</span>
                                                    </div>
                                                </li>
                                            )
                                        ))
                                    }
                                </ul>
                                <div className={classes['compare-table']}>
                                    <div className={classes['compare-row']}>
                                        <div className={classes['stats-overview']}>MÀN HÌNH</div>
                                        <div className={classes['stats-content']}>
                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Công nghệ màn hình</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.display.type}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                                
                                            </div>

                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Độ phân giải</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.display.resolution}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                            </div>

                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Màn hình rộng</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.display.size}"</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                            </div>

                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Mặt kính cảm ứng</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.display.glass ? listCompare[index].specs.display.glass : '-'}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                            </div>
                                
                                        </div>
                                    </div>  
                                    <div className={classes['compare-row']}>
                                        <div className={classes['stats-overview']}>HỆ ĐIỀU HÀNH & CPU</div>
                                        <div className={classes['stats-content']}>
                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Hệ điều hành</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.platform.os}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                                
                                            </div>

                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Chip xử lý (CPU)</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.platform.chip}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                            </div>

                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Tốc độ CPU</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.platform.cpu}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                            </div>

                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Chip đồ họa (GPU)</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.platform.gpu}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                            </div>
                                
                                        </div>
                                    </div>          
                                    <div className={classes['compare-row']}>
                                        <div className={classes['stats-overview']}>BỘ NHỚ & LƯU TRỮ</div>
                                        <div className={classes['stats-content']}>
                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Ram</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.memory.ram} GB</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                                
                                            </div>

                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Bộ nhớ trong</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                            <p>{listCompare[index].specs.memory.rom} GB</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                            </div>

                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Thẻ nhớ</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.memory.card_slot}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes['compare-row']}>
                                        <div className={classes['stats-overview']}>CAMERA CHÍNH</div>
                                        <div className={classes['stats-content']}>
                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Độ phân giải</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.camera.back.resolution}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                                
                                            </div>

                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Tính năng</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                            <p className={classes['list-specs']}>
                                                                {
                                                                        listCompare[index].specs.camera.back.features ? 
                                                                        listCompare[index].specs.camera.back.features.map(item => (
                                                                            <span key={item}>{item}</span>
                                                                        )) : '-'
                                                                    }
                                                            </p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                            </div>

                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Video</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.camera.back.video ? listCompare[index].specs.camera.back.video : '-'}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes['compare-row']}>
                                        <div className={classes['stats-overview']}>CAMERA PHỤ</div>
                                        <div className={classes['stats-content']}>
                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Độ phân giải</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.camera.front.resolution}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                                
                                            </div>

                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Tính năng</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                            <p className={classes['list-specs']}>
                                                                {
                                                                        listCompare[index].specs.camera.front.features ? 
                                                                        listCompare[index].specs.camera.front.features.map(item => (
                                                                            <span key={item}>{item}</span>
                                                                        )) : '-'
                                                                    }
                                                            </p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes['compare-row']}>
                                        <div className={classes['stats-overview']}>KẾT NỐI</div>
                                        <div className={classes['stats-content']}>
                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Wifi</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.connectivity.wifi}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                                
                                            </div>
                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Bluetooth</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                            <p>{listCompare[index].specs.connectivity.bluetooth}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                            </div>
                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>USB</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.connectivity.usb}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                            </div>
                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Jack tai nghe</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.connectivity.audio ? listCompare[index].specs.connectivity.audio : '-'}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                            </div>
                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Radio</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.connectivity.radio}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes['compare-row']}>
                                        <div className={classes['stats-overview']}>THÔNG TIN CHUNG</div>
                                        <div className={classes['stats-content']}>
                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Kích thước</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.body.dimensions}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                                
                                            </div>
                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Khối lượng</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.body.weight}g</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                                
                                            </div>
                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>SIM</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.sim}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                                
                                            </div>
                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Pin</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].specs.pin} mAH</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                                
                                            </div>
                                            <div className={classes['stats-row']}>
                                                <div className={classes.lbl}>Ngày ra mắt</div>
                                                {
                                                    Array(3).fill().map((item ,index) => (
                                                        listCompare[index] ? (
                                                            <div key={listCompare[index]._id} className={classes.stat}>
                                                                <p>{listCompare[index].released}</p>
                                                            </div>
                                                        ) : (
                                                            <div key={index} className={classes.stat}></div>
                                                        )
                                                    ))
                                                }
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null
                    }
                </div>
            </div>
            
            <CompareModalWrapper ref={compareModalRef} listCompare={listCompare}
                addItemToCompare={addItemToCompare} 
                isComparing={isComparing} 
                setIsComparing={setIsComparing}
            />
        </Fragment>
    );
};

export default ComparePage;
