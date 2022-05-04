import useCheckMobile from '../../hooks/useCheckMobile';
import classes from '../../scss/Footer.module.scss';

const Footer = (props) => {
    const {mobileView} = props;
    const {isMobile} = useCheckMobile();

    const footerContent = (
        <div className={classes.footer}>
            <div className='container'>
                <div className={classes['wrap-footer']}>
                    <div className={classes['footer-block']}>
                        <h5>Hỗ trợ khách hàng</h5>
                        <ul className={classes.menu}>
                            <li>
                                <a href='/#'>Trung tâm trợ giúp</a>
                            </li>
                            <li>
                                <a href='/#'>Hướng dẫn mua online</a>
                            </li>
                            <li>
                                <a href='/#'>Phương thức vận chuyển</a>
                            </li>
                            <li>
                                <a href='/#'>Chính sách bảo hành</a>
                            </li>
                            <li>
                                <a href='/#'>Chính sách trả góp</a>
                            </li>
                            <li>
                                <a href='/#'>Chính sách đổi trả</a>
                            </li>
                        </ul>
                    </div>
                    <div className={classes['footer-block']}>
                        <h5>Về cửa hàng</h5>
                        <ul className={classes.menu}>
                            <li>
                                <a href='/#'>Giới thiệu công ty</a>
                            </li>
                            <li>
                                <a href='/#'>Liên hệ</a>
                            </li>
                            <li>
                                <a href='/#'>Hệ thống cửa hàng</a>
                            </li>
                            <li>
                                <a href='/#'>Tin tuyển dụng</a>
                            </li>
                            <li>
                                <a href='/#'>Tin khuyến mãi</a>
                            </li>
                        </ul>
                    </div>
                    <div className={classes['footer-block']}>
                        <h5>Phương thức thanh toán</h5>
                        <ul className={`${classes.menu} ${classes.payment}`}>
                            <li></li>
                            <li className={classes['payment-02']}></li>
                            <li className={classes['payment-03']}></li>
                            <li className={classes['payment-04']}></li>
                            <li className={classes['payment-05']}></li>
                            <li className={classes['payment-06']}></li>
                            <li className={classes['payment-07']}></li>
                            <li className={classes['payment-08']}></li>
                            <li className={classes['payment-09']}></li>
                        </ul>
                    </div>
                    <div className={classes['footer-block']}>
                        <h5>Kết nối với chúng tôi</h5>
                        <ul className={`${classes.menu} ${classes.social}`}>
                            <li>
                                <a rel='noreferrer' href='https://www.facebook.com/' title='Facebook'></a>
                            </li>
                            <li>
                                <a rel='noreferrer' href='https://www.youtube.com/' title='Youtube'></a>
                            </li>
                            <li>
                                <a rel='noreferrer' href='https://www.instagram.com/' title='Instagram'></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={classes.bottom}>
                <p>Địa chỉ: Tầng 4, Tòa nhà ABC, số 664 đường Nguyễn Đình Chiểu, Phường 3, Quận 3, Thành phố Hồ Chí Minh, Việt Nam. Tổng đài hỗ trợ: 12345678 - Email: cskh@hotro.shopping.vn</p>
                <p>&copy;Copyright React Mobile App 2021-Nghia Le</p>
            </div>
        </div>
    );
    return (
		!mobileView ? footerContent : (
            !isMobile ? footerContent : null
        )
	);
};

export default Footer;