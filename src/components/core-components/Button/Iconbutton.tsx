import React from 'react';
import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

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
