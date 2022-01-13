import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: localStorage.getItem('isLoggedIn') ? localStorage.getItem('isLoggedIn') : false, 
        userData: JSON.parse(localStorage.getItem('userData')) ? JSON.parse(localStorage.getItem('userData')) : null
    },
    reducers: {
        updateState(state, action) {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.userData = action.payload.userData;
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