import { useCallback, useRef, useState } from 'react';
import { produce } from 'immer';

const useImmerState = (initialState) => {
	const [state, setState] = useState(initialState);
	const nextState = useRef(initialState);

	const setImmerState = useCallback((fn) => {
		setState((prevState) => {
			const newState = produce(prevState, fn);
			nextState.current = newState;

			return newState;
		});
	}, []);

	const getImmerState = useCallback(() => {
		return nextState.current;
	}, []);

	return [state, setImmerState, getImmerState];
};

export default useImmerState;
