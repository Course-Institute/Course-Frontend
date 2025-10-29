import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Container,
  Chip,
  Fade,
  Slide,
} from '@mui/material';
import {
  TrendingUp,
  Business,
  School,
  Receipt,
  People,
  Assessment,
  Speed,
  Security,
  Analytics,
  CheckCircle,
  ArrowForward,
  AttachMoney,
  Store,
} from '@mui/icons-material';
import { useDashboardData } from '../../hooks/useDashboardData';

const DashboardContent = () => {
  const { data: dashboardData, isLoading, isError, error } = useDashboardData();

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-IN');
  };

  // Quick stats data - all from API
  const quickStats = [
    {
      title: 'Total Students',
      value: dashboardData?.studentCount || 0,
      change: dashboardData?.studentIncrease || 0,
      icon: <School />,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      trend: dashboardData?.studentIncrease >= 0 ? 'up' : 'down',
    },
    {
      title: 'Active Centers',
      value: dashboardData?.activeCenters || 0,
      change: dashboardData?.centerIncrease || 0,
      icon: <Business />,
      color: '#8b5cf6',
      bgColor: '#f3e8ff',
      trend: dashboardData?.centerIncrease >= 0 ? 'up' : 'down',
    },
    {
      title: 'Total Payments',
      value: dashboardData?.totalPayments || 0,
      change: 0, // No increase percentage available from API
      icon: <AttachMoney />,
      color: '#10b981',
      bgColor: '#ecfdf5',
      trend: 'neutral',
    },
    {
      title: 'Pending Approvals',
      value: dashboardData?.pendingApprovals || 0,
      change: 0, // No increase percentage available from API
      icon: <Receipt />,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      trend: 'neutral',
    },
  ];

  // Feature cards - using real data
  const features = [
    {
      title: 'Student Management',
      description: 'Comprehensive student records, enrollment tracking, and academic progress monitoring.',
      icon: <People />,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      stats: `${formatNumber(dashboardData?.studentCount || 0)} Students`,
    },
    {
      title: 'Center Operations',
      description: 'Manage multiple centers, staff assignments, and operational efficiency metrics.',
      icon: <Store />,
      color: '#8b5cf6',
      bgColor: '#f3e8ff',
      stats: `${formatNumber(dashboardData?.activeCenters || 0)} Centers`,
    },
    {
      title: 'Financial Tracking',
      description: 'Real-time billing, payment processing, and comprehensive financial reporting.',
      icon: <Assessment />,
      color: '#10b981',
      bgColor: '#ecfdf5',
      stats: `₹${formatNumber(dashboardData?.totalPayments || 0)}`,
    },
    {
      title: 'Analytics & Reports',
      description: 'Advanced analytics, custom reports, and data-driven insights for better decisions.',
      icon: <Analytics />,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      stats: `${formatNumber(dashboardData?.pendingApprovals || 0)} Pending`,
    },
  ];


  return (
    <Box sx={{ 
      width: '100%', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overflow: 'auto',
      position: 'relative',
    }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
        `,
        zIndex: 0,
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: { xs: 2, sm: 4 } }}>
        {/* Error Alert */}
        {isError && (
          <Fade in={isError}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(220, 38, 38, 0.2)',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(254, 242, 242, 0.9)',
              }}
            >
              Failed to load dashboard data: {error?.message || 'Unknown error'}
            </Alert>
          </Fade>
        )}

        {/* Hero Section */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Slide direction="down" in timeout={1000}>
              <Box>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                    mb: 2,
                    textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    lineHeight: 1.1,
                  }}
                >
                  Welcome to Admin Panel
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                    fontWeight: 400,
                    mb: 3,
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  Streamline your institute management with powerful tools and insights
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Chip
                    icon={<CheckCircle />}
                    label="Real-time Analytics"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  />
                  <Chip
                    icon={<Security />}
                    label="Secure & Reliable"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  />
                  <Chip
                    icon={<Speed />}
                    label="Lightning Fast"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  />
                </Box>
              </Box>
            </Slide>
          </Box>
        </Fade>

        {/* Quick Stats */}
        <Fade in timeout={1200}>
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 3,
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              Key Metrics
            </Typography>
            <Grid container spacing={3}>
              {quickStats.map((stat, index) => (
                <Grid key={index} size={{ xs: 6, sm: 3 }}>
                  <Slide direction="up" in timeout={1400 + index * 200}>
                    <Card
                      sx={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        {isLoading ? (
                          <CircularProgress size={40} sx={{ color: stat.color }} />
                        ) : (
                          <>
                            <Box sx={{
                              p: 2,
                              borderRadius: 2,
                              backgroundColor: stat.bgColor,
                              display: 'inline-flex',
                              mb: 2,
                            }}>
                              <Box sx={{ color: stat.color, fontSize: '2rem' }}>
                                {stat.icon}
                              </Box>
                            </Box>
                            <Typography
                              variant="h3"
                              sx={{
                                fontWeight: 800,
                                color: '#1e293b',
                                fontSize: { xs: '1.8rem', sm: '2.2rem' },
                                mb: 1,
                              }}
                            >
                              {formatNumber(stat.value)}
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{
                                color: '#64748b',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                mb: 1,
                              }}
                            >
                              {stat.title}
                            </Typography>
                            {stat.change !== 0 && (
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                <TrendingUp sx={{ 
                                  fontSize: 16, 
                                  color: stat.trend === 'up' ? '#10b981' : stat.trend === 'down' ? '#ef4444' : '#64748b',
                                  transform: stat.trend === 'down' ? 'rotate(180deg)' : 'none',
                                  opacity: stat.trend === 'neutral' ? 0.5 : 1,
                                }} />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: stat.trend === 'up' ? '#10b981' : stat.trend === 'down' ? '#ef4444' : '#64748b',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                  }}
                                >
                                  {stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}%
                                </Typography>
                              </Box>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Slide>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* Features Section */}
        <Fade in timeout={1600}>
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 4,
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              Powerful Features
            </Typography>
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Slide direction="up" in timeout={1800 + index * 200}>
                    <Card
                      sx={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.15)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: feature.bgColor,
                          display: 'inline-flex',
                          mb: 2,
                          width: 'fit-content',
                        }}>
                          <Box sx={{ color: feature.color, fontSize: '2rem' }}>
                            {feature.icon}
                          </Box>
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: '#1e293b',
                            mb: 1,
                            fontSize: '1.1rem',
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#64748b',
                            mb: 2,
                            flex: 1,
                            lineHeight: 1.6,
                          }}
                        >
                          {feature.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: feature.color,
                              fontWeight: 600,
                              fontSize: '0.8rem',
                            }}
                          >
                            {feature.stats}
                          </Typography>
                          <ArrowForward sx={{ color: feature.color, fontSize: '1.2rem' }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Slide>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

      </Container>
    </Box>
  );
};

export default DashboardContent;
