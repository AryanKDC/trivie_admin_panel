import * as React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const navLinks = [
  { name: 'Portfolio', path: '/', icon: <FolderOpenOutlinedIcon /> },
  { name: 'Categories', path: '/category', icon: <LocalOfferOutlinedIcon /> },
  { name: 'Users', path: '/users', icon: <PeopleOutlineIcon /> }
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <AppBar
      position="static"
      color="default"
      sx={{
        bgcolor: 'white',
        boxShadow: 'none',
        borderBottom: '1px solid #e0e0e0'
      }}
    >
      <Container maxWidth="xl">
        {/* 🔝 Top Section */}
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            minHeight: '95px !important', // taller header
            px: '0 !important'
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src="/company_logo.png"
            alt="Logo"
            sx={{
              height: 60, // bigger logo
              cursor: 'pointer',
              objectFit: 'contain'
            }}
            onClick={() => navigate('/')}
          />

          {/* Logout */}
          <Button
            onClick={handleLogout}
            startIcon={<LogoutOutlinedIcon sx={{ fontSize: 26 }} />} // bigger icon
            sx={{
              textTransform: 'none',
              color: '#5A6B89',
              fontSize: '1.1rem',
              fontWeight: 500,
              '&:hover': { bgcolor: 'transparent', color: '#333' }
            }}
          >
            Logout
          </Button>
        </Toolbar>

        {/* 🧭 Nav Links */}
        <Box
          sx={{
            display: 'flex',
            gap: 6, // more spacing horizontally
            mt: 2.5, // spacing from top
          }}
        >
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Box
                key={link.name}
                component={Link}
                to={link.path}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                  textDecoration: 'none',
                  pb: 2,
                  borderBottom: active
                    ? '3px solid #E53935'
                    : '3px solid transparent',
                  width: 120, // 🔥 longer underline than word
                  justifyContent: 'center',
                  color: active ? '#E53935' : '#7D8FA9',
                  transition: 'all 0.25s',
                  '&:hover': { color: '#E53935' }
                }}
              >
                {React.cloneElement(link.icon, { sx: { fontSize: 24 } })} {/* bigger icons */}
                <Typography
                  sx={{
                    fontSize: '1.05rem', // bigger text
                    fontWeight: active ? 600 : 450
                  }}
                >
                  {link.name}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Container>
    </AppBar>
  );
}

export default Navbar;
