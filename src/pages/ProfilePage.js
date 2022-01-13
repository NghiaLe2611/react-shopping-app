import { Fragment, useState, useEffect } from 'react';
import { firebase } from '../firebase/config';
import 'firebase/compat/auth';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import classes from '../scss/Profile.module.scss';

const profileNav = [
    {
        icon: 'icon-user',
        link: '/tai-khoan',
        slug: 'tai-khoan',
        name: 'Thông tin tài khoản'
    },
    {
        icon: 'icon-cart',
        link: '/tai-khoan/don-hang',
        slug: 'don-hang',
        name: 'Quản lý đơn hàng'
    },
    {
        icon: 'icon-heart',
        link: '/tai-khoan/yeu-thich',
        slug: 'yeu-thich',
        name: 'Sản phẩm yêu thích'
    },
    {
        icon: 'icon-star-half',
        link: '/tai-khoan/nhan-xet',
        slug: 'nhan-xet',
        name: 'Nhận xét của tôi'
    }
];

const minYear = 1900;
const maxYear = new Date().getFullYear();

const ProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedMonth, setSelectedMonth] = useState(0);
    const [selectedYear, setSelectedYear] = useState(0);
    const [listDay, setListDay] = useState([]);

    const slug = location.pathname.split('/').pop();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const userData = useSelector(state => state.auth.userData);
    const { displayName, photoURL, id, email } = userData ? userData : {};
    console.log(isLoggedIn);
    
    const yearList = Array.from(Array(new Date().getFullYear() - 1899), (_, i) => (i + 1900).toString());

    useEffect(() => {
        if (parseInt(selectedMonth) !== 0 && parseInt(selectedYear) !== 0) {
            console.log(1, parseInt(selectedMonth), parseInt(selectedYear));
        }
    }, [selectedMonth, selectedYear]);

    const onChangeMonth = (e) => {
        console.log(e.target.value);
        setSelectedMonth(e.target.value);
    };

    const onChangeYear = (e) => {
        console.log(e.target.value);
        setSelectedYear(e.target.value);
    };

    let profileContent;

    switch (slug) {
        case 'don-hang': {
            profileContent = <p>Đơn hàng</p>
            break;
        }
        case 'yeu-thich': {
            profileContent = <p>Yêu thích</p>
            break;
        }
        case 'nhan-xet': {
            profileContent = <p>Nhận xét</p>
            break;
        }
        default: {
            profileContent = (
                <Fragment>
                    <h3>Thông tin tài khoản</h3>
                    <div className={classes.content}>
                        <form action="">
                            <div className={classes['input-group']}>
                                <label>Họ và tên</label>
                                <div className={classes['wrap-ip']}>
                                    <input type="text" placeholder='Họ tên'/>
                                </div>
                            </div>
                            <div className={classes['input-group']}>
                                <label>Email</label>
                                <div className={classes['wrap-ip']}>
                                    <p>{email}</p>
                                </div>
                            </div>
                            <div className={classes['input-group']}>
                                <label>Số điện thoại</label>
                                <div className={classes['wrap-ip']}>
                                    <input type="text" placeholder='Thêm số điện thoại' />
                                </div>
                            </div>
                            <div className={classes['input-group']}>
                                <label>Ngày sinh</label>
                                <div className={classes['wrap-ip']}>
                                    <select name='day' id='select-day'>
                                        <option value='0'>Ngày</option>
                                    </select>
                                    <select name='month' id='select-month' onChange={onChangeMonth}>
                                        <option value='0'>Tháng</option>
                                        {
                                            Array(12).fill().map((item, index) => (
                                                <option key={index + 1} value={index + 1}>{index + 1}</option>
                                            ))
                                        }
                                    </select>
                                    <select name='year' onChange={onChangeYear}>
                                        <option value='0'>Năm</option>
                                        {
                                        yearList.reverse().map(item => (
                                                <option key={item} value={item}>{item}</option>
                                        ))
                                        }
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                </Fragment>
            )
        }
    };

    return (
		userData && (
            <div className='container'>
                <div className={classes['wrap-profile']}>
                    <aside>
                        <div className={classes['wrap-avatar']}>
                            <div className={classes.avatar}>
                                {
                                    photoURL ? <img src={photoURL} alt='avatar' /> : <span className='icon-user'></span>
                                }
                            </div>
                            <span className={classes.username}>
                                {displayName ? displayName : email}
                            </span>
                        </div>
                        <ul className={classes['account-nav']}>
                            {
                                profileNav.map(item => (
                                    <li key={item.name} 
                                        className={`${item.slug === slug ? classes.active : ''}`}>
                                        <Link to={item.link}>
                                            <i className={item.icon}></i>{item.name}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </aside>
                    <div className={classes['wrap-profile-content']}>
                        {profileContent}
                    </div>
                </div>
            </div>
        )
	);
};

export default ProfilePage;