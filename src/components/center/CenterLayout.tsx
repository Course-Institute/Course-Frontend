import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import CenterSidebar from './CenterSidebar';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 280;

interface CenterLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const CenterLayout = ({ children, title = "Center Dashboard" }: CenterLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    
    
    if (!token || !role || role !== 'center') {
      navigate('/login?role=center');
    }
  }, [navigate]);

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };


  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#f8fafc'
    }}>
      <CenterSidebar 
        open={sidebarOpen} 
        onClose={handleDrawerToggle} 
        drawerWidth={drawerWidth} 
      />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          width: '100%',
          ml: { 
            xs: 0,
            md: sidebarOpen ? `${drawerWidth}px` : 0 
          },
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: 'white',
            borderBottom: '1px solid #e2e8f0',
            p: 2.3,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            zIndex: 1000,
          }}
        >
          {/* Toggle Button - Only show on desktop when sidebar is closed or on mobile */}
          <Box sx={{ display: { xs: 'block', md: sidebarOpen ? 'none' : 'block' } }}>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: '#64748b',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                  color: '#1e293b',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#1e293b',
              textAlign: 'center',
              flexGrow: 1,
            }}
          >
            {title}
          </Typography>

          {/* Spacer to center the title */}
          <Box sx={{ width: { xs: 'auto', md: sidebarOpen ? 'auto' : '48px' } }} />
        </Box>

        {/* Page Content - Takes remaining space */}
        <Box sx={{ 
          flexGrow: 1,
          width: '100%',
          height: 'calc(100vh - 80px)', // Subtract header height
          overflow: 'auto',
          p: { xs: 2, sm: 3 },
          pr: { xs: 2, sm: 3, md: 4 }, // Extra right padding
          boxSizing: 'border-box',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a8a8a8',
          },
        }}>
          {children}
        </Box>
      </Box>

    </Box>
  );
};

export default CenterLayout;
