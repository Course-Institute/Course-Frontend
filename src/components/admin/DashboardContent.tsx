import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  People,
  CheckCircle,
  Upload,
  CreditCard,
  Business,
  School,
  PendingActions,
} from '@mui/icons-material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useDashboardData } from '../../hooks/useDashboardData';

const DashboardContent = () => {
  const { data: dashboardData, isLoading, isError, error } = useDashboardData();

  // Format currency for Indian Rupees
  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-IN');
  };

  const metrics = [
    {
      title: 'Student Count',
      value: formatNumber(dashboardData.studentCount),
      icon: <School sx={{ fontSize: 40, color: '#3b82f6' }} />,
      trend: '+12%',
      color: '#3b82f6',
    },
    {
      title: 'Payments',
      value: formatCurrency(dashboardData.totalPayments),
      icon: <CurrencyRupeeIcon sx={{ fontSize: 40, color: '#10b981' }} />,
      trend: '+8%',
      color: '#10b981',
    },
    {
      title: 'Pending Approvals',
      value: formatNumber(dashboardData.pendingApprovals),
      icon: <PendingActions sx={{ fontSize: 40, color: '#f59e0b' }} />,
      trend: '-5%',
      color: '#f59e0b',
    },
    {
      title: 'Active Centers',
      value: formatNumber(dashboardData.activeCenters),
      icon: <Business sx={{ fontSize: 40, color: '#8b5cf6' }} />,
      trend: '+3%',
      color: '#8b5cf6',
    },
  ];

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      {/* Error Alert */}
      {isError && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Failed to load dashboard data: {error?.message || 'Unknown error'}
        </Alert>
      )}

      {/* Metrics Cards - Full Width Layout */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {isLoading ? (
          // Loading state
          Array.from({ length: 4 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f1f5f9',
                  height: '140px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress size={40} />
              </Card>
            </Grid>
          ))
        ) : (
          // Data state
          metrics.map((metric, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f1f5f9',
                '&:hover': {
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2 }}>{metric.icon}</Box>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 'bold',
                        color: '#1e293b',
                        fontSize: '1.8rem',
                      }}
                    >
                      {metric.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        fontSize: '0.9rem',
                      }}
                    >
                      {metric.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp sx={{ fontSize: 16, color: metric.color }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: metric.color,
                      fontWeight: 600,
                      fontSize: '0.85rem',
                    }}
                  >
                    {metric.trend} from last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Action Cards */}
      <Grid container spacing={3}>
        {/* Pending Approvals */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9',
              height:"220px"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  mb: 3,
                }}
              >
                Pending Approvals
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FormControlLabel
                  control={<CheckCircle sx={{ color: '#10b981' }} />}
                  label="New Admissions"
                  sx={{ flex: 1 }}
                />
                <Chip
                  label="12"
                  size="small"
                  sx={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FormControlLabel
                  control={<CheckCircle sx={{ color: '#64748b' }} />}
                  label="Center Requests"
                  sx={{ flex: 1 }}
                />
                <Chip
                  label="25"
                  size="small"
                  sx={{
                    backgroundColor: '#64748b',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#3b82f6',
                  '&:hover': { backgroundColor: '#2563eb' },
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                View All
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9',
              height:"220px"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  mb: 3,
                }}
              >
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt:5, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="contained"
                  startIcon={<CheckCircle />}
                  sx={{
                    backgroundColor: '#10b981',
                    '&:hover': { backgroundColor: '#059669' },
                    textTransform: 'none',
                    borderRadius: 2,
                    flex: 1,
                  }}
                >
                  Approve Student
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Upload />}
                  sx={{
                    backgroundColor: '#3b82f6',
                    '&:hover': { backgroundColor: '#2563eb' },
                    textTransform: 'none',
                    borderRadius: 2,
                    flex: 1,
                  }}
                >
                  Upload Results
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Reports */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9',
              height:"220px"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  mb: 3,
                }}
              >
                Reports
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' }, minWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                      Export Student Lists
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: '#ef4444',
                          color: '#ef4444',
                          textTransform: 'none',
                          borderRadius: 2,
                        }}
                      >
                        PDF
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: '#10b981',
                          color: '#10b981',
                          textTransform: 'none',
                          borderRadius: 2,
                        }}
                      >
                        Excel
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ID Card Management */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ fontSize: 32, color: '#3b82f6', mr: 1 }} />
                <Typography sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                  15 Centers
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CreditCard sx={{ fontSize: 20, color: '#64748b' }} />
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    ID Card Management
                  </Typography>
                </Box>
                <Switch size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Result Management */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3, height: '100%' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  mb: 3,
                }}
              >
                Result Management
              </Typography>
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={<Switch size="small" />}
                  label="Upload Results"
                  sx={{ width: '100%', justifyContent: 'space-between' }}
                />
              </Box>
              <Box>
                <FormControlLabel
                  control={<Switch size="small" />}
                  label="Release Marksheets"
                  sx={{ width: '100%', justifyContent: 'space-between' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Tracking */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3, height: '100%' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  mb: 3,
                }}
              >
                Payment Tracking
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                  Monthly Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#10b981',
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                  75% Complete
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default DashboardContent;
