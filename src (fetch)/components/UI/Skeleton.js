import React from 'react'
import classes from '../../scss/Skeleton.module.scss'
const SkeletonElement = ({ type }) => {
    return (
        <div className={`${classes.skeleton} ${classes[type]}`}></div>
    )
};

export default SkeletonElement;