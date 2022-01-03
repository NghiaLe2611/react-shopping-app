import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: localStorage.getItem('firebaseToken') ? true : false,
        userData: JSON.parse(localStorage.getItem('userData')) ? JSON.parse(localStorage.getItem('userData')) : null
        // loginToken: storedToken ? storedToken : null
    },
    reducers: {
        updateState(state, action) {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.userData = action.payload.userData;
        }
    }
});

export const authActions = authSlice.actions;

export default authSlice.reducer;