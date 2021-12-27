import { useEffect, useState } from 'react';

// export const useCheckMobile = () => {
//     const [width, setWidth] = useState(window.innerWidth);
//     const handleWindowSizeChange = () => {
//         setWidth(window.innerWidth);
//     }

//     useEffect(() => {
//         window.addEventListener('resize', handleWindowSizeChange);
//         return () => {
//             window.removeEventListener('resize', handleWindowSizeChange);
//         }
//     }, []);

//     return (width <= 768);
// }

// export default function useCheckMobile() {
// 	const [isMobile, setMobile] = useState(false);

// 	useEffect(() => {
// 		const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
// 		const mobile = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i));
// 		setMobile(mobile);
// 	}, []);

// 	return { isMobile };
// }

export default function useCheckMobile() {
	const [width, setWidth] = useState(window.innerWidth);
    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width <= 768;

    return { isMobile }
}