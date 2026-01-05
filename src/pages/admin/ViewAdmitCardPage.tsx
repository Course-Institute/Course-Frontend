import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, Fragment, useMemo } from 'react';
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
import { useGetMarksheetBySemester } from '../../hooks/useGetMarksheetBySemester';
import { useAllSubjects } from '../../hooks/useAllSubjects';
import { useCenterProfile } from '../../hooks/useCenterProfile';

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

  // Handle center details - centerId might be a populated object or just an ID string
  const centerIdValue = (student as any)?.centerId;
  const isCenterPopulated = centerIdValue && typeof centerIdValue === 'object' && centerIdValue.centerDetails;
  const centerIdString = isCenterPopulated ? null : (typeof centerIdValue === 'string' ? centerIdValue : null);
  
  // Only fetch center details if centerId is a string (not already populated)
  const { data: centerResponse } = useCenterProfile(centerIdString);
  const fetchedCenter = centerResponse?.data;
  
  // Use populated center from student object if available, otherwise use fetched center
  const center = isCenterPopulated ? centerIdValue : fetchedCenter;

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
        // Wait for all images to load before capturing
        const images = admitCardRef.current.querySelectorAll('img');
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
        
        const width = admitCardRef.current.scrollWidth;
        const height = admitCardRef.current.scrollHeight;
        // Increase scale for better quality (3x for high quality, 4x for very high quality)
        const scale = 3;
        
        const canvas = await html2canvas(admitCardRef.current, {
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
        
        const fileName = `admit-card-${student.registrationNo}-${student.candidateName.replace(/\s+/g, '-')}.pdf`;
        pdf.save(fileName);
      } catch (error) {
        console.error('Error generating admit card PDF:', error);
        alert('Error generating admit card PDF. Please try again.');
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
          {isDownloading ? 'Generating PDF...' : 'Download Admit Card (PDF)'}
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
          margin: '0 auto',
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
          <Box sx={{ position: 'absolute', left: '239px', top: '416px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.2rem' }}>
              {student.candidateName}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '239px', top: '469px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.2rem' }}>
              {student.fatherName}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '248px', top: '521px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.2rem' }}>
              {student.motherName}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '223px', top: '574px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.2rem' }}>
              {student.dateOfBirth}
            </Typography>
          </Box>
          
          {/* Exam Centre Address */}
          <Box sx={{ position: 'absolute', left: '265px', top: '655px', maxWidth: '700px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.3rem' }}>
              {(() => {
                // First, try to get center address from fetched center details
                if (center?.centerDetails?.centerName) {
                  const centerDetails = center.centerDetails;
                  return centerDetails.centerName;
                }
                return 'N/A';
              })()}
            </Typography>
          </Box>
          {/* {Course Name} */}
          <Box sx={{ position: 'absolute', left: '265px', top: '751px', maxWidth: '700px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.3rem' }}>
              {student.course.name}
            </Typography>
          </Box>
          
          {/* Roll No. */}
          <Box sx={{ position: 'absolute', right: '139px', top: '341px' }}>
            <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.4rem' }}>
              {student.registrationNo || 'N/A'}
            </Typography>
          </Box>
          
          {/* Student Photo */}
          {student.photo && (
            <Box
              sx={{
                position: 'absolute',
                left: '738px',
                top: '404px',
                width: '251.5px',
                height: '214px',
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
                  objectFit: 'fill',
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
                const rowHeight = 45; // Height between rows
                const rowTop = 854 + (index * rowHeight);
                
                return (
                  <Fragment key={index}>
                    {/* Subject Code */}
                    <Box sx={{ 
                      position: 'absolute', 
                      left: '110px', 
                      top: `${rowTop}px`,
                      height: `${rowHeight}px`,
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.2rem' }}>
                        {subject.subjectCode || 'N/A'}
                      </Typography>
                    </Box>
                    
                    {/* Subject Name */}
                    <Box sx={{ 
                      position: 'absolute', 
                      left: '265px', 
                      top: `${rowTop}px`, 
                      height: `${rowHeight}px`,
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.2rem' }}>
                        {subject.subjectName}
                      </Typography>
                    </Box>
                    
                    {/* Date of Exam - placeholder, adjust if exam dates are available */}
                    <Box sx={{ 
                      position: 'absolute', 
                      left: '820px', 
                      top: `${rowTop}px`,
                      height: `${rowHeight}px`,
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.2rem' }}>
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
