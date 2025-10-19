import {
  Dialog as MuiDialog,
  DialogActions as MuiDialogActions,
  DialogContent as MuiDialogContent,
  DialogTitle as MuiDialogTitle,
  Typography,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { type MouseEventHandler } from 'react';
import CloseIcon from '@mui/icons-material/Close'; // Importing the close icon
import Button from '../Button/Button';

const DialogBoxStyle = styled(MuiDialog, {
  shouldForwardProp: prop => prop !== 'width' && prop !== 'maxWidth',
})<{
  width?: string | number;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string | number;
  minHeight?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string | number;
  height?: string | number;
  dialogStyles?: any;
  minWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string | number;
  maxHeight?: string | number;
  padding?: string | number;
  contentPadding?: string | number;
  hideScrollbar?: boolean;
}>(
  ({
    theme,
    width,
    maxWidth,
    height,
    minHeight,
    minWidth,
    dialogStyles,
    padding,
    contentPadding,
    maxHeight,
    hideScrollbar,
  }) => ({
    '& .MuiDialog-paper': {
      padding: padding || theme.spacing(4),
      margin: 'auto',
      minWidth: minWidth || '200px',
      minHeight: minHeight || '200px',
      width: width || 'auto',
      maxWidth: maxWidth || '1000px',
      borderRadius: '12px',
      height: height || 'auto',
      maxHeight: maxHeight || 'auto',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        margin: '16px',
        maxWidth: '100%',
        minWidth: 'auto',
      },
      ...dialogStyles,
    },
    '& .MuiDialogContent-root': {
      padding: contentPadding || '20px 0',
      ...(hideScrollbar && {
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
        '&::-webkit-scrollbar': {
          display: 'none', // Chrome/Safari
        },
      }),
    },
    '& .MuiDialogActions-root': {
      // paddingLeft: theme.spacing(4),
      // paddingRight: theme.spacing(4),
    },
  })
);

const DialogTitleContainer = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  // padding: theme.spacing(0), // Adjusted padding
}));

const DialogTitle = styled(MuiDialogTitle)(() => ({
  margin: 0,
  // padding: theme.spacing(2),
  paddingRight: 0, // Adjust padding right for close button alignment
  display: 'flex',
  alignItems: 'center',
}));

export default function DialogBox(props: any) {
  const { title, dialogStyles, showCloseIcon = false, onClose, titleProps, centerTitle = false, disableBackdropClick = false, ...otherProps } = props;
  return (
    <>
      <DialogBoxStyle
        maxWidth={props.maxWidth}
        minWidth={props.minWidth}
        onClose={(_, reason) => {
          if (disableBackdropClick && reason === 'backdropClick') {
            return;
          }
          if (onClose) onClose();
          if (props?.handleClose) props.handleClose();
        }}
        aria-labelledby="customized-dialog-title"
        open={props.open}
        dialogStyles={{ ...dialogStyles }}
        {...otherProps}
        onClick={e => { e.stopPropagation();}}
        onMouseDown={e => { e.stopPropagation();}}
        onMouseUp={e => { e.stopPropagation();}}
        onKeyDown={e => { e.stopPropagation();}}
        onWheel={e => { e.stopPropagation();}}
        onTouchStart={e => { e.stopPropagation();}}
      >
        <DialogTitleContainer
          style={centerTitle ? { justifyContent: 'center' } : {}}
        >
          <DialogTitle
            sx={{ display: 'flex', alignItems: 'center', padding: '0', ...titleProps }}
            id="customized-dialog-title"
          > 
            <Typography fontSize={props.TitlefontSize} letterSpacing={0} variant="h6" sx={centerTitle ? { textAlign: 'center', width: '100%' } : {}}>
              {props.title}
            </Typography>
          </DialogTitle>
          {showCloseIcon && !centerTitle && (
            <IconButton aria-label="close" onClick={onClose} sx={{ color: 'black' }}>
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitleContainer>

        <MuiDialogContent>{props.children}</MuiDialogContent>
        {props.actions ? (
          <MuiDialogActions sx={{ display: 'flex', justifyContent: 'end', padding: '0', gap: 2 }}>
            {props.actions.map(
              (action: {
                color?: any;
                textColor?: string;
                fullWidth?: boolean;
                variant?: any;
                text: string;
                disabled?: boolean;
                handler: MouseEventHandler<HTMLButtonElement> | undefined;
              }) => (
                <Button
                  sx={{ boxShadow: 'none' }}
                  disabled={action?.disabled}
                  color={action?.color}
                  variant={action?.variant}
                  fullWidth={action?.fullWidth}
                  onClick={action.handler}
                >
                  {action.text}
                </Button>
              )
            )}
          </MuiDialogActions>
        ) : null}
      </DialogBoxStyle>
    </>
  );
}
