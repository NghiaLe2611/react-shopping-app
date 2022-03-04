import { Fragment, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom';
import classes from '../../scss/Modal.module.scss';

const Backdrop = (props) => {
    return (
        props.backdrop === false ? null : (
            // <div className={classes.overlay} onClick={props.onCloseModal}></div>
            <Fragment>
                <div className={classes.backdrop} onClick={props.onCloseModal}></div>
                {props.close ? props.close : null}
            </Fragment>
        )
    );
};

const ModalOverlay = (props) => {
    let mountedStyle = props.animation === 'slide' ? { animation: "slideDown 300ms ease-out forwards" } : { animation: "fadeIn 300ms ease-out forwards" };
    let unmountedStyle = props.animation === 'slide' ? { animation: "slideUp 300ms ease-out forwards" } : { animation: "fadeOut 300ms ease-out forwards" };
    
    if (props.animation === 'none') {
        mountedStyle = { animation: 'none'};
        unmountedStyle = { animation: 'none'};
    }

    const componentRef = useRef();

    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
        function handleClick(e) {
            if(componentRef && componentRef.current){
                const ref = componentRef.current;
                
                if(!ref.contains(e.target)){
                    props.onCloseModal();
                }
            }
        }
    }, [props]);

    let modal = (
        <div className={`${classes.modal} ${props.contentClass ? props.contentClass : ''}`} style={props.isShowModal ? mountedStyle : unmountedStyle}>
            { props.backdrop !== false && !props.close && <span className={classes.close} onClick={props.onCloseModal}>&times;</span> }
            {/* <div className={classes.content}>{props.children}</div> */}
            <Fragment>{props.children}</Fragment>
        </div>
    );

    if (props.type === 'popup') {
        if (props.modalStyles) {
            mountedStyle= Object.assign(mountedStyle, props.modalStyles);
            unmountedStyle= Object.assign(unmountedStyle, props.modalStyles);
        }
        modal = (
            <div className={`${classes.popup} ${props.contentClass ? props.contentClass : ''}`}
                style={props.isShowModal ? mountedStyle : unmountedStyle} ref={componentRef}>
                { props.backdrop !== false && !props.close && <span className={classes.close} onClick={props.onCloseModal}>&times;</span> }
                <Fragment>{props.children}</Fragment>
            </div>
        )
    }
    
    if (props.type === 'alert') {
        modal = (
            <div className={classes.alert} style={props.isShowModal ? mountedStyle : unmountedStyle}>
                { props.backdrop !== false && !props.close && <span className={classes.close} onClick={props.onCloseModal}>&times;</span> }
                <Fragment>{props.children}</Fragment>
            </div>
        )
    }

    return modal;
};

const portalElement = document.getElementById('overlay');
const popupPortal = document.getElementById('popup-root');

const Modal = ({ type, closeModal, isShowModal, backdrop, children, position, animation, 
    contentClass, close, modalStyles,  }) => {
    const modalContent = (
        <ModalOverlay type={type} onCloseModal={closeModal} isShowModal={isShowModal} close={close} modalStyles={modalStyles}
            backdrop={backdrop} animation={animation} contentClass={contentClass}> 
                {children}
        </ModalOverlay>
    );

    return (
        <Fragment>
            { ReactDOM.createPortal(<Backdrop onCloseModal={closeModal} backdrop={backdrop} close={close}/>, portalElement) }
            {
                type === 'popup' ? (position === 'fixed' ? ReactDOM.createPortal(modalContent, popupPortal) : 
                (position === 'absolute' && modalContent)) :
                ReactDOM.createPortal(modalContent, portalElement)
            }
            {/* { position !== 'absolute' ? ReactDOM.createPortal(modalContent, portalElement) :  modalContent } */}
        </Fragment>
    )
};

export default Modal;