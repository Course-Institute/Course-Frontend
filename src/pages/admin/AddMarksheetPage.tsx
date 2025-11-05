import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Container,
  Alert,
  Chip,
  Fade,
  Slide,
  InputAdornment,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  School, 
  Description, 
  Save, 
  Cancel,
  CheckCircle,
} from '@mui/icons-material';
import ApiBasedAutoComplete from '../../components/core-components/apiBasedAutoComplete';
import { useSaveMarksheet, type SubjectData, type MarksheetFormData } from '../../hooks/useSaveMarksheet';
import {
  calculateTotal,
  validateSubject,
  validateMaxSubjects,
  validateFormForSave,
  type ValidationErrors,
} from '../../utils/marksheetValidation';

const AddMarksheetPageAdmin = () => {
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
  const [, setTableErrors] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle adding subject
  const handleAddSubject = () => {
    const validationErrors = validateSubject(currentSubject, subjects, 'admin');

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

    setIsSubmitting(true);
    const data: MarksheetFormData = {
      studentId: selectedStudent.studentId || selectedStudent.id,
      subjects,
      role: 'admin',
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
        setIsSubmitting(false);
      },
      onError: (error: any) => {
        alert(error.response?.data?.message || 'Failed to save marksheet');
        setIsSubmitting(false);
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

  const totalMarks = subjects.reduce((sum, subject) => sum + subject.total, 0);
  const averageMarks = subjects.length > 0 ? totalMarks / subjects.length : 0;

  return (
    <Container maxWidth="lg" sx={{ 
      py: { xs: 2, sm: 3 },
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
    }}>
      {/* Header Section */}
      <Fade in timeout={600}>
        <Card sx={{ 
          mb: 4,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            transform: 'translate(50%, -50%)',
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '150px',
            height: '150px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50%',
            transform: 'translate(-50%, 50%)',
          }} />
          <CardContent sx={{ position: 'relative', zIndex: 1, p: { xs: 3, sm: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Description sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
              </Box>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '1.75rem', sm: '2.25rem' },
                    mb: 0.5,
                  }}
                >
                  Add Marksheet
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  Create and manage student marksheets for the admin panel
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Fade>

      {/* Student Selection Card */}
      <Slide direction="up" in timeout={800}>
        <Card sx={{ 
          mb: 4,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <School sx={{ color: '#3b82f6', fontSize: '1.5rem' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                Student Selection
              </Typography>
            </Box>
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6',
                    },
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6',
                      borderWidth: 2,
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </Slide>

      {/* Add Subject Form */}
      {selectedStudent && (
        <Slide direction="up" in timeout={1000}>
          <Card sx={{ 
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <AddIcon sx={{ color: '#10b981', fontSize: '1.5rem' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Add Subject
                </Typography>
                <Chip 
                  label={`${subjects.length}/7`} 
                  size="small" 
                  color={subjects.length >= 7 ? 'error' : 'primary'}
                  sx={{ ml: 'auto' }}
                />
              </Box>

              <Grid container spacing={2} alignItems="flex-end">
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Subject Name *"
                    value={currentSubject.subjectName}
                    onChange={(e) => handleInputChange('subjectName', e.target.value)}
                    error={!!errors.subjectName}
                    helperText={errors.subjectName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description sx={{ color: '#64748b', fontSize: '1.2rem' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#ffffff',
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <TextField
                    fullWidth
                    label="Marks *"
                    type="number"
                    value={currentSubject.marks}
                    onChange={(e) => handleInputChange('marks', e.target.value)}
                    error={!!errors.marks}
                    helperText={errors.marks}
                    inputProps={{ min: 0, max: 100 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#ffffff',
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <TextField
                    fullWidth
                    label="Internal *"
                    type="number"
                    value={currentSubject.internal}
                    onChange={(e) => handleInputChange('internal', e.target.value)}
                    error={!!errors.internal}
                    helperText={errors.internal}
                    inputProps={{ min: 0, max: 100 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#ffffff',
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <TextField
                    fullWidth
                    label="Total *"
                    type="number"
                    value={currentSubject.total}
                    disabled
                    error={!!errors.total}
                    helperText={errors.total}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f8fafc',
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <TextField
                    fullWidth
                    label="Min Marks *"
                    type="number"
                    value={currentSubject.minMarks}
                    onChange={(e) => handleInputChange('minMarks', e.target.value)}
                    error={!!errors.minMarks}
                    helperText={errors.minMarks}
                    inputProps={{ min: 0 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#ffffff',
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <TextField
                    fullWidth
                    label="Max Marks *"
                    type="number"
                    value={currentSubject.maxMarks}
                    onChange={(e) => handleInputChange('maxMarks', e.target.value)}
                    error={!!errors.maxMarks}
                    helperText={errors.maxMarks}
                    inputProps={{ min: 0 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#ffffff',
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 1.5 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleAddSubject}
                    disabled={subjects.length >= 7}
                    startIcon={<AddIcon />}
                    sx={{
                      height: '56px',
                      borderRadius: 2,
                      backgroundColor: subjects.length >= 7 ? '#d1d5db' : '#3b82f6',
                      color: 'white',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        backgroundColor: subjects.length >= 7 ? '#d1d5db' : '#2563eb',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                      },
                      '&:disabled': {
                        backgroundColor: '#d1d5db',
                        color: '#9ca3af',
                      },
                    }}
                  >
                    Add Subject
                  </Button>
                </Grid>
              </Grid>
              
              {subjects.length >= 7 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Maximum 7 subjects allowed
                </Alert>
              )}
            </CardContent>
          </Card>
        </Slide>
      )}

      {/* Subjects Table */}
      {subjects.length > 0 && (
        <Slide direction="up" in timeout={1200}>
          <Card sx={{ 
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CheckCircle sx={{ color: '#10b981', fontSize: '1.5rem' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Added Subjects ({subjects.length}/7)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label={`Total: ${totalMarks.toFixed(1)}`} 
                    color="primary" 
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip 
                    label={`Average: ${averageMarks.toFixed(1)}`} 
                    color="success" 
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>

              <TableContainer 
                component={Paper} 
                sx={{ 
                  borderRadius: 2,
                  boxShadow: 'none',
                  border: '1px solid #e2e8f0',
                  maxHeight: { xs: 400, sm: 500 },
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                    height: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f5r9',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#cbd5e1',
                    borderRadius: '3px',
                    '&:hover': {
                      background: '#94a3b8',
                    },
                  },
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Subject Name</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Marks</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Internal</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Total</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Min Marks</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Max Marks</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subjects.map((subject) => (
                      <TableRow 
                        key={subject.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: '#f9fafb',
                          },
                          '&:nth-of-type(even)': {
                            backgroundColor: '#fafafa',
                          },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500 }}>{subject.subjectName}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 500, color: '#3b82f6' }}>{subject.marks}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 500, color: '#8b5cf6' }}>{subject.internal}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: '#059669' }}>{subject.total}</TableCell>
                        <TableCell align="right" sx={{ color: '#64748b' }}>{subject.minMarks}</TableCell>
                        <TableCell align="right" sx={{ color: '#64748b' }}>{subject.maxMarks}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteSubject(subject.id)}
                            size="small"
                            sx={{
                              '&:hover': {
                                backgroundColor: '#fef2f2',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Slide>
      )}

      {/* Action Buttons */}
      {selectedStudent && (
        <Slide direction="up" in timeout={1400}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: { xs: 'center', sm: 'flex-end' }, 
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
              }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  startIcon={<Cancel />}
                  sx={{
                    minWidth: { xs: '100%', sm: '120px' },
                    height: '48px',
                    borderRadius: 2,
                    borderColor: '#6b7280',
                    color: '#6b7280',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#4b5563',
                      backgroundColor: '#f9fafb',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={isSubmitting || !selectedStudent || subjects.length === 0}
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                  sx={{
                    minWidth: { xs: '100%', sm: '120px' },
                    height: '48px',
                    borderRadius: 2,
                    backgroundColor: '#3b82f6',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#2563eb',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                    },
                    '&:disabled': {
                      backgroundColor: '#d1d5db',
                      color: '#9ca3af',
                    },
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Marksheet'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Slide>
      )}
    </Container>
  );
};

export default AddMarksheetPageAdmin;
