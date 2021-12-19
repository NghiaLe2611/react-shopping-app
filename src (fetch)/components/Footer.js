import classes from '../scss/Footer.module.scss';
import listSocialIcon from '../assets/social-icon.jpg';

const Footer = () => {
    return (
        <div className={classes.footer}>
            <div className="container">
                <div className={classes['wrap-footer']}>
                    <ul className={classes.menu}>
                        <li><a href="/#">Giới thiệu</a></li>
                        <li><a href="/#">Liên hệ</a></li>
                        <li><a href="/#">Chính sách bảo hành</a></li>
                    </ul>
                    <div className={classes.social}>
                        <a href="/#"><img src={listSocialIcon} alt="" /></a>
                    </div>
                </div>
            </div>
            <div className={classes.copyright}>&copy;Copyright Redux Shopping Cart 2021-Nghia Le</div>
        </div>
    )
};

export default Footer;