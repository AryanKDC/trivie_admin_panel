import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
  Container,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Implement actual login logic here
    console.log('Login with:', email, password);
    navigate('/');
  };

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
            <form onSubmit={handleLogin}>
              <Box sx={{ textAlign: 'left', mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#334155', fontWeight: 500, mb: 0.5, display: 'block' }}>
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon sx={{ color: '#94A3B8' }} />
                      </InputAdornment>
                    ),
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
                  type="password"
                  placeholder="Enter your password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: '#94A3B8' }} />
                      </InputAdornment>
                    ),
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
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;