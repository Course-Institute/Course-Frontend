import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import { useSession, formatTimeRemaining } from '../contexts/SessionContext';

interface SessionWarningProps {
  open: boolean;
  onExtend: () => void;
  onLogout: () => void;
}

const SessionWarning: React.FC<SessionWarningProps> = ({ open, onExtend, onLogout }) => {
  const { timeRemaining } = useSession();
  
  const progress = (timeRemaining / (5 * 60 * 1000)) * 100; // 5 minutes in milliseconds
  
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ef4444' }}>
          Session Expiring Soon
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', py: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: '#64748b', mb: 2 }}>
            Your session will expire in:
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ef4444', mb: 2 }}>
            {formatTimeRemaining(timeRemaining)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#fef2f2',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#ef4444',
              },
            }}
          />
        </Box>
        
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Would you like to extend your session or logout?
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', gap: 2, p: 3 }}>
        <Button
          variant="outlined"
          onClick={onLogout}
          sx={{
            borderColor: '#ef4444',
            color: '#ef4444',
            '&:hover': {
              backgroundColor: '#fef2f2',
              borderColor: '#dc2626',
            },
            px: 4,
            py: 1,
          }}
        >
          Logout
        </Button>
        <Button
          variant="contained"
          onClick={onExtend}
          sx={{
            backgroundColor: '#10b981',
            '&:hover': {
              backgroundColor: '#059669',
            },
            px: 4,
            py: 1,
          }}
        >
          Extend Session
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionWarning;
