import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import InstituteLogo from './InstituteLogo';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLoginClick = (loginType: string) => {
    // Navigate to login page with role parameter
    navigate(`/login?role=${loginType.toLowerCase()}`);
    setMobileOpen(false); // Close mobile drawer if open
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogoClick = () => {
    // Navigate to homepage unless we're in an admin panel
    const currentPath = window.location.pathname;
    if (currentPath.includes('/admin') || currentPath.includes('/dashboard')) {
      // If in admin panel, stay there or navigate to admin dashboard
      navigate('/admin-dashboard');
    } else {
      // Otherwise, navigate to homepage
      navigate('/');
    }
    setMobileOpen(false);
  };


  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'About Us', path: '/about' },
    { id: 'programs', label: 'Programs', path: '/programs' },
    { id: 'alumni', label: 'Alumni', path: '/alumni' },
    { id: 'affiliation', label: 'Affiliation', path: '/affiliation' },
    { id: 'contact', label: 'Contact', path: '/contact' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: theme.palette.grey[50],
          },
          transition: 'background-color 0.2s ease',
        }}
        onClick={handleLogoClick}
      >
        <InstituteLogo width={30} height={30} sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          MIVPS
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
                color: 'white',
              },
            }}
          >
            <ListItemText
              primary={item.label}
              sx={{
                color: window.location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                fontWeight: window.location.pathname === item.path ? 'bold' : 'normal',
              }}
            />
          </ListItem>
        ))}
        <ListItem sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleLoginClick('Student')}
              sx={{
                backgroundColor: theme.palette.primary.main,
                '&:hover': { backgroundColor: theme.palette.primary.dark },
                textTransform: 'none',
              }}
            >
              Student Login
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleLoginClick('Center')}
              sx={{
                backgroundColor: theme.palette.secondary.main,
                '&:hover': { backgroundColor: theme.palette.secondary.dark },
                textTransform: 'none',
              }}
            >
              Center Login
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleLoginClick('App')}
              sx={{
                backgroundColor: theme.palette.success?.main || '#4caf50',
                '&:hover': { backgroundColor: theme.palette.success?.dark || '#388e3c' },
                textTransform: 'none',
              }}
            >
              App Login
            </Button>
          </Box>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {/* Logo */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mr: 4, 
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
              transition: 'opacity 0.2s ease',
            }}
            onClick={handleLogoClick}
          >
            <InstituteLogo width={30} height={30} sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              MIVPS
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    color: window.location.pathname === item.path ? theme.palette.primary.main : 'text.primary',
                    fontWeight: window.location.pathname === item.path ? 'bold' : 'normal',
                    textTransform: 'none',
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '100%',
                        height: 2,
                        backgroundColor: theme.palette.primary.main,
                      },
                    },
                    '&::after': window.location.pathname === item.path ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '100%',
                      height: 2,
                      backgroundColor: theme.palette.primary.main,
                    } : {},
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Desktop Login Buttons */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleLoginClick('Student')}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': { backgroundColor: theme.palette.primary.dark },
                  textTransform: 'none',
                  px: 2,
                }}
              >
                Student Login
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleLoginClick('Center')}
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  '&:hover': { backgroundColor: theme.palette.secondary.dark },
                  textTransform: 'none',
                  px: 2,
                }}
              >
                Center Login
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleLoginClick('App')}
                sx={{
                  backgroundColor: theme.palette.success?.main || '#4caf50',
                  '&:hover': { backgroundColor: theme.palette.success?.dark || '#388e3c' },
                  textTransform: 'none',
                  px: 2,
                }}
              >
                App Login
              </Button>
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: 'auto' }}
            >
              <MenuIcon sx={{ color: theme.palette.primary.main }} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
