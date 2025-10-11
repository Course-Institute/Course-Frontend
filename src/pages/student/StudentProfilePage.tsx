import React from 'react';
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
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '../../components/ErrorBoundary';

const StudentProfilePage: React.FC = () => {
  const { data: profile, isLoading, isError, error } = useStudentProfile();
  const navigate = useNavigate();

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
      <StudentLayout activeMenuItem="profile" pageTitle="Student Profile">
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
      <StudentLayout activeMenuItem="profile" pageTitle="Student Profile">
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
      >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
            Student Profile
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            CMS Student Profile
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Card - Student Photo and Basic Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: 'fit-content' }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: '#1976d2', 
                    mb: 3,
                    textAlign: 'left'
                  }}
                >
                  STUDENT PROFILE
                </Typography>
                
                {/* Student Photo */}
                <Box sx={{ mb: 3 }}>
                  <Avatar
                    src={profile?.photo ? (() => {
                      const baseUrl = import.meta.env.VITE_APP_ENDPOINT || 'http://localhost:5000';
                      // Remove trailing slash from baseUrl and leading slash from photo path to avoid double slashes
                      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
                      const cleanPhotoPath = profile.photo.startsWith('/') ? profile.photo : `/${profile.photo}`;
                      return `${cleanBaseUrl}${cleanPhotoPath}`;
                    })() : '/default-avatar.png'}
                    alt="Student Photo"
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      border: '3px solid #1976d2',
                      mb: 2,
                    }}
                  />
                </Box>

                {/* Basic Info */}
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                    Registration No. : {profile?.registrationNo || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Course : {profile?.course || 'N/A'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Card - Detailed Information */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: '#1976d2', 
                    mb: 3 
                  }}
                >
                  STUDENT PROFILE
                </Typography>

                {/* Student Details Grid */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Student Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {profile?.candidateName || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Father's Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {profile?.fatherName || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Mother's Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {profile?.motherName || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        D.O.B
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {profile?.dateOfBirth ? formatDate(profile.dateOfBirth) : 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Aadhar Card No.
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {profile?.adharCardNo || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Gender
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {profile?.gender || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Session
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {profile?.session || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Mobile No.
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {profile?.contactNumber || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Faculty
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {profile?.faculty || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Stream
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {profile?.stream || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Year
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {profile?.year || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Course Fee
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        ₹{profile?.courseFee || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Duration
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {profile?.duration || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Contact Information */}
                {profile?.emailAddress && (
                  <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EmailIcon sx={{ fontSize: 16, color: '#666' }} />
                      <Typography variant="body2" color="text.secondary">
                        Email: {profile.emailAddress}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 16, color: '#666' }} />
                      <Typography variant="body2" color="text.secondary">
                        Phone: {profile.contactNumber}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Important Note */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    mt: 3, 
                    p: 2, 
                    backgroundColor: '#fff3cd', 
                    border: '1px solid #ffeaa7',
                    borderRadius: 1 
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#856404', fontWeight: 'medium' }}>
                    NOTE: In case of any discrepancy in details, kindly contact: info@mivps.com
                  </Typography>
                </Paper>

                {/* Generate ID Card Button */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<CreditCard />}
                    onClick={handleGenerateIdCard}
                    sx={{
                      backgroundColor: '#3b82f6',
                      '&:hover': { backgroundColor: '#2563eb' },
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                    }}
                  >
                    Generate ID Card
                  </Button>
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
