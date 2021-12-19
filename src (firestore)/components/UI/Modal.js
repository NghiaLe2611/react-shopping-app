import { Fragment } from 'react'
import ReactDOM from 'react-dom';
import classes from '../../scss/Modal.module.scss';

const Backdrop = (props) => {
    return (
        props.backdrop === false ? (
            <div className={classes.overlay} onClick={props.onCloseModal}></div>
        ) : (
            <div className={classes.backdrop} onClick={props.onCloseModal}></div>
        )
    );
};

const ModalOverlay = (props) => {
    const mountedStyle = { animation: "slideDown 300ms ease-out forwards" };
    const unmountedStyle = { animation: "slideUp 300ms ease-out forwards" };

    let modal = (
        <div className={classes.modal} style={props.isShowModal ? mountedStyle : unmountedStyle}>
            { props.backdrop !== false && <span className={classes.close} onClick={props.onCloseModal}>&times;</span> }
            <div className={classes.content}>{props.children}</div>
        </div>
    );

    if (props.type === 'popup') {
        modal = (
            <div className={classes.popup} style={props.isShowModal ? mountedStyle : unmountedStyle}>
                { props.backdrop !== false && <span className={classes.close} onClick={props.onCloseModal}>&times;</span> }
                <div className={classes.content}>{props.children}</div>
            </div>
        )
    }
    
    if (props.type === 'alert') {
        modal = (
            <div className={classes.alert} style={props.isShowModal ? mountedStyle : unmountedStyle}>
                { props.backdrop !== false && <span className={classes.close} onClick={props.onCloseModal}>&times;</span> }
                <div className={classes.content}>{props.children}</div>
            </div>
        )
    }

    return modal;
};

const portalElement = document.getElementById('overlay');

const Modal = ({ type, closeModal, isShowModal, backdrop, children, position }) => {
    const modalContent = <ModalOverlay type={type} onCloseModal={closeModal} isShowModal={isShowModal} backdrop={backdrop}>{children}</ModalOverlay>;

    return (
        <Fragment>
            { ReactDOM.createPortal(<Backdrop onCloseModal={closeModal} backdrop={backdrop}/>, portalElement) }
            { position !== 'absolute' ? ReactDOM.createPortal(modalContent, portalElement) :  modalContent }
        </Fragment>
    )
};

export default Modal;