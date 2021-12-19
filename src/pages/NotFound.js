import classes from '../scss/NotFound.module.scss';
import NotFoundImage from '../assets/images/404.png';

const NotFound = () => {
	return (
		<div className={classes.content}>
			<div className='container'>
                <img src={NotFoundImage} alt="not-found" className={classes.img}/>
				<p>Xin lỗi, chúng tôi không tìm thấy trang mà bạn cần!</p>
				<a href='/'>Trở về trang chủ</a>
			</div>
		</div>
	);
};

export default NotFound;
