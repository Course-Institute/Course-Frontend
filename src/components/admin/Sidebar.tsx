import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import {
  Dashboard,
  People,
  CreditCard,
  Upload,
  Payment,
  Business,
  Assessment,
  School,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { useSession, formatTimeRemaining } from '../../contexts/SessionContext';
import { useNavigate, useLocation } from 'react-router-dom';
interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

const Sidebar = ({ open, onClose, drawerWidth }: SidebarProps) => {
  const { logout, timeRemaining } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    // In admin panel, clicking logo should stay in admin dashboard
    navigate('/admin-dashboard');
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  const menuItems = [
    { id: 1, label: 'Dashboard', icon: <Dashboard />, path: '/admin-dashboard' },
    { id: 2, label: 'Manage Students', icon: <People />, path: '/admin/students' },
    { id: 3, label: 'ID Card Management', icon: <CreditCard />, path: '/admin/id-cards' },
    { id: 4, label: 'Upload Results', icon: <Upload />, path: '/admin/upload-results' },
    { id: 5, label: 'Payment Tracking', icon: <Payment />, path: '/admin/payments' },
    { id: 6, label: 'Manage Centers', icon: <Business />, path: '/admin/centers' },
    { id: 7, label: 'Reports', icon: <Assessment />, path: '/admin/reports' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
            },
            transition: 'opacity 0.2s ease',
          }}
          onClick={handleLogoClick}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <School sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#1e293b',
              fontSize: '1.1rem',
            }}
          >
            Admin Panel
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
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

      {/* Navigation Menu */}
      <List sx={{ flex: 1, pt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.id} disablePadding sx={{ px: 2, mb: 1 }}>
              <ListItemButton
                onClick={() => handleMenuItemClick(item.path)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? '#1e293b' : 'transparent',
                  color: isActive ? 'white' : '#64748b',
                  '&:hover': {
                    backgroundColor: isActive ? '#1e293b' : '#f1f5f9',
                    color: isActive ? 'white' : '#1e293b',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
              <ListItemIcon
                sx={{
                  color: 'inherit',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 600 : 500,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
        {/* Session Timer */}
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: timeRemaining < 60000 ? '#ef4444' : '#64748b',
              fontSize: '0.75rem',
              fontWeight: 'medium',
            }}
          >
            Session: {formatTimeRemaining(timeRemaining)}
          </Typography>
        </Box>
        
        {/* Logout Button */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={logout}
          sx={{
            color: '#ef4444',
            borderColor: '#ef4444',
            '&:hover': {
              backgroundColor: '#fef2f2',
              borderColor: '#dc2626',
            },
            fontSize: '0.875rem',
            fontWeight: 'medium',
            py: 1,
          }}
        >
          Logout
        </Button>
        
        <Typography
          variant="body2"
          sx={{
            color: '#94a3b8',
            textAlign: 'center',
            fontSize: '0.7rem',
            mt: 1,
          }}
        >
          © 2024 Course Institute
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            height: '100vh',
            borderRight: '1px solid #e2e8f0',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer - Only render when open */}
      {open && (
        <Drawer
          variant="persistent"
          anchor="left"
          open={open}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              height: '100vh',
              borderRight: '1px solid #e2e8f0',
              backgroundColor: 'white',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
