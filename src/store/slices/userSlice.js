import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

const initialState = {
    users: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
};

// Add User
export const addUser = createAsyncThunk(
    'user/addUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/user', userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add user');
        }
    }
);

// Fetch Users
export const fetchUsers = createAsyncThunk(
    'user/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/user');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch users');
        }
    }
);

// Fetch User By ID
export const fetchUserById = createAsyncThunk(
    'user/fetchUserById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/user/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch user');
        }
    }
);

// Update User
export const updateUser = createAsyncThunk(
    'user/updateUser',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/user/${id}`, data);
            // Return both the id and the updated data to simplify reducer logic
            return { id, data: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update user');
        }
    }
);

// Delete User
export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/user/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete user');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Add User
            .addCase(addUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Handle different response structures: { data: user } or just user
                const newUser = action.payload && action.payload.data ? action.payload.data : action.payload;
                if (newUser) {
                    state.users.push(newUser);
                }
            })
            .addCase(addUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (Array.isArray(action.payload)) {
                    state.users = action.payload;
                } else if (action.payload && Array.isArray(action.payload.data)) {
                    state.users = action.payload.data;
                } else if (action.payload && Array.isArray(action.payload.users)) {
                    state.users = action.payload.users;
                } else {
                    console.error('Unexpected user data format:', action.payload);
                    state.users = [];
                }
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            // Update User
            .addCase(updateUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { id, data } = action.payload; // data here is response.data from the thunk

                // Check if the inner data has a 'data' property (API wrapper)
                const updatedUser = data && data.data ? data.data : data;

                if (updatedUser) {
                    const index = state.users.findIndex(user => user._id === id);
                    if (index !== -1) {
                        // Merge in case partial update, or replace if full object
                        state.users[index] = { ...state.users[index], ...updatedUser };
                    }
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = state.users.filter((user) => user._id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            });
    },
});

export const { resetStatus } = userSlice.actions;

export default userSlice.reducer;
