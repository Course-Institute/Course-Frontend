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
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  error = false,
  helperText,
  required = false,
  fullWidth = true,
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
        }}
      />
    </Box>
  );
};

export default DateInput;
