import React, { useState, useEffect, useRef } from 'react';
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
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import PersonIcon from '@mui/icons-material/Person';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const passwordRef = useRef(null);
  const cursorPosRef = useRef(null);

  useEffect(() => {
    if (passwordRef.current && cursorPosRef.current !== null) {
      const input = passwordRef.current;
      input.focus();
      input.setSelectionRange(cursorPosRef.current, cursorPosRef.current);
    }
  }, [showPassword]);

  const handleClickShowPassword = () => {
    if (passwordRef.current) {
      cursorPosRef.current = passwordRef.current.selectionStart;
    }
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        setError('');
        const response = await axiosInstance.post('/auth/signin', {
          user_name: values.username,
          password: values.password,
        });

        if (response.data.status) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.result));
          navigate('/');
        } else {
          setError(response.data.message || 'Invalid credentials');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'An error occurred during login');
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
                height: 60,
                mb: 3,
                objectFit: 'contain',
              }}
            />

            {/* Title */}
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#0F172A', mb: 1 }}>
              Admin Portal
            </Typography>

            {/* Subtitle */}
            <Typography variant="body2" sx={{ color: '#64748B', mb: 4 }}>
              Sign in to manage your portfolio
            </Typography>

            {/* Form */}
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ textAlign: 'left', mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#334155', fontWeight: 500, mb: 0.5, display: 'block' }}>
                  Name
                </Typography>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  placeholder="username"
                  variant="outlined"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#94A3B8' }} />
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

              <Box sx={{ textAlign: 'left', mb: 4 }}>
                <Typography variant="caption" sx={{ color: '#334155', fontWeight: 500, mb: 0.5, display: 'block' }}>
                  Password
                </Typography>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  variant="outlined"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  inputRef={passwordRef}
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
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
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

              <Button
                fullWidth
                type="submit"
                variant="contained"
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
                LogIn
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;