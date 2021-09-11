import { Fragment } from 'react'
import Header from './components/Header';
import Footer from './components/Footer';
import Products from './components/Products';
import banner from './assets/banner-xperia.jpg';

function App() {
    return (
		<Fragment>
            <Header/>
            <div className="banner">
                <div className="container">
                    <img src={banner} alt="banner" />
                </div>
            </div>
            <Products/>
            <Footer/>
        </Fragment>
	);
}

export default App;
