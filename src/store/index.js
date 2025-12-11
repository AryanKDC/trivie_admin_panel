import { configureStore } from '@reduxjs/toolkit';
import portfolioReducer from './slices/portfolioSlice';
import categoryReducer from './slices/categorySlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        portfolio: portfolioReducer,
        category: categoryReducer,
        user: userReducer,
    },
});