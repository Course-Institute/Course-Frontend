import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import React, { ReactNode } from 'react';

interface Buttonprops extends MuiButtonProps {
  children: ReactNode;
  width?: string | number;
  height?: string | number;
}
const Button: React.FC<Buttonprops> = ({
  color = 'Primary',
  variant = 'contained',
  width,
  height,
  children,
  ...props
}) => {
  return (
    <MuiButton
      color={color}
      variant={variant}
      sx={{
        width,
        height,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};
export default Button;
