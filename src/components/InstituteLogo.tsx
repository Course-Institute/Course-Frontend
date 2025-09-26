import React from 'react';
import { Box } from '@mui/material';

interface InstituteLogoProps {
  sx?: any;
  width?: number;
  height?: number;
}

const InstituteLogo: React.FC<InstituteLogoProps> = ({ sx, width = 30, height = 30 }) => {
  return (
    <Box
      component="img"
      src="/institute-logo.svg"
      alt="MIVPS Logo"
      sx={{
        width,
        height,
        ...sx,
      }}
    />
  );
};

export default InstituteLogo;
