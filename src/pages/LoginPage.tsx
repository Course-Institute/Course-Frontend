import { useState, useCallback } from 'react';
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
  useTheme,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Business,
} from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { loginUser, type LoginResponse } from '../api/authApi';
import { useSession } from '../contexts/SessionContext';
import Navbar from '../components/Navbar';
import DateInput from '../components/DateInput';

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'Student';
  const { login } = useSession();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    registrationNumber: '',
    dateOfBirth: '',
    keepSignedIn: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const loginMutation = useMutation<LoginResponse, Error, { email?: string; password?: string; registrationNumber?: string; dateOfBirth?: string; role: string }>(

    {
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Handle successful login
      console.log('Login successful:', data);
      console.log('Role:', role);
      
      // Use session context to login with token and user role from response
      const userRole = data.data.user.role;
      login(data.data.token, userRole);
      
      // Store keep signed in preference
      localStorage.setItem('keepSignedIn', formData.keepSignedIn.toString());
      
      // Store student registration number if student login
      if (userRole.toLowerCase() === 'student' && formData.registrationNumber) {
        localStorage.setItem('studentRegistrationNumber', formData.registrationNumber.toString());
      }
      
      // Navigate to appropriate dashboard based on role from response
      console.log('Navigating with role:', userRole.toLowerCase());
      switch (userRole.toLowerCase()) {
        case 'student':
          console.log('Navigating to student dashboard');
          navigate('/student-dashboard');
          break;
        case 'center':
          console.log('Navigating to center dashboard');
          navigate('/center-dashboard');
          break;
        case 'admin':
        case 'app': // App Login is also admin login
          console.log('Navigating to admin dashboard');
          navigate('/admin-dashboard');
          break;
        default:
          console.log('Navigating to home (default)');
          navigate('/');
      }
    },
    onError: (error: any) => {
      console.log("error::", error)
      setError(error.message || error.response?.data?.message || 'Login failed. Please try again.');
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

  const getTitle = useCallback(() => {
    switch (role.toLowerCase()) {
      case 'student':
        return 'Student Login';
      case 'center':
        return 'Center Login';
      case 'admin':
        return 'Admin Login';
      default:
        return 'Welcome Back';
    }
  }, [role]);

  const getSubtitle = useCallback(() => {
    switch (role.toLowerCase()) {
      case 'student':
        return 'Please sign in to your student account';
      case 'center':
        return 'Please sign in to your center account';
      case 'admin':
        return 'Please sign in to your admin account';
      default:
        return 'Please sign in to your corporate account';
    }
  }, [role]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <Navbar />
      
      {/* Login Content */}
      <Box
        sx={{
          flex: 1,
          background: `linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 6 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              {/* Logo/Icon */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <Business sx={{ fontSize: 40, color: 'white' }} />
              </Box>

              {/* Title */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  mb: 1,
                }}
              >
                {getTitle()}
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="body1"
                sx={{
                  color: '#7f8c8d',
                  fontSize: '1.1rem',
                }}
              >
                {getSubtitle()}
              </Typography>
            </Box>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
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
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
                    onChange={(value) => setFormData(prev => ({ ...prev, dateOfBirth: value }))}
                    fullWidth
                    disabled={loginMutation.isPending}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
              <Grid container justifyContent="end" sx={{ mb: 4 }}>
                <Grid size="auto">
                  <Button
                    variant="text"
                    sx={{
                      color: theme.palette.primary.main,
                      textTransform: 'none',
                      fontWeight: 'large',
                    }}
                    disabled={loginMutation.isPending}
                  >
                    Reset password
                  </Button>
                </Grid>
              </Grid>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loginMutation.isPending}
                sx={{
                  py: 2,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                  },
                  '&:disabled': {
                    background: '#bdc3c7',
                  },
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
  );
};

export default LoginPage;
