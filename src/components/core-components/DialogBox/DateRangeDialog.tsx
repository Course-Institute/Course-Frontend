import React from 'react';
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
import DialogBox from './DialogBox';

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
  title: _title = 'Select Date Range',
  relativeTimeOptions = defaultRelativeTimeOptions,
  showGranularity = true,
  saveButtonText = 'Apply',
  cancelButtonText = 'Cancel',
  loading = false,
}) => {
  const [selectedRelativeTime, setSelectedRelativeTime] = React.useState<string | null>(null);
  const [granularity, setGranularity] = React.useState<string>('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleRelativeTimeSelect = (value: string) => {
    setSelectedRelativeTime(value);
  };

  const handleApply = () => {
    onApply({
      startDate: new Date(),
      endDate: new Date(),
      granularity,
      timeRangeType: 'absolute',
    });
  };

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
                 Date Range Selection
               </Typography>
               
               <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                 <Typography variant="body1">
                   Date picker component would go here
                 </Typography>
               </Box>
               
               <Box sx={{ mt: 3}}>
                 <Typography variant="subtitle2" sx={{ mb: 2, textAlign: 'center' }}>
                   Time Selection
                 </Typography>
                 <Stack spacing={2} sx={{ maxWidth: '300px', mx: 'auto' }}>
                   <Typography variant="body2">Time picker components would go here</Typography>
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
                   Date Range Selection
                 </Typography>
                 <Box sx={{marginTop:"50px"}}>
                   <Box>
                     <Typography variant="body2">Start Time picker would go here</Typography>
                   </Box>
                   <Box sx={{ mt: 2}}>
                     <Typography variant="body2">End Time picker would go here</Typography>
                   </Box>
                 </Box>
               
               </Box>

               <Divider orientation="vertical" flexItem sx={{ mx: 2, height:"360px", width:"1px" }} />
               <Box sx={{ flex: 1 }}>
                 <Typography variant="body1">Date range picker would go here</Typography>
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
                                 {['Minutes', 'Hours', 'Days'].map((option) => (
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

       
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <button onClick={handleCancel} disabled={loading}>
            {cancelButtonText}
          </button>
          <button onClick={handleApply} disabled={loading}>
            {loading ? 'Loading...' : saveButtonText}
          </button>
        </Box>
      </Stack>
    </DialogBox>
  );
};