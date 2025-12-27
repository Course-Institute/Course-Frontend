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

const StudentMigrationCertificatePage = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useStudentProfile();
  const migrationRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Generate 6-digit serial number from registrationNo
  const getSerialNo = (registrationNo: string): string => {
    if (!registrationNo) return '000000';
    
    // Remove any non-digit characters
    const digits = registrationNo.replace(/\D/g, '');
    
    if (digits.length === 0) return '000000';
    
    // Take last 6 digits, or pad with zeros if shorter
    if (digits.length >= 6) {
      return digits.slice(-6);
    } else {
      // Pad with zeros to make it 6 digits
      return digits.padStart(6, '0');
    }
  };

  const serialNo = profile ? getSerialNo(profile.registrationNo) : '000000';

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
      <StudentLayout activeMenuItem="migration" pageTitle="Migration Certificate" onMenuItemClick={handleMenuItemClick}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </StudentLayout>
    );
  }

  if (!profile?.isMigrationApproved) {
    return (
      <StudentLayout activeMenuItem="migration" pageTitle="Migration Certificate" onMenuItemClick={handleMenuItemClick}>
        <Box sx={{ p: 3 }}>
          <Alert severity="info">Your migration certificate is not yet approved. Please contact your center.</Alert>
        </Box>
      </StudentLayout>
    );
  }

  const handleDownload = async () => {
    if (migrationRef.current && profile) {
      setIsDownloading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(migrationRef.current, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          windowWidth: migrationRef.current.scrollWidth,
          windowHeight: migrationRef.current.scrollHeight,
        });
        
        const link = document.createElement('a');
        link.download = `migration-certificate-${profile.registrationNo}-${profile.candidateName.replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      } catch (error) {
        console.error('Error generating migration certificate image:', error);
        alert('Error generating migration certificate image. Please try again.');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <StudentLayout activeMenuItem="migration" pageTitle="Migration Certificate" onMenuItemClick={handleMenuItemClick}>
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
            {isDownloading ? 'Generating...' : 'Download Migration Certificate'}
          </Button>
        </Box>

        <Paper 
          ref={migrationRef}
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
            src="/mivps-migration-certificate.svg"
            alt="Migration Certificate Template"
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
            {/* Serial No in top left corner */}
            <Box sx={{ position: 'absolute', left: '146px', top: '64px' }}>
              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.1rem' }}>
                {serialNo}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '185px', top: '325px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.3rem' }}>
                {profile.candidateName}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '630px', top: '325px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.3rem' }}>
                {profile.fatherName}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '253px', top: '368px' }}>
              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.3rem' }}>
                {typeof (profile as any).course === 'object' && (profile as any).course?.name 
                  ? (profile as any).course.name 
                  : profile.course}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '760px', top: '416px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.3rem' }}>
                {profile.session}
              </Typography>
            </Box>
            
            {/* Center Name */}
            <Box sx={{ position: 'absolute', left: '97px', top: '416px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}>
                {typeof (profile as any).centerId === 'object' && (profile as any).centerId?.centerDetails?.centerName
                  ? (profile as any).centerId.centerDetails.centerName
                  : (profile as any).centerName || 'N/A'}
              </Typography>
            </Box>
            
            {/* Enrollment No (Registration No) */}
            <Box sx={{ position: 'absolute', left: '430px', top: '460px' }}>
              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.3rem' }}>
                {profile.registrationNo || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </StudentLayout>
  );
};

export default StudentMigrationCertificatePage;
