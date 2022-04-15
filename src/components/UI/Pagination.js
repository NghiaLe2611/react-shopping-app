import React from 'react';
import classes from '../../scss/Pagination.module.scss';

const DOTS = '...';
const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
};

const Pagination = ({ pageSize, totalCount, paginate, currentPage, siblingCount = 1, style, right }) => {
	let totalPages  = [];

	for (let i = 1; i <= Math.ceil(totalCount / pageSize); i++) {
		totalPages.push(i);
	}

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages.length
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages.length - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages.length;

    if (!shouldShowLeftDots && shouldShowRightDots) {
        let leftItemCount = 3 + 2 * siblingCount;
        let leftRange = range(1, leftItemCount);

        totalPages = [...leftRange, DOTS, totalPages.length];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
        let rightItemCount = 3 + 2 * siblingCount;
        let rightRange = range(
            totalPages.length - rightItemCount + 1,
            totalPages.length
        );
        totalPages = [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
        let middleRange = range(leftSiblingIndex, rightSiblingIndex);
        totalPages = [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    const lastPage = totalPages[totalPages.length - 1];

	return (
		<nav style={style}>
			<ul className={classes['pagination']} style={right && {justifyContent: 'flex-end'}}>
                {
                    currentPage > 1 && (
                        <li className={classes['page-item']}>
                            <a href="/#" className={classes['page-link']} onClick={(e) => paginate(e, 'prev')}>«</a>
                        </li>
                    )
                }
                {
                    totalPages.map((number, index) => (
                        <li key={index} className={`${classes['page-item']} ${currentPage === number ? classes.current : ''}`}>
                            <a href='/#' className={classes['page-link']}
                                onClick={(e) => paginate(e, number)}>{number}
                            </a>
                        </li>
                    ))
                }
                {
                    currentPage < lastPage && (
                        <li className={classes['page-item']}>
                            <a href="/#" className={classes['page-link']} onClick={(e) => paginate(e, 'next')}>»</a>
                        </li>
                    )
                }
			</ul>
		</nav>
	);
};

export default Pagination;
