import { createSlice,  } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userData: JSON.parse(localStorage.getItem('userData')) ? JSON.parse(localStorage.getItem('userData')) : null,
        test: ''
    },
    reducers: {
        updateState(state, action) {
            // state.isLoggedIn = action.payload.isLoggedIn;
            state.userData = action.payload.userData;
        },
        update(state, action) {
            state.test = action.payload;
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