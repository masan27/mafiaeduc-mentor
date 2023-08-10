import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, { payload }) {
            state.user = payload.user;
            state.token = payload.token;
        },
        setToken(state, { payload }) {
            state.token = payload;
            localStorage.setItem('token', payload);
        },
        setUser(state, { payload }) {
            state.user = payload;
        },
    },
});

export const getToken = (state) => state.auth.token;
export const getUser = (state) => state.auth.user;

export const { login, setToken, setUser } = authSlice.actions;

export default authSlice.reducer;
