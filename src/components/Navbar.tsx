import { useState, useEffect } from 'react';
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
import { School } from '@mui/icons-material';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLoginClick = (loginType: string) => {
    console.log(`${loginType} login clicked`);
    alert(`${loginType} login page will be implemented soon!`);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setMobileOpen(false);
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'impact', 'reviews'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'impact', label: 'Impact' },
    { id: 'reviews', label: 'Reviews' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <School sx={{ fontSize: 30, color: theme.palette.primary.main, mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          Course Institute
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.id}
            button
            onClick={() => scrollToSection(item.id)}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
                color: 'white',
              },
            }}
          >
            <ListItemText
              primary={item.label}
              sx={{
                color: activeSection === item.id ? theme.palette.primary.main : 'inherit',
                fontWeight: activeSection === item.id ? 'bold' : 'normal',
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
        position="static"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <School sx={{ fontSize: 30, color: theme.palette.primary.main, mr: 1 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Course Institute
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  sx={{
                    color: activeSection === item.id ? theme.palette.primary.main : 'text.primary',
                    fontWeight: activeSection === item.id ? 'bold' : 'normal',
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
                    '&::after': activeSection === item.id ? {
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
