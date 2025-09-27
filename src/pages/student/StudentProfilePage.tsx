import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import StudentLayout from '../../components/student/StudentLayout';
import { useStudentProfile, useDownloadIdCard } from '../../hooks/useStudentProfile';

const StudentProfilePage: React.FC = () => {
  const { data: profile, isLoading, isError, error } = useStudentProfile();
  const { downloadIdCard } = useDownloadIdCard();

  const handleDownloadIdCard = async () => {
    try {
      await downloadIdCard();
    } catch (error) {
      console.error('Failed to download ID card:', error);
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
                    src={profile?.photo || '/default-avatar.png'}
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
                    Student Ref. No. : {profile?.studentRefNo || 'N/A'}
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
                        {profile?.studentName || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Father's Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {profile?.fathersName || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Mother's Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {profile?.mothersName || 'N/A'}
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
                        Enrollment No.
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {profile?.enrollmentNo || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Roll No.
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {profile?.rollNo || 'N/A'}
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
                        {profile?.mobileNo || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Contact Information */}
                {profile?.email && (
                  <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EmailIcon sx={{ fontSize: 16, color: '#666' }} />
                      <Typography variant="body2" color="text.secondary">
                        Email: {profile.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 16, color: '#666' }} />
                      <Typography variant="body2" color="text.secondary">
                        Phone: {profile.mobileNo}
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

                {/* Download ID Card Button */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadIdCard}
                    sx={{
                      backgroundColor: '#1976d2',
                      '&:hover': {
                        backgroundColor: '#1565c0',
                      },
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Download Id Card
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </StudentLayout>
  );
};

export default StudentProfilePage;
