import { configureStore } from '@reduxjs/toolkit';

// Reducers
import authSlice from './reducers/authSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
