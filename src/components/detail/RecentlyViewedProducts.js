import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import classes from '../../scss/RecentlyViewedProducts.module.scss';
import { convertProductLink, formatCurrency } from '../../helpers/helpers';



const RecentlyViewedProducts = (props) => {
    const { data } = props;

    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <button
                className={`${className} ${classes.arrow} ${classes.next}`}
                style={{ ...style }}
                onClick={onClick}
            />
        );
    }
    
    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <button
                className={`${className} ${classes.arrow} ${classes.prev}`}
                style={{ ...style }}
                onClick={onClick}
            />
        );
    }

    const settings = {
        dots: false,
        slidesToShow: 5,
        slidesToScroll: 5,
        arrow: true,
        className: classes['recently-products'],
        infinite: false,
        nextArrow: <SampleNextArrow/>,
        prevArrow: <SamplePrevArrow/>,
        responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				},
			},
		]
    };

    return (
        <div className={classes['wrap-recently-products']}>
            <h4 className={classes.title}>Sản Phẩm Bạn Đã Xem</h4>
            <Slider {...settings}>
                {
                    data.map((item) => (
                        <div key={item._id} className={classes.item}>
                            <a href={`/${item.category === 'smartphone' ? 'dien-thoai' : 'may-tinh-bang'}/${convertProductLink(item.name)}`}>
                                <div className={classes.img}>
                                    <img src={item.img} alt={item.name} />
                                </div>
                                <h3 className={classes.name}>{item.name}</h3>
                                <div className={classes.rating}></div>
                                {
                                    item.sale ? 
                                        <p className={`${classes.price} ${classes.discount}`}>
                                            {formatCurrency(item.price - item.sale)} ₫
                                            <span className={classes.percent}>
                                                {Math.round(item.sale*100/item.price)}%
                                            </span>
                                        </p> : 
                                        <p className={classes.price}>{formatCurrency(item.price)} ₫</p>
                                    
                                }
                            </a>
                        </div>
                    ))
                }
            </Slider>
        </div>
    )
};

export default RecentlyViewedProducts;