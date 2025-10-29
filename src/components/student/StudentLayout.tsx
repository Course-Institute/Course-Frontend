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
  Logout as LogoutIcon,
} from '@mui/icons-material';
import StudentSidebar from './StudentSidebar';

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
  const handleMenuClick = (item: string) => {
    if (onMenuItemClick) {
      onMenuItemClick(item);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('keepSignedIn');
    localStorage.removeItem('studentRegistrationNumber');
    window.location.href = '/login?role=student';
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
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          marginLeft: sidebarOpen ? '280px' : 0,
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* Top App Bar */}
        <AppBar 
          position="fixed" 
          elevation={0}
          sx={{ 
            backgroundColor: 'white',
            borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            width: sidebarOpen ? 'calc(100% - 280px)' : '100%',
            marginLeft: sidebarOpen ? '280px' : 0,
            transition: 'width 0.3s ease, margin-left 0.3s ease',
            zIndex: 900,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Left side - Menu button and breadcrumbs */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                sx={{ 
                  color: '#64748b',
                  mr: 2,
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                    color: '#1976d2',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <MenuIcon />
              </IconButton>

              {/* Breadcrumbs */}
              <Breadcrumbs 
                sx={{ 
                  color: '#64748b',
                  '& .MuiBreadcrumbs-separator': {
                    color: '#94a3b8',
                  },
                }}
              >
                {breadcrumbs.map((crumb, index) => (
                  <Link
                    key={index}
                    href={crumb.href}
                    underline="hover"
                    color="inherit"
                    sx={{ 
                      fontSize: '0.875rem',
                      fontWeight: index === breadcrumbs.length - 1 ? 600 : 400,
                      color: index === breadcrumbs.length - 1 ? '#1e293b' : '#64748b',
                      '&:hover': { color: '#1976d2' },
                      transition: 'color 0.2s ease',
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
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  color: '#64748b',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                    color: '#dc2626',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box 
          sx={{ 
            flex: 1, 
            background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
            marginTop: '64px', // AppBar height
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default StudentLayout;
