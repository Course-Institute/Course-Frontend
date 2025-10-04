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
import { useStudentProfile } from '../../hooks/useStudentProfile';
import ErrorBoundary from '../../components/ErrorBoundary';

const StudentProfilePage: React.FC = () => {
  const { data: profile, isLoading, isError, error } = useStudentProfile();

  const handleDownloadIdCard = async () => {
    if (!profile) return;
    
    try {
      // Create a canvas element for ID card generation
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size (smaller width for better proportions)
      const width = 450; // Reduced width
      const height = 637;  // 2.125 * 300
      canvas.width = width;
      canvas.height = height;

      // Clear canvas with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // Simple header background
      ctx.fillStyle = '#1E3A8A';
      ctx.fillRect(0, 0, width, 200);

      // Draw institute logo using your actual icon
      const logoX = width / 2;
      const logoY = 60;
      const logoSize = 50;

      // Try to load and draw the institute logo
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.onload = () => {
        ctx.drawImage(logoImg, logoX - logoSize/2, logoY - logoSize/2, logoSize, logoSize);
      };
      logoImg.onerror = () => {
        // Fallback: simple text logo if image fails to load
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('MIVPS', logoX, logoY + 8);
      };
      logoImg.src = '/institute-logo.svg';

      // Institute name (bold white letters)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px Arial';
      ctx.textAlign = 'center';
      
      ctx.fillText('MAHAVIR INSTITUTE OF VOCATIONAL', logoX, logoY + 80);
      ctx.fillText('& PARAMEDICAL SCIENCE', logoX, logoY + 105);

      // Student photo placeholder
      const photoX = logoX;
      const photoY = 220;
      const photoWidth = 120;
      const photoHeight = 90;

      // Photo border (dark blue)
      ctx.strokeStyle = '#1E3A8A';
      ctx.lineWidth = 4;
      ctx.strokeRect(photoX - photoWidth/2, photoY - photoHeight/2, photoWidth, photoHeight);

      // Photo background (light gray)
      ctx.fillStyle = '#F5F5F5';
      ctx.fillRect(photoX - photoWidth/2 + 2, photoY - photoHeight/2 + 2, photoWidth - 4, photoHeight - 4);

      // Try to load and draw student photo
      if (profile.photo) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, photoX - photoWidth/2 + 2, photoY - photoHeight/2 + 2, photoWidth - 4, photoHeight - 4);
          drawTextElements();
        };
        img.onerror = () => {
          drawTextElements();
        };
        // Fix photo URL - remove double slash and use correct base URL
        const baseUrl = import.meta.env.VITE_APP_ENDPOINT || 'http://localhost:5000';
        // Remove trailing slash from baseUrl and leading slash from photo path to avoid double slashes
        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const cleanPhotoPath = profile.photo.startsWith('/') ? profile.photo : `/${profile.photo}`;
        const photoUrl = `${cleanBaseUrl}${cleanPhotoPath}`;
        img.src = photoUrl;
      } else {
        drawTextElements();
      }

      function drawTextElements() {
        if (!ctx || !profile) return;
        
        // Student name
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Student Name :', photoX, photoY + 70);
        ctx.font = 'bold 18px Arial';
        ctx.fillText(profile.candidateName || 'N/A', photoX, photoY + 95);

        // Roll number
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Roll No. :', photoX, photoY + 120);
        ctx.font = 'bold 18px Arial';
        ctx.fillText(profile.registrationNo || 'N/A', photoX, photoY + 145);

        // Horizontal line
        ctx.strokeStyle = '#1E3A8A';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, photoY + 170);
        ctx.lineTo(width - 50, photoY + 170);
        ctx.stroke();

        // Course details (left side)
        const leftX = 60;
        let currentY = photoY + 200;

        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Course :', leftX, currentY);
        ctx.fillText(profile.course || 'N/A', leftX + 60, currentY);

        currentY += 25;
        ctx.fillText('Session :', leftX, currentY);
        ctx.fillText(`${profile.monthSession || ''} ${profile.year || ''} - ${profile.session || ''}`, leftX + 60, currentY);

        currentY += 25;
        ctx.fillText('Enroll. No. :', leftX, currentY);
        ctx.fillText(profile.registrationNo || 'N/A', leftX + 80, currentY);

        currentY += 25;
        ctx.fillText('DOB :', leftX, currentY);
        const dob = profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-GB') : 'N/A';
        ctx.fillText(dob, leftX + 40, currentY);

        currentY += 25;
        ctx.fillText('Phone :', leftX, currentY);
        ctx.fillText(profile.contactNumber || 'N/A', leftX + 60, currentY);

        // QR Code (right side, moved lower)
        const qrX = width - 120;
        const qrY = photoY + 250; // Moved lower
        const qrSize = 80;

        // Generate actual QR code
        const qrData = `${profile.candidateName} - ${profile.registrationNo} - MIVPS`;
        const qrImg = new Image();
        qrImg.crossOrigin = 'anonymous';
        qrImg.onload = () => {
          ctx.drawImage(qrImg, qrX - qrSize/2, qrY - qrSize/2, qrSize, qrSize);
        };
        qrImg.onerror = () => {
          // Fallback: simple QR-like pattern
          ctx.fillStyle = '#000000';
          ctx.fillRect(qrX - qrSize/2, qrY - qrSize/2, qrSize, qrSize);
          
          // Draw QR-like pattern
          ctx.fillStyle = '#FFFFFF';
          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
              if ((i + j) % 2 === 0) {
                ctx.fillRect(qrX - qrSize/2 + i * 10, qrY - qrSize/2 + j * 10, 10, 10);
              }
            }
          }
        };
        
        // Generate QR code using a QR code API
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(qrData)}`;
        qrImg.src = qrUrl;

        // Authorised Signatory (adjusted for new QR position)
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('Authorised Signatory', width - 60, qrY + 100);

        // Footer background (dark teal)
        const footerY = height - 80;
        ctx.fillStyle = '#2D5A5A';
        ctx.fillRect(0, footerY, width, 80);

        // Footer text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Student must carry this card before entering the college premises.', width/2, footerY + 20);
        ctx.fillText('This card is the property of college, if found return it to the college.', width/2, footerY + 40);
        ctx.fillText('If lost, immediately inform the office.', width/2, footerY + 60);

        // Download the generated image
        const link = document.createElement('a');
        link.download = `id-card-${profile.registrationNo || 'student'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (error) {
      console.error('Failed to generate ID card:', error);
      alert('Failed to generate ID card. Please try again.');
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
    </ErrorBoundary>
  );
};

export default StudentProfilePage;
