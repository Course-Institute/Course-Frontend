import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddStudentForm from '../../components/AddStudentForm';
import { useToast } from '../../contexts/ToastContext';

const CenterAddStudentPage: React.FC = () => {
  const [centerInfo, setCenterInfo] = useState<{ centerId: string; centerName: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get center information from localStorage
    const centerId = localStorage.getItem('centerId');
    const centerName = localStorage.getItem('centerName');
    
    if (centerId && centerName) {
      setCenterInfo({ centerId, centerName });
    } else {
      showToast('Center information not found. Please login again.', 'error');
    }
    setIsLoading(false);
  }, [showToast]);

  const handleClose = () => {
    // Navigate to center student list page after successful student creation
    navigate('/center/students');
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!centerInfo) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Center information not found. Please login again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      py: 3,
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#1e293b',
            mb: 2,
            textAlign: 'center',
          }}
        >
          Add New Student
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: '#64748b',
            mb: 4,
            textAlign: 'center',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          Register a new student for your center: <strong>{centerInfo.centerName}</strong>
        </Typography>

        <AddStudentForm 
          onClose={handleClose}
          preFilledCenter={{
            centerId: centerInfo.centerId,
            centerName: centerInfo.centerName,
            name: centerInfo.centerName
          }}
        />
      </Box>
    </Box>
  );
};

export default CenterAddStudentPage;
