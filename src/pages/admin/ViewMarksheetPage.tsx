import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Fragment, useRef, useState } from 'react';
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
  const navigate = useNavigate();
  const marksheetRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Use semester if provided, otherwise default to "1" for backward compatibility
  const semesterValue = semester || "1";
  
  const { data: marksheet, isLoading, error } = useGetMarksheetBySemester(
    marksheetId || '', 
    semesterValue,
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
          <Box sx={{ position: 'absolute', left: '257px', top: '478px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.2rem' }}>
              {marksheet.studentId.candidateName}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '260px', top: '514px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.2rem' }}>
              {marksheet.studentId.fatherName}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '264px', top: '551px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.2rem' }}>
              {marksheet.studentId.motherName}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '250px', top: '588px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.2rem' }}>
              {marksheet.studentId.course} - {marksheet.studentId.stream}
            </Typography>
          </Box>

          {/* Right Column */}
          <Box sx={{ position: 'absolute', left: '775px', top: '478px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.2rem' }}>
              {marksheet.studentId.registrationNo}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '775px', top: '514px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.2rem' }}>
              {new Date(marksheet.studentId.dateOfBirth).toLocaleDateString('en-GB')}
            </Typography>
          </Box>
          
          <Box sx={{ position: 'absolute', left: '726px', top: '551px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium' , fontSize: '1.2rem' }}>
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
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', textAlign: 'center'}}>
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

export default AdminMarksheetPage;
