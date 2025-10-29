import React, { useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import StudentLayout from '../../components/student/StudentLayout';
import { useStudentProfile } from '../../hooks/useStudentProfile';
import { Button } from '@mui/material';
import { CreditCard } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import ErrorBoundary from '../../components/ErrorBoundary';

const StudentProfilePage: React.FC = () => {
  const { data: profile, isLoading, isError, error } = useStudentProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const shouldRedirect = useRef(true);

  // Auto-redirect to marksheet if approved - only on initial load from login
  useEffect(() => {
    // Check if user is coming from marksheet (intentional navigation) or has viewed profile
    const hasViewedProfile = sessionStorage.getItem('hasViewedProfile');
    const fromMarksheet = sessionStorage.getItem('fromMarksheet');
    
    // If coming from marksheet, clear the flag and don't redirect
    if (fromMarksheet === 'true') {
      sessionStorage.removeItem('fromMarksheet');
      shouldRedirect.current = false;
      return;
    }
    
    // Only redirect if:
    // 1. Profile has approved marksheet
    // 2. Should redirect flag is true (first time visiting)
    // 3. User hasn't viewed their profile yet in this session
    if (
      profile?.isMarksheetAndCertificateApproved && 
      shouldRedirect.current &&
      !hasViewedProfile &&
      location.pathname === '/student-dashboard'
    ) {
      shouldRedirect.current = false;
      navigate('/student/marksheet', { replace: true });
    }
  }, [profile, navigate, location.pathname]);

  const handleMenuItemClick = (item: string) => {
    // Clear the redirect flag and mark that user has viewed profile
    if (item === 'profile') {
      shouldRedirect.current = false;
      sessionStorage.setItem('hasViewedProfile', 'true');
    }
    
    switch (item) {
      case 'profile':
        navigate('/student-dashboard');
        break;
      case 'marksheet':
        navigate('/student/marksheet');
        break;
      default:
        break;
    }
  };

  const handleGenerateIdCard = () => {
    if (profile) {
      navigate('/admin/generate-id-card', {
        state: {
          studentData: {
            _id: profile._id,
            candidateName: profile.candidateName,
            registrationNo: profile.registrationNo,
            course: profile.course,
            session: profile.session,
            year: profile.year,
            faculty: profile.faculty,
            stream: profile.stream,
            contactNumber: profile.contactNumber,
            emailAddress: profile.emailAddress,
            dateOfBirth: profile.dateOfBirth,
            photo: profile.photo
          }
        }
      });
    } else {
      navigate('/admin/generate-id-card');
    }
  };



  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <StudentLayout 
        activeMenuItem="profile" 
        pageTitle="Student Profile"
        onMenuItemClick={handleMenuItemClick}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} />
          </Box>
        </Container>
      </StudentLayout>
    );
  }

  if (isError) {
    return (
      <StudentLayout 
        activeMenuItem="profile" 
        pageTitle="Student Profile"
        onMenuItemClick={handleMenuItemClick}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error?.message || 'Failed to load student profile. Please try again.'}
          </Alert>
        </Container>
      </StudentLayout>
    );
  }

  return (
    <ErrorBoundary>
      <StudentLayout 
        activeMenuItem="profile" 
        pageTitle="Student Profile"
        breadcrumbs={[
          { label: 'Home' },
          { label: 'Student Profile' }
        ]}
        onMenuItemClick={handleMenuItemClick}
      >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#1e293b', 
              mb: 1,
              fontSize: { xs: '1.75rem', md: '2.125rem' },
            }}
          >
            Student Profile
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#64748b',
              fontSize: '0.95rem',
            }}
          >
            CMS Student Profile
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Card - Student Photo and Basic Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card 
              sx={{ 
                height: 'fit-content',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#1976d2', 
                    mb: 3,
                    textAlign: 'left',
                    fontSize: '1rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  STUDENT PROFILE
                </Typography>
                
                {/* Student Photo */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                  <Avatar
                    src={profile?.photo ? (() => {
                      const baseUrl = import.meta.env.VITE_APP_ENDPOINT || 'http://localhost:5000';
                      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
                      const cleanPhotoPath = profile.photo.startsWith('/') ? profile.photo : `/${profile.photo}`;
                      return `${cleanBaseUrl}${cleanPhotoPath}`;
                    })() : '/default-avatar.png'}
                    alt="Student Photo"
                    sx={{
                      width: 140,
                      height: 140,
                      border: '4px solid #1976d2',
                      boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                    }}
                  />
                </Box>

                {/* Basic Info */}
                <Box sx={{ textAlign: 'left', px: 1 }}>
                  <Box sx={{ mb: 2, p: 1.5, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Registration No.
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 600 }}>
                      {profile?.registrationNo || 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Course
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 600 }}>
                      {profile?.course || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Card - Detailed Information */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#1976d2', 
                    mb: 4,
                    fontSize: '1rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  STUDENT PROFILE
                </Typography>

                {/* Student Details Grid */}
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        border: '1px solid #e9ecef',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f1f3f5',
                          borderColor: '#1976d2',
                        },
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 0.5,
                          color: '#64748b',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Student Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {profile?.candidateName || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        border: '1px solid #e9ecef',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f1f3f5',
                          borderColor: '#1976d2',
                        },
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 0.5,
                          color: '#64748b',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Father's Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {profile?.fatherName || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        border: '1px solid #e9ecef',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f1f3f5',
                          borderColor: '#1976d2',
                        },
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 0.5,
                          color: '#64748b',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Mother's Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {profile?.motherName || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        border: '1px solid #e9ecef',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f1f3f5',
                          borderColor: '#1976d2',
                        },
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 0.5,
                          color: '#64748b',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        D.O.B
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {profile?.dateOfBirth ? formatDate(profile.dateOfBirth) : 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        border: '1px solid #e9ecef',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f1f3f5',
                          borderColor: '#1976d2',
                        },
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 0.5,
                          color: '#64748b',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Aadhar Card No.
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {profile?.adharCardNo || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        border: '1px solid #e9ecef',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f1f3f5',
                          borderColor: '#1976d2',
                        },
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 0.5,
                          color: '#64748b',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Gender
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {profile?.gender || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        border: '1px solid #e9ecef',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f1f3f5',
                          borderColor: '#1976d2',
                        },
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 0.5,
                          color: '#64748b',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Session
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {profile?.session || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        border: '1px solid #e9ecef',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f1f3f5',
                          borderColor: '#1976d2',
                        },
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 0.5,
                          color: '#64748b',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Mobile No.
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {profile?.contactNumber || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        border: '1px solid #e9ecef',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f1f3f5',
                          borderColor: '#1976d2',
                        },
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 0.5,
                          color: '#64748b',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Faculty
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {profile?.faculty || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        border: '1px solid #e9ecef',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f1f3f5',
                          borderColor: '#1976d2',
                        },
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 0.5,
                          color: '#64748b',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Stream
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {profile?.stream || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        border: '1px solid #e9ecef',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f1f3f5',
                          borderColor: '#1976d2',
                        },
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 0.5,
                          color: '#64748b',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Year
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {profile?.year || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        border: '1px solid #e9ecef',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f1f3f5',
                          borderColor: '#1976d2',
                        },
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 0.5,
                          color: '#64748b',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Course Fee
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        ₹{profile?.courseFee || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box 
                      sx={{ 
                        mb: 2,
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 2,
                        border: '1px solid #e9ecef',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f1f3f5',
                          borderColor: '#1976d2',
                        },
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 0.5,
                          color: '#64748b',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Duration
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {profile?.duration || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Contact Information */}
                {profile?.emailAddress && (
                  <Box 
                    sx={{ 
                      mt: 3, 
                      p: 3, 
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      borderRadius: 2,
                      border: '1px solid #dee2e6',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Box sx={{ 
                        p: 1, 
                        backgroundColor: 'white', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <EmailIcon sx={{ fontSize: 20, color: '#1976d2' }} />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, display: 'block' }}>
                          Email Address
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 500 }}>
                          {profile.emailAddress}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ 
                        p: 1, 
                        backgroundColor: 'white', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <PhoneIcon sx={{ fontSize: 20, color: '#1976d2' }} />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, display: 'block' }}>
                          Phone Number
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 500 }}>
                          {profile.contactNumber}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Important Note */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    mt: 3, 
                    p: 2.5, 
                    background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
                    border: '1px solid #ffd43b',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.15)',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#856404', fontWeight: 600, fontSize: '0.9rem' }}>
                    <strong>NOTE:</strong> In case of any discrepancy in details, kindly contact: info@mivps.com
                  </Typography>
                </Paper>

                {/* Generate ID Card Button or Approval Status */}
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  {profile?.isApprovedByAdmin ? (
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<CreditCard />}
                      onClick={handleGenerateIdCard}
                      sx={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                        '&:hover': { 
                          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                          boxShadow: '0 6px 20px rgba(59, 130, 246, 0.5)',
                          transform: 'translateY(-2px)',
                        },
                        textTransform: 'none',
                        borderRadius: 3,
                        px: 5,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Generate ID Card
                    </Button>
                  ) : (
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 3, 
                        background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
                        border: '1px solid #ffd43b',
                        borderRadius: 2,
                        display: 'inline-block',
                        maxWidth: '600px',
                        boxShadow: '0 2px 8px rgba(245, 158, 11, 0.15)',
                      }}
                    >
                      <Typography variant="body1" sx={{ color: '#856404', fontWeight: 600, fontSize: '0.95rem' }}>
                        Your profile is pending admin approval. ID card generation will be available once approved.
                      </Typography>
                    </Paper>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Container>
    </StudentLayout>
    </ErrorBoundary>
  );
};

export default StudentProfilePage;
