import Products from '../components/Products';
import Slides from '../components/Slides';

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

const HomePage = () => {
    return (
        <div className="container">
            <Slides slides={slides} subSlides={subSlides} />
            <Products/>
        </div>
    )
}

export default HomePage;