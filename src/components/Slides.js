import { useState } from 'react';
import Slider from 'react-slick';
import classes from '../scss/Slides.module.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../scss/SlickSlider.scss';
import { useCheckMobile } from '../hooks/useCheckMobile';

const slides = [
    {
        url: "images/slide1.jpg",
        desc: "Mua iPhone 13 Pro <br/>Giảm Đến 1,5 Triệu"
    },
    {
        url: "images/slide2.jpg",
        desc: "Galaxy Z Fold3 | Flip3 5G <br/>Ưu Đãi Đặc Quyền"
    },
    {
        url: "images/slide3.jpg",
        desc: "Xiaomi 11T 5G <br/>Trả Góp 0%"
    },
    {
        url: "images/slide4.jpg",
        desc: "OPPO Reno6 Series 5G <br/>Giá Từ 9.490.000đ"
    },
    {
        url: "images/slide5.jpg",
        desc: "Apple Watch S6 <br/>Giảm đến 15%"
    }
];

const subSlides = [
    {
        url: "images/subslide1.jpg"
    },
    {
        url: "images/subslide2.jpg"
    },
    {
        url: "images/subslide3.jpg"
    },
    {
        url: "images/subslide4.jpg"
    }
];

const Slides = () => {
    const [nav1, setNav1] = useState();
    const [nav2, setNav2] = useState();

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
                    <img src={img.url} alt="" />
                </a>
            </div>
        ))
    );

    const navSlides = (
        slides.map((img, index) => (
            <div key={index} className={classes.item}>
                <p dangerouslySetInnerHTML={{ __html: img.desc }} />
            </div>
        ))
    );

    return (
        <section className={classes['slides-section']}>
            <div className={classes['slides-content']}>
                <div className={classes['wrap-slides']}>
                    <Slider {...settings} asNavFor={nav2} ref={(slider1) => setNav1(slider1)}>
                        {mainSlides}
                    </Slider>
                    { !useCheckMobile() && (
                        <Slider
                            asNavFor={nav1}
                            ref={(slider2) => setNav2(slider2)}
                            slidesToShow={5}
                            swipeToSlide={true}
                            focusOnSelect={true}
                            className={`${classes['nav-slides']} nav-slides`}
                        >
                            {navSlides}
                        </Slider>
                    )}
                </div>
                
                { !useCheckMobile() && (
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
                )}
            </div>
        </section>
    )
}

export default Slides;