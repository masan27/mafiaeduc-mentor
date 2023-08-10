import { configureStore } from '@reduxjs/toolkit';

// Reducers
import authSlice from './reducers/authSlice';
import animationSlice from './reducers/animationSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        animation: animationSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
