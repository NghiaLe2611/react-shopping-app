import React, { useEffect, useState } from 'react';

const ModalAnimation = ({ show, children, active, exit }) => {
	const [render, setRender] = useState(show);

	useEffect(() => {
		if (show) setRender(true);
	}, [show]);

	const onAnimationEnd = () => {
		if (!show) setRender(false);
	};

	return (
		render && (
			<div style={{position: 'relative', zIndex: 99}}
				className={`${show ? active : exit}`}
				onAnimationEnd={onAnimationEnd}
			>
				{children}
			</div>
		)
	);
};

export default ModalAnimation;
