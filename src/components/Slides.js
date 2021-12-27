import { useState } from 'react';
import Slider from 'react-slick';
import classes from '../scss/Slides.module.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../scss/SlickSlider.scss';
import useCheckMobile from '../hooks/useCheckMobile';

const Slides = (props) => {
    const { slides, subSlides, full } = props;
    
    const [nav1, setNav1] = useState();
    const [nav2, setNav2] = useState();
    const { isMobile } = useCheckMobile();

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
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        className: classes.slides,
        nextArrow: <SampleNextArrow/>,
        prevArrow: <SamplePrevArrow/>
    };
    
    const mainSlides = (
        slides.map((img, index) => (
            <div key={index} className={classes.item}>
                <a href="/#">
                    <img src={img.url} alt="" 
                        onError={(e)=>{e.target.onError = null; e.target.src=`https://dummyimage.com/1200x300/000/fff`}}
                    />
                </a>
            </div>
        ))
    );

    const navSlides = (
        slides.map((img, index) => (
            img.desc ? (
                    <div key={index} className={classes.item}>
                    <p dangerouslySetInnerHTML={{ __html: img.desc }} />
                </div>
            ) : null
        ))
    );

    return (
        <section className={classes['slides-section']}>
            <div className={classes['slides-content']}>
                <div className={`${classes['wrap-slides']} ${full ? classes.full : ''}`}>
                    <Slider {...settings} asNavFor={nav2} ref={(slider1) => setNav1(slider1)} dots={full ? true : false}>
                        {mainSlides}
                    </Slider>
                    {
                        !isMobile ? (
                            slides && (
                                <Slider
                                    asNavFor={nav1}
                                    ref={(slider2) => setNav2(slider2)}
                                    slidesToShow={5}
                                    swipeToSlide={true}
                                    focusOnSelect={true}
                                    className={`${classes['nav-slides']} nav-slick`}
                                >
                                    {navSlides}
                                </Slider>
                            )
                        ) : null
                    }
                </div>
                
                { 
                    !isMobile ? (
                        subSlides && (
                            <div className={classes['sub-slides']}>
                                {
                                    subSlides.map((img, index) => (
                                        <div key={index} className={classes.item}>
                                            <a href="/#">
                                                <img src={img.url} alt="" />
                                            </a>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    ) : null
                }
            </div>
        </section>
    )
}

export default Slides;