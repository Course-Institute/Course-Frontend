import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Breadcrumbs,
  Link,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Lock as LockIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import StudentSidebar from './StudentSidebar';
import { useSession } from '../../contexts/SessionContext';

interface StudentLayoutProps {
  children: React.ReactNode;
  activeMenuItem?: string;
  onMenuItemClick?: (item: string) => void;
  pageTitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

const StudentLayout: React.FC<StudentLayoutProps> = ({
  children,
  activeMenuItem = 'profile',
  onMenuItemClick,
  pageTitle = 'Student Dashboard',
  breadcrumbs = [{ label: 'Home' }, { label: pageTitle }],
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useSession();

  const handleMenuClick = (item: string) => {
    if (onMenuItemClick) {
      onMenuItemClick(item);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handlePasswordChange = () => {
    // TODO: Implement password change functionality
    console.log('Password change clicked');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <StudentSidebar
          activeItem={activeMenuItem}
          onItemClick={handleMenuClick}
        />
      )}

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top App Bar */}
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            backgroundColor: 'white',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Left side - Menu button and breadcrumbs */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                sx={{ 
                  color: '#666',
                  mr: 2,
                }}
              >
                <MenuIcon />
              </IconButton>

              {/* Breadcrumbs */}
              <Breadcrumbs sx={{ color: '#666' }}>
                {breadcrumbs.map((crumb, index) => (
                  <Link
                    key={index}
                    href={crumb.href}
                    underline="hover"
                    color="inherit"
                    sx={{ 
                      fontSize: '0.875rem',
                      '&:hover': { color: '#1976d2' },
                    }}
                  >
                    {crumb.label}
                  </Link>
                ))}
              </Breadcrumbs>
            </Box>

            {/* Right side - Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                startIcon={<LockIcon />}
                onClick={handlePasswordChange}
                sx={{
                  color: '#666',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                Password change
              </Button>
              
              <Button
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  color: '#666',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ flex: 1, backgroundColor: '#f5f5f5' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default StudentLayout;
