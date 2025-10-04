import React from 'react';
import { Grid, Box, SxProps, Theme } from '@mui/material';

export interface CoreIconButtonProps {
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  text?: string | React.ReactNode;
  sx?: SxProps<Theme>;
  gridProps?: any;
  boxProps?: any;
  tabIndex?: number;
  ariaLabel?: string;
}

const CoreIconButton: React.FC<CoreIconButtonProps> = ({
  onClick,
  disabled = false,
  icon = '+',
  text,
  sx = {},
  gridProps = {},
  boxProps = {},
  tabIndex,
  ariaLabel,
}) => (
  <Grid
    item
    xs={1}
    display="flex"
    alignItems="center"
    justifyContent="center"
    {...gridProps}
  >
    <Box
      sx={{
        width: '100%',
        maxHeight: '60px',
        height: '100%',
        maxWidth: '60px',
        background: '#eee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 24,
        border: '1px solid #ccc',
        boxSizing: 'border-box',
        userSelect: 'none',
        borderRadius: '5px',
        ...((typeof sx === 'function') ? sx({} as Theme) : sx),
      }}
      onClick={!disabled ? onClick : undefined}
      tabIndex={typeof tabIndex === 'number' ? tabIndex : (disabled ? -1 : 0)}
      aria-disabled={disabled}
      aria-label={ariaLabel}
      {...boxProps}
    >
      {icon}
      {text && (
        <Box component="span" sx={{ ml: 1, fontSize: 16 }}>
          {text}
        </Box>
      )}
    </Box>
  </Grid>
);

export default CoreIconButton;