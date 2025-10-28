import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useGetMarksheet, type SubjectData } from '../hooks/useGetMarksheet';
import { useApproveMarksheet } from '../hooks/useApproveMarksheet';
import { useToast } from '../contexts/ToastContext';

interface EditableMarksheetDialogProps {
  open: boolean;
  onClose: () => void;
  studentId: string;
  registrationNo: string;
  studentName: string;
  marksheetId?: string;
}

const EditableMarksheetDialog = ({
  open,
  onClose,
  studentId,
  registrationNo,
  studentName,
}: EditableMarksheetDialogProps) => {
  const [editedSubjects, setEditedSubjects] = useState<SubjectData[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  
  const { data: marksheet, isLoading, error } = useGetMarksheet(studentId, open && !!studentId);
  const approveMarksheetMutation = useApproveMarksheet();
  const { showToast } = useToast();

  // Initialize edited subjects when marksheet data is loaded
  useEffect(() => {
    if (marksheet && marksheet.subjects) {
      setEditedSubjects(marksheet.subjects);
      setHasChanges(false);
    }
  }, [marksheet]);

  // Handle subject field edit
  const handleSubjectChange = (subjectKey: string | undefined, field: keyof SubjectData, value: number) => {
    setEditedSubjects((prev) =>
      prev.map((subject) => {
        // Use subjectName as fallback if id doesn't exist
        const key = subject.id || subject.subjectName;
        if (key === subjectKey) {
          let updatedSubject = { ...subject, [field]: value };
          
          // Auto-calculate total when marks or internal changes
          if (field === 'marks' || field === 'internal') {
            const marks = field === 'marks' ? value : subject.marks;
            const internal = field === 'internal' ? value : subject.internal;
            updatedSubject.total = marks + internal;
          }
          
          return updatedSubject;
        }
        return subject;
      })
    );
    setHasChanges(true);
  };

  // Handle submit and approve
  const handleSubmitAndApprove = () => {
    if (!marksheet) return;

    const approveData = {
      registrationNo,
      subjects: editedSubjects,
      marksheetId: marksheet._id,
    };

    approveMarksheetMutation.mutate(approveData as any, {
      onSuccess: (data: any) => {
        showToast(data.message || 'Marksheet approved successfully!', 'success');
        onClose();
      },
      onError: (error: any) => {
        showToast(error?.response?.data?.message || 'Failed to approve marksheet', 'error');
      },
    });
  };

  const isValidMarks = () => {
    return editedSubjects.every((subject) => {
      const total = subject.marks + subject.internal;
      return (
        subject.marks >= 0 &&
        subject.internal >= 0 &&
        subject.minMarks >= 0 &&
        subject.maxMarks >= 0 &&
        subject.minMarks <= subject.maxMarks &&
        total >= subject.minMarks &&
        total <= subject.maxMarks
      );
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Edit & Approve Marksheet
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
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
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Student: <strong>{studentName}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Registration No: <strong>{registrationNo}</strong>
              </Typography>
            </Box>

            {editedSubjects && editedSubjects.length > 0 ? (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: '#1e293b' }}>
                  Subject Marks ({editedSubjects.length})
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Subject Name</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
                          Marks
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
                          Internal
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
                          Total
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
                          Min Marks
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
                          Max Marks
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {editedSubjects.map((subject, index) => (
                        <TableRow key={subject.id || subject.subjectName || index}>
                          <TableCell sx={{ fontWeight: 500 }}>{subject.subjectName}</TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={subject.marks}
                              onChange={(e) => handleSubjectChange(subject.id || subject.subjectName, 'marks', parseFloat(e.target.value) || 0)}
                              size="small"
                              inputProps={{ min: 0, style: { textAlign: 'right' } }}
                              sx={{ width: '80px' }}
                              error={
                                subject.marks < 0 || subject.marks + subject.internal > subject.maxMarks
                              }
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={subject.internal}
                              onChange={(e) =>
                                handleSubjectChange(subject.id || subject.subjectName, 'internal', parseFloat(e.target.value) || 0)
                              }
                              size="small"
                              inputProps={{ min: 0, style: { textAlign: 'right' } }}
                              sx={{ width: '80px' }}
                              error={
                                subject.internal < 0 || subject.marks + subject.internal > subject.maxMarks
                              }
                            />
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ 
                              fontWeight: 'bold',
                              color: (subject.marks + subject.internal < subject.minMarks ||
                                subject.marks + subject.internal > subject.maxMarks) ? 'error.main' : 'inherit'
                            }}
                          >
                            {subject.marks + subject.internal}
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={subject.minMarks}
                              onChange={(e) =>
                                handleSubjectChange(subject.id || subject.subjectName, 'minMarks', parseFloat(e.target.value) || 0)
                              }
                              size="small"
                              inputProps={{ min: 0, style: { textAlign: 'right' } }}
                              sx={{ width: '80px' }}
                              error={subject.minMarks > subject.maxMarks || subject.marks + subject.internal < subject.minMarks}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={subject.maxMarks}
                              onChange={(e) =>
                                handleSubjectChange(subject.id || subject.subjectName, 'maxMarks', parseFloat(e.target.value) || 0)
                              }
                              size="small"
                              inputProps={{ min: 0, style: { textAlign: 'right' } }}
                              sx={{ width: '80px' }}
                              error={subject.minMarks > subject.maxMarks || subject.marks + subject.internal > subject.maxMarks}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {!isValidMarks() && hasChanges && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    {editedSubjects.some(s => s.minMarks > s.maxMarks) 
                      ? 'Min Marks cannot be greater than Max Marks for some subjects. Please correct the values.'
                      : 'Some marks are outside the valid range. Please ensure total marks are within Min and Max Marks for each subject.'
                    }
                  </Alert>
                )}
              </Box>
            ) : (
              <Alert severity="info">No subjects found in marksheet.</Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={approveMarksheetMutation.isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmitAndApprove}
          disabled={approveMarksheetMutation.isPending || isLoading || !marksheet || !isValidMarks()}
          sx={{
            backgroundColor: '#6366f1',
            '&:hover': { backgroundColor: '#4f46e5' },
            minWidth: '150px',
          }}
        >
          {approveMarksheetMutation.isPending ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Submit & Approve'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditableMarksheetDialog;

