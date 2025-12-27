import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Button,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useStudentProfile } from '../../hooks/useStudentProfile';
import StudentLayout from '../../components/student/StudentLayout';

const StudentCertificatePage = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useStudentProfile();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleMenuItemClick = (item: string) => {
    switch (item) {
      case 'profile':
        navigate('/student-dashboard');
        break;
      case 'admitCard':
        navigate('/student/admit-card');
        break;
      case 'marksheet':
        navigate('/student/marksheet');
        break;
      case 'certificate':
        navigate('/student/certificate');
        break;
      case 'migration':
        navigate('/student/migration');
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <StudentLayout activeMenuItem="certificate" pageTitle="Certificate" onMenuItemClick={handleMenuItemClick}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </StudentLayout>
    );
  }

  if (!profile?.isCertificateApproved) {
    return (
      <StudentLayout activeMenuItem="certificate" pageTitle="Certificate" onMenuItemClick={handleMenuItemClick}>
        <Box sx={{ p: 3 }}>
          <Alert severity="info">Your certificate is not yet approved. Please contact your center.</Alert>
        </Box>
      </StudentLayout>
    );
  }

  const handleDownload = async () => {
    if (certificateRef.current && profile) {
      setIsDownloading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(certificateRef.current, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          windowWidth: certificateRef.current.scrollWidth,
          windowHeight: certificateRef.current.scrollHeight,
        });
        
        const link = document.createElement('a');
        link.download = `certificate-${profile.registrationNo}-${profile.candidateName.replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      } catch (error) {
        console.error('Error generating certificate image:', error);
        alert('Error generating certificate image. Please try again.');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <StudentLayout activeMenuItem="certificate" pageTitle="Certificate" onMenuItemClick={handleMenuItemClick}>
      <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownload}
            disabled={isDownloading}
            sx={{
              backgroundColor: '#10b981',
              '&:hover': { backgroundColor: '#059669' },
            }}
          >
            {isDownloading ? 'Generating...' : 'Download Certificate'}
          </Button>
        </Box>

        <Paper 
          ref={certificateRef}
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            minHeight: '800px', 
            width: { xs: '100%', md: '1056px' },
            height: { xs: 'auto', md: '1494px' },
            aspectRatio: { md: '1056/1494' },
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            margin: '0 auto',
          }}
        >
          {/* SVG Background */}
          <Box
            component="img"
            src="/mivps-certificate.svg"
            alt="Certificate Template"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 'auto',
              zIndex: 0,
              objectFit: 'contain',
            }}
          />
          
          {/* Student Details Overlay - Adjust positions based on actual SVG template */}
          <Box sx={{ position: 'relative', height: '100%', zIndex: 1 }}>
            <Box sx={{ position: 'absolute', left: '220px', top: '300px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.3rem' }}>
                {profile.candidateName}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '220px', top: '350px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.3rem' }}>
                {profile.registrationNo}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '220px', top: '400px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.3rem' }}>
                {typeof (profile as any).course === 'object' && (profile as any).course?.name 
                  ? (profile as any).course.name 
                  : (profile.course as string)}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '220px', top: '450px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.3rem' }}>
                {profile.session}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </StudentLayout>
  );
};

export default StudentCertificatePage;
