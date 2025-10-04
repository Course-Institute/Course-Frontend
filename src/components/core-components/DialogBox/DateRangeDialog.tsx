import React, { useState } from 'react';
import {
  Stack,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { DateRange } from '@mui/x-date-pickers-pro';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import DialogBox from './DialogBox';
import SaveCancelButtons from '../SaveCancelComponent/SaveCancelButtons';
import { Neutrals, Primary } from '../../color-palette/colors';

interface RelativeTimeOption {
  label: string;
  value: string;
}

interface DateRangeDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (params: {
    startDate: Date;
    endDate: Date;
    granularity: string;
    timeRangeType: string;
  }) => void;
  onCancel?: () => void;
  title?: string;
  relativeTimeOptions?: RelativeTimeOption[];
  showGranularity?: boolean;
  saveButtonText?: string;
  cancelButtonText?: string;
  loading?: boolean;
}

const defaultRelativeTimeOptions = [
  { label: 'Today', value: 'today' },
  { label: 'Last 24 Hours', value: 'last24Hours' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 3 Days', value: 'last3Days' },
  { label: 'Last 7 Days', value: 'last7Days' },
  { label: 'Last 10 Days', value: 'last10Days' },
  { label: 'Last 30 Days', value: 'last30Days' },
  { label: 'Last 3 Months', value: 'last3Months' },
  { label: 'Last 6 Months', value: 'last6Months' },
];

export const DateRangeDialog: React.FC<DateRangeDialogProps> = ({
  open,
  onClose,
  onApply,
  onCancel,
  title = 'Select Date Range',
  relativeTimeOptions = defaultRelativeTimeOptions,
  showGranularity = true,
  saveButtonText = 'Apply',
  cancelButtonText = 'Cancel',
  loading = false,
}) => {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange<Dayjs>>([
    dayjs().subtract(24, 'hours'),
    dayjs(),
  ]);
  const [startTime, setStartTime] = useState<Dayjs>(dayjs().subtract(24, 'hours'));
  const [endTime, setEndTime] = useState<Dayjs>(dayjs().subtract(24, 'hours'));
  const [granularity, setGranularity] = useState<string>('');
  const [selectedRelativeTime, setSelectedRelativeTime] = useState<string | null>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getGranularityOptions = (startDate: Dayjs, endDate: Dayjs) => {
    const dateDiff = endDate.diff(startDate, 'days');
    
    if (dateDiff <= 3) {
      return ['Minutes', 'Hours', 'Days'];
    } else if (dateDiff > 3 && dateDiff <= 7) {
      return ['Hours', 'Days'];
    } else if (dateDiff > 7 && dateDiff <= 60) {
      return ['Days', 'Weeks'];
    } else if (dateDiff > 60) {
      return ['Weeks', 'Months'];
    }
    return ['Hours', 'Days']; 
  };

  const granularityOptions = getGranularityOptions(selectedDateRange[0] || dayjs(), selectedDateRange[1] || dayjs());

  const handleRelativeTimeSelect = (value: string) => {
    setSelectedRelativeTime(value);
    const now = dayjs();
    let newStartDate: Dayjs;

    switch (value) {
      case 'today':
        newStartDate = now.startOf('day');
        break;
      case 'last24Hours':
        newStartDate = now.subtract(24, 'hours');
        break;
      case 'yesterday':
        newStartDate = now.subtract(1, 'day').startOf('day');
        break;
      case 'last3Days':
        newStartDate = now.subtract(3, 'days').startOf('day');
        break;
      case 'last7Days':
        newStartDate = now.subtract(7, 'days').startOf('day');
        break;
      case 'last10Days':
        newStartDate = now.subtract(10, 'days').startOf('day');
        break;
      case 'last30Days':
        newStartDate = now.subtract(30, 'days').startOf('day');
        break;
      case 'last3Months':
        newStartDate = now.subtract(3, 'months').startOf('month');
        break;
      case 'last6Months':
        newStartDate = now.subtract(6, 'months').startOf('month');
        break;
      default:
        newStartDate = selectedDateRange[0] || dayjs();
    }

    setSelectedDateRange([newStartDate, now]);
    setStartTime(newStartDate);
    setEndTime(now);
    setGranularity(''); 
  };

  const handleDateRangeChange = (newValue: DateRange<Dayjs>) => {
    setSelectedDateRange(newValue);
    setSelectedRelativeTime(null);
    setGranularity(''); 
    
    if (newValue[0]) {
      setStartTime(newValue[0].hour(startTime.hour()).minute(startTime.minute()));
    }
    if (newValue[1]) {
      setEndTime(newValue[1].hour(endTime.hour()).minute(endTime.minute()));
    }
  };

  const handleStartTimeChange = (newTime: Dayjs | null) => {
    if (newTime && selectedDateRange[0]) {
      const newDateTime = selectedDateRange[0]
        .hour(newTime.hour())
        .minute(newTime.minute())
        .second(0);
      setStartTime(newDateTime);
      setSelectedDateRange([newDateTime, selectedDateRange[1] || dayjs()]);
    }
  };

  const handleEndTimeChange = (newTime: Dayjs | null) => {
    if (newTime && selectedDateRange[1]) {
      const newDateTime = selectedDateRange[1]
        .hour(newTime.hour())
        .minute(newTime.minute())
        .second(0);
      setEndTime(newDateTime);
      setSelectedDateRange([selectedDateRange[0] || dayjs(), newDateTime]);
    }
  };

  const handleApply = () => {
    if (selectedDateRange[0] && selectedDateRange[1] && granularity) {
      onApply({
        startDate: startTime.toDate(),
        endDate: endTime.toDate(),
        granularity,
        timeRangeType: 'absolute',
      });
    }
  };

  const isFormValid = selectedDateRange[0] && selectedDateRange[1] && granularity;

  const handleCancel = () => {
    setSelectedRelativeTime(null);
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <DialogBox
      open={open}
      handleClose={onClose}
      showCloseIcon={true}
      onClose={onClose}
      padding="0px 10px 0px 30px"
    >
      <Stack spacing={3}>
        <Box
        sx={{
          width:"100%",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
        }}> 
                     <Box
             sx={{
               display: 'flex',
               overflowX: 'scroll',
               maxWidth:"800px",
               gap:"30px",
               scrollbarWidth: 'none',
               scrollbarColor: '#ccc transparent',
               '&::-webkit-scrollbar': {
                 height: '6px',
               },
               '&::-webkit-scrollbar-track': {
                 background: 'transparent',
               },
               '&::-webkit-scrollbar-thumb': {
                 background: '#ccc',
                 borderRadius: '3px',
               },
               '&::-webkit-scrollbar-thumb:hover': {
                 background: '#999',
               },
               pb: 1,
             }}
           >
                         {relativeTimeOptions.map((option) => (
               <Chip
                 key={option.value}
                 label={option.label}
                 onClick={() => handleRelativeTimeSelect(option.value)}
                 color={selectedRelativeTime === option.value ? 'primary' : 'default'}
                 variant={selectedRelativeTime === option.value ? 'filled' : 'outlined'}
                 sx={{ 
                   flexShrink: 0,
                   whiteSpace: 'nowrap',
                   backgroundColor: 'rgba(0, 0, 0, 0.082)',
                   border: "0px"

                 }}
               />
             ))}
          </Box>
          </Box>
                 <Box>
           {isMobile ? (
             // Mobile layout: Single calendar on top, time selection below
             <Stack spacing={3} sx={{marginTop:"50px"}}>
               <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                 <Typography variant="caption" color="textSecondary" gutterBottom>
                   Select Date Range
                 </Typography>
               </Box>
               <Typography 
                 variant="h5" 
                 sx={{ 
                   fontWeight: '500',
                   color: 'text.primary',
                   mb: 2,
                   textAlign: 'center'
                 }}
               >
                 {selectedDateRange[0] && selectedDateRange[1] 
                   ? `${selectedDateRange[0].format('MMM DD')} - ${selectedDateRange[1].format('MMM DD')}`
                   : 'Select Date Range'
                 }
               </Typography>
               
               {/* Single Calendar for Mobile */}
               <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
                   <StaticDateRangePicker
                     value={selectedDateRange}
                     onChange={handleDateRangeChange}
                     disableFuture={true}
                     calendars={1}
                     slotProps={{
                       actionBar: { actions: [] },
                       toolbar: { hidden: true },
                     }}
                     sx={{
                       '.Mui-selected.MuiDateRangePickerDay-day': {
                         backgroundColor: '#193458',
                       },
                       '.MuiDateRangePickerDay-rangeIntervalDayHighlight': {
                         backgroundColor: '#D8E7FD',
                       },
                       '.MuiDateRangePickerDay-hiddenDayFiller': {
                         backgroundColor: 'white !important',
                       },
                     }}
                   />
                 </LocalizationProvider>
               </Box>
               
               <Box sx={{ mt: 3}}>
                 <Typography variant="subtitle2" sx={{ mb: 2, textAlign: 'center' }}>
                   Time Selection
                 </Typography>
                 <Stack spacing={2} sx={{ maxWidth: '300px', mx: 'auto' }}>
                   <LocalizationProvider dateAdapter={AdapterDayjs}>
                     <TimePicker
                       label="Start Time"
                       value={startTime}
                       onChange={handleStartTimeChange}
                       ampm={false}
                       timeSteps={{ minutes: 1 }}
                       slotProps={{
                         textField: {
                           sx: {
                             '& .MuiInputLabel-root': {
                                color: Primary[900],
                             },
                             '& .MuiInputBase-input': {
                                color: Primary[900],
                             },
                           },
                         },
                       }}
                     />
                   </LocalizationProvider>
                   <LocalizationProvider dateAdapter={AdapterDayjs}>
                     <TimePicker
                       label="End Time"
                       value={endTime}
                       onChange={handleEndTimeChange}
                       ampm={false}
                       timeSteps={{ minutes: 1 }}
                       slotProps={{
                         textField: {
                           sx: {
                             '& .MuiInputLabel-root': {
                               color: '#204769',
                             },
                             '& .MuiInputBase-input': {
                               color: '#204769',
                             },
                           },
                         },
                       }}
                     />
                   </LocalizationProvider>
                 </Stack>
               </Box>
             </Stack>
           ) : (
             <Stack direction="row" spacing={3} alignItems="start" sx={{marginTop:"50px"}}>
               <Box
               sx={{
                 width:"100%",
                 display:"flex",
                 justifyContent:"start",
                 alignItems:"start",
               }}
               >
               <Box sx={{ minWidth: '200px' }}>
                 <Typography variant="caption" color="textSecondary" gutterBottom>
                   Select Date Range
                 </Typography>
                 <Typography 
                   variant="h5" 
                   sx={{ 
                     fontWeight: '500',
                     color: 'text.primary',
                     mb: 3
                   }}
                 >
                   {selectedDateRange[0] && selectedDateRange[1] 
                     ? `${selectedDateRange[0].format('MMM DD')} - ${selectedDateRange[1].format('MMM DD')}`
                     : 'Select Date Range'
                   }
                 </Typography>
                 <Box sx={{marginTop:"50px"}}>
                                                      <Box>
                       <LocalizationProvider dateAdapter={AdapterDayjs}>
                         <TimePicker
                           label="Start Time"
                           value={startTime}
                           onChange={handleStartTimeChange}
                           ampm={false}
                           timeSteps={{ minutes: 1 }}
                           
                         />
                       </LocalizationProvider>
                     </Box>
                                      <Box sx={{ mt: 2}}>
                       <LocalizationProvider dateAdapter={AdapterDayjs}>
                         <TimePicker
                           label="End Time"
                           onChange={handleEndTimeChange}
                           ampm={false}
                           timeSteps={{ minutes: 1 }}
                           
                         />
                       </LocalizationProvider>
                     </Box>
                 </Box>
               
               </Box>

               <Divider orientation="vertical" flexItem sx={{ mx: 2, height:"360px", width:"1px" }} />
               <Box sx={{ flex: 1 }}>
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
                   <StaticDateRangePicker
                     value={selectedDateRange}
                     onChange={handleDateRangeChange}
                     disableFuture={true}
                     calendars={2}
                     slotProps={{
                       actionBar: { actions: [] },
                       toolbar: { hidden: true },
                     }}
                     sx={{
                       '.Mui-selected.MuiDateRangePickerDay-day': {
                         backgroundColor: '#193458',
                       },
                       '.MuiDateRangePickerDay-rangeIntervalDayHighlight': {
                         backgroundColor: '#D8E7FD',
                       },
                       '.MuiDateRangePickerDay-hiddenDayFiller': {
                         backgroundColor: 'white !important',
                       },
                     }}
                   />
                 </LocalizationProvider>
               </Box>
               </Box>
               
             </Stack>
           )}
          <Box sx={{ display:"flex", justifyContent:"start", alignItems:"end"}}>
              {showGranularity && (
          <Box
            sx={{
              border: '1px solid #BDBDBD',
              borderRadius: '12px',
              padding: '12px',
              textAlign:"center",
              width:"130px",
            }}
          >
            <FormControl>
              <FormLabel
                sx={{ color: 'Primary.main', mt: 2 }}

              >
                Granularity
              </FormLabel>
              <RadioGroup
                aria-labelledby="granularity-radio-button-group"
                name="granularity-radio-button-group"
                value={granularity}
                onChange={(e) => setGranularity(e.target.value)}
              >
                                 {granularityOptions.map((option) => (
                   <FormControlLabel
                     key={option}
                     value={option}
                                           control={
                        <Radio 
                          sx={{
                            '&.Mui-checked': {
                              color: '#204769 !important',
                            },
                            '&.Mui-checked .MuiRadio-root': {
                              color: '#204769 !important',
                            },
                          }}
                        />
                      }
                     label={option}
                     sx={{ fontSize: '14px' }}
                   />
                 ))}
              </RadioGroup>
            </FormControl>
          </Box>
        )}
              </Box>
        </Box>

       
        <SaveCancelButtons
          onSave={handleApply}
          onCancel={handleCancel}
          saveValue={saveButtonText}
          cancelValue={cancelButtonText}
          containerStyle={{ marginTop: '20px' }}
          loading={loading}
          customSaveDisabled={!isFormValid}
        />
      </Stack>
    </DialogBox>
  );
}; 