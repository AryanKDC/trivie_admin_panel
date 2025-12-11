import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

const initialState = {
    items: [],
    status: 'idle',
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
    tags: [],
    sort: {
        key: 'createdAt',
        direction: 'desc',
    },
    columnFilters: {
        title: [],
        category: [],
    },
    currentPortfolio: null,
};

export const fetchCategories = createAsyncThunk('portfolio/fetchCategories', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/portfolio/categories');
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch categories');
    }
});

export const fetchPortfolios = createAsyncThunk(
    'portfolio/fetchPortfolios',
    async (_, { getState }) => {
        const { pagination, search, sort, filters, columnFilters } = getState().portfolio;

        const sortFieldMap = {
            'createdAt': 'createdAt',
            'title': 'title',
            'category': 'category',
        };

        const sortBy = sortFieldMap[sort.key] || sort.key;

        const params = {
            page: pagination.page,
            limit: pagination.limit,
            sortBy: sortBy,
            sort: sort.direction,
            search: typeof search === 'string' ? search : '',
        };

        const body = {
            filter: {},
        };

        if (filters.title) body.filter.title = filters.title;
        if (filters.page) body.filter.page = filters.page;
        if (filters.category && filters.category !== 'All Categories') body.filter.category = filters.category;
        if (filters.tags) {

            body.filter.tags = filters.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag);
        }

        if (columnFilters.title && columnFilters.title.length > 0) {
            body.filter.title = columnFilters.title[0];
        }
        if (columnFilters.category && columnFilters.category.length > 0) {
            body.filter.category = columnFilters.category;
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
            state.pagination.page = 1;
        },
        setFilter: (state, action) => {
            const { key, value } = action.payload;
            state.filters[key] = value;
            state.pagination.page = 1;
        },
        setSort: (state, action) => {
            const { key } = action.payload;
            const defaultSort = { key: 'createdAt', direction: 'desc' };

            if (state.sort.key === key) {
                if (state.sort.direction === 'asc') {
                    state.sort.direction = 'desc';
                } else if (state.sort.direction === 'desc') {
                    if (key === defaultSort.key) {
                        state.sort.direction = 'asc';
                    } else {
                        state.sort.key = defaultSort.key;
                        state.sort.direction = defaultSort.direction;
                    }
                }
            } else {
                state.sort.key = key;
                state.sort.direction = 'asc';
            }
            state.pagination.page = 1;
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },
        setColumnFilter: (state, action) => {
            const { column, values } = action.payload;
            state.columnFilters[column] = values;
            state.pagination.page = 1;
        },
        clearColumnFilter: (state, action) => {
            const column = action.payload;
            state.columnFilters[column] = [];
            state.pagination.page = 1;
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
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.tags = action.payload;
            })
            .addCase(addPortfolio.fulfilled, (state, action) => {
                state.items.unshift(action.payload.data);
                state.status = 'succeeded';
                state.pagination.total += 1;
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
                const index = state.items.findIndex(item => item._id === action.payload.data?._id);
                if (index !== -1) {
                    state.items[index] = action.payload.data;
                }
                state.status = 'succeeded';
            })
            .addCase(deletePortfolio.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.meta.arg);
                state.status = 'succeeded';
            });
    },
});

export const { setSearch, setFilter, setSort, setPage, setColumnFilter, clearColumnFilter, resetState } = portfolioSlice.actions;

export default portfolioSlice.reducer;