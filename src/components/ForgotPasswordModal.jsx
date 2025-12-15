import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../store/slices/forgotPasswordSlice';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import InputAdornment from '@mui/material/InputAdornment';

const ForgotPasswordModal = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.forgotPassword.forgotPassword);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (status === 'succeeded') {
            setSuccess(true);
        }
    }, [status]);

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
        }),
        onSubmit: async (values) => {
            setSuccess(false);
            await dispatch(forgotPassword(values.email));
        },
    });

    const handleClose = () => {
        formik.resetForm();
        setSuccess(false);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    px: 1,
                    py: 1,
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 600, color: '#0F172A', pb: 1 }}>
                Reset Password
            </DialogTitle>

            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    {success ? (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Password reset instructions have been sent to your email address.
                        </Alert>
                    ) : (
                        <>
                            <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                                Enter your email address and we'll send you instructions to reset your password.
                            </Typography>

                            {status === 'failed' && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error || 'Failed to send reset email. Please try again.'}
                                </Alert>
                            )}

                            <Box sx={{ textAlign: 'left' }}>
                                <Typography
                                    variant="caption"
                                    sx={{ color: '#334155', fontWeight: 500, mb: 0.5, display: 'block' }}
                                >
                                    Email Address
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    variant="outlined"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailOutlinedIcon sx={{ color: '#94A3B8' }} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: 'white',
                                            '& fieldset': { borderColor: '#E2E8F0' },
                                            '&:hover fieldset': { borderColor: '#CBD5E1' },
                                        },
                                    }}
                                />
                            </Box>
                        </>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleClose}
                        sx={{
                            textTransform: 'none',
                            color: '#64748B',
                            '&:hover': {
                                bgcolor: '#F1F5F9',
                            },
                        }}
                    >
                        {success ? 'Close' : 'Cancel'}
                    </Button>
                    {!success && (
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={status === 'loading'}
                            sx={{
                                bgcolor: '#E50914',
                                color: 'white',
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                '&:hover': {
                                    bgcolor: '#D00812',
                                },
                                '&:disabled': {
                                    bgcolor: '#FCA5A5',
                                },
                            }}
                        >
                            {status === 'loading' ? (
                                <>
                                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </Button>
                    )}
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ForgotPasswordModal;
