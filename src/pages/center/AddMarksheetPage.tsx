import { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import { generateSerialNumber } from '../../utils/serialNumberGenerator';
import { useCourses } from '../../hooks/useCourses';
import { useCourseSubjects } from '../../hooks/useCourseSubjects';
import { useGetMarksheetBySemester } from '../../hooks/useGetMarksheetBySemester';
import {
  calculateTotal,
  validateSubject,
  validateMaxSubjects,
  validateFormForSave,
  type ValidationErrors,
} from '../../utils/marksheetValidation';
import { useToast } from '../../contexts/ToastContext';

const AddMarksheetPageCenter = () => {
  const { showToast } = useToast();
  const [centerId, setCenterId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [existingMarksheetId, setExistingMarksheetId] = useState<string | null>(null);
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

  // Fetch courses from API
  const { courses, isLoading: isLoadingCourses } = useCourses();

  // Normalize selectedCourse to always be a string (extract _id if it's an object)
  const normalizedCourseId = selectedCourse 
    ? (typeof selectedCourse === 'string' 
        ? selectedCourse 
        : (selectedCourse as any)?._id || String(selectedCourse))
    : "";

  // Fetch subjects based on selected course and semester
  const { subjects: courseSubjects, isLoading: isLoadingSubjects } = useCourseSubjects(
    normalizedCourseId,
    semester,
    year
  );

  // Fetch existing marksheet for selected student and semester
  const studentId = selectedStudent?.studentId || selectedStudent?.id || "";
  const { data: existingMarksheet, isLoading: isLoadingMarksheet } = useGetMarksheetBySemester(
    studentId,
    semester,
    year,
    !!studentId && !!(semester || year)
  );

  useEffect(() => {
    // Read centerId from localStorage when component mounts or when it changes
    const id = localStorage.getItem('centerId');
    setCenterId(id);
    
    // Listen for storage changes (in case centerId is updated in another tab/window)
    const handleStorageChange = () => {
      const updatedId = localStorage.getItem('centerId');
      setCenterId(updatedId);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle adding subject
  const handleAddSubject = () => {
    const validationErrors = validateSubject(currentSubject, subjects, 'center');

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

    showToast('Subject added successfully!', 'success');
  };

  // Handle deleting subject
  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
    setTableErrors({});
    showToast('Subject removed successfully!', 'info');
  };

  /* ---------------------------------------------------------------
                     COURSE CHANGE → LOAD SUBJECTS
  --------------------------------------------------------------- */
  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    // Reset subject when course changes
    setCurrentSubject((prev) => ({ ...prev, subjectName: "" }));
  };

  /* ---------------------------------------------------------------
                     SEMESTER CHANGE → RELOAD SUBJECTS
  --------------------------------------------------------------- */
  const handleSemesterChange = (newSemester: string) => {
    // Clear course and subjects when semester changes
    if (subjects.length === 0) {
      setSelectedCourse("");
      setCurrentSubject({
        subjectName: "",
        marks: "",
        internal: "",
        total: "",
        minMarks: "",
        maxMarks: "",
      });
    }
    setSemester(newSemester);
    setYear("");
    setExistingMarksheetId(null);
    setSubjects([]);
    
    // Reset subject selection when semester changes
    setCurrentSubject((prev) => ({ ...prev, subjectName: "" }));
    
    if (errors.semester || errors.year) {
      const newErrors = { ...errors };
      delete newErrors.semester;
      delete newErrors.year;
      setErrors(newErrors);
    }
  };

  /* ---------------------------------------------------------------
                     YEAR CHANGE → RELOAD SUBJECTS
  --------------------------------------------------------------- */
  const handleYearChange = (newYear: string) => {
    if (subjects.length === 0) {
      setSelectedCourse("");
      setCurrentSubject({
        subjectName: "",
        marks: "",
        internal: "",
        total: "",
        minMarks: "",
        maxMarks: "",
      });
    }
    setYear(newYear);
    setSemester("");
    setExistingMarksheetId(null);
    setSubjects([]);

    setCurrentSubject((prev) => ({ ...prev, subjectName: "" }));

    if (errors.year || errors.semester) {
      const newErrors = { ...errors };
      delete newErrors.year;
      delete newErrors.semester;
      setErrors(newErrors);
    }
  };

  // Load existing marksheet data when it's fetched
  useEffect(() => {
    // Only process if we have a valid marksheet response and not loading
    if (!isLoadingMarksheet && existingMarksheet && existingMarksheet._id) {
      setExistingMarksheetId(existingMarksheet._id);
      
      if (existingMarksheet.semester) {
        setSemester(existingMarksheet.semester.toString());
        setYear("");
      } else if ((existingMarksheet as any).year) {
        setYear((existingMarksheet as any).year.toString());
        setSemester("");
      }
      
      // Pre-select course if it exists in marksheet
      if (existingMarksheet.courseId) {
        // Extract courseId if it's an object (handle populated courseId)
        const courseIdValue = typeof existingMarksheet.courseId === 'string' 
          ? existingMarksheet.courseId 
          : (existingMarksheet.courseId as any)?._id || existingMarksheet.courseId;
        setSelectedCourse(courseIdValue);
      }
      
      // Convert existing subjects to the format expected by the form
      if (existingMarksheet.subjects && existingMarksheet.subjects.length > 0) {
        const formattedSubjects: SubjectData[] = existingMarksheet.subjects.map((sub: any, index: number) => ({
          id: sub.id || `existing-${Date.now()}-${index}`,
          subjectName: sub.subjectName,
          marks: sub.marks,
          internal: sub.internal,
          total: sub.total,
          minMarks: sub.minMarks,
          maxMarks: sub.maxMarks,
        }));
        setSubjects(formattedSubjects);
      } else {
        // Marksheet exists but has no subjects yet
        setSubjects([]);
      }
    } else if (!isLoadingMarksheet && (!existingMarksheet || existingMarksheet === null) && studentId && (semester || year)) {
      // No existing marksheet found, ensure we're in create mode
      // Only reset if we don't have any subjects added yet (to avoid clearing user input)
      if (subjects.length === 0) {
        setExistingMarksheetId(null);
        setSelectedCourse(""); // Reset course when no marksheet found
        // Keep selected semester/year so the form stays visible
      }
    }
  }, [existingMarksheet, isLoadingMarksheet, studentId, semester, year]);

  // Handle input change
  const handleInputChange = (field: string, value: string) => {
    // Clear field-specific errors
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }

    let updatedSubject = { ...currentSubject, [field]: value };

    // Auto-calculate total when marks or internal changes
    if (field === 'marks' || field === 'internal') {
      updatedSubject.total = calculateTotal(
        field === 'marks' ? value : updatedSubject.marks,
        field === 'internal' ? value : updatedSubject.internal
      );
    }

    setCurrentSubject(updatedSubject);

    // Real-time validation for center role - total marks cannot exceed 80
    if (field === 'marks' || field === 'internal') {
      const newTotal = parseFloat(updatedSubject.total);
      if (newTotal && newTotal > 80) {
        setErrors({ ...errors, total: 'Total marks cannot exceed 80 for center role' });
      } else if (errors.total && newTotal <= 80) {
        const newErrors = { ...errors };
        delete newErrors.total;
        setErrors(newErrors);
      }
    }
  };

  // Use the custom hook for saving marksheet
  const saveMarksheetMutation = useSaveMarksheet();

  // Handle save
  const handleSave = () => {
    // Validate term is selected
    if (!semester && !year) {
      setErrors({ 
        ...errors, 
        semester: "Please select a semester or year",
        year: "Please select a semester or year",
      });
      return;
    }

    const validationErrors = validateFormForSave(selectedStudent, subjects);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Normalize selectedCourse to always be a string (extract _id if it's an object)
    const normalizedCourseIdForSave = selectedCourse 
      ? (typeof selectedCourse === 'string' 
          ? selectedCourse 
          : (selectedCourse as any)?._id || String(selectedCourse))
      : "";

    // Validate course is selected
    if (!normalizedCourseIdForSave) {
      setErrors({ ...errors, course: "Please select a course" });
      return;
    }

    setIsSubmitting(true);
    
    // Generate 6-digit serial number for new marksheets only
    const serialNo = existingMarksheetId ? undefined : generateSerialNumber();
    
    const data: MarksheetFormData = {
      studentId: selectedStudent.studentId || selectedStudent.id,
      subjects,
      semester: semester ? semester.toString() : undefined,
      year: year ? year.toString() : undefined,
      courseId: normalizedCourseIdForSave, // Include courseId in marksheet (always a string)
      role: 'center',
      serialNo, // Include serial number for new marksheets
    } as any;

    saveMarksheetMutation.mutate(data, {
      onSuccess: () => {
        const message = existingMarksheetId 
          ? 'Marksheet updated successfully!' 
          : 'Marksheet saved successfully!';
        showToast(message, 'success');
        
        // Don't reset form if updating - allow adding more subjects
        if (!existingMarksheetId) {
          // Reset form
          setSelectedStudent(null);
          setSubjects([]);
          setSelectedCourse("");
          setSemester("");
          setYear("");
          setExistingMarksheetId(null);
          setCurrentSubject({
            subjectName: '',
            marks: '',
            internal: '',
            total: '',
            minMarks: '',
            maxMarks: '',
          });
        }
        setErrors({});
        setIsSubmitting(false);
      },
      onError: (error: any) => {
        showToast(error.response?.data?.message || 'Failed to save marksheet', 'error');
        setIsSubmitting(false);
      },
    });
  };

  // Handle cancel
  const handleCancel = () => {
    setSelectedStudent(null);
    setSubjects([]);
    setSelectedCourse("");
    setSemester("");
    setYear("");
    setExistingMarksheetId(null);
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
    showToast('Form cleared', 'info');
  };

  const totalMarks = subjects.reduce((sum, subject) => sum + subject.total, 0);
  const averageMarks = subjects.length > 0 ? totalMarks / subjects.length : 0;
  const selectedTermLabel = semester ? `Semester ${semester}` : year ? `Year ${year}` : "";

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
                  Create and manage student marksheets for your center
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
                setSubjects([]);
                setSelectedCourse("");
                setSemester("");
                setYear("");
                setExistingMarksheetId(null);
                setErrors({});
                showToast(`Selected student: ${opt.studentName}`, 'success');
              }}
              selectedOptions={selectedStudent}
              error={!!errors.studentId}
              helperText={errors.studentId}
              required
              customActionMethod="POST"
              defaultData={{ centerId: centerId }}
              disabled={!centerId}
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
            {!centerId && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Center information not found. Please login again.
              </Alert>
            )}
          </CardContent>
        </Card>
      </Slide>

      {/* Semester / Year Selection */}
      {selectedStudent && (
        <Slide direction="up" in timeout={900}>
          <Card sx={{ 
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1e293b' }}>
                Semester / Year Selection
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Semester *</InputLabel>
                    <Select
                      value={semester}
                      label="Semester *"
                      onChange={(e) => handleSemesterChange(e.target.value)}
                      error={!!errors.semester}
                      disabled={subjects.length > 0 || !!year}
                    >
                      {[1, 2].map((s) => (
                        <MenuItem key={s} value={s}>
                          Semester {s}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.semester && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {errors.semester}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1.75 }}>
                    {subjects.length > 0
                      ? 'Semester cannot be changed once subjects are added'
                      : 'Pick semester or use yearly selection below'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Year *</InputLabel>
                    <Select
                      value={year}
                      label="Year *"
                      onChange={(e) => handleYearChange(e.target.value)}
                      error={!!errors.year}
                      disabled={subjects.length > 0 || !!semester}
                    >
                      {[1, 2, 3, 4].map((yVal) => (
                        <MenuItem key={yVal} value={yVal}>
                          Year {yVal}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.year && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {errors.year}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1.75 }}>
                    {subjects.length > 0
                      ? 'Year cannot be changed once subjects are added'
                      : 'Use year-based selection if course is yearly'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, ml: 1.75, display: 'inline-block' }}>
                    Note: Total marks cannot exceed 80 for center role
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Slide>
      )}

      {/* Add Subject Form */}
      {selectedStudent && (semester || year) && (
        <Slide direction="up" in timeout={900}>
          <Card sx={{ 
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: '#1e293b', display: 'flex', gap: 1, alignItems: 'center' }}
                >
                  <AddIcon sx={{ color: '#10b981' }} /> Add Subject
                </Typography>

                {/* Display selected term (Semester or Year) */}
                {(semester || year) && (
                  <Chip
                    label={semester ? `Semester ${semester}` : `Year ${year}`}
                    size="small"
                    color="info"
                    sx={{ fontWeight: 600 }}
                  />
                )}

                <Chip 
                  label={`${subjects.length}/7`} 
                  size="small" 
                  color={subjects.length >= 7 ? 'error' : 'primary'}
                  sx={{ ml: 'auto' }}
                />
              </Box>

              <Grid container spacing={3} alignItems="flex-start">
                {/* Semester / Year Selection */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.5, color: '#1e293b' }}>
                      Semester / Year *
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Select semester or year for this marksheet
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Semester</InputLabel>
                        <Select
                          value={semester || ""}
                          label="Semester"
                          onChange={(e) => handleSemesterChange(e.target.value)}
                          error={!!errors.semester}
                          disabled={subjects.length > 0 || !!year}
                          MenuProps={{ disablePortal: true }}
                          sx={{
                            backgroundColor: '#f8fafc',
                            borderRadius: 2,
                          }}
                        >
                          <MenuItem value="">None</MenuItem>
                          {[1, 2].map((s) => (
                            <MenuItem key={s} value={s}>
                              Semester {s}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Year</InputLabel>
                        <Select
                          value={year || ""}
                          label="Year"
                          onChange={(e) => handleYearChange(e.target.value)}
                          error={!!errors.year}
                          disabled={subjects.length > 0 || !!semester}
                          MenuProps={{ disablePortal: true }}
                          sx={{
                            backgroundColor: '#f8fafc',
                            borderRadius: 2,
                          }}
                        >
                          <MenuItem value="">None</MenuItem>
                          {[1, 2, 3, 4].map((y) => (
                            <MenuItem key={y} value={y}>
                              Year {y}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  {errors.semester && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.semester}
                    </Typography>
                  )}
                  {errors.year && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.year}
                    </Typography>
                  )}
                </Grid>

                {/* Course */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.5, color: '#1e293b' }}>
                      Course *
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Select the course for this subject
                    </Typography>
                  </Box>
                  <FormControl fullWidth error={!!errors.course}>
                    <Select
                      displayEmpty
                      value={selectedCourse}
                      onChange={(e) => handleCourseChange(e.target.value)}
                      disabled={isLoadingCourses}
                      sx={{
                        backgroundColor: '#f8fafc',
                        borderRadius: 2,
                        '& .MuiSelect-select': { 
                          padding: '12px 14px',
                          fontSize: '0.95rem',
                        },
                        '&:hover': {
                          backgroundColor: '#ffffff',
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#ffffff',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        {isLoadingCourses ? "Loading courses..." : "Select Course"}
                      </MenuItem>
                      {courses.map((c) => (
                        <MenuItem key={c._id} value={c._id}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.course && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.course}
                    </Typography>
                  )}
                </Grid>

                {/* Subject */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.5, color: '#1e293b' }}>
                      Subject *
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Choose the subject from the selected course
                    </Typography>
                  </Box>
                  <FormControl fullWidth disabled={!selectedCourse || (!semester && !year) || isLoadingSubjects}>
                    <Select
                      displayEmpty
                      value={currentSubject.subjectName}
                      onChange={(e) => handleInputChange('subjectName', e.target.value)}
                      sx={{
                        backgroundColor: '#f8fafc',
                        borderRadius: 2,
                        '& .MuiSelect-select': { 
                          padding: '12px 14px',
                          fontSize: '0.95rem',
                        },
                        '&:hover': {
                          backgroundColor: '#ffffff',
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#ffffff',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        {isLoadingSubjects 
                          ? "Loading subjects..." 
                          : !selectedCourse || (!semester && !year)
                          ? "Select Course and Semester/Year first"
                          : "Select Subject"}
                      </MenuItem>
                      {courseSubjects.map((sub, idx) => {
                        const isAlreadyAdded = subjects.some(s => s.subjectName === sub);
                        return (
                          <MenuItem 
                            key={idx} 
                            value={sub}
                            disabled={isAlreadyAdded}
                            sx={{
                              ...(isAlreadyAdded && {
                                opacity: 0.5,
                                color: 'text.disabled',
                                cursor: 'not-allowed',
                              }),
                            }}
                          >
                            {sub} {isAlreadyAdded && '(Already Added)'}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  {errors.subjectName && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {errors.subjectName}
                    </Typography>
                  )}
                </Grid>

                {/* Marks Section */}
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2, color: '#1e293b' }}>
                      Marks Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5, color: '#334155' }}>
                          Marks *
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          placeholder="0-100"
                          value={currentSubject.marks}
                          onChange={(e) => handleInputChange('marks', e.target.value)}
                          error={!!errors.marks}
                          helperText={errors.marks}
                          inputProps={{ min: 0, max: 100 }}
                          sx={{
                            backgroundColor: '#ffffff',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              '&:hover': {
                                backgroundColor: '#fafafa',
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5, color: '#334155' }}>
                          Internal *
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          placeholder="0-100"
                          value={currentSubject.internal}
                          onChange={(e) => handleInputChange('internal', e.target.value)}
                          error={!!errors.internal}
                          helperText={errors.internal}
                          inputProps={{ min: 0, max: 100 }}
                          sx={{
                            backgroundColor: '#ffffff',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              '&:hover': {
                                backgroundColor: '#fafafa',
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5, color: '#334155' }}>
                          Total (Auto-calculated)
                        </Typography>
                        <TextField
                          fullWidth
                          disabled
                          value={currentSubject.total || '0'}
                          error={!!errors.total}
                          helperText={errors.total || (parseFloat(currentSubject.total) > 80 ? 'Center limit: Max 80' : '')}
                          sx={{
                            backgroundColor: '#f1f5f9',
                            borderRadius: 2,
                            '& .MuiInputBase-input': {
                              fontWeight: 600,
                              color: parseFloat(currentSubject.total) > 80 ? '#ef4444' : '#059669',
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Min/Max Marks Section */}
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2, color: '#1e293b' }}>
                      Passing Criteria
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5, color: '#334155' }}>
                          Min Marks *
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          placeholder="Minimum passing marks"
                          value={currentSubject.minMarks}
                          onChange={(e) => handleInputChange('minMarks', e.target.value)}
                          error={!!errors.minMarks}
                          helperText={errors.minMarks}
                          inputProps={{ min: 0 }}
                          sx={{
                            backgroundColor: '#ffffff',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              '&:hover': {
                                backgroundColor: '#fafafa',
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5, color: '#334155' }}>
                          Max Marks *
                        </Typography>
                        <TextField
                          fullWidth
                          type="number"
                          placeholder="Maximum possible marks"
                          value={currentSubject.maxMarks}
                          onChange={(e) => handleInputChange('maxMarks', e.target.value)}
                          error={!!errors.maxMarks}
                          helperText={errors.maxMarks}
                          inputProps={{ min: 0 }}
                          sx={{
                            backgroundColor: '#ffffff',
                            borderRadius: 2,
                            '& .MuiOutlinedInput-root': {
                              '&:hover': {
                                backgroundColor: '#fafafa',
                              },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Add Button */}
                <Grid size={{ xs: 12 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddSubject}
                    disabled={subjects.length >= 7}
                    sx={{
                      height: 50,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        boxShadow: '0 6px 16px rgba(59, 130, 246, 0.5)',
                        transform: 'translateY(-1px)',
                      },
                      '&:disabled': {
                        background: '#cbd5e1',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {subjects.length >= 7 ? 'Maximum Subjects Reached' : 'Add Subject to Marksheet'}
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                {subjects.length >= 7 ? (
                  <Alert severity="warning">Maximum 7 subjects allowed</Alert>
                ) : (
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Select course & subject, fill marks (max 80 total) and click Add Subject
                  </Typography>
                )}
              </Box>
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
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  {selectedTermLabel && (
                    <Chip label={selectedTermLabel} color="info" sx={{ fontWeight: 600 }} />
                  )}
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
                    background: '#f1f5f9',
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

export default AddMarksheetPageCenter;