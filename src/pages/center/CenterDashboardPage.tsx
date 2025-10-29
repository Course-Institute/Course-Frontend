import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Container,
  Chip,
  Fade,
  Slide,
  Grid,
} from '@mui/material';
import {
  People,
  School,
  Payment,
  PendingActions,
  Add,
  Description,
  CheckCircle,
  Speed,
  Security,
  ArrowForward,
  Timeline,
  AttachMoney,
  Group,
  Assessment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCenterDashboardStats } from '../../hooks/useCenterDashboardStats';

const CenterDashboardPage = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading, isError, error } = useCenterDashboardStats();

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-IN');
  };

  // Quick stats data - all from API
  const quickStats = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: <People />,
      color: '#3b82f6',
      bgColor: '#eff6ff',
    },
    {
      title: 'Active Students',
      value: stats?.activeStudents || 0,
      icon: <School />,
      color: '#10b981',
      bgColor: '#ecfdf5',
    },
    {
      title: 'Pending Approvals',
      value: stats?.pendingApprovals || 0,
      icon: <PendingActions />,
      color: '#f59e0b',
      bgColor: '#fffbeb',
    },
    {
      title: 'Completed Payments',
      value: stats?.completedPayments || 0,
      icon: <Payment />,
      color: '#8b5cf6',
      bgColor: '#f3e8ff',
    },
  ];

  // Feature cards - using real data
  const features = [
    {
      title: 'Student Management',
      description: 'Register new students, manage student records, and track academic progress.',
      icon: <Group />,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      stats: `${formatNumber(stats?.totalStudents || 0)} Students`,
      action: () => navigate('/center/students'),
    },
    {
      title: 'Marksheet Management',
      description: 'Add, edit, and manage student marksheets with ease.',
      icon: <Description />,
      color: '#10b981',
      bgColor: '#ecfdf5',
      stats: `${formatNumber(stats?.activeStudents || 0)} Active`,
      action: () => navigate('/center/add-marksheet'),
    },
    {
      title: 'Payment Tracking',
      description: 'Monitor payment status and financial transactions.',
      icon: <AttachMoney />,
      color: '#8b5cf6',
      bgColor: '#f3e8ff',
      stats: `${formatNumber(stats?.completedPayments || 0)} Completed`,
      action: () => navigate('/center/payments'),
    },
    {
      title: 'Approval Management',
      description: 'Review and approve pending student applications.',
      icon: <Assessment />,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      stats: `${formatNumber(stats?.pendingApprovals || 0)} Pending`,
      action: () => navigate('/center/approvals'),
    },
  ];

  // Quick actions
  const quickActions = [
    {
      title: 'Add New Student',
      description: 'Register a new student in the system',
      icon: <Add />,
      color: '#10b981',
      bgColor: '#ecfdf5',
      action: () => navigate('/center/add-student'),
    },
    {
      title: 'Add Marksheet',
      description: 'Upload student marksheet data',
      icon: <Description />,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      action: () => navigate('/center/add-marksheet'),
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
                  Center Dashboard
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
                  Manage your center operations with powerful tools and insights
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Chip
                    icon={<CheckCircle />}
                    label="Real-time Updates"
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
                    label="Easy Management"
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
              Center Overview
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
              Management Tools
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
                      onClick={feature.action}
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

        {/* Quick Actions */}
        <Fade in timeout={2000}>
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Timeline sx={{ color: '#3b82f6', fontSize: '2rem' }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#1e293b',
                  }}
                >
                  Quick Actions
                </Typography>
              </Box>
              <Grid container spacing={3}>
                {quickActions.map((action, index) => (
                  <Grid key={index} size={{ xs: 12, sm: 6 }}>
                    <Card
                      sx={{
                        p: 3,
                        cursor: 'pointer',
                        border: '1px solid #e2e8f0',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: action.color,
                          boxShadow: `0 8px 24px ${action.color}20`,
                          transform: 'translateY(-2px)',
                        },
                      }}
                      onClick={action.action}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: action.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Box sx={{ color: action.color, fontSize: '1.5rem' }}>
                            {action.icon}
                          </Box>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: '#1e293b',
                              mb: 0.5,
                            }}
                          >
                            {action.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#64748b',
                            }}
                          >
                            {action.description}
                          </Typography>
                        </Box>
                        <ArrowForward sx={{ color: action.color, fontSize: '1.2rem' }} />
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default CenterDashboardPage;
