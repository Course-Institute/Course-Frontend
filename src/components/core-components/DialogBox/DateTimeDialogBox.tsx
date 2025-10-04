import React from 'react';
import DialogBox from '../DialogBox/DialogBox';
import { Box, Stack, Typography, Divider } from '@mui/material';
import { StaticDatePicker, TimePicker } from '@mui/x-date-pickers';
import SaveCancelButtons from '../SaveCancelComponent/SaveCancelButtons';

interface DateTimeDialogBoxProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: { dateTime: number | null, granularity: string }) => void;
  value: Date | null;
  setValue: (val: Date | null) => void;
  title?: string;
  granularity: any;
  setGranularity: (val: any) => void;
}

const DateTimeDialogBox: React.FC<DateTimeDialogBoxProps> = ({
  open,
  onClose,
  onSave,
  value,
  setValue,
  title = 'Date and Time',
  granularity,
  setGranularity,
}) => {
  const handleDateChange = (date: Date | null) => {
    if (!date && value) {
      setValue(null);
      return;
    }
    if (date && value) {
      const newDate = new Date(date);
      newDate.setHours(value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
      setValue(newDate);
    } else {
      setValue(date);
    }
  };

  const handleTimeChange = (time: Date | null) => {
    if (!time && value) {
      setValue(null);
      return;
    }
    if (time && value) {
      const newDate = new Date(value);
      newDate.setHours(time.getHours(), time.getMinutes(), 0, 0); 
      setValue(newDate);
    } else if (time) {
      const newDate = new Date(time);
      newDate.setSeconds(0, 0);
      setValue(newDate);
    }
  };

  const handleSave = () => {
    onSave({
      dateTime: value ? value.getTime() : null,
      granularity,
    });
  };

  return (
    <DialogBox
      open={open}
      onClose={onClose}
      title={title}
      minWidth="50%"
      minHeight="60%"
      padding="5px 10px 0px 8px"
      showCloseIcon
      maxWidth="xs"
      TitlefontSize={30}
    >
      <Box sx={{ minWidth: 300, display: 'flex', flexDirection: 'column', }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch" justifyContent="space-around" sx={{ width: '100%' }}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, minWidth: 350, bgcolor: '#fafbfc', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 420, justifyContent: 'flex-start', p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Date</Typography>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={value}
              onChange={handleDateChange}
              maxDate={new Date()}
            />
          </Box>
      
          </Box>
          <Divider orientation='vertical' flexItem sx={{ mx: { xs: 0, md: 2 }, my: { xs: 2, md: 0 }, borderColor: '#e0e0e0' }} />
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, minWidth: 350, bgcolor: '#fafbfc', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 420, justifyContent: 'flex-start', p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Time</Typography>
            <TimePicker
              value={value}
              onChange={handleTimeChange}
              ampm={false}
            />

          </Box>

          
          </Box>
        </Stack>

        
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <SaveCancelButtons
          onSave={handleSave}
          onCancel={onClose}
          cancelButtonStyle={{
            width: { xs: '50%', sm: '50%', md: '12%' },
          }}
          saveButtonStyle={{
            width: { xs: '50%', sm: '50%', md: '12%' },
          }}
        />
      </Box>
    </DialogBox>
  );
};

export default DateTimeDialogBox; 