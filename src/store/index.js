import { configureStore } from '@reduxjs/toolkit';
import portfolioReducer from './slices/portfolioSlice';
import categoryReducer from './slices/categorySlice';
import userReducer from './slices/userSlice';
import forgotPasswordReducer from './slices/forgotPasswordSlice';

export const store = configureStore({
    reducer: {
        portfolio: portfolioReducer,
        category: categoryReducer,
        user: userReducer,
        forgotPassword: forgotPasswordReducer,
    },
});