import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People,
  School,
  Assignment,
  Payment,
  PendingActions,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCenterDashboardStats } from '../../hooks/useCenterDashboardStats';

const CenterDashboardPage = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading, isError, error } = useCenterDashboardStats();

  const quickActions = [
    {
      title: 'Add New Student',
      description: 'Register a new student',
      icon: <People sx={{ fontSize: 40, color: '#10b981' }} />,
      color: '#10b981',
      action: () => navigate('/center/add-student'),
    },
    {
      title: 'Add Marksheet',
      description: 'Add student marksheet',
      icon: <Assignment sx={{ fontSize: 40, color: '#3b82f6' }} />,
      color: '#3b82f6',
      action: () => navigate('/center/add-marksheet'),
    },
  ];

  const statsCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents?.toLocaleString() || '0',
      icon: <People sx={{ fontSize: 40, color: '#3b82f6' }} />,
      color: '#3b82f6',
      trend: '+12%',
      trendIcon: <TrendingUp sx={{ fontSize: 16 }} />,
    },
    {
      title: 'Active Students',
      value: stats?.activeStudents?.toLocaleString() || '0',
      icon: <School sx={{ fontSize: 40, color: '#10b981' }} />,
      color: '#10b981',
      trend: '+8%',
      trendIcon: <TrendingUp sx={{ fontSize: 16 }} />,
    },
    {
      title: 'Pending Approvals',
      value: stats?.pendingApprovals?.toLocaleString() || '0',
      icon: <PendingActions sx={{ fontSize: 40, color: '#f59e0b' }} />,
      color: '#f59e0b',
      trend: '-3%',
      trendIcon: <TrendingDown sx={{ fontSize: 16 }} />,
    },
    {
      title: 'Completed Payments',
      value: stats?.completedPayments?.toLocaleString() || '0',
      icon: <Payment sx={{ fontSize: 40, color: '#8b5cf6' }} />,
      color: '#8b5cf6',
      trend: '+15%',
      trendIcon: <TrendingUp sx={{ fontSize: 16 }} />,
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
      {/* Error Alert */}
      {isError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Failed to load dashboard data: {error?.message || 'Unknown error'}
        </Alert>
      )}

      {/* Page Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          color: '#1e293b',
          flexShrink: 0,
        }}
      >
        Center Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gridColumn: '1 / -1', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          statsCards.map((stat, index) => (
            <Box key={index}>
              <Card
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
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {stat.trendIcon}
                      <Typography
                        variant="body2"
                        sx={{
                          color: stat.trend.startsWith('+') ? '#10b981' : '#ef4444',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      >
                        {stat.trend}
                      </Typography>
                    </Box>
                  </Box>
              </CardContent>
            </Card>
          </Box>
          ))
        )}
      </Box>

      {/* Main Content Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 3 }} >
        {/* Quick Actions */}
        <Box>
          <Card sx={{ height: '100%' }}>
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
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                {quickActions.map((action, index) => (
                  <Box key={index}>
                    <Card
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        border: '1px solid #e2e8f0',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: action.color,
                          boxShadow: `0 4px 12px ${action.color}20`,
                        },
                      }}
                      onClick={action.action}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        {action.icon}
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: '#1e293b',
                            mt: 1,
                            mb: 0.5,
                          }}
                        >
                          {action.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                          }}
                        >
                          {action.description}
                        </Typography>
                      </Box>
                    </Card>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

      </Box>

    </Box>
  );
};

export default CenterDashboardPage;
