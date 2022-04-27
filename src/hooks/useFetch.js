import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/AxiosClient';

const useFetch = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const fetchData = useCallback(async ({ url, method, body = null, params = null, headers = {} }, applyData) => {
        setIsLoading(true);
		setError(null);

        // try {
		// 	const response = await fetch(url, {
		// 		method: method ? method : 'GET',
		// 		headers: headers ? headers : {},
		// 		body: body ? JSON.stringify(body) : null,
		// 	});

		// 	if (!response.ok) {
		// 		throw new Error('Request failed. Please try again !');
		// 	}

		// 	const data = await response.json();
		// 	applyData(data);
        //     setIsLoading(false);
		// } catch (err) {
		// 	setError(err.message || 'Something went wrong. Please try again !');
        //     setIsLoading(false);
		// }

        try {
			const response = await axiosClient({
				method: method ? method : 'GET',
                url: url,
				headers: headers ? headers : {},
				data: body ? JSON.stringify(body) : null,
				params: params ? params : null
			});

            applyData(response.data);
            setIsLoading(false);

		} catch (err) {
			setError(err?.message || 'Something went wrong. Please try again !');
			setIsLoading(false);
		}

    }, []);

	return { error, isLoading, fetchData };
};

export default useFetch;