import { createSlice,  } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userData: JSON.parse(localStorage.getItem('userData')) ? JSON.parse(localStorage.getItem('userData')) : null,
        shippingInfo: null
    },
    reducers: {
        updateState(state, action) {
            // state.isLoggedIn = action.payload.isLoggedIn;
            state.userData = action.payload.userData;
        },
        setShippingAddress(state, action) {
            state.shippingInfo = action.payload;
        }
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