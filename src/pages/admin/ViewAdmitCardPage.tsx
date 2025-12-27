import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, Fragment, useMemo } from 'react';
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
import { useGetMarksheetBySemester } from '../../hooks/useGetMarksheetBySemester';
import { useAllSubjects } from '../../hooks/useAllSubjects';

const ViewAdmitCardPage = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const admitCardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const { data: studentResponse, isLoading: isLoadingStudent, error } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => getStudentDetails(studentId || ''),
    enabled: !!studentId,
  });

  const student = studentResponse?.student || studentResponse?.data?.student;

  // Fetch marksheet to get subjects - try to get first available semester/year
  const semestersWithMarksheet: string[] = student?.whichSemesterMarksheetIsGenerated || [];
  const yearsWithMarksheet: string[] = (student as any)?.whichYearMarksheetIsGenerated || [];
  const isYearBased = yearsWithMarksheet.length > 0;
  const terms = isYearBased ? yearsWithMarksheet : semestersWithMarksheet;
  const firstTerm = terms.length > 0 ? terms[0] : '1';
  
  const { data: marksheet, isLoading: isLoadingMarksheet } = useGetMarksheetBySemester(
    studentId || '',
    isYearBased ? '' : firstTerm,
    isYearBased ? firstTerm : '',
    !!studentId && terms.length > 0
  );

  // Fetch all subjects to get subject codes
  const { subjects: allSubjects } = useAllSubjects();

  // Match marksheet subjects with all subjects to get codes
  const subjectsWithCodes = useMemo(() => {
    if (!marksheet?.subjects) return [];
    
    return marksheet.subjects.map((subject) => {
      const matchedSubject = allSubjects.find(
        (s) => s.name.toLowerCase() === subject.subjectName.toLowerCase()
      );
      return {
        ...subject,
        subjectCode: matchedSubject?.code || '',
      };
    });
  }, [marksheet?.subjects, allSubjects]);

  const isLoading = isLoadingStudent || isLoadingMarksheet;

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
          Error loading admit card: {error instanceof Error ? error.message : 'Student not found'}
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
    if (admitCardRef.current && student) {
      setIsDownloading(true);
      try {
        // Additional wait to ensure everything is rendered
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(admitCardRef.current, {
          backgroundColor: '#ffffff',
          scale: 2, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          logging: false,
          windowWidth: admitCardRef.current.scrollWidth,
          windowHeight: admitCardRef.current.scrollHeight,
        });
        
        const link = document.createElement('a');
        link.download = `admit-card-${student.registrationNo}-${student.candidateName.replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      } catch (error) {
        console.error('Error generating admit card image:', error);
        alert('Error generating admit card image. Please try again.');
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
          {isDownloading ? 'Generating...' : 'Download Admit Card'}
        </Button>
      </Box>

      <Paper 
        ref={admitCardRef}
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
          src="/mivps-admit-card.svg"
          alt="Admit Card Template"
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
          <Box sx={{ position: 'absolute', left: '240px', top: '442px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.3rem' }}>
              {student.candidateName}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '240px', top: '495px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.3rem' }}>
              {student.fatherName}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '248px', top: '547px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.3rem' }}>
              {student.motherName}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '225px', top: '600px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.3rem' }}>
              {student.session}
            </Typography>
          </Box>
          
          {/* Roll No. */}
          <Box sx={{ position: 'absolute', right: '190px', top: '368px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.4rem' }}>
              {student.registrationNo || 'N/A'}
            </Typography>
          </Box>
          
          {/* Student Photo */}
          {student.photo && (
            <Box
              sx={{
                position: 'absolute',
                left: '739px',
                top: '431px',
                width: '244px',
                height: '209.25px',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                zIndex: 2,
              }}
            >
              <Box
                component="img"
                src={(() => {
                  const baseUrl = import.meta.env.VITE_APP_ENDPOINT || 'http://localhost:5000';
                  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
                  const cleanPhotoPath = student.photo.startsWith('/') ? student.photo : `/${student.photo}`;
                  return `${cleanBaseUrl}${cleanPhotoPath}`;
                })()}
                alt="Student Photo"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </Box>
          )}
          
          {/* Subjects Table */}
          {subjectsWithCodes.length > 0 && (
            <>
              {subjectsWithCodes.map((subject, index) => {
                // Starting position for subjects table - adjust based on actual SVG template
                const baseTop = 829; // Adjust this value based on where the table starts in the SVG
                const rowHeight = 43; // Height between rows
                const rowTop = baseTop + (index * rowHeight);
                
                return (
                  <Fragment key={index}>
                    {/* Subject Code */}
                    <Box sx={{ 
                      position: 'absolute', 
                      left: '130px', 
                      top: `${rowTop}px`,
                      height: `${rowHeight}px`,
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1rem' }}>
                        {subject.subjectCode || 'N/A'}
                      </Typography>
                    </Box>
                    
                    {/* Subject Name */}
                    <Box sx={{ 
                      position: 'absolute', 
                      left: '278px', 
                      top: `${rowTop}px`, 
                      height: `${rowHeight}px`,
                      maxWidth: '300px',
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1rem' }}>
                        {subject.subjectName}
                      </Typography>
                    </Box>
                    
                    {/* Date of Exam - placeholder, adjust if exam dates are available */}
                    <Box sx={{ 
                      position: 'absolute', 
                      left: '810px', 
                      top: `${rowTop}px`,
                      height: `${rowHeight}px`,
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1rem' }}>
                        {/* TODO: Add exam date when available in API */}
                        TBA
                      </Typography>
                    </Box>
                  </Fragment>
                );
              })}
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewAdmitCardPage;
