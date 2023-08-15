import { configureStore } from '@reduxjs/toolkit';

// Reducers
import authSlice from './reducers/authSlice';
import animationSlice from './reducers/animationSlice';
import subjectSlice from './reducers/subjectSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        animation: animationSlice,
        subject: subjectSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
