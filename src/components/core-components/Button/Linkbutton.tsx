import React from 'react';
import { Button as MuiButton, type ButtonProps as MuiButtonProps } from '@mui/material';
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom';

interface LinkButtonProps extends MuiButtonProps {
  to: RouterLinkProps['to'];
  label?: string;
}
const LinkButton: React.FC<LinkButtonProps> = ({ to, label, children, ...props }) => {
  return (
    <MuiButton component={RouterLink} to={to} {...props}>
      {label || children}
    </MuiButton>
  );
};

export default LinkButton;
