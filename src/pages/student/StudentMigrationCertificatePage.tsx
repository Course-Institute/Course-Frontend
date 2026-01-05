import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
        // Wait for all images to load before capturing
        const images = migrationRef.current.querySelectorAll('img');
        await Promise.all(
          Array.from(images).map((img) => {
            return new Promise((resolve) => {
              if (img.complete && img.naturalWidth > 0) {
                resolve(true);
              } else {
                img.onload = () => resolve(true);
                img.onerror = () => resolve(true); // Continue even if image fails to load
              }
            });
          })
        );

        // Additional wait to ensure everything is rendered
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const width = migrationRef.current.scrollWidth;
        const height = migrationRef.current.scrollHeight;
        // Increase scale for better quality (3x for high quality, 4x for very high quality)
        const scale = 3;
        
        const canvas = await html2canvas(migrationRef.current, {
          backgroundColor: '#ffffff',
          scale: scale,
          useCORS: true,
          allowTaint: true,
          logging: false,
          windowWidth: width,
          windowHeight: height,
          removeContainer: false,
          imageTimeout: 15000,
          onclone: (clonedDoc) => {
            // Ensure all fonts are loaded
            const clonedWindow = clonedDoc.defaultView;
            if (clonedWindow) {
              clonedWindow.document.fonts.ready;
            }
          },
        });
        
        // Use maximum quality PNG
        const imgData = canvas.toDataURL('image/png', 1.0);
        
        // Create PDF with the actual dimensions
        const pdf = new jsPDF({
          orientation: width > height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [width, height],
          compress: false,
        });
        
        // Use 'FAST' compression for better quality (SLOW can degrade quality)
        pdf.addImage(imgData, 'PNG', 0, 0, width, height, undefined, 'FAST');
        
        const fileName = `migration-certificate-${profile.registrationNo}-${profile.candidateName.replace(/\s+/g, '-')}.pdf`;
        pdf.save(fileName);
      } catch (error) {
        console.error('Error generating migration certificate PDF:', error);
        alert('Error generating migration certificate PDF. Please try again.');
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
            {isDownloading ? 'Generating PDF...' : 'Download Migration Certificate (PDF)'}
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
            <Box sx={{ position: 'absolute', left: '147px', top: '61.5px' }}>
              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.1rem' }}>
                {serialNo}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '185px', top: '325px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.3rem', fontFamily: '"Dancing Script", cursive' }}>
                {profile.candidateName}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '625px', top: '325px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.3rem', fontFamily: '"Dancing Script", cursive' }}>
                {profile.fatherName}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '253px', top: '364px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.5rem', fontFamily: '"Dancing Script", cursive' }}>
                {typeof (profile as any).course === 'object' && (profile as any).course?.name 
                  ? (profile as any).course.name 
                  : profile.course}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '760px', top: '414px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.3rem', fontFamily: '"Dancing Script", cursive' }}>
                {profile.session}
              </Typography>
            </Box>
            
            {/* Center Name */}
            <Box sx={{ position: 'absolute', left: '97px', top: '416.5px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.1rem', fontFamily: '"Dancing Script", cursive' }}>
                {typeof (profile as any).centerId === 'object' && (profile as any).centerId?.centerDetails?.centerName
                  ? (profile as any).centerId.centerDetails.centerName
                  : (profile as any).centerName || 'N/A'}
              </Typography>
            </Box>
            
            {/* Enrollment No (Registration No) */}
            <Box sx={{ position: 'absolute', left: '493px', top: '459px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.3rem', fontFamily: '"Dancing Script", cursive' }}>
                {profile.registrationNo || 'N/A'}
              </Typography>
            </Box>
            
            {/* Place - Hardcoded as New Delhi */}
            <Box sx={{ position: 'absolute', left: '435px', top: '640px' }}>
              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.2rem' }}>
                New Delhi
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </StudentLayout>
  );
};

export default StudentMigrationCertificatePage;
