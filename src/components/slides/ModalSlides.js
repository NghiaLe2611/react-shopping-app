import { useState, useEffect, useRef, Fragment } from 'react'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import classes from '../../scss/ModalSlides.module.scss';
import '../../scss/SlickSlider.scss';
const ModalSlides = (props) => {
    const { name, featureImgs, images } = props;
    
    const [nav1, setNav1] = useState();
    const [nav2, setNav2] = useState();

    const settingsMainSlides = {
        dots: false,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow/>,
        prevArrow: <SamplePrevArrow/>
    };

    const settingsNavSlides = {
        dots: false,
        arrows: false,
        infinite: false,
        slidesToShow: 10,
        slidesToScroll: 1,
        focusOnSelect: true
    };

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


    return (
        <div className={classes['modal-slider']}>
            {
                featureImgs ? (
                    featureImgs.length >= 2 ? (
                        <Fragment>
                            <div className={classes['main-slider']}>
                                <Slider {...settingsMainSlides} asNavFor={nav2} ref={(slider1) => setNav1(slider1)}>
                                    {
                                        featureImgs.map((image, index) => (
                                            <div key={index}>
                                                <img src={image} alt=""/>
                                            </div>
                                        ))
                                    }
                                </Slider>
                            </div>
                        
                            <Slider {...settingsNavSlides} asNavFor={nav1} ref={(slider2) => setNav2(slider2)}
                                className={`${featureImgs.length <= 10 ? 'slick-no-slide nav-slides' : 'nav-slides'}`}
                            >
                                {
                                    featureImgs.map((image, index) => (
                                        <div key={index}>
                                            <img src={image} alt=""/>
                                        </div>
                                    ))
                                }
                            </Slider>
                        </Fragment>
                    ) : <img src={featureImgs[0]} alt={name} />
                ) : (
                    <Fragment>
                        <div className={classes['main-slider']}>
                            <Slider {...settingsMainSlides} asNavFor={nav2} ref={(slider1) => setNav1(slider1)}>
                                {
                                    images.map((image, index) => (
                                        <div key={index}>
                                            <img src={image} alt=""/>
                                        </div>
                                    ))
                                }
                            </Slider>
                        </div>
                        
                        <Slider {...settingsNavSlides} asNavFor={nav1} ref={(slider2) => setNav2(slider2)}
                            className={`${images.length <= 10 ? 'slick-no-slide nav-slides' : 'nav-slides'}`}
                        >
                            {
                                images.map((image, index) => (
                                    <div key={index}>
                                        <img src={image} alt=""/>
                                    </div>
                                ))
                            }
                        </Slider>
                    </Fragment>
                )
            }
        </div>
    )
}

export default ModalSlides;