import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
import { ArrowBack, Download } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getStudentDetails } from '../../api/studentsApi';

const ViewMigrationCertificatePage = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const migrationRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const { data: studentResponse, isLoading, error } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => getStudentDetails(studentId || ''),
    enabled: !!studentId,
  });

  const student = studentResponse?.student || studentResponse?.data?.student;

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

  const serialNo = student ? getSerialNo(student.registrationNo) : '000000';

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading migration certificate: {error instanceof Error ? error.message : 'Student not found'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/students')}
          sx={{ mt: 2 }}
        >
          Back to Students
        </Button>
      </Box>
    );
  }

  if (!student) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No student found.</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/students')}
          sx={{ mt: 2 }}
        >
          Back to Students
        </Button>
      </Box>
    );
  }

  const handleDownload = async () => {
    if (migrationRef.current && student) {
      setIsDownloading(true);
      try {
        // Additional wait to ensure everything is rendered
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(migrationRef.current, {
          backgroundColor: '#ffffff',
          scale: 2, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          logging: false,
          windowWidth: migrationRef.current.scrollWidth,
          windowHeight: migrationRef.current.scrollHeight,
        });
        
        const link = document.createElement('a');
        link.download = `migration-certificate-${student.registrationNo}-${student.candidateName.replace(/\s+/g, '-')}.png`;
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
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/students')}
        >
          Back to Students
        </Button>
        
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
          
          {/* Example fields - adjust positions based on actual SVG template */}
          <Box sx={{ position: 'absolute', left: '185px', top: '325px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.3rem' }}>
              {student.candidateName}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '630px', top: '325px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.3rem' }}>
              {student.fatherName}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '253px', top: '368px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.3rem' }}>
              {typeof student.course === 'object' && student.course?.name 
                ? student.course.name 
                : student.course}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '760px', top: '416px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.3rem' }}>
              {student.session}
            </Typography>
          </Box>
          
          {/* Center Name */}
          <Box sx={{ position: 'absolute', left: '97px', top: '416px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}>
              {typeof student.centerId === 'object' && student.centerId?.centerDetails?.centerName
                ? student.centerId.centerDetails.centerName
                : student.centerName || 'N/A'}
            </Typography>
          </Box>
          
          {/* Enrollment No (Registration No) */}
          <Box sx={{ position: 'absolute', left: '430px', top: '460px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.3rem' }}>
              {student.registrationNo || 'N/A'}
            </Typography>
          </Box>
          
          {/* Add more fields as needed based on the actual SVG template */}
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewMigrationCertificatePage;
