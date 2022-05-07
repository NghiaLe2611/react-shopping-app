import {Fragment} from 'react';
import useCheckMobile from '../../hooks/useCheckMobile';
import Footer from '../partials/Footer';
import Header from '../partials/Header';

const Root = (props) => {
    const showMobileView = props.mobileView ? true : false;
    const {isMobile} = useCheckMobile();

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
            <Header mobileView={showMobileView} title={props.title}/>
            <main className={`${isMobile && showMobileView ? 'main app' : 'main'}`}>
                {props.children}
            </main>
            <Footer mobileView={showMobileView}/>
        </Fragment>
    )
}

export default Root;