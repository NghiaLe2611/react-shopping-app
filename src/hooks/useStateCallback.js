import { useState, useEffect, useRef, useCallback } from 'react';

export const useStateCallback = (initialState) => {
	const [state, setState] = useState(initialState);
	const cbRef = useRef(null);

	const setStateCallback = useCallback((state, cb) => {
		cbRef.current = cb;
		setState(state);
	}, []);

	useEffect(() => {
		if (cbRef.current) {
			cbRef.current(state);
			cbRef.current = null;
		}
	}, [state]);

	return [state, setStateCallback];
}