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
  Assessment,
  Logout as LogoutIcon,
  PersonAdd,
  Payment,
  Assignment,
} from '@mui/icons-material';
import InstituteLogo from '../InstituteLogo';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';

interface CenterSidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

const CenterSidebar = ({ open, onClose, drawerWidth }: CenterSidebarProps) => {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('keepSignedIn');
    localStorage.removeItem('studentRegistrationNumber');
    localStorage.removeItem('centerId');
    localStorage.removeItem('centerName');
    navigate('/login?role=center');
  };
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    // In center panel, clicking logo should stay in center dashboard
    navigate('/center-dashboard');
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  const menuItems = [
    { id: 1, label: 'Dashboard', icon: <Dashboard />, path: '/center-dashboard' },
    { id: 2, label: 'Add Student', icon: <PersonAdd />, path: '/center/add-student' },
    { id: 3, label: 'Manage Students', icon: <People />, path: '/center/students' },
    { id: 4, label: 'Create Bill', icon: <Payment />, path: '/center/create-bill' },
    { id: 5, label: 'Manage Bills', icon: <Assessment />, path: '/center/bills' },
    { id: 6, label: 'ID Card Management', icon: <CreditCard />, path: '/center/id-cards' },
    { id: 7, label: 'Upload Results', icon: <Upload />, path: '/center/upload-results' },
    { id: 8, label: 'Add Marksheet', icon: <Assignment />, path: '/center/add-marksheet' },
    // { id: 9, label: 'Payment Tracking', icon: <Payment />, path: '/center/payments' },
    // { id: 10, label: 'Reports', icon: <Assessment />, path: '/center/reports' },
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
            <InstituteLogo width={24} height={24} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#1e293b',
              fontSize: '1.1rem',
            }}
          >
            Center Panel
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
        
        {/* Logout Button */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
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
          © 2024 MIVPS
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

export default CenterSidebar;
