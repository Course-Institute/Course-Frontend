import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  Business,
  School,
} from '@mui/icons-material';
import { useDashboardData } from '../../hooks/useDashboardData';

const DashboardContent = () => {
  const { data: dashboardData, isLoading, isError, error } = useDashboardData();

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-IN');
  };


  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      boxSizing: 'border-box',
      overflow: 'hidden',
      p: 3,
    }}>
      {/* Error Alert */}
      {isError && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Failed to load dashboard data: {error?.message || 'Unknown error'}
        </Alert>
      )}

      {/* Welcome Message */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            mb: 2,
          }}
        >
          WELCOME TO THE ADMIN PANEL
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#64748b',
            fontSize: '1.2rem',
            fontWeight: 400,
          }}
        >
          Manage your institute with ease
        </Typography>
      </Box>

      {/* Two Main Cards */}
      <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
        {/* Total Students Card */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9',
              height: '280px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
              '&:hover': {
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-5px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              {isLoading ? (
                <CircularProgress size={60} sx={{ color: '#3b82f6' }} />
              ) : (
                <>
                  <Box sx={{ mb: 2 }}>
                    <School sx={{ fontSize: 50, color: '#3b82f6' }} />
                  </Box>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 'bold',
                      color: '#1e293b',
                      fontSize: '3rem',
                      mb: 1,
                    }}
                  >
                    {dashboardData.studentCount > 0 ? formatNumber(dashboardData.studentCount) : '---'}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#64748b',
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      mb: 2,
                    }}
                  >
                    Total Students
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp sx={{ fontSize: 20, color: '#3b82f6' }} />
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#3b82f6',
                        fontWeight: 600,
                        fontSize: '1rem',
                      }}
                    >
                      {dashboardData.studentIncrease > 0 ? `+${dashboardData.studentIncrease}%` : '---'} from last month
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Total Centers Card */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9',
              height: '280px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
              '&:hover': {
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-5px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              {isLoading ? (
                <CircularProgress size={60} sx={{ color: '#8b5cf6' }} />
              ) : (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Business sx={{ fontSize: 50, color: '#8b5cf6' }} />
                  </Box>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 'bold',
                      color: '#1e293b',
                      fontSize: '3rem',
                      mb: 1,
                    }}
                  >
                    {dashboardData.activeCenters > 0 ? formatNumber(dashboardData.activeCenters) : '---'}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#64748b',
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      mb: 2,
                    }}
                  >
                    Total Centers
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp sx={{ fontSize: 20, color: '#8b5cf6' }} />
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#8b5cf6',
                        fontWeight: 600,
                        fontSize: '1rem',
                      }}
                    >
                      {dashboardData.centerIncrease > 0 ? `+${dashboardData.centerIncrease}%` : '---'} from last month
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardContent;
