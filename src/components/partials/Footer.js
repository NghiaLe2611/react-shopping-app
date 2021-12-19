import classes from '../../scss/Footer.module.scss';
import listSocialIcon from '../../assets/images/social-icon.jpg';

const Footer = () => {
    return (
        <div className={classes.footer}>
            <div className="container">
                <div className={classes['wrap-footer']}>
                    <ul className={classes.menu}>
                        <li><a href="/#">Giới thiệu công ty</a></li>
                        <li><a href="/#">Liên hệ</a></li>
                        <li><a href="/#">Hệ thống cửa hàng</a></li>
                        <li><a href="/#">Tin tuyển dụng</a></li>
                        <li><a href="/#">Tin khuyến mãi</a></li>
                        <li><a href="/#">Hướng dẫn mua online</a></li>
                        <li><a href="/#">Chính sách bảo hành</a></li>
                        <li><a href="/#">Chính sách trả góp</a></li>
                        <li><a href="/#">Chính sách đổi trả</a></li>
                    </ul>
                    <div className={classes.social}>
                        <a href="/#"><img src={listSocialIcon} alt="" /></a>
                    </div>
                </div>
            </div>
            <div className={classes.copyright}>&copy;Copyright React Mobile App 2021-Nghia Le</div>
        </div>
    )
};

export default Footer;