import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ApiBasedAutoComplete from '../../components/core-components/apiBasedAutoComplete';
import { useSaveMarksheet, type SubjectData, type MarksheetFormData } from '../../hooks/useSaveMarksheet';
import {
  calculateTotal,
  validateSubject,
  validateMaxSubjects,
  validateFormForSave,
  type SubjectInput,
  type ValidationErrors,
} from '../../utils/marksheetValidation';


const centerId = localStorage.getItem('centerId');
const AddMarksheetPageCenter = () => {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [currentSubject, setCurrentSubject] = useState({
    subjectName: '',
    marks: '',
    internal: '',
    total: '',
    minMarks: '',
    maxMarks: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [tableErrors, setTableErrors] = useState<{ [key: number]: string }>({});

  // Handle adding subject
  const handleAddSubject = () => {
    const validationErrors = validateSubject(currentSubject, subjects);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Check max subjects limit
    const maxSubjectsErrors = validateMaxSubjects(subjects.length);
    if (Object.keys(maxSubjectsErrors).length > 0) {
      setErrors(maxSubjectsErrors);
      return;
    }

    // Clear errors
    setErrors({});

    const newSubject: SubjectData = {
      id: Date.now().toString(),
      subjectName: currentSubject.subjectName.trim(),
      marks: parseFloat(currentSubject.marks),
      internal: parseFloat(currentSubject.internal),
      total: parseFloat(currentSubject.total),
      minMarks: parseFloat(currentSubject.minMarks),
      maxMarks: parseFloat(currentSubject.maxMarks),
    };

    setSubjects([...subjects, newSubject]);

    // Reset current subject
    setCurrentSubject({
      subjectName: '',
      marks: '',
      internal: '',
      total: '',
      minMarks: '',
      maxMarks: '',
    });
  };

  // Handle deleting subject
  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
    setTableErrors({});
  };

  // Handle input change
  const handleInputChange = (field: string, value: string) => {
    setErrors({});

    let updatedSubject = { ...currentSubject, [field]: value };

    // Auto-calculate total when marks or internal changes
    if (field === 'marks' || field === 'internal') {
      updatedSubject.total = calculateTotal(
        field === 'marks' ? value : updatedSubject.marks,
        field === 'internal' ? value : updatedSubject.internal
      );
    }

    setCurrentSubject(updatedSubject);
  };

  // Use the custom hook for saving marksheet
  const saveMarksheetMutation = useSaveMarksheet();

  // Handle save
  const handleSave = () => {
    const validationErrors = validateFormForSave(selectedStudent, subjects);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data: MarksheetFormData = {
      studentId: selectedStudent.studentId || selectedStudent.id,
      subjects,
      role: 'center',
    } as any;

    saveMarksheetMutation.mutate(data, {
      onSuccess: () => {
        alert('Marksheet saved successfully!');
        // Reset form
        setSelectedStudent(null);
        setSubjects([]);
        setCurrentSubject({
          subjectName: '',
          marks: '',
          internal: '',
          total: '',
          minMarks: '',
          maxMarks: '',
        });
        setErrors({});
      },
      onError: (error: any) => {
        alert(error.response?.data?.message || 'Failed to save marksheet');
      },
    });
  };

  // Handle cancel
  const handleCancel = () => {
    setSelectedStudent(null);
    setSubjects([]);
    setCurrentSubject({
      subjectName: '',
      marks: '',
      internal: '',
      total: '',
      minMarks: '',
      maxMarks: '',
    });
    setErrors({});
    setTableErrors({});
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1e293b' }}>
        Add Marksheet
      </Typography>

      {/* Student Selection */}
      <Box sx={{ mb: 4 }}>
        <ApiBasedAutoComplete
          label="Select Student *"
          apiPath="/api/student/getStudentAutoCompleteList"
          searchKey="query"
          keyToPick="studentName"
          idKey="studentId"
          onSelect={(opt) => {
              setSelectedStudent(opt);
              setErrors({});
            }}
            selectedOptions={selectedStudent}
            error={!!errors.studentId}
            helperText={errors.studentId}
            required
            customActionMethod="POST"
            defaultData={{centerId: centerId}}
            disabled={!centerId}
        />
      </Box>

      {/* Add Subject Form */}
      {selectedStudent && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1e293b' }}>
            Add Subject
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid size={3}>
              <TextField
                fullWidth
                label="Subject Name *"
                value={currentSubject.subjectName}
                onChange={(e) => handleInputChange('subjectName', e.target.value)}
                error={!!errors.subjectName}
                helperText={errors.subjectName}
              />
            </Grid>
            <Grid size={1.5}>
              <TextField
                fullWidth
                label="Marks *"
                type="number"
                value={currentSubject.marks}
                onChange={(e) => handleInputChange('marks', e.target.value)}
                error={!!errors.marks}
                helperText={errors.marks}
              />
            </Grid>
            <Grid size={1.5}>
              <TextField
                fullWidth
                label="Internal *"
                type="number"
                value={currentSubject.internal}
                onChange={(e) => handleInputChange('internal', e.target.value)}
                error={!!errors.internal}
                helperText={errors.internal}
              />
            </Grid>
            <Grid size={1.5}>
              <TextField
                fullWidth
                label="Total *"
                type="number"
                value={currentSubject.total}
                disabled
              />
            </Grid>
            <Grid size={1.5}>
              <TextField
                fullWidth
                label="Min Marks *"
                type="number"
                value={currentSubject.minMarks}
                onChange={(e) => handleInputChange('minMarks', e.target.value)}
                error={!!errors.minMarks}
                helperText={errors.minMarks}
              />
            </Grid>
            <Grid size={1.5}>
              <TextField
                fullWidth
                label="Max Marks *"
                type="number"
                value={currentSubject.maxMarks}
                onChange={(e) => handleInputChange('maxMarks', e.target.value)}
                error={!!errors.maxMarks}
                helperText={errors.maxMarks}
              />
            </Grid>
            <Grid size={1}>
              <IconButton
                color="primary"
                onClick={handleAddSubject}
                disabled={subjects.length >= 7}
                sx={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  '&:hover': { backgroundColor: '#2563eb' },
                  '&.Mui-disabled': { backgroundColor: '#d1d5db' },
                }}
              >
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
          {subjects.length >= 7 && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              Maximum 7 subjects allowed
            </Typography>
          )}
        </Box>
      )}

      {/* Subjects Table */}
      {subjects.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1e293b' }}>
            Added Subjects ({subjects.length}/7)
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Subject Name</TableCell>
                  <TableCell align="right">Marks</TableCell>
                  <TableCell align="right">Internal</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Min Marks</TableCell>
                  <TableCell align="right">Max Marks</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell>{subject.subjectName}</TableCell>
                    <TableCell align="right">{subject.marks}</TableCell>
                    <TableCell align="right">{subject.internal}</TableCell>
                    <TableCell align="right">{subject.total}</TableCell>
                    <TableCell align="right">{subject.minMarks}</TableCell>
                    <TableCell align="right">{subject.maxMarks}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteSubject(subject.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={saveMarksheetMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saveMarksheetMutation.isPending || !selectedStudent || subjects.length === 0}
          sx={{
            backgroundColor: '#3b82f6',
            '&:hover': { backgroundColor: '#2563eb' },
          }}
        >
          {saveMarksheetMutation.isPending ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default AddMarksheetPageCenter;