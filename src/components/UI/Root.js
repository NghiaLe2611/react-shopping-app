import {Fragment} from 'react';
import Footer from '../partials/Footer';
import Header from '../partials/Header';

const Root = (props) => (
    <Fragment>
        <Header/>
        <div className='main'>
            {props.children}
        </div>
        <Footer/>
    </Fragment>
)

export default Root;