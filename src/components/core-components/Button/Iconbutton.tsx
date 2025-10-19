import React from 'react';
import { IconButton as MuiIconButton, type IconButtonProps as MuiIconButtonProps } from '@mui/material';
import { type SvgIconComponent } from '@mui/icons-material';

interface CustomIconButtonProps extends MuiIconButtonProps {
  icon: SvgIconComponent;
  label?: string;
}
const CustomIconButton: React.FC<CustomIconButtonProps> = ({ icon: Icon, label, ...props }) => {
  return (
    <MuiIconButton aria-label={label} {...props}>
      <Icon />
    </MuiIconButton>
  );
};

export default CustomIconButton;
