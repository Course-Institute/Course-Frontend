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
      onError={(e: any) => {
        // Fallback if logo fails to load
        e.target.style.display = 'none';
      }}
      sx={{
        width,
        height,
        objectFit: 'contain',
        ...sx,
      }}
    />
  );
};

export default InstituteLogo;
