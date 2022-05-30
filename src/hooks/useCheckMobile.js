import { useEffect, useState } from 'react';

// export default function useCheckMobile() {
// 	const [isMobile, setMobile] = useState(false);

// 	useEffect(() => {
// 		const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
// 		const mobile = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i));
// 		setMobile(mobile);
// 	}, []);

// 	return { isMobile };
// }

// export default function useDeviceDetect() {
//     const [isMobile, setMobile] = useState(false);

//     useEffect(() => {
//         const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
//         const mobile = Boolean(
//             userAgent.match(
//                 /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
//             )
//         );
//         setMobile(mobile);
//     }, []);

//     return { isMobile };
// }

export default function useCheckMobile() {
	const [width, setWidth] = useState(window.innerWidth);
    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        // handleWindowSizeChange();
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width < 768;
    const isTablet = width >= 768 && width <= 1024;

    // const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return { isMobile, isTablet };
}

// export default function useWinduseCheckMobileowSize() {
// 	const [windowSize, setWindowSize] = useState({
// 		width: undefined,
// 		height: undefined,
// 	});
// 	useEffect(() => {
// 		// Handler to call on window resize
// 		function handleResize() {
// 			// Set window width/height to state
// 			setWindowSize({
// 				width: window.innerWidth,
// 				height: window.innerHeight,
// 			});
// 		}
// 		// Add event listener
// 		window.addEventListener('resize', handleResize);
// 		// Call handler right away so state gets updated with initial window size
// 		handleResize();
// 		// Remove event listener on cleanup
// 		return () => window.removeEventListener('resize', handleResize);
// 	}, []); // Empty array ensures that effect is only run on mount
// 	return windowSize;
// }