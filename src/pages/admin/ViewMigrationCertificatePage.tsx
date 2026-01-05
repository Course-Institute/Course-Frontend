import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
        // Wait for all images to load before capturing
        const images = migrationRef.current.querySelectorAll('img');
        await Promise.all(
          Array.from(images).map((img) => {
            return new Promise((resolve) => {
              if (img.complete && img.naturalWidth > 0) {
                resolve(true);
              } else {
                img.onload = () => resolve(true);
                img.onerror = () => resolve(true);
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
        
        const fileName = `migration-certificate-${student.registrationNo}-${student.candidateName.replace(/\s+/g, '-')}.pdf`;
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
          
          {/* Example fields - adjust positions based on actual SVG template */}
          <Box sx={{ position: 'absolute', left: '185px', top: '325px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.3rem', fontFamily: '"Dancing Script", cursive' }}>
              {student.candidateName}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '625px', top: '325px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.3rem', fontFamily: '"Dancing Script", cursive' }}>
              {student.fatherName}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '253px', top: '364px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.5rem', fontFamily: '"Dancing Script", cursive' }}>
              {typeof student.course === 'object' && student.course?.name 
                ? student.course.name 
                : student.course}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '760px', top: '414px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.3rem', fontFamily: '"Dancing Script", cursive' }}>
              {student.session}
            </Typography>
          </Box>
          
          {/* Center Name */}
          <Box sx={{ position: 'absolute', left: '97px', top: '416.5px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.1rem', fontFamily: '"Dancing Script", cursive' }}>
              {typeof student.centerId === 'object' && student.centerId?.centerDetails?.centerName
                ? student.centerId.centerDetails.centerName
                : student.centerName || 'N/A'}
            </Typography>
          </Box>
          
          {/* Enrollment No (Registration No) */}
          <Box sx={{ position: 'absolute', left: '493px', top: '459px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.3rem', fontFamily: '"Dancing Script", cursive' }}>
              {student.registrationNo || 'N/A'}
            </Typography>
          </Box>
          
          {/* Place - Hardcoded as New Delhi */}
          <Box sx={{ position: 'absolute', left: '435px', top: '640px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.2rem' }}>
              New Delhi
            </Typography>
          </Box>
          
          {/* Add more fields as needed based on the actual SVG template */}
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewMigrationCertificatePage;
