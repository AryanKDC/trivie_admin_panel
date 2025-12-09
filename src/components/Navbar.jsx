import * as React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const navLinks = [
  { name: 'Portfolio', path: '/', icon: <FolderOpenOutlinedIcon /> },
  { name: 'Categories', path: '/category', icon: <LocalOfferOutlinedIcon /> },
  { name: 'Users', path: '/users', icon: <PeopleOutlineIcon /> }
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, height: '100%', display: 'flex', flexDirection: 'column' }} role="presentation" onClick={handleDrawerToggle}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ px: 2, mb: 2, textAlign: 'center' }}>
        <img src="/company_logo.png" alt="Logo" style={{ height: 40 }} />
      </Box>
      <List>
        {navLinks.map((link) => {
          const active = isActive(link.path);
          return (
            <ListItem key={link.name} disablePadding>
              <ListItemButton
                component={Link}
                to={link.path}
                sx={{
                  color: active ? '#E53935' : '#7D8FA9',
                  bgcolor: active ? 'rgba(229, 57, 53, 0.08)' : 'transparent',
                  borderRadius: 2,
                  mx: 1,
                  mb: 1,
                }}
              >
                <ListItemIcon sx={{ color: active ? '#E53935' : '#7D8FA9', minWidth: 40 }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText primary={link.name} primaryTypographyProps={{ fontWeight: active ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutOutlinedIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

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
      <Container maxWidth="lg">
        {/* 🔝 Top Section */}
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            minHeight: { xs: '64px', md: '95px !important' }, // taller header on desktop only
            px: '0 !important'
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src="/company_logo.png"
            alt="Logo"
            sx={{
              height: { xs: 40, md: 60 }, // responsive logo size
              cursor: 'pointer',
              objectFit: 'contain'
            }}
            onClick={() => navigate('/')}
          />

          {/* Desktop Logout - Hidden on Mobile */}
          <Button
            onClick={handleLogout}
            startIcon={<LogoutOutlinedIcon sx={{ fontSize: 26 }} />} // bigger icon
            sx={{
              display: { xs: 'none', md: 'flex' },
              textTransform: 'none',
              color: '#5A6B89',
              fontSize: '1.1rem',
              fontWeight: 500,
              '&:hover': { bgcolor: 'transparent', color: '#333' }
            }}
          >
            Logout
          </Button>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, ml: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>

        {/* 🧭 Nav Links - Desktop Only */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
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
                  width: 120,
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

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default Navbar;
