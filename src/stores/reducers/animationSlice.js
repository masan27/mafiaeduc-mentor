import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    openSidebar: false,
};

const animationSlice = createSlice({
    name: 'animation',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.openSidebar = !state.openSidebar;
        },
    },
});

export const getOpenSidebar = (state) => state.animation.openSidebar;

export const { toggleSidebar } = animationSlice.actions;

export default animationSlice.reducer;
