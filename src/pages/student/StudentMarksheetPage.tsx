
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useGetMarksheet } from '../../hooks/useGetMarksheet';

const StudentMarksheetPage = () => {
  // Get marksheet ID from localStorage for student
  const marksheetId = localStorage.getItem('studentMarksheetId') || '';
  
  const { data: marksheet, isLoading, error } = useGetMarksheet(marksheetId, !!marksheetId);

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
      </Box>
    );
  }

  if (!marksheet) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No marksheet found for this student.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
          Marksheet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Registration No: {marksheet.studentId.registrationNo}
        </Typography>
      </Box>

      {marksheet.subjects && marksheet.subjects.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Subject Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Marks</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Internal</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Min Marks</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Max Marks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {marksheet.subjects.map((subject, index) => (
                <TableRow key={subject.id || index} hover>
                  <TableCell>{subject.subjectName}</TableCell>
                  <TableCell align="right">{subject.marks}</TableCell>
                  <TableCell align="right">{subject.internal}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>{subject.total}</TableCell>
                  <TableCell align="right">{subject.minMarks}</TableCell>
                  <TableCell align="right">{subject.maxMarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No subjects found in marksheet.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default StudentMarksheetPage;
