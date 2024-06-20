import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        SignInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.currentUser = action.payload;
        }, 
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.currentUser = action.payload
        }, 
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.currentUser = null
        }, 
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signOutSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.currentUser = null
        }, 
    }
});

export const { signInFailure, signInSuccess, SignInStart, updateFailure, updateStart, updateSuccess,deleteUserSuccess, deleteUserFailure, deleteUserStart, signOutSuccess } = userSlice.actions;

export default userSlice.reducer;