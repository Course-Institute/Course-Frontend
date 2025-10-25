import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { Warning } from '@mui/icons-material';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  severity?: 'warning' | 'error' | 'info' | 'success';
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  severity = 'warning',
}) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'error':
        return '#ef4444';
      case 'success':
        return '#10b981';
      case 'info':
        return '#3b82f6';
      case 'warning':
      default:
        return '#f59e0b';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: `${getSeverityColor()}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Warning sx={{ color: getSeverityColor(), fontSize: 24 }} />
          </Box>
          <Box>
            <Box
              sx={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1e293b',
                lineHeight: 1.2,
              }}
            >
              {title}
            </Box>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2, pb: 3 }}>
        <DialogContentText
          sx={{
            fontSize: '1rem',
            color: '#64748b',
            lineHeight: 1.5,
            mb: 0,
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          sx={{
            color: '#64748b',
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#f1f5f9',
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          variant="contained"
          sx={{
            backgroundColor: getSeverityColor(),
            color: 'white',
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: getSeverityColor(),
              filter: 'brightness(0.9)',
            },
            '&:disabled': {
              backgroundColor: '#9ca3af',
              color: 'white',
            },
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} color="inherit" />
              Processing...
            </Box>
          ) : (
            confirmText
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
