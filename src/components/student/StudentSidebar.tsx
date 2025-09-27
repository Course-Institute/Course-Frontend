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
  Dashboard,
  Person,
  Support,
  Payment,
  Assignment,
  Science,
  Build,
  Quiz,
  Description,
  School,
  LocalShipping,
} from '@mui/icons-material';
import InstituteLogo from '../InstituteLogo';

interface StudentSidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({ activeItem, onItemClick }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { id: 'profile', label: 'Student Profile', icon: <Person /> },
    { id: 'support', label: 'Support', icon: <Support /> },
    { id: 'fees', label: 'Fees', icon: <Payment /> },
    { id: 'assignments', label: 'Assignments', icon: <Assignment /> },
    { id: 'lab', label: 'Lab', icon: <Science /> },
    { id: 'project', label: 'Project', icon: <Build /> },
    { id: 'exam-form', label: 'Examination Form', icon: <Quiz /> },
    { id: 'question-paper', label: 'Question Paper', icon: <Description /> },
    { id: 'result', label: 'Result', icon: <School /> },
    { id: 'courier', label: 'Courier', icon: <LocalShipping /> },
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
        <InstituteLogo width={40} height={40} sx={{ filter: 'brightness(0) invert(1)' }} />
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
                  borderRadius: 1,
                  mx: 1,
                  backgroundColor: activeItem === item.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: activeItem === item.id 
                      ? 'rgba(255, 255, 255, 0.25)' 
                      : 'rgba(255, 255, 255, 0.1)',
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
                      fontSize: '0.9rem',
                      fontWeight: activeItem === item.id ? 'bold' : 'normal',
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
