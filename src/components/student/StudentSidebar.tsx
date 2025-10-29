import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Person,
  FilePresent,
} from '@mui/icons-material';

interface StudentSidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({ activeItem, onItemClick }) => {
  const menuItems = [
    { id: 'profile', label: 'Student Profile', icon: <Person /> },
    { id: 'marksheet', label: 'Marksheet', icon: <FilePresent /> },
  ];

  return (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        backgroundColor: '#1976d2',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src="/institute-logo.svg"
            alt="MIVPS Logo"
            sx={{
              width: '100%',
              height: '100%',
              padding: 0.5,
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)',
            }}
            onError={(e: any) => {
              // Hide image if it fails to load
              e.target.style.display = 'none';
              // Show a simple "M" as fallback
              const parent = e.target.parentElement;
              if (parent && !parent.querySelector('.logo-fallback')) {
                const fallback = document.createElement('div');
                fallback.className = 'logo-fallback';
                fallback.textContent = 'M';
                fallback.style.cssText = 'color: white; font-weight: bold; font-size: 24px; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;';
                parent.appendChild(fallback);
              }
            }}
          />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            MIVPS
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
            Student Portal
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ px: 1, py: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => onItemClick(item.id)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  backgroundColor: activeItem === item.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: activeItem === item.id 
                      ? 'rgba(255, 255, 255, 0.25)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.95rem',
                      fontWeight: activeItem === item.id ? 700 : 500,
                      letterSpacing: '0.3px',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.75rem' }}>
          © 2024 MIVPS. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default StudentSidebar;
