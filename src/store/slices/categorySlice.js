import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

const initialState = {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    },
};

export const addCategory = createAsyncThunk(
    'category/addCategory',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/category/add-category', categoryData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add category');
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { pagination } = getState().category;
            const params = {
                page: pagination.page,
                limit: pagination.limit,
            };
            const response = await axiosInstance.get('/category/get', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch categories');
        }
    }
);

export const updateCategory = createAsyncThunk(
    'category/updateCategory',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/category/update/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update category');
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/category/delete/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete category');
        }
    }
);

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Add Category
            .addCase(addCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // push new item if structure matches
                if (action.payload && action.payload.data) {
                    state.items.push(action.payload.data);
                }
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            // Fetch Categories
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Assuming response structure: { data: [...], pagination: { total, totalPages, limit, page } }
                if (action.payload.data) {
                    state.items = action.payload.data;
                } else if (Array.isArray(action.payload)) {
                    state.items = action.payload;
                }

                if (action.payload.pagination) {
                    state.pagination.total = action.payload.pagination.total;
                    state.pagination.totalPages = action.payload.pagination.totalPages;
                    state.pagination.page = action.payload.pagination.page || state.pagination.page;
                    state.pagination.limit = action.payload.pagination.limit || state.pagination.limit;
                }
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            // Update Category
            .addCase(updateCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedItem = action.payload.data || action.payload;
                if (updatedItem && updatedItem._id) {
                    const index = state.items.findIndex(item => item._id === updatedItem._id);
                    if (index !== -1) {
                        state.items[index] = updatedItem;
                    }
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            // Delete Category
            .addCase(deleteCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Remove the item from the list using the id passed to the thunk
                const id = action.meta.arg;
                state.items = state.items.filter(item => item._id !== id);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            });
    },
});

export const { resetStatus, setPage } = categorySlice.actions;

export default categorySlice.reducer;
