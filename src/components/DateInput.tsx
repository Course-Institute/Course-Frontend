import React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
} from '@mui/material';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  sx?: any;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  error = false,
  helperText,
  required = false,
  fullWidth = true,
  disabled = false,
  sx = {},
}) => {
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleCalendarClick = () => {
    // Create a temporary input element to trigger the native date picker
    const input = document.createElement('input');
    input.type = 'date';
    input.value = value || '';
    
    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      onChange(target.value);
    });
    
    // Trigger the date picker
    input.click();
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        fullWidth={fullWidth}
        label={label}
        type="date"
        value={value}
        onChange={handleDateChange}
        error={error}
        helperText={helperText}
        required={required}
        disabled={disabled}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleCalendarClick}
                edge="end"
                size="small"
                sx={{ color: 'text.secondary' }}
                disabled={disabled}
              >
                <CalendarIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiInputBase-input': {
            cursor: 'pointer',
          },
          ...sx,
        }}
      />
    </Box>
  );
};

export default DateInput;
