import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School,
  AdminPanelSettings,
  Person,
  BusinessCenter,
} from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { loginUser, type LoginResponse } from '../api/authApi';
import Navbar from '../components/Navbar';
import DateInput from '../components/DateInput';
import ErrorBoundary from '../components/ErrorBoundary';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'Student';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    registrationNumber: '',
    dateOfBirth: '',
    keepSignedIn: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Clear error when role changes
  useEffect(() => {
    setError('');
  }, [role]);

  const loginMutation = useMutation<LoginResponse, Error, { email?: string; password?: string; registrationNumber?: string; dateOfBirth?: string; role: string }>(

    {
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Clear any previous errors
      setError('');
      
      // Handle successful login
      // Get user role from response
      const userRole = data.data.user.role;
      
      // Store authentication data in localStorage
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('keepSignedIn', formData.keepSignedIn.toString());
      
      // Store student registration number if student login
      if (userRole.toLowerCase() === 'student' && formData.registrationNumber) {
        localStorage.setItem('studentRegistrationNumber', formData.registrationNumber.toString());
      }
      
      // Store center information if center login
      if (userRole.toLowerCase() === 'center' && data.data.user.centerId && data.data.user.centerName) {
        localStorage.setItem('centerId', data.data.user.centerId);
        localStorage.setItem('centerName', data.data.user.centerName);
      }
      
      // Navigate to appropriate dashboard based on role from response
      switch (userRole.toLowerCase()) {
        case 'student':
          navigate('/student-dashboard');
          break;
        case 'center':
          navigate('/center-dashboard');
          break;
        case 'admin':
        case 'app': // App Login is also admin login
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/');
      }
    },
    onError: (error: any) => {
      // Extract error message from various possible error formats
      // Prioritize 'error' field as it contains more specific messages
      let errorMessage = 'Login failed. Please try again.';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error?.response?.data === 'string') {
        errorMessage = error.response.data;
      }
      
      setError(errorMessage);
    },
  });

  const handleInputChange = useCallback((field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (error) setError(''); // Clear error when user starts typing
  }, [error]);


  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    
    // Clear any previous errors before submitting
    setError('');
    
    // Validate based on role
    if (role.toLowerCase() === 'student') {
      if (!formData.registrationNumber || !formData.dateOfBirth) {
        setError('Please fill in all fields');
        return;
      }
    } else {
      if (!formData.email.trim() || !formData.password.trim()) {
        setError('Please fill in all fields');
        return;
      }
    }

    // Prepare credentials based on role
    const credentials = role.toLowerCase() === 'student' 
      ? {
          registrationNumber: formData.registrationNumber.toString(),
          dateOfBirth: formData.dateOfBirth,
          role: role,
        }
      : {
          email: formData.email,
          password: formData.password,
          role: role,
        };

    loginMutation.mutate(credentials);
  }, [formData, role, loginMutation]);

  const getThemeConfig = useCallback(() => {
    switch (role.toLowerCase()) {
      case 'student':
        return {
          background: `
            linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(34, 197, 94, 0.6) 100%),
            url('student-panel.jpg')
          `,
          cardBackground: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          iconBackground: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)',
          icon: <School sx={{ fontSize: 40, color: 'white' }} />,
          primaryColor: '#3b82f6',
          secondaryColor: '#22c55e',
          title: 'Student Portal',
          description: 'Access your academic journey and educational resources'
        };
      case 'center':
        return {
          background: `
            linear-gradient(135deg, rgba(34, 197, 94, 0.6) 0%, rgba(251, 191, 36, 0.6) 100%),
            url('center-panel.jpg')
          `,
          cardBackground: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          iconBackground: 'linear-gradient(135deg, #22c55e 0%, #fbbf24 100%)',
          icon: <BusinessCenter sx={{ fontSize: 40, color: 'white' }} />,
          primaryColor: '#22c55e',
          secondaryColor: '#fbbf24',
          title: 'Center Portal',
          description: 'Manage your center operations and student services'
        };
      case 'admin':
      case 'app':
        return {
          background: `
            linear-gradient(135deg, rgba(99, 102, 241, 0.6) 0%, rgba(168, 85, 247, 0.6) 100%),
            url('admin-panel.jpg')
          `,
          cardBackground: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
          iconBackground: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          icon: <AdminPanelSettings sx={{ fontSize: 40, color: 'white' }} />,
          primaryColor: '#6366f1',
          secondaryColor: '#a855f7',
          title: 'Admin Portal',
          description: 'System administration and management dashboard'
        };
      default:
        return {
          background: `
            linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(34, 197, 94, 0.6) 100%),
            url('https://images.unsplash.com/photo-1523240798034-6c2165d3b3b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')
          `,
          cardBackground: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          iconBackground: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)',
          icon: <Person sx={{ fontSize: 40, color: 'white' }} />,
          primaryColor: '#3b82f6',
          secondaryColor: '#22c55e',
          title: 'Welcome Back',
          description: 'Please sign in to your account'
        };
    }
  }, [role]);

  return (
    <ErrorBoundary>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <Navbar />
      
      {/* Login Content */}
      <Box
        sx={{
          flex: 1,
          background: getThemeConfig().background,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.05)',
            zIndex: 1,
          }
        }}
      >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            background: getThemeConfig().cardBackground,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <CardContent sx={{ p: 6 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              {/* Beautiful Icon */}
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 4,
                  background: getThemeConfig().iconBackground,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: `0 8px 25px ${getThemeConfig().primaryColor}40`,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    background: getThemeConfig().iconBackground,
                    borderRadius: 4,
                    zIndex: -1,
                    opacity: 0.3,
                    filter: 'blur(8px)',
                  }
                }}
              >
                {getThemeConfig().icon}
              </Box>

              {/* Title */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  background: `linear-gradient(135deg, ${getThemeConfig().primaryColor} 0%, ${getThemeConfig().secondaryColor} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  fontSize: { xs: '1.8rem', sm: '2.2rem' },
                }}
              >
                {getThemeConfig().title}
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="body1"
                sx={{
                  color: '#64748b',
                  fontSize: '1.1rem',
                  mb: 2,
                }}
              >
                {getThemeConfig().description}
              </Typography>

              {/* Role Badge */}
              <Box
                sx={{
                  display: 'inline-block',
                  background: `linear-gradient(135deg, ${getThemeConfig().primaryColor}20 0%, ${getThemeConfig().secondaryColor}20 100%)`,
                  borderRadius: '20px',
                  px: 3,
                  py: 1,
                  border: `2px solid ${getThemeConfig().primaryColor}30`,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: getThemeConfig().primaryColor,
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  {role.toUpperCase()} ACCESS
                </Typography>
              </Box>
            </Box>

              {/* Error Alert */}
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 3,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    '& .MuiAlert-icon': {
                      color: '#ef4444',
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              {role.toLowerCase() === 'student' ? (
                <>
                  <TextField
                    fullWidth
                    label="Registration Number"
                    type="number"
                    value={formData.registrationNumber}
                    onChange={handleInputChange('registrationNumber')}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        
                      },
                      '& .MuiInputLabel-root': {
                        color: getThemeConfig().primaryColor,
                        fontWeight: '600',
                      },
                    }}
                    disabled={loginMutation.isPending}
                    placeholder="Enter your registration number"
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                    }}
                  />

                  <DateInput
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, dateOfBirth: value }));
                      if (error) setError(''); // Clear error when user changes date
                    }}
                    fullWidth
                    disabled={loginMutation.isPending}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                       
                      },
                      '& .MuiInputLabel-root': {
                        color: getThemeConfig().primaryColor,
                        fontWeight: '600',
                      },
                    }}
                  />
                </>
              ) : (
                <>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        
                      },
                      '& .MuiInputLabel-root': {
                        color: getThemeConfig().primaryColor,
                        fontWeight: '600',
                      },
                    }}
                    disabled={loginMutation.isPending}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    autoComplete="current-password"
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        
                      },
                      '& .MuiInputLabel-root': {
                        color: getThemeConfig().primaryColor,
                        fontWeight: '600',
                      },
                    }}
                    disabled={loginMutation.isPending}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            disabled={loginMutation.isPending}
                            sx={{ color: getThemeConfig().primaryColor }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              )}

              {/* Options */}
              {/* <Grid container justifyContent="end" sx={{ mb: 4 }}>
                <Grid size="auto">
                  <Button
                    variant="text"
                    sx={{
                      color: getThemeConfig().primaryColor,
                      textTransform: 'none',
                      fontWeight: '600',
                      '&:hover': {
                        backgroundColor: `${getThemeConfig().primaryColor}10`,
                      },
                    }}
                    disabled={loginMutation.isPending}
                  >
                    Reset password
                  </Button>
                </Grid>
              </Grid> */}

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loginMutation.isPending}
                sx={{
                  py: 2.5,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${getThemeConfig().primaryColor} 0%, ${getThemeConfig().secondaryColor} 100%)`,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  boxShadow: `0 8px 25px ${getThemeConfig().primaryColor}40`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${getThemeConfig().secondaryColor} 0%, ${getThemeConfig().primaryColor} 100%)`,
                    transform: 'translateY(-3px)',
                    boxShadow: `0 12px 35px ${getThemeConfig().primaryColor}50`,
                  },
                  '&:disabled': {
                    background: '#bdc3c7',
                    transform: 'none',
                    boxShadow: 'none',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loginMutation.isPending ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Signing In...
                  </Box>
                ) : (
                  'SIGN IN'
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
      </Box>
    </Box>
    </ErrorBoundary>
  );
};

export default LoginPage;
