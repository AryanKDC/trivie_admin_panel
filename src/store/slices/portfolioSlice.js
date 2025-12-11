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
    filters: {
        title: '',
        page: '',
        tags: '',
        category: '',
    },
    search: '',
    tags: [], // Available tags for autocomplete
    sort: {
        key: 'createdAt',
        direction: 'desc',
    },
    currentPortfolio: null,
};

export const fetchTags = createAsyncThunk('portfolio/fetchTags', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/portfolio/tags');
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch tags');
    }
});

export const fetchPortfolios = createAsyncThunk(
    'portfolio/fetchPortfolios',
    async (_, { getState }) => {
        const { pagination, search, sort, filters } = getState().portfolio;

        // Query params for pagination and sorting
        const params = {
            page: pagination.page,
            limit: pagination.limit,
            sortBy: sort.key,
            sort: sort.direction,
            search: typeof search === 'string' ? search : '', // Global search, ensure strictly string
        };

        // Body for dynamic filters
        const body = {
            filter: {},
        };

        // Map filters to body
        if (filters.title) body.filter.title = filters.title;
        if (filters.page) body.filter.page = filters.page;
        if (filters.category && filters.category !== 'All Categories') body.filter.category = filters.category;
        if (filters.tags) {
            // Split tags by comma and trim
            body.filter.tags = filters.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag);
        }

        const response = await axiosInstance.post('/portfolio/get', body, { params });
        return response.data;
    },
);

export const getPortfolioById = createAsyncThunk(
    'portfolio/getPortfolioById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/portfolio/get/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch portfolio details');
        }
    }
);

export const addPortfolio = createAsyncThunk(
    'portfolio/addPortfolio',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/portfolio/add-portfolio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);

export const updatePortfolio = createAsyncThunk(
    'portfolio/updatePortfolio',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/portfolio/edit/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);

export const deletePortfolio = createAsyncThunk(
    'portfolio/deletePortfolio',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/portfolio/delete/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {
        setSearch: (state, action) => {
            state.search = action.payload;
            state.pagination.page = 1; // Reset page on search
        },
        setFilter: (state, action) => {
            const { key, value } = action.payload;
            state.filters[key] = value;
            state.pagination.page = 1; // Reset page on filter
        },
        setSort: (state, action) => {
            const { key } = action.payload;
            if (state.sort.key === key) {
                if (state.sort.direction === 'asc') {
                    state.sort.direction = 'desc';
                } else if (state.sort.direction === 'desc') {
                    // Reset to default (e.g., createdAt desc) or empty
                    state.sort.key = 'createdAt';
                    state.sort.direction = 'desc';
                }
            } else {
                state.sort.key = key;
                state.sort.direction = 'asc';
            }
            state.pagination.page = 1; // Reset page on sort change
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },
        resetState: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPortfolios.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPortfolios.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.data;
                if (action.payload.pagination) {
                    state.pagination.total = action.payload.pagination.total;
                    state.pagination.totalPages = action.payload.pagination.totalPages;
                    state.pagination.limit = action.payload.pagination.limit;
                }
            })
            .addCase(fetchPortfolios.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.tags = action.payload;
            })
            .addCase(addPortfolio.fulfilled, (state, action) => {
                // Optionally refresh list or handle success
            })
            .addCase(getPortfolioById.pending, (state) => {
                state.status = 'loading';
                state.currentPortfolio = null;
            })
            .addCase(getPortfolioById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentPortfolio = action.payload.data;
            })
            .addCase(getPortfolioById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updatePortfolio.fulfilled, (state, action) => {
                // Update the item in the list if it exists
                const index = state.items.findIndex(item => item._id === action.payload.data?._id);
                if (index !== -1) {
                    state.items[index] = action.payload.data;
                }
                state.status = 'succeeded';
            })
            .addCase(deletePortfolio.fulfilled, (state, action) => {
                // Remove the item from existing list
                state.items = state.items.filter(item => item._id !== action.meta.arg);
                // Note: action.meta.arg contains the 'id' passed to the thunk
                state.status = 'succeeded';
            });
    },
});

export const { setSearch, setFilter, setSort, setPage, resetState } = portfolioSlice.actions;

export default portfolioSlice.reducer;