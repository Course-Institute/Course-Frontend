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

const ViewCertificatePage = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const { data: studentResponse, isLoading, error } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => getStudentDetails(studentId || ''),
    enabled: !!studentId,
  });

  const student = studentResponse?.student || studentResponse?.data?.student;

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
          Error loading certificate: {error instanceof Error ? error.message : 'Student not found'}
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
    if (certificateRef.current && student) {
      setIsDownloading(true);
      try {
        // Additional wait to ensure everything is rendered
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(certificateRef.current, {
          backgroundColor: '#ffffff',
          scale: 2, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          logging: false,
          windowWidth: certificateRef.current.scrollWidth,
          windowHeight: certificateRef.current.scrollHeight,
        });
        
        const link = document.createElement('a');
        link.download = `certificate-${student.registrationNo}-${student.candidateName.replace(/\s+/g, '-')}.png`;
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
          {/* Example fields - adjust positions based on actual SVG template */}
          <Box sx={{ position: 'absolute', left: '435px', top: '625px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.6rem' }}>
              {student.candidateName}
            </Typography>
          </Box>

          <Box sx={{ position: 'absolute', left: '409px', top: '735px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.6rem' }}>
              {student.fatherName}
            </Typography>
          </Box>

          <Box sx={{ position: 'absolute', left: '585px', top: '795px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.8rem' }}>
              {student.registrationNo}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '325px', top: '945px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.6rem' }}>
              {typeof student.course === 'object' && student.course?.name 
                ? student.course.name 
                : student.course}
            </Typography>
          </Box>
          
          {/* <Box sx={{ position: 'absolute', left: '220px', top: '1050px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.3rem' }}>
              {student.session}
            </Typography>
          </Box> */}
          
          {/* Add more fields as needed based on the actual SVG template */}
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewCertificatePage;
