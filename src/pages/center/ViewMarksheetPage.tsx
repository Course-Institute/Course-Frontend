import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Fragment, useRef, useState, useMemo } from 'react';
import html2canvas from 'html2canvas';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ArrowBack, Download } from '@mui/icons-material';
import { useGetMarksheetBySemester } from '../../hooks/useGetMarksheetBySemester';
import { getStudentDetails } from '../../api/studentsApi';
import { useQuery } from '@tanstack/react-query';

const CenterViewMarksheetPage = () => {
  const { marksheetId, semester } = useParams<{ marksheetId: string; semester?: string }>();
  const navigate = useNavigate();
  const marksheetRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Use semester from URL or default to "1" for backward compatibility
  const semesterValue = semester || "1";
  
  const { data: marksheet, isLoading, error } = useGetMarksheetBySemester(
    marksheetId || '', 
    semesterValue,
    !!marksheetId
  );
  
  // Fetch student data to check approval status
  // Add refetch interval to check for approval updates
  const { data: studentData, isLoading: isLoadingStudent } = useQuery({
    queryKey: ['student', marksheetId],
    queryFn: async () => {
      if (!marksheetId) {
        return null; // Return null instead of undefined
      }
      try {
        const response = await getStudentDetails(marksheetId);
        // getStudentDetails returns response.data from axios
        // Handle different possible API response structures
        // Similar to how EditStudentPage handles it
        if (!response) {
          return null;
        }
        
        // Try different possible response structures
        const studentData = response?.student || response?.data?.student || response?.data || response;
        
        // Ensure we return a valid object or null, never undefined
        if (studentData && typeof studentData === 'object') {
          return studentData;
        }
        
        // Fallback to null if no valid data found
        return null;
      } catch (error) {
        console.error('Error fetching student details:', error);
        return null; // Return null on error instead of throwing
      }
    },
    enabled: !!marksheetId, // Fetch student data as soon as we have marksheetId
    staleTime: 0, // Always consider data stale to refetch on focus
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
  
  // Check if this semester is approved - use useMemo to ensure stable decision
  // IMPORTANT: Centers should ONLY see marksheet template if semester is explicitly approved
  // Default to table view (marks only) if approval status is unclear
  const showTableOnly = useMemo(() => {
    // Wait for data to load before making decision
    if (isLoadingStudent || !studentData) {
      return true; // Default to table view while loading (safer)
    }
    
    const approvedSemesters: string[] = studentData.approvedSemesters || [];
    const hasApprovedSemestersField = 'approvedSemesters' in studentData;
    
    // Determine approval status - be STRICT: only show marksheet if explicitly approved
    let approved = false;
    
    if (hasApprovedSemestersField) {
      // New system: semester MUST be explicitly in approvedSemesters array
      // If array is empty or semester not in array, it's NOT approved
      // NEVER fall back to old flag if approvedSemesters field exists
      approved = approvedSemesters.length > 0 && approvedSemesters.includes(semesterValue);
    } else {
      // Old system: only use global flag if approvedSemesters field doesn't exist at all
      // This is for backward compatibility with old data that hasn't been migrated
      // For new semesters, this should be false by default
      approved = studentData.isMarksheetAndCertificateApproved || false;
    }
    
    // CRITICAL: If approvedSemesters field exists but semester is not in it, force NOT approved
    // This prevents showing marksheet template for unapproved semesters
    if (hasApprovedSemestersField && !approvedSemesters.includes(semesterValue)) {
      approved = false;
    }
    
    // Debug logging - check what's happening
    console.log('Center View Marksheet Approval Check:', {
      semesterValue,
      hasApprovedSemestersField,
      approvedSemesters,
      isInArray: approvedSemesters.includes(semesterValue),
      isMarksheetAndCertificateApproved: studentData.isMarksheetAndCertificateApproved,
      approved,
      showTableOnly: !approved,
      studentDataKeys: studentData ? Object.keys(studentData) : []
    });
    
    // Show table if NOT approved (default to table view for safety)
    return !approved;
  }, [isLoadingStudent, studentData, semesterValue]);
  
  if (isLoading || isLoadingStudent) {
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
          Error loading marksheet: {error instanceof Error ? error.message : 'Marksheet not found'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/center/students')}
          sx={{ mt: 2 }}
        >
          Back to Students
        </Button>
      </Box>
    );
  }

  if (!marksheet) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No marksheet found for this student.</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/center/students')}
          sx={{ mt: 2 }}
        >
          Back to Students
        </Button>
      </Box>
    );
  }
  
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

  // If not approved, show only marks table
  if (showTableOnly) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Pending Admin Approval
          </Typography>
          <Typography variant="body2">
            This marksheet for Semester {semesterValue} is pending admin approval. 
            You can view the marks you've entered below. Once approved by admin, students will be able to view this marksheet.
          </Typography>
        </Alert>
        
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/center/students')}
          >
            Back to Students
          </Button>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Semester {semesterValue} - Marks
          </Typography>
        </Box>

        {/* Student Info */}
        {marksheet && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Student Information
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {marksheet.studentId.candidateName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Registration No</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {marksheet.studentId.registrationNo}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Course</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {marksheet.studentId.course} - {marksheet.studentId.stream}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Session</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {marksheet.studentId.session}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Marks Table */}
        {marksheet && marksheet.subjects && marksheet.subjects.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Marks</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Internal</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Total</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Min Marks</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Max Marks</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Grade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {marksheet.subjects.map((subject, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{subject.subjectName}</TableCell>
                    <TableCell align="center">{subject.marks}</TableCell>
                    <TableCell align="center">{subject.internal}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 500 }}>{subject.total}</TableCell>
                    <TableCell align="center">{subject.minMarks}</TableCell>
                    <TableCell align="center">{subject.maxMarks}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 500 }}>{subject.grade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              No marks entered yet for this semester.
            </Typography>
          </Paper>
        )}
      </Box>
    );
  }

  // If approved, show full marksheet
  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/center/students')}
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
          <Box sx={{ position: 'absolute', left: '257px', top: '478px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.2rem' }}>
              {marksheet.studentId.candidateName}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '260px', top: '514px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.2rem' }}>
              {marksheet.studentId.fatherName}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '264px', top: '551px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.2rem' }}>
              {marksheet.studentId.motherName}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '250px', top: '588px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.2rem' }}>
              {marksheet.studentId.course} - {marksheet.studentId.stream}
            </Typography>
          </Box>

          {/* Right Column */}
          <Box sx={{ position: 'absolute', left: '775px', top: '478px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.2rem' }}>
              {marksheet.studentId.registrationNo}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '775px', top: '514px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.2rem' }}>
              {new Date(marksheet.studentId.dateOfBirth).toLocaleDateString('en-GB')}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '726px', top: '551px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.2rem' }}>
              {marksheet.studentId.session}
            </Typography>
          </Box>

          {/* Subjects Table with Absolute Positioning */}
          {marksheet.subjects && marksheet.subjects.length > 0 && (
            <>
              {marksheet.subjects.map((subject, index) => (
                <Fragment key={index}>
                  {/* Subject Name */}
                  <Box sx={{ position: 'absolute', left: '185px', top: `${777 + index * 50}px` }}>
                    <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                      {subject.subjectName}
                    </Typography>
                  </Box>
                  
                  {/* Marks */}
                  <Box sx={{ position: 'absolute', left: '553px', top: `${777 + index * 50}px` }}>
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', textAlign: 'center' }}>
                      {subject.marks}
                    </Typography>
                  </Box>
                  
                  {/* Internal */}
                  <Box sx={{ position: 'absolute', left: '620px', top: `${777 + index * 50}px` }}>
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', textAlign: 'center' }}>
                      {subject.internal}
                    </Typography>
                  </Box>
                  
                  {/* Total */}
                  <Box sx={{ position: 'absolute', left: '688px', top: `${777 + index * 50}px` }}>
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', textAlign: 'center' }}>
                      {subject.total}
                    </Typography>
                  </Box>
                  
                  {/* Min Marks */}
                  <Box sx={{ position: 'absolute', left: '763px', top: `${777 + index * 50}px` }}>
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', textAlign: 'center' }}>
                      {subject.minMarks}
                    </Typography>
                  </Box>
                  
                  {/* Max Marks */}
                  <Box sx={{ position: 'absolute', left: '826px', top: `${777 + index * 50}px` }}>
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', textAlign: 'center' }}>
                      {subject.maxMarks}
                    </Typography>
                  </Box>
                  
                  {/* Grade */}
                  <Box sx={{ position: 'absolute', left: '910px', top: `${777 + index * 50}px` }}>
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', textAlign: 'center' }}>
                      {subject.grade}
                    </Typography>
                  </Box>
                </Fragment>
              ))}
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default CenterViewMarksheetPage;
