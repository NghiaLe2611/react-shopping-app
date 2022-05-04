import {Fragment} from 'react';
import Footer from '../partials/Footer';
import Header from '../partials/Header';

const Root = (props) => {
    const showMobileView = props.mobileView ? true : false;
    const styleBody = `
        @media (max-width: 1024px) {
            body{
                background-color: #efefef;
            }
            .app .container{
                padding: 0;
            }
            .app{
                margin-top: 56px;
            }
        }
    `;
    return (
        <Fragment>
            <style>{styleBody}</style>
            <Header mobileView={showMobileView}/>
            <div className={`main ${showMobileView ? 'app' : null}`}>
                {props.children}
            </div>
            <Footer mobileView={showMobileView}/>
        </Fragment>
    )
}

export default Root;