import React from 'react';
import { Switch, SwitchProps, Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Theme } from '@mui/material/styles';

// Custom styled iOS switch with "On"/"Off" text inside the thumb
const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 52, // Slightly increased to accommodate the text better
  height: 26,
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(26px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#f88c00', // Yellow background when checked
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#000', // Black text for better visibility
    backgroundColor: '#fff', // Always white background
    textTransform: 'uppercase',
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: 'grey', // Reddish background when unchecked
    opacity: 1,
    transition: (theme as Theme).transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

interface IOSZoomSwitchProps {
  checked: boolean;
  onChange: () => void;
}

const IOSZoomSwitch: React.FC<IOSZoomSwitchProps> = ({ checked, onChange }) => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      {/* Static Zoom Label */}
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        Zoom
      </Typography>

      {/* Switch with "On"/"Off" text inside the thumb */}
      <IOSSwitch
        checked={checked}
        onChange={onChange}
        color="default"
        sx={{
          '& .MuiSwitch-thumb::before': {
            content: `"${checked ? 'On' : 'Off'}"`,
            position: 'absolute',
            fontSize: '10px',
            fontWeight: 'bold',
            color: checked ? '#000' : '#000', // Black text when On, white text when Off
          },
        }}
      />
    </Box>
  );
};

export default IOSZoomSwitch;
