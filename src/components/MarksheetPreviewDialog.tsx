import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Grid,
} from '@mui/material';
import DialogBox from './core-components/DialogBox/DialogBox';
import { useGetMarksheet } from '../hooks/useGetMarksheet';

interface MarksheetPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  marksheetId: string; // This will be studentId from the backend
}

const MarksheetPreviewDialog = ({ open, onClose, marksheetId }: MarksheetPreviewDialogProps) => {
  const { data: marksheet, isLoading, error } = useGetMarksheet(marksheetId, open && !!marksheetId);

  return (
    <DialogBox
      open={open}
      onClose={onClose}
      title="Preview Marksheet"
      showCloseIcon={true}
      maxWidth="md"
      width="800px"
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">
          Error loading marksheet: {error instanceof Error ? error.message : 'Marksheet not found'}
        </Alert>
      ) : !marksheet ? (
        <Alert severity="info">No marksheet found for this student.</Alert>
      ) : (
        <Box>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Registration Number"
                value={marksheet.registrationNo}
                disabled
                size="small"
              />
            </Grid>
          </Grid>

          {marksheet.subjects && marksheet.subjects.length > 0 ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1e293b' }}>
                Subject Marks ({marksheet.subjects.length})
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Subject Name</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Marks</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Internal</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Total</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Min Marks</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Max Marks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {marksheet.subjects.map((subject) => (
                      <TableRow key={subject.id}>
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
            </Box>
          ) : (
            <Alert severity="info">No subjects found in marksheet.</Alert>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Close
            </button>
          </Box>
        </Box>
      )}
    </DialogBox>
  );
};

export default MarksheetPreviewDialog;

