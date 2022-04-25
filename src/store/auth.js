import { createSlice,  } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userData: JSON.parse(localStorage.getItem('userData')) ? JSON.parse(localStorage.getItem('userData')) : null,
        shippingInfo: null,
        accessToken: localStorage.getItem('access_token') ? localStorage.getItem('access_token') : '',
        // isLoggingOut: false
    },
    reducers: {
        updateState(state, action) {
            state.userData = action.payload.userData;
        },
        setShippingAddress(state, action) {
            state.shippingInfo = action.payload;
        },
        setToken(state, action) {
            state.accessToken = action.payload;
        },
        // setIsLoggingOut(state, action) {
        //     state.isLoggingOut = action.payload;
        // }
    },
    extraReducers: {
        // add your async reducers here
    }
});

export const authActions = authSlice.actions;
/*
    // Action creators
    export const { ...reducers } = authSlice.actions;
*/

export default authSlice.reducer;