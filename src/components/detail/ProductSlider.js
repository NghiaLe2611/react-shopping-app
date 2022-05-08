import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import classes from '../../scss/ProductDetail.module.scss';

const ProductSlider = (props) => {
	const { product, setActiveModalTab } = props;
	const [activeTab, setActiveTab] = useState(0);
	const [tabContent, setTabContent] = useState([]);
	// const [activeModalTab, setActiveModalTab] = useState('');

	function SampleNextArrow(props) {
		const { className, style, onClick } = props;
		return (
			<button style={{ ...style }} onClick={onClick} 
				className={`${className} ${classes.arrow} ${classes.next}`}
			/>
		);
	};
	
	function SamplePrevArrow(props) {
		const { className, style, onClick } = props;
		return (
			<button style={{ ...style }} onClick={onClick}
				className={`${className} ${classes.arrow} ${classes.prev}`}
			/>
		);
	};

	const settings = {
		dots: false,
		infinite: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		className: classes['wrap-slider'],
		nextArrow: <SampleNextArrow/>,
		prevArrow: <SamplePrevArrow/>
	};

	const handleSelectThumbnail = (item, index) => {
		if (item) {
			setActiveTab(index + 1);
			const itemIndex = tabContent.findIndex(val => val.color === item.color);
			if (itemIndex < 0) {
				setTabContent(content => content = [...content, item]);
			}
		} else {
			setActiveTab(0);
		}
	};

	return (
		<div className={classes['wrap-product-img']}>
			<div className={`${classes.tab} ${activeTab === 0 ? classes.show : ''}`} id='tab-1'>
				{product.featureImgs.length >= 2 ? (
					<Slider {...settings}>
						{product.featureImgs.map((image, index) => (
							<div key={index} onClick={() => setActiveModalTab('highlight')}>
								<img src={image} alt='' />
							</div>
						))}
					</Slider>
				) : (
					<img src={product.featureImgs[0]} alt={product.name} onClick={() => setActiveModalTab('highlight')} />
				)}
			</div>
			{tabContent.length > 0 &&
				tabContent.map((item, index) => (
					<div key={item.color} className={`${classes.tab} ${activeTab === index + 1 ? classes.show : ''}`} id={`tab-${index + 2}`}>
						<Slider {...settings}>
							{item.images.map((image, index) => (
								<div key={index} onClick={() => setActiveModalTab(`color-${item.color}`)}>
									<img src={image} alt={product.name + '-' + item.color} />
								</div>
							))}
						</Slider>
					</div>
				))}
			<div className={classes['product-tab']}>
				{product.featureImgs && (
					<div className={`${classes.item} ${activeTab === 0 ? classes.selected : ''}`} onClick={() => handleSelectThumbnail()}>
						<div className={classes.img}>
							<span className={`${classes.icon} icon-star`}></span>
						</div>
						<span>Điểm nổi bật</span>
					</div>
				)}
				{product.variations &&
					product.variations.colors.length &&
					product.variations.colors.map((item, index) => (
						<div key={item.color} className={`${classes.item} ${activeTab === index + 1 ? classes.selected : ''}`} onClick={() => handleSelectThumbnail(item, index)}>
							<div className={classes.img}>
								<img src={item.thumbnail} alt={product.name + '-' + item.color} />
							</div>
							<span>{item.color}</span>
						</div>
					))}
			</div>
		</div>
	);
};

export default ProductSlider;
