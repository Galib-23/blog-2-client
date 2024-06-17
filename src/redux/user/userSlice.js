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
    }
});

export const { signInFailure, signInSuccess, SignInStart, updateFailure, updateStart, updateSuccess } = userSlice.actions;

export default userSlice.reducer;