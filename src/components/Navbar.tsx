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
import LayoutWrapper from './LayoutWrapper';

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
    { id: 'about', label: 'About Us', path: '/about-us' },
    { id: 'programs', label: 'Programs', path: '/programs' },
    { id: 'alumni', label: 'Alumni', path: '/alumni' },
    { id: 'affiliation', label: 'Affiliation', path: '/affiliation' },
    { id: 'verification', label: 'Verification', path: '/verification' },
    { id: 'contact', label: 'Contact Us', path: '/contact-us' },
  ];

  const drawer = (
    <Box sx={{ width: 280, height: '100%', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      {/* Simple Mobile Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 3, 
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.9,
          },
          transition: 'opacity 0.3s ease',
        }}
        onClick={handleLogoClick}
      >
        <InstituteLogo width={32} height={32} sx={{ color: '#2563eb' }} />
      </Box>
      
      {/* Navigation Items */}
      <List sx={{ px: 2, py: 1 }}>
        {navItems.map((item) => (
          <ListItem
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: 2,
              mb: 1,
              cursor: 'pointer',
              backgroundColor: window.location.pathname === item.path ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
              border: window.location.pathname === item.path ? '2px solid #2563eb' : '2px solid transparent',
              '&:hover': {
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                transform: 'translateX(4px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ListItemText
              primary={item.label}
              sx={{
                color: window.location.pathname === item.path ? '#2563eb' : '#475569',
                fontWeight: window.location.pathname === item.path ? 'bold' : '600',
                fontSize: '1rem',
              }}
            />
          </ListItem>
        ))}
      </List>
      
      {/* Mobile Login Buttons */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
          Access Portal
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleLoginClick('Student')}
            sx={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white',
              textTransform: 'none',
              py: 1.5,
              borderRadius: 3,
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px rgba(37, 99, 235, 0.5)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Student Login
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleLoginClick('Center')}
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              textTransform: 'none',
              py: 1.5,
              borderRadius: 3,
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.5)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Center Login
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleLoginClick('App')}
            sx={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              textTransform: 'none',
              py: 1.5,
              borderRadius: 3,
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.5)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            App Login
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <LayoutWrapper>
      {/* Header Image */}
      <Box
        sx={{
          width: '100%',
          height: '40vh',
          backgroundImage: 'url(/images/header/header-banner.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        {/* Optional: Add text content here if needed */}
        <Box sx={{ position: 'relative' }}>
          {/* You can add header text or logo here if needed */}
        </Box>
      </Box>

      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          {/* Logo Only */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.02)',
              },
              transition: 'all 0.3s ease',
            }}
            onClick={handleLogoClick}
          >
            <InstituteLogo width={60} height={60} sx={{ color: '#2563eb' }} />
          </Box>

          {/* All Navigation Items in One Line */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            flexGrow: 1, 
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'nowrap',
            overflow: 'hidden'
          }}>
            {navItems.map((item) => (
              <Button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  color: window.location.pathname === item.path ? '#2563eb' : '#475569',
                  fontWeight: window.location.pathname === item.path ? 'bold' : '600',
                  textTransform: 'none',
                  position: 'relative',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontSize: '0.9rem',
                  minWidth: 'auto',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    color: '#2563eb',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                  },
                  '&::before': window.location.pathname === item.path ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%',
                    height: 3,
                    background: 'linear-gradient(90deg, #2563eb, #10b981)',
                    borderRadius: '2px 2px 0 0',
                  } : {},
                  transition: 'all 0.3s ease',
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Login Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleLoginClick('Student')}
              sx={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: 'white',
                textTransform: 'none',
                px: 2,
                py: 1,
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: '0.8rem',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Student
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleLoginClick('Center')}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                textTransform: 'none',
                px: 2,
                py: 1,
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: '0.8rem',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Center
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleLoginClick('App')}
              sx={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                textTransform: 'none',
                px: 2,
                py: 1,
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: '0.8rem',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              App
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                ml: 'auto',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.2)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <MenuIcon sx={{ color: '#2563eb' }} />
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
    </LayoutWrapper>
  );
};

export default Navbar;
