import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import Sidebar from '../components/admin/Sidebar';
import DashboardContent from '../components/admin/DashboardContent';
import SessionWarning from '../components/SessionWarning';
import { useSession } from '../contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';


const drawerWidth = 280;

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Open by default on desktop, closed on mobile
  const { isAuthenticated, logout, extendSession, timeRemaining } = useSession();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?role=app');
    }
  }, [isAuthenticated, navigate]);

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show warning when less than 1 minute remaining
  const showWarning = timeRemaining < 60000 && timeRemaining > 0;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
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
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: sidebarOpen ? 0 : `-${drawerWidth}px`,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
        }}
      >
        {/* Top Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
            backgroundColor: 'white',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!sidebarOpen && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                edge="start"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#1e293b',
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              Admin Panel
            </Typography>
          </Box>

          {/* User Info / Logout Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Welcome, Admin
            </Typography>
          </Box>
        </Box>

        {/* Dashboard Content */}
        <Box sx={{ p: 3 }}>
          <DashboardContent />
        </Box>
      </Box>
      
      {/* Session Warning Dialog */}
      <SessionWarning
        open={showWarning}
        onExtend={extendSession}
        onLogout={logout}
      />
    </Box>
  );
};

export default AdminDashboard;
