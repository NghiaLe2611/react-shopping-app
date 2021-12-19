import Products from '../components/Products';
import Slides from '../components/Slides';

const HomePage = () => {
    return (
        <div className="container">
            <Slides/>
            <Products/>
        </div>
    )
}

export default HomePage;