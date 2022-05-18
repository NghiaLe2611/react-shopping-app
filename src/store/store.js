import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart';
import authReducer from './auth';

const store = configureStore({
	reducer: {
		cart: cartReducer,
		auth: authReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export default store;
