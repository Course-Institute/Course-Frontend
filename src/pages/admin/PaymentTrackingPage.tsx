import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search,
  AccountBalance,
  PendingActions,
  Payment,
  Receipt,
} from '@mui/icons-material';
import { usePaymentStats } from '../../hooks/usePaymentStats';
import { usePaymentList, type PaymentFilters } from '../../hooks/usePaymentList';
import PaymentTable from '../../components/PaymentTable';

const PaymentTrackingPage = () => {
  const [filters, setFilters] = useState<PaymentFilters>({});
  const { data: stats, isLoading: statsLoading } = usePaymentStats();
  const { data: paymentData, isLoading: paymentLoading, isError, error } = usePaymentList(filters);

  const handleFilterChange = (key: keyof PaymentFilters, value: string) => {
    setFilters((prev: PaymentFilters) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prev: PaymentFilters) => ({
      ...prev,
      search: searchTerm || undefined,
    }));
  };

  const handleExport = () => {
    console.log('Exporting payment data...');
  };

  const handleUploadResult = () => {
    console.log('Uploading result...');
  };

  const statsCards = [
    {
      title: 'Total Payments Collected',
      value: `₹${stats?.totalPayments?.toLocaleString() || '0'}`,
      icon: <AccountBalance sx={{ fontSize: 40, color: '#10b981' }} />,
      color: '#10b981',
    },
    {
      title: 'Pending Payments',
      value: `₹${stats?.pendingPayments?.toLocaleString() || '0'}`,
      icon: <PendingActions sx={{ fontSize: 40, color: '#f59e0b' }} />,
      color: '#f59e0b',
    },
    {
      title: 'Partial Payments',
      value: stats?.partialPayments?.toString() || '0',
      icon: <Payment sx={{ fontSize: 40, color: '#3b82f6' }} />,
      color: '#3b82f6',
    },
    {
      title: 'Refunds/Failed Transactions',
      value: stats?.refundsFailed?.toString() || '0',
      icon: <Receipt sx={{ fontSize: 40, color: '#ef4444' }} />,
      color: '#ef4444',
    },
  ];

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      boxSizing: 'border-box',
    }}>
      {/* Page Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          color: '#1e293b',
          flexShrink: 0,
        }}
      >
        Payment Tracking
      </Typography>

      {/* Statistics Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, flexShrink: 0 }}>
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              background: 'white',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {statsLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2">Loading...</Typography>
                </Box>
              ) : (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 'bold',
                        color: stat.color,
                        fontSize: '1.8rem',
                      }}
                    >
                      {stat.value}
                    </Typography>
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 500,
                    }}
                  >
                    {stat.title}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Search and Filters */}
      <Card sx={{ flexShrink: 0 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Search Bar */}
            <TextField
              placeholder="Search by Student ID/Name / Transaction ID"
              fullWidth
              value={filters.search || ''}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Filter Row */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Course</InputLabel>
                <Select
                  value={filters.course || ''}
                  onChange={(e) => handleFilterChange('course', e.target.value)}
                  label="Course"
                >
                  <MenuItem value="">All Courses</MenuItem>
                  <MenuItem value="B.Sc IT">B.Sc IT</MenuItem>
                  <MenuItem value="MBA">MBA</MenuItem>
                  <MenuItem value="B.Tech">B.Tech</MenuItem>
                  <MenuItem value="MCA">MCA</MenuItem>
                  <MenuItem value="BBA">BBA</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Center</InputLabel>
                <Select
                  value={filters.center || ''}
                  onChange={(e) => handleFilterChange('center', e.target.value)}
                  label="Center"
                >
                  <MenuItem value="">All Centers</MenuItem>
                  <MenuItem value="Delhi Center">Delhi Center</MenuItem>
                  <MenuItem value="Mumbai Center">Mumbai Center</MenuItem>
                  <MenuItem value="Jaipur Center">Jaipur Center</MenuItem>
                  <MenuItem value="Ahmedabad Center">Ahmedabad Center</MenuItem>
                  <MenuItem value="Pune Center">Pune Center</MenuItem>
                  <MenuItem value="Bangalore Center">Bangalore Center</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={filters.paymentStatus || ''}
                  onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                  label="Payment Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Partial">Partial</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                  <MenuItem value="Refunded">Refunded</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Payment Type</InputLabel>
                <Select
                  value={filters.paymentType || ''}
                  onChange={(e) => handleFilterChange('paymentType', e.target.value)}
                  label="Payment Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="PhonePe">PhonePe</MenuItem>
                  <MenuItem value="Google Pay">Google Pay</MenuItem>
                  <MenuItem value="Net Banking">Net Banking</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={filters.dateRange || ''}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  label="Date Range"
                >
                  <MenuItem value="">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="quarter">This Quarter</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                size="small"
                onClick={handleUploadResult}
                sx={{
                  textTransform: 'none',
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                  '&:hover': {
                    borderColor: '#2563eb',
                    backgroundColor: '#eff6ff',
                  },
                }}
              >
                UPLOAD RESULT
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {isError && (
        <Alert severity="error" sx={{ flexShrink: 0 }}>
          Failed to load payment data: {error?.message || 'Unknown error'}
        </Alert>
      )}

      {/* Payment Table - Takes remaining space */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: 400,
      }}>
        {paymentLoading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            flexGrow: 1,
            p: 4 
          }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <PaymentTable
            payments={paymentData?.payments || []}
            onExport={handleExport}
          />
        )}
      </Box>
    </Box>
  );
};

export default PaymentTrackingPage;

