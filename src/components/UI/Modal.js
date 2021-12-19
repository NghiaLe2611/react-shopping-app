import { Fragment, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom';
import classes from '../../scss/Modal.module.scss';

const Backdrop = (props) => {
   
    return (
        props.backdrop === false ? (
            <div></div>
            // <div className={classes.overlay} onClick={props.onCloseModal}></div>
        ) : (
            <Fragment>
                <div className={classes.backdrop} onClick={props.onCloseModal}></div>
                {props.close ? props.close : null}
            </Fragment>
        )
    );
};

const ModalOverlay = (props) => {
    const mountedStyle = props.animation === 'slide' ? { animation: "slideDown 300ms ease-out forwards" } : { animation: "fadeIn 300ms ease-out forwards" };
    const unmountedStyle = props.animation === 'slide' ? { animation: "slideUp 300ms ease-out forwards" } : { animation: "fadeOut 300ms ease-out forwards" };
    
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
            <div className={classes.content}>{props.children}</div>
        </div>
    );

    if (props.type === 'popup') {
        modal = (
            <div className={classes.popup} style={props.isShowModal ? mountedStyle : unmountedStyle} ref={componentRef}>
                { props.backdrop !== false && !props.close && <span className={classes.close} onClick={props.onCloseModal}>&times;</span> }
                <div className={classes.content}>{props.children}</div>
            </div>
        )
    }
    
    if (props.type === 'alert') {
        modal = (
            <div className={classes.alert} style={props.isShowModal ? mountedStyle : unmountedStyle}>
                { props.backdrop !== false && !props.close && <span className={classes.close} onClick={props.onCloseModal}>&times;</span> }
                <div className={classes.content}>{props.children}</div>
            </div>
        )
    }

    return modal;
};

const portalElement = document.getElementById('overlay');

const Modal = ({ type, closeModal, isShowModal, backdrop, children, position, animation, contentClass, close }) => {
    const modalContent = (
        <ModalOverlay type={type} onCloseModal={closeModal} isShowModal={isShowModal} close={close}
            backdrop={backdrop} animation={animation} contentClass={contentClass}> 
                {children}
        </ModalOverlay>
    );

    return (
        <Fragment>
            { ReactDOM.createPortal(<Backdrop onCloseModal={closeModal} backdrop={backdrop} close={close}/>, portalElement) }
            { position !== 'absolute' ? ReactDOM.createPortal(modalContent, portalElement) :  modalContent }
        </Fragment>
    )
};

export default Modal;