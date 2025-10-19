import { Button as MuiButton, type ButtonProps as MuiButtonProps } from '@mui/material';
import React, { type ReactNode } from 'react';

interface Buttonprops extends MuiButtonProps {
  children: ReactNode;
  width?: string | number;
  height?: string | number;
}
const Button: React.FC<Buttonprops> = ({
  color = 'primary',
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
