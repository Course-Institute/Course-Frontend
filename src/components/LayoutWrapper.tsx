import React from 'react';
import { Box } from '@mui/material';
import { layoutConfig } from '../theme/layout';

interface LayoutWrapperProps {
  children: React.ReactNode;
  backgroundColor?: string;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ 
  children, 
  backgroundColor = 'white' 
}) => {
  return (
    <Box sx={{
      ...layoutConfig.getContentStyles(),
      backgroundColor
    }}>
      {children}
    </Box>
  );
};

export default LayoutWrapper;
