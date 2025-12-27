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
import { Download } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useStudentProfile } from '../../hooks/useStudentProfile';
import StudentLayout from '../../components/student/StudentLayout';
import { useGetMarksheetBySemester } from '../../hooks/useGetMarksheetBySemester';
import { useAllSubjects } from '../../hooks/useAllSubjects';

const StudentAdmitCardPage = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading: isLoadingProfile } = useStudentProfile();
  const admitCardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(admitCardRef.current, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          windowWidth: admitCardRef.current.scrollWidth,
          windowHeight: admitCardRef.current.scrollHeight,
        });
        
        const link = document.createElement('a');
        link.download = `admit-card-${profile.registrationNo}-${profile.candidateName.replace(/\s+/g, '-')}.png`;
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
            <Box sx={{ position: 'absolute', left: '240px', top: '442px' }}>
              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.3rem' }}>
                {profile.candidateName}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '240px', top: '495px' }}>
              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.3rem' }}>
                {profile.fatherName}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '248px', top: '547px' }}>
              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.3rem' }}>
                {profile.motherName}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '225px', top: '600px' }}>
              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.3rem' }}>
                {profile.session}
              </Typography>
            </Box>
            
            {/* Roll No. */}
            <Box sx={{ position: 'absolute', right: '200px', top: '80px' }}>
              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '1.2rem' }}>
                {profile.registrationNo || 'N/A'}
              </Typography>
            </Box>
            
            {/* Student Photo */}
            {profile.photo && (
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
                    const cleanPhotoPath = profile.photo.startsWith('/') ? profile.photo : `/${profile.photo}`;
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
                  const baseTop = 830; // Adjust this value based on where the table starts in the SVG
                  const rowHeight = 42; // Height between rows
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
    </StudentLayout>
  );
};

export default StudentAdmitCardPage;
