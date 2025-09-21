import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';
import SessionWarning from '../SessionWarning';
import { useSession } from '../../contexts/SessionContext';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 280;

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout = ({ children, title = "Admin Panel" }: AdminLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { isAuthenticated, logout, extendSession, timeRemaining } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?role=app');
    }
  }, [isAuthenticated, navigate]);

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const showWarning = timeRemaining < 60000 && timeRemaining > 0;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        open={sidebarOpen} 
        onClose={handleDrawerToggle} 
        drawerWidth={drawerWidth} 
      />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          ml: { 
            xs: 0,
            md: sidebarOpen ? `${drawerWidth}px` : 0 
          },
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
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

        {/* Page Content */}
        <Box sx={{ 
          flexGrow: 1,
          width: '100%',
          minHeight: 'calc(100vh - 80px)', // Subtract header height
        }}>
          {children}
        </Box>
      </Box>

      {/* Session Warning Modal */}
      <SessionWarning
        open={showWarning}
        onExtend={extendSession}
        onLogout={logout}
      />
    </Box>
  );
};

export default AdminLayout;
