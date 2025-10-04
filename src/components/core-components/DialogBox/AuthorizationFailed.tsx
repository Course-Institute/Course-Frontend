import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Primary } from '../../color-palette/colors';
import { Box } from '@mui/material';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const AuthorizationFailed = ({ isFeature }: any) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const handleClose = () => {
    setOpen(false);
    history.back();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '.MuiDialog-paper': {
            borderRadius: '12px',
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <DialogTitle id="alert-dialog-title">Authorization Failed</DialogTitle>
        </Box>
        <DialogContent
          sx={{
            paddingTop: '0px',
            paddingBottom: '0px',
          }}
        >
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              color: '#000000DE',
            }}
          >
            {isFeature
              ? 'Authorization failed for feature name'
              : 'You don’t have the Authorization to access it'}
          </DialogContentText>
        </DialogContent>
        <DialogContent>
          <Button
            variant="contained"
            disableElevation
            fullWidth
            sx={{
              background: Primary[500],
              padding: '0.5rem',
            }}
            onClick={() => (navigate as any)(-1, { replace: true })}
          >
            Go Back
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthorizationFailed;
