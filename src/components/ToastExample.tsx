import React from 'react';
import { Button, Box, Typography, Grid } from '@mui/material';
import { useToast } from '../contexts/ToastContext';

/**
 * Example component demonstrating how to use the global toast system
 * This component can be used anywhere in the application
 */
const ToastExample: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo, showToast } = useToast();

  const handleSuccess = () => {
    showSuccess('Operation completed successfully!');
  };

  const handleError = () => {
    showError('Something went wrong! Please try again.');
  };

  const handleWarning = () => {
    showWarning('Please check your input before proceeding.');
  };

  const handleInfo = () => {
    showInfo('This is an informational message.');
  };

  const handleCustom = () => {
    showToast('Custom toast with info severity', 'info');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Toast Notification Examples
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Click the buttons below to see different types of toast notifications.
        These toasts are global and can be used anywhere in the application.
      </Typography>
      
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleSuccess}
          >
            Success Toast
          </Button>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleError}
          >
            Error Toast
          </Button>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Button
            variant="contained"
            color="warning"
            fullWidth
            onClick={handleWarning}
          >
            Warning Toast
          </Button>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Button
            variant="contained"
            color="info"
            fullWidth
            onClick={handleInfo}
          >
            Info Toast
          </Button>
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleCustom}
            sx={{ mt: 2 }}
          >
            Custom Toast
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ToastExample;
