import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle as MuiDialogTitle,
  IconButton as MuiIconButton,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';
import Button from '../Button/Button';
import CloseIcon from '@mui/icons-material/Close';

interface Action {
  color?: string;
  textColor?: string;
  text: string;
  handler: () => void;
  variant?: any;
}

interface ConfirmationDialogProps {
  open: any;
  title: ReactNode;
  description?: ReactNode;
  actions: Action[];
  handleClose: () => void;
  showCloseIcon?: boolean; // New prop to control the close icon
  style?: any;
  maxWidth?: string;
}

const DialogTitleContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 16px ',
});

const DialogTitle = styled(MuiDialogTitle)(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(2),
  paddingLeft: 0,
  paddingRight: 0,
  display: 'flex',
  alignItems: 'center',
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    padding: theme.spacing(2),
    maxWidth: '400px',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: '100px',
}));

function ConfirmationDialog(props: ConfirmationDialogProps) {
  const { showCloseIcon = false } = props; // Default to showing the close icon

  return (
    <StyledDialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ ...props.style }}
    >
      <DialogTitleContainer>
        <DialogTitle id="customized-dialog-title">
          <Typography p={0} variant="h3">
            {props.title}
          </Typography>
        </DialogTitle>
        {showCloseIcon && (
          <MuiIconButton aria-label="close" onClick={props.handleClose}>
            <CloseIcon sx={{ color: 'black' }} />
          </MuiIconButton>
        )}
      </DialogTitleContainer>
      <DialogContent sx={{ padding: '16px' }}>
        <DialogContentText id="alert-dialog-description" sx={{ textAlign: 'left' }}>
          <Typography>{props.description}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
        {props.actions.map(action => (
          <StyledButton
            key={action.text}
            variant={action.variant || 'contained'}
            sx={{
              width: '100%',
              backgroundColor: action.color,
              color: action.textColor,
              boxShadow: 'none',
              padding: '10px 40px',
              '&:nth-child(2)': {
                marginLeft: '16px',
              },
              "&:hover": {
                backgroundColor: action.color, 
                boxShadow: 'none',
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              action.handler();
              props.handleClose();
            }}
          >
            <Typography variant="body" color={action.textColor}>
              {action.text}
            </Typography>
          </StyledButton>
        ))}
      </DialogActions>
    </StyledDialog>
  );
}

export default ConfirmationDialog;
