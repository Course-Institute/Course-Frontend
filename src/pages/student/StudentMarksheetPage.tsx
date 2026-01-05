import { Fragment, useRef, useState, useEffect, useMemo } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
import { useAllSubjects } from '../../hooks/useAllSubjects';
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
  
  // Get available semesters and years from profile
  const semestersWithMarksheet: string[] = profile?.whichSemesterMarksheetIsGenerated || [];
  const yearsWithMarksheet: string[] = (profile as any)?.whichYearMarksheetIsGenerated || [];
  
  // Determine if marksheets are year-based or semester-based
  const isYearBased = yearsWithMarksheet.length > 0;
  const terms = isYearBased ? yearsWithMarksheet : semestersWithMarksheet;
  
  // Get approved terms - check for approvedYears if year-based, otherwise approvedSemesters
  const approvedYears: string[] = (profile as any)?.approvedYears || [];
  const approvedSemesters: string[] = profile?.approvedSemesters || [];
  const approvedTerms = isYearBased ? approvedYears : approvedSemesters;
  
  // For backward compatibility: if approvedTerms is empty but isMarksheetAndCertificateApproved is true,
  // treat all terms as approved (migration scenario)
  const allTermsApproved = profile?.isMarksheetAndCertificateApproved && approvedTerms.length === 0;
  const visibleTerms = allTermsApproved 
    ? terms 
    : terms.filter(term => approvedTerms.includes(term));
  
  // Set default term if not selected and terms are available
  useEffect(() => {
    // If semester is in URL, use it (but only if it's approved)
    if (semesterFromUrl && visibleTerms.includes(semesterFromUrl)) {
      setSelectedSemester(semesterFromUrl);
    } else if (!selectedSemester && visibleTerms.length > 0) {
      setSelectedSemester(visibleTerms[0]);
    } else if (!selectedSemester && terms.length === 0 && profile?.isMarksheetGenerated && allTermsApproved) {
      // Fallback for backward compatibility
      setSelectedSemester('1');
    }
  }, [profile, terms, visibleTerms, selectedSemester, semesterFromUrl, allTermsApproved]);
  
  // Use selected term or default to first visible term
  const termToFetch = selectedSemester || (visibleTerms.length > 0 ? visibleTerms[0] : '');
  const isTermApproved = termToFetch ? (allTermsApproved || approvedTerms.includes(termToFetch)) : false;
  const shouldFetchMarksheet = isTermApproved && !!studentId && !!termToFetch;
  
  // Pass year or semester based on marksheet type
  const semesterToFetch = isYearBased ? '' : termToFetch;
  const yearToFetch = isYearBased ? termToFetch : '';
  
  const { data: marksheet, isLoading: marksheetLoading, error } = useGetMarksheetBySemester(
    studentId,
    semesterToFetch,
    yearToFetch,
    shouldFetchMarksheet && !profileLoading
  );
  
  const isLoading = profileLoading || marksheetLoading;

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

  const handleDownload = async () => {
    if (marksheetRef.current && marksheet) {
      setIsDownloading(true);
      try {
        // Wait for all images to load before capturing
        const images = marksheetRef.current.querySelectorAll('img');
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
        
        const width = marksheetRef.current.scrollWidth;
        const height = marksheetRef.current.scrollHeight;
        // Increase scale for better quality (3x for high quality, 4x for very high quality)
        const scale = 3;
        
        const canvas = await html2canvas(marksheetRef.current, {
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
        
        const fileName = `marksheet-${marksheet.studentId.registrationNo}-${marksheet.studentId.candidateName.replace(/\s+/g, '-')}.pdf`;
        pdf.save(fileName);
      } catch (error) {
        console.error('Error generating marksheet PDF:', error);
        alert('Error generating marksheet PDF. Please try again.');
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
    } else {
      switch (item) {
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

  // Show message if no approved terms
  if (!profileLoading && visibleTerms.length === 0 && terms.length > 0) {
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
  if (!profileLoading && terms.length === 0 && !profile?.isMarksheetAndCertificateApproved) {
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

  if (!marksheet && !isLoading && isTermApproved) {
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
        {/* Term Selection - Only show approved terms (semesters or years) */}
        {visibleTerms.length > 1 && (
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mr: 1 }}>
              Select {isYearBased ? 'Year' : 'Semester'}:
            </Typography>
            {visibleTerms.map((term: string) => (
              <Chip
                key={term}
                label={`${isYearBased ? 'Year' : 'Semester'} ${term}`}
                onClick={() => setSelectedSemester(term)}
                color={selectedSemester === term ? 'primary' : 'default'}
                variant={selectedSemester === term ? 'filled' : 'outlined'}
                sx={{
                  cursor: 'pointer',
                  fontWeight: selectedSemester === term ? 600 : 400,
                  '&:hover': {
                    backgroundColor: selectedSemester === term ? undefined : 'action.hover',
                  },
                }}
              />
            ))}
          </Box>
        )}
        
        {/* Show warning if there are unapproved terms */}
        {terms.length > visibleTerms.length && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            You have {terms.length - visibleTerms.length} {isYearBased ? 'year(s)' : 'semester(s)'} pending approval. 
            Only approved {isYearBased ? 'years' : 'semesters'} are visible.
          </Alert>
        )}
        
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {terms.length > 0 && (
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {selectedSemester ? `${isYearBased ? 'Year' : 'Semester'} ${selectedSemester} Marksheet` : 'Marksheet'}
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
            {isDownloading ? 'Generating PDF...' : 'Download Marksheet (PDF)'}
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
            <Box sx={{ position: 'absolute', left: '220px', top: '454px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.3rem' }}>
                {marksheet.studentId.candidateName}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '221px', top: '491px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.3rem' }}>
                {marksheet.studentId.fatherName}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '227px', top: '527px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.3rem' }}>
                {marksheet.studentId.motherName}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '210px', top: '565px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' , fontSize: '1.1rem' }}>
                {typeof marksheet.courseId === 'object' && marksheet.courseId?.name 
                  ? marksheet.courseId.name 
                  : marksheet.studentId.course}
              </Typography>
            </Box>

            {/* Right Column */}
            <Box sx={{ position: 'absolute', left: '765px', top: '455px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.3rem' }}>
                {marksheet.studentId.registrationNo}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '765px', top: '491px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.3rem' }}>
                {new Date(marksheet.studentId.dateOfBirth).toLocaleDateString('en-GB')}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '718px', top: '527px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.3rem' }}>
                {marksheet.studentId.session}
              </Typography>
            </Box>
            
            <Box sx={{ position: 'absolute', left: '178px', top: '70px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' , fontSize: '1.5rem' }}>
                {marksheet.serialNo || ''}
              </Typography>
            </Box>

            {/* Term label */}
            <Box sx={{ position: 'absolute', left: '750px', top: '563px' }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.3rem' }}>
                ({isYearBased ? 'Year' : 'Semester'} {selectedSemester || termToFetch || ''})
              </Typography>
            </Box>

            {/* Subjects Table with Absolute Positioning */}
            {subjectsWithCodes.length > 0 && (
              <>
                {subjectsWithCodes.map((subject, index) => (
                  <Fragment key={index}>
                    {/* Subject Code - Extract only numbers */}
                    <Box sx={{ position: 'absolute', left: '70px', top: `${742 + index * 53}px` }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {subject.subjectCode ? subject.subjectCode.replace(/\D/g, '') || 'N/A' : 'N/A'}
                      </Typography>
                    </Box>
                    
                    {/* Subject Name */}
                    <Box sx={{ position: 'absolute', left: '130px', top: `${742 + index * 53}px` }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' ,fontSize: '1.1rem' }}>
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
                  const totalMarks = subjectsWithCodes.reduce((sum, subject) => sum + (subject.marks || 0), 0);
                  const totalInternal = subjectsWithCodes.reduce((sum, subject) => sum + (subject.internal || 0), 0);
                  const totalTotal = subjectsWithCodes.reduce((sum, subject) => sum + (subject.total || 0), 0);
                  const totalMinMarks = subjectsWithCodes.reduce((sum, subject) => sum + (subject.minMarks || 0), 0);
                  const totalMaxMarks = subjectsWithCodes.reduce((sum, subject) => sum + (subject.maxMarks || 0), 0);
                  const percentage = totalMaxMarks > 0 ? ((totalTotal / totalMaxMarks) * 100).toFixed(2) : '0.00';
                  const totalRowTop = 736 + subjectsWithCodes.length * 53;
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
