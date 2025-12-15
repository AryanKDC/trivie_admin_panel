import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    InputAdornment,
    Container,
    IconButton,
    Alert,
    CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../store/slices/forgotPasswordSlice';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [serverError, setServerError] = useState('');

    const { status } = useSelector((state) => state.forgotPassword.resetPassword);
    const loading = status === 'loading';

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .required('Password is required')
                .min(6, 'Password must be at least 6 characters'),
            confirmPassword: Yup.string()
                .required('Confirm Password is required')
                .oneOf([Yup.ref('password'), null], 'Passwords must match'),
        }),
        onSubmit: async (values) => {
            setMessage('');
            setServerError('');
            try {
                const resultAction = await dispatch(resetPassword({ token, password: values.password }));
                if (resetPassword.fulfilled.match(resultAction)) {
                    setMessage('Password reset successfully! Redirecting to login...');
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setServerError(resultAction.payload || 'Failed to reset password');
                }
            } catch (err) {
                setServerError('An unexpected error occurred.');
            }
        },
    });

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f5f7fa',
            }}
        >
            <Container maxWidth="xs">
                <Card
                    sx={{
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                        borderRadius: 2,
                        px: 2,
                        py: 3,
                        textAlign: 'center',
                    }}
                >
                    <CardContent>
                        {/* Logo */}
                        <Box
                            component="img"
                            src="/image.png"
                            alt="Trivie Interiors"
                            sx={{
                                height: 100,
                                mb: 3,
                                objectFit: 'contain',
                            }}
                        />

                        {/* Title */}
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#0F172A', mb: 1 }}>
                            Reset Password
                        </Typography>

                        {/* Subtitle */}
                        <Typography variant="body2" sx={{ color: '#64748B', mb: 4 }}>
                            Enter your new password below
                        </Typography>

                        {/* Messages */}
                        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

                        {/* Form */}
                        <form onSubmit={formik.handleSubmit}>
                            <Box sx={{ textAlign: 'left', mb: 2 }}>
                                <Typography variant="caption" sx={{ color: '#334155', fontWeight: 500, mb: 0.5, display: 'block' }}>
                                    New Password
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    variant="outlined"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                    disabled={loading}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon sx={{ color: '#94A3B8' }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
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

                            <Box sx={{ textAlign: 'left', mb: 3 }}>
                                <Typography variant="caption" sx={{ color: '#334155', fontWeight: 500, mb: 0.5, display: 'block' }}>
                                    Confirm Password
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    variant="outlined"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                    disabled={loading}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon sx={{ color: '#94A3B8' }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        edge="end"
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
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

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    bgcolor: '#E50914',
                                    color: 'white',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    py: 1.5,
                                    borderRadius: 1.5,
                                    '&:hover': {
                                        bgcolor: '#D00812',
                                    },
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default ResetPasswordPage;
