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
import { Download } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useStudentProfile } from '../../hooks/useStudentProfile';
import StudentLayout from '../../components/student/StudentLayout';
import { useGetMarksheetBySemester } from '../../hooks/useGetMarksheetBySemester';
import { useAllSubjects } from '../../hooks/useAllSubjects';
import { useCenterProfile } from '../../hooks/useCenterProfile';

const StudentAdmitCardPage = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading: isLoadingProfile } = useStudentProfile();
  const admitCardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Handle center details - centerId might be a populated object or just an ID string
  const centerIdValue = (profile as any)?.centerId;
  const isCenterPopulated = centerIdValue && typeof centerIdValue === 'object' && centerIdValue.centerDetails;
  const centerIdString = isCenterPopulated ? null : (typeof centerIdValue === 'string' ? centerIdValue : null);
  
  // Only fetch center details if centerId is a string (not already populated)
  const { data: centerResponse } = useCenterProfile(centerIdString);
  const fetchedCenter = centerResponse?.data;
  
  // Use populated center from profile object if available, otherwise use fetched center
  const center = isCenterPopulated ? centerIdValue : fetchedCenter;

  // Fetch marksheet to get subjects - try to get first available semester/year
  const semestersWithMarksheet: string[] = profile?.whichSemesterMarksheetIsGenerated || [];
  const yearsWithMarksheet: string[] = (profile as any)?.whichYearMarksheetIsGenerated || [];
  const isYearBased = yearsWithMarksheet.length > 0;
  const terms = isYearBased ? yearsWithMarksheet : semestersWithMarksheet;
  const firstTerm = terms.length > 0 ? terms[0] : '1';
  
  const { data: marksheet, isLoading: isLoadingMarksheet } = useGetMarksheetBySemester(
    profile?._id || '',
    isYearBased ? '' : firstTerm,
    isYearBased ? firstTerm : '',
    !!profile?._id && terms.length > 0
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

  const isLoading = isLoadingProfile || isLoadingMarksheet;

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
      <StudentLayout activeMenuItem="admitCard" pageTitle="Admit Card" onMenuItemClick={handleMenuItemClick}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </StudentLayout>
    );
  }

  if (!profile?.isAdmitCardApproved) {
    return (
      <StudentLayout activeMenuItem="admitCard" pageTitle="Admit Card" onMenuItemClick={handleMenuItemClick}>
        <Box sx={{ p: 3 }}>
          <Alert severity="info">Your admit card is not yet approved. Please contact your center.</Alert>
        </Box>
      </StudentLayout>
    );
  }

  const handleDownload = async () => {
    if (admitCardRef.current && profile) {
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
                img.onerror = () => resolve(true); // Continue even if image fails to load
              }
            });
          })
        );

        // Additional wait to ensure everything is rendered
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // A4 dimensions in pixels at 96 DPI: 595.5px × 842.25px
        // But admit card is larger, so we'll use the actual dimensions
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
        
        const fileName = `admit-card-${profile.registrationNo}-${profile.candidateName.replace(/\s+/g, '-')}.pdf`;
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
    <StudentLayout activeMenuItem="admitCard" pageTitle="Admit Card" onMenuItemClick={handleMenuItemClick}>
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
            <Box sx={{ position: 'absolute', left: '239px', top: '416px' }}>
              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.2rem' }}>
                {profile.candidateName}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '239px', top: '469px' }}>
              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.2rem' }}>
                {profile.fatherName}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '248px', top: '521px' }}>
              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.2rem' }}>
                {profile.motherName}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '223px', top: '574px' }}>
              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.2rem' }}>
                {profile.dateOfBirth}
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
            
            {/* Course Name */}
            <Box sx={{ position: 'absolute', left: '265px', top: '751px', maxWidth: '700px' }}>
              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.3rem' }}>
                {typeof (profile as any).course === 'object' && (profile as any).course?.name 
                  ? (profile as any).course.name 
                  : (profile.course as string) || 'N/A'}
              </Typography>
            </Box>
            
            {/* Roll No. */}
            <Box sx={{ position: 'absolute', right: '139px', top: '341px' }}>
              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.4rem' }}>
                {profile.registrationNo || 'N/A'}
              </Typography>
            </Box>
            
            {/* Student Photo */}
            {profile.photo && (
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
                    const cleanPhotoPath = profile.photo.startsWith('/') ? profile.photo : `/${profile.photo}`;
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
    </StudentLayout>
  );
};

export default StudentAdmitCardPage;
