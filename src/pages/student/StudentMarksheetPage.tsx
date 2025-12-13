import { Fragment, useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Container,
  Button,
  Chip,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetMarksheetBySemester } from '../../hooks/useGetMarksheetBySemester';
import { useStudentProfile } from '../../hooks/useStudentProfile';
import StudentLayout from '../../components/student/StudentLayout';

const StudentMarksheetPage = () => {
  const navigate = useNavigate();
  const { semester: semesterFromUrl } = useParams<{ semester?: string }>();
  const marksheetRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  
  // Get student profile to check approval status and get student ID
  const { data: profile, isLoading: profileLoading } = useStudentProfile();
  
  // Only fetch marksheet if approved and student ID is available
  const studentId = profile?._id || '';
  
  // Get available semesters from profile
  const semestersWithMarksheet: string[] = profile?.whichSemesterMarksheetIsGenerated || [];
  
  // Get approved semesters - only these should be visible to students
  const approvedSemesters: string[] = profile?.approvedSemesters || [];
  
  // For backward compatibility: if approvedSemesters is empty but isMarksheetAndCertificateApproved is true,
  // treat all semesters as approved (migration scenario)
  const allSemestersApproved = profile?.isMarksheetAndCertificateApproved && approvedSemesters.length === 0;
  const visibleSemesters = allSemestersApproved 
    ? semestersWithMarksheet 
    : semestersWithMarksheet.filter(sem => approvedSemesters.includes(sem));
  
  // Set default semester if not selected and semesters are available
  useEffect(() => {
    // If semester is in URL, use it (but only if it's approved)
    if (semesterFromUrl && visibleSemesters.includes(semesterFromUrl)) {
      setSelectedSemester(semesterFromUrl);
    } else if (!selectedSemester && visibleSemesters.length > 0) {
      setSelectedSemester(visibleSemesters[0]);
    } else if (!selectedSemester && semestersWithMarksheet.length === 0 && profile?.isMarksheetGenerated && allSemestersApproved) {
      // Fallback for backward compatibility
      setSelectedSemester('1');
    }
  }, [profile, semestersWithMarksheet, visibleSemesters, selectedSemester, semesterFromUrl, allSemestersApproved]);
  
  // Use selected semester or default to first visible semester
  const semesterToFetch = selectedSemester || (visibleSemesters.length > 0 ? visibleSemesters[0] : '');
  const isSemesterApproved = semesterToFetch ? (allSemestersApproved || approvedSemesters.includes(semesterToFetch)) : false;
  const shouldFetchMarksheet = isSemesterApproved && !!studentId && !!semesterToFetch;
  
  const { data: marksheet, isLoading: marksheetLoading, error } = useGetMarksheetBySemester(
    studentId,
    semesterToFetch,
    '',
    shouldFetchMarksheet && !profileLoading
  );
  
  const isLoading = profileLoading || marksheetLoading;

  const handleDownload = async () => {
    if (marksheetRef.current && marksheet) {
      setIsDownloading(true);
      try {
        // Additional wait to ensure everything is rendered
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(marksheetRef.current, {
          backgroundColor: '#ffffff',
          scale: 2, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          logging: false,
          windowWidth: marksheetRef.current.scrollWidth,
          windowHeight: marksheetRef.current.scrollHeight,
        });
        
        const link = document.createElement('a');
        link.download = `marksheet-${marksheet.studentId.registrationNo}-${marksheet.studentId.candidateName.replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      } catch (error) {
        console.error('Error generating marksheet image:', error);
        alert('Error generating marksheet image. Please try again.');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handleMenuItemClick = (item: string) => {
    // When navigating to profile, mark that user is intentionally viewing it
    if (item === 'profile') {
      sessionStorage.setItem('hasViewedProfile', 'true');
      sessionStorage.setItem('fromMarksheet', 'true');
      navigate('/student-dashboard');
    } else if (item === 'marksheet') {
      navigate('/student/marksheet');
    }
  };

  if (isLoading) {
    return (
      <StudentLayout 
        activeMenuItem="marksheet" 
        pageTitle="Marksheet"
        onMenuItemClick={handleMenuItemClick}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        </Container>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout 
        activeMenuItem="marksheet" 
        pageTitle="Marksheet"
        onMenuItemClick={handleMenuItemClick}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">
            Error loading marksheet: {error instanceof Error ? error.message : 'Marksheet not found'}
          </Alert>
        </Container>
      </StudentLayout>
    );
  }

  // Show message if no approved semesters
  if (!profileLoading && visibleSemesters.length === 0 && semestersWithMarksheet.length > 0) {
    return (
      <StudentLayout 
        activeMenuItem="marksheet" 
        pageTitle="Marksheet"
        onMenuItemClick={handleMenuItemClick}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="info">
            Your marksheet(s) are pending approval. Please check back later once the admin approves your marksheet.
          </Alert>
        </Container>
      </StudentLayout>
    );
  }
  
  // Show message if marksheet is not approved (backward compatibility)
  if (!profileLoading && semestersWithMarksheet.length === 0 && !profile?.isMarksheetAndCertificateApproved) {
    return (
      <StudentLayout 
        activeMenuItem="marksheet" 
        pageTitle="Marksheet"
        onMenuItemClick={handleMenuItemClick}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="info">
            Your marksheet and certificate are pending approval. Please check back later.
          </Alert>
        </Container>
      </StudentLayout>
    );
  }

  if (!marksheet && !isLoading && isSemesterApproved) {
    return (
      <StudentLayout 
        activeMenuItem="marksheet" 
        pageTitle="Marksheet"
        onMenuItemClick={handleMenuItemClick}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="info">No marksheet found for this student.</Alert>
        </Container>
      </StudentLayout>
    );
  }

  // Ensure marksheet exists before rendering
  if (!marksheet) {
    return null;
  }

  return (
    <StudentLayout 
      activeMenuItem="marksheet" 
      pageTitle="Marksheet"
      breadcrumbs={[
        { label: 'Home' },
        { label: 'Marksheet' }
      ]}
      onMenuItemClick={handleMenuItemClick}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Semester Selection - Only show approved semesters */}
        {visibleSemesters.length > 1 && (
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mr: 1 }}>
              Select Semester:
            </Typography>
            {visibleSemesters.map((sem: string) => (
              <Chip
                key={sem}
                label={`Semester ${sem}`}
                onClick={() => setSelectedSemester(sem)}
                color={selectedSemester === sem ? 'primary' : 'default'}
                variant={selectedSemester === sem ? 'filled' : 'outlined'}
                sx={{
                  cursor: 'pointer',
                  fontWeight: selectedSemester === sem ? 600 : 400,
                  '&:hover': {
                    backgroundColor: selectedSemester === sem ? undefined : 'action.hover',
                  },
                }}
              />
            ))}
          </Box>
        )}
        
        {/* Show warning if there are unapproved semesters */}
        {semestersWithMarksheet.length > visibleSemesters.length && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            You have {semestersWithMarksheet.length - visibleSemesters.length} semester(s) pending approval. 
            Only approved semesters are visible.
          </Alert>
        )}
        
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {semestersWithMarksheet.length > 0 && (
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {selectedSemester ? `Semester ${selectedSemester} Marksheet` : 'Marksheet'}
            </Typography>
          )}
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownload}
            disabled={isDownloading || !marksheet}
            sx={{
              backgroundColor: '#10b981',
              '&:hover': { backgroundColor: '#059669' },
            }}
          >
            {isDownloading ? 'Generating...' : 'Download Marksheet'}
          </Button>
        </Box>

        <Paper 
          ref={marksheetRef}
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
            mx: 'auto',
          }}
        >
          {/* SVG Background */}
          <Box
            component="img"
            src="/mivps-marksheet.svg"
            alt="Marksheet Template"
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
          {/* Student Details Overlay - Only Values with Absolute Positioning */}
          <Box sx={{ position: 'relative', height: '100%', zIndex: 1 }}>
            {/* Left Column */}
            <Box sx={{ position: 'absolute', left: '224px', top: '455px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.3rem' }}>
                {marksheet.studentId.candidateName}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '224px', top: '492px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.3rem' }}>
                {marksheet.studentId.fatherName}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '227px', top: '528px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.3rem' }}>
                {marksheet.studentId.motherName}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '217px', top: '563px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' , fontSize: '1.3rem' }}>
                {typeof marksheet.courseId === 'object' && marksheet.courseId?.name 
                  ? marksheet.courseId.name 
                  : marksheet.studentId.course}
              </Typography>
            </Box>

            {/* Right Column */}
            <Box sx={{ position: 'absolute', left: '705px', top: '455px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.3rem' }}>
                {marksheet.studentId.registrationNo}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '705px', top: '492px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.3rem' }}>
                {new Date(marksheet.studentId.dateOfBirth).toLocaleDateString('en-GB')}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '658px', top: '528px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.3rem' }}>
                {marksheet.studentId.session}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '178px', top: '70px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' , fontSize: '1.5rem' }}>
                {marksheet.serialNo || ''}
              </Typography>
            </Box>
            
            {/* Semester - placed below session */}
            <Box sx={{ position: 'absolute', left: '564px', top: '560px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' , fontSize: '1.3rem' }}>
                Semester {selectedSemester || semesterToFetch || ''}
              </Typography>
            </Box>

            {/* Subjects Table with Absolute Positioning */}
            {marksheet.subjects && marksheet.subjects.length > 0 && (
              <>
                {marksheet.subjects.map((subject, index) => (
                  <Fragment key={index}>
                    {/* Subject Name */}
                    <Box sx={{ position: 'absolute', left: '130px', top: `${746 + index * 53}px` }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' ,fontSize: '0.8rem' }}>
                        {subject.subjectName}
                      </Typography>
                    </Box>
                    
                    {/* Marks */}
                    <Box sx={{ position: 'absolute', left: '617px', top: `${746 + index * 53}px`, width: '50px' }}>
                      <Typography variant="body2" sx={{ fontSize: '1rem', textAlign: 'center'}}>
                        {subject.marks}
                      </Typography>
                    </Box>
                    
                    {/* Internal */}
                    <Box sx={{ position: 'absolute', left: '679px', top: `${746 + index * 53}px`, width: '50px' }}>
                      <Typography variant="body2" sx={{ fontSize: '1rem', textAlign: 'center' }}>
                        {subject.internal}
                      </Typography>
                    </Box>
                    
                    {/* Total */}
                    <Box sx={{ position: 'absolute', left: '746px', top: `${746 + index * 53}px`, width: '50px' }}>
                      <Typography variant="body2" sx={{ fontSize: '1rem', textAlign: 'center' }}>
                        {subject.total}
                      </Typography>
                    </Box>
                    
                    {/* Min Marks */}
                    <Box sx={{ position: 'absolute', left: '813px', top: `${746 + index * 53}px`, width: '50px' }}>
                      <Typography variant="body2" sx={{ fontSize: '1rem', textAlign: 'center' }}>
                        {subject.minMarks}
                      </Typography>
                    </Box>
                    
                    {/* Max Marks */}
                    <Box sx={{ position: 'absolute', left: '876px', top: `${746 + index * 53}px`, width: '50px' }}>
                      <Typography variant="body2" sx={{ fontSize: '1rem', textAlign: 'center' }}>
                        {subject.maxMarks}
                      </Typography>
                    </Box>
                    
                    {/* Grade */}
                    <Box sx={{ position: 'absolute', left: '956px', top: `${746 + index * 53}px`, width: '100' }}>
                      <Typography variant="body2" sx={{ fontSize: '1rem', textAlign: 'center' }}>
                        {subject.grade}
                      </Typography>
                    </Box>
                  </Fragment>
                ))}
                
                {/* Total Row */}
                {(() => {
                  const totalMarks = marksheet.subjects.reduce((sum, subject) => sum + (subject.marks || 0), 0);
                  const totalInternal = marksheet.subjects.reduce((sum, subject) => sum + (subject.internal || 0), 0);
                  const totalTotal = marksheet.subjects.reduce((sum, subject) => sum + (subject.total || 0), 0);
                  const totalMinMarks = marksheet.subjects.reduce((sum, subject) => sum + (subject.minMarks || 0), 0);
                  const totalMaxMarks = marksheet.subjects.reduce((sum, subject) => sum + (subject.maxMarks || 0), 0);
                  const percentage = totalMaxMarks > 0 ? ((totalTotal / totalMaxMarks) * 100).toFixed(2) : '0.00';
                  const totalRowTop = 736 + marksheet.subjects.length * 53;
                  const percentageRowTop = totalRowTop + 50;
                  
                  return (
                    <Fragment>
                      {/* Total Marks */}
                      <Box sx={{ position: 'absolute', left: '617px', top: `${totalRowTop}px`, width: '50px' }}>
                        <Typography variant="body2" sx={{ fontSize: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
                          {totalMarks}
                        </Typography>
                      </Box>
                      
                      {/* Total Internal */}
                      <Box sx={{ position: 'absolute', left: '679px', top: `${totalRowTop}px`, width: '50px' }}>
                        <Typography variant="body2" sx={{ fontSize: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
                          {totalInternal}
                        </Typography>
                      </Box>
                      
                      {/* Total Total */}
                      <Box sx={{ position: 'absolute', left: '746px', top: `${totalRowTop}px`, width: '50px' }}>
                        <Typography variant="body2" sx={{ fontSize: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
                          {totalTotal}
                        </Typography>
                      </Box>
                      
                      {/* Total Min Marks */}
                      <Box sx={{ position: 'absolute', left: '813px', top: `${totalRowTop}px`, width: '50px' }}>
                        <Typography variant="body2" sx={{ fontSize: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
                          {totalMinMarks}
                        </Typography>
                      </Box>
                      
                      {/* Total Max Marks */}
                      <Box sx={{ position: 'absolute', left: '876px', top: `${totalRowTop}px`, width: '50px' }}>
                        <Typography variant="body2" sx={{ fontSize: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
                          {totalMaxMarks}
                        </Typography>
                      </Box>
                      
                      {/* Percentage Row */}
                      {/* Percentage Value */}
                      <Box sx={{ position: 'absolute', left: '887px', top: `${percentageRowTop}px`, width: '100px' }}>
                        <Typography variant="body2" sx={{ fontSize: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
                          {percentage}%
                        </Typography>
                      </Box>
                    </Fragment>
                  );
                })()}
              </>
            )}
          </Box>
        </Paper>
      </Container>
    </StudentLayout>
  );
};

export default StudentMarksheetPage;
