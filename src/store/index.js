import { configureStore } from '@reduxjs/toolkit';
import portfolioReducer from './slices/portfolioSlice';
import categoryReducer from './slices/categorySlice';

export const store = configureStore({
    reducer: {
        portfolio: portfolioReducer,
        category: categoryReducer,
    },
});