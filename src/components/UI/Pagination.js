import React from 'react';
import classes from '../../scss/Pagination.module.scss';

const Pagination = ({ limit, total, paginate, currentPage, style }) => {
	const totalPages  = [];

	for (let i = 1; i <= Math.ceil(total / limit); i++) {
		totalPages.push(i);
	}

	return (
		<nav style={style}>
			<ul className={classes['pagination']}>
                {
                    currentPage > 1 && (
                        <li className={classes['page-item']}>
                            <a href="/#" className={classes['page-link']} onClick={(e) => paginate(e, 'prev')}>«</a>
                        </li>
                    )
                }
                {
                    totalPages.map((number) => (
                        <li key={number} className={`${classes['page-item']} ${currentPage === number ? classes.current : ''}`}>
                            <a href='/#' className={classes['page-link']}
                                onClick={(e) => paginate(e, number)}>{number}
                            </a>
                        </li>
                    ))
                }
                {
                    currentPage < totalPages.length && (
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
