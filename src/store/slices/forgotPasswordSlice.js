import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

const initialState = {
    forgotPassword: {
        status: 'idle',
        error: null,
    },
    resetPassword: {
        status: 'idle',
        error: null,
    },
};

export const forgotPassword = createAsyncThunk(
    'forgotPassword/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/password/forgot-password', { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send reset password email');
        }
    }
);

export const resetPassword = createAsyncThunk(
    'forgotPassword/resetPassword',
    async ({ token, password }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/password/reset-password/${token}`, { password });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
        }
    }
);

const forgotPasswordSlice = createSlice({
    name: 'forgotPassword',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(forgotPassword.pending, (state) => {
                state.forgotPassword.status = 'loading';
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.forgotPassword.status = 'succeeded';
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.forgotPassword.status = 'failed';
                state.forgotPassword.error = action.payload;
            })
            .addCase(resetPassword.pending, (state) => {
                state.resetPassword.status = 'loading';
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.resetPassword.status = 'succeeded';
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.resetPassword.status = 'failed';
                state.resetPassword.error = action.payload;
            });
    },
});

export default forgotPasswordSlice.reducer;
