import { useParams, useLocation } from 'react-router-dom';
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
} from '@mui/material';
import { ArrowBack, Download } from '@mui/icons-material';
import { useGetMarksheetBySemester } from '../../hooks/useGetMarksheetBySemester';

const AdminMarksheetPage = () => {
  const { marksheetId, semester } = useParams<{ marksheetId: string; semester?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const marksheetRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Read optional year from query string
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const yearParam = searchParams.get('year') || '';
  
  // If year is provided, do not send semester (API expects only one)
  const semesterValue = yearParam ? '' : (semester || "1");
  
  const { data: marksheet, isLoading, error } = useGetMarksheetBySemester(
    marksheetId || '', 
    semesterValue,
    yearParam,
    !!marksheetId
  );

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
          Error loading marksheet: {error instanceof Error ? error.message : 'Marksheet not found'}
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

  if (!marksheet) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No marksheet found for this student.</Alert>
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
          
          <Box sx={{ position: 'absolute', left: '214px', top: '562px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' , fontSize: '1.3rem' }}>
              {typeof marksheet.courseId === 'object' && marksheet.courseId?.name 
                ? marksheet.courseId.name 
                : marksheet.studentId.course}
            </Typography>
          </Box>

          {/* Right Column */}
          <Box sx={{ position: 'absolute', left: '705px', top: '454px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.3rem' }}>
              {marksheet.studentId.registrationNo}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '705px', top: '491px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.3rem' }}>
              {new Date(marksheet.studentId.dateOfBirth).toLocaleDateString('en-GB')}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '658px', top: '527px' }}>
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
          <Box sx={{ position: 'absolute', left: '780px', top: '526px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' , fontSize: '1.3rem' }}>
              {yearParam ? `(Year ${yearParam})` : `(Semester ${semesterValue})`}
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
    </Box>
  );
};

export default AdminMarksheetPage;
