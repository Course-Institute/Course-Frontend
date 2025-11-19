import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Container,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School,
  Book,
  Search as SearchIcon,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { useCourses } from '../../hooks/useCourses';
import { useAllSubjects } from '../../hooks/useAllSubjects';
import {
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from '../../hooks/useCourseManagement';
import { useToast } from '../../contexts/ToastContext';
import ConfirmationDialog from '../../components/ConfirmationDialog';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`course-tabpanel-${index}`}
      aria-labelledby={`course-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const CourseManagementPage = () => {
  const { showToast } = useToast();
  const [tabValue, setTabValue] = useState(0);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'course' | 'subject'>('course');
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteSubjectData, setDeleteSubjectData] = useState<{ courseId: string; semester: number } | null>(null);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [editingSubject, setEditingSubject] = useState<any>(null);

  // Form states
  const [courseForm, setCourseForm] = useState({
    name: '',
    code: '',
    duration: '',
    description: '',
  });

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    courseId: '',
    semester: '',
    code: '',
    credits: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Search and filter states for subjects
  const [subjectSearch, setSubjectSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState<string>('');
  const [filterSemester, setFilterSemester] = useState<string>('');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Hooks
  const { courses, isLoading: coursesLoading, refetch: refetchCourses } = useCourses();
  const { subjects, isLoading: subjectsLoading, refetch: refetchSubjects } = useAllSubjects();
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();
  const createSubjectMutation = useCreateSubject();
  const updateSubjectMutation = useUpdateSubject();
  const deleteSubjectMutation = useDeleteSubject();

  // Handlers
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenCourseDialog = (course?: any) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({
        name: course.name || '',
        code: course.code || '',
        duration: course.duration?.toString() || '',
        description: course.description || '',
      });
    } else {
      setEditingCourse(null);
      setCourseForm({ name: '', code: '', duration: '', description: '' });
    }
    setFormErrors({});
    setCourseDialogOpen(true);
  };

  const handleCloseCourseDialog = () => {
    setCourseDialogOpen(false);
    setEditingCourse(null);
    setCourseForm({ name: '', code: '', duration: '', description: '' });
    setFormErrors({});
  };

  const handleOpenSubjectDialog = (subject?: any) => {
    if (subject) {
      setEditingSubject(subject);
      setSubjectForm({
        name: subject.name || '',
        courseId: subject.courseId || '',
        semester: subject.semester?.toString() || '',
        code: subject.code || '',
        credits: subject.credits?.toString() || '',
      });
    } else {
      setEditingSubject(null);
      setSubjectForm({ name: '', courseId: '', semester: '', code: '', credits: '' });
    }
    setFormErrors({});
    setSubjectDialogOpen(true);
  };

  const handleCloseSubjectDialog = () => {
    setSubjectDialogOpen(false);
    setEditingSubject(null);
    setSubjectForm({ name: '', courseId: '', semester: '', code: '', credits: '' });
    setFormErrors({});
  };

  const validateCourseForm = () => {
    const errors: Record<string, string> = {};
    if (!courseForm.name.trim()) {
      errors.name = 'Course name is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSubjectForm = () => {
    const errors: Record<string, string> = {};
    if (!subjectForm.name.trim()) {
      errors.name = 'Subject name is required';
    }
    if (!subjectForm.courseId) {
      errors.courseId = 'Course is required';
    }
    if (!subjectForm.semester) {
      errors.semester = 'Semester is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCourse = () => {
    if (!validateCourseForm()) return;

    const courseData = {
      name: courseForm.name.trim(),
      code: courseForm.code.trim() || undefined,
      duration: courseForm.duration ? parseInt(courseForm.duration) : undefined,
      description: courseForm.description.trim() || undefined,
    };

    if (editingCourse) {
      updateCourseMutation.mutate(
        { _id: editingCourse._id, ...courseData },
        {
          onSuccess: () => {
            showToast('Course updated successfully!', 'success');
            handleCloseCourseDialog();
            refetchCourses();
          },
          onError: (error: any) => {
            showToast(error.response?.data?.message || 'Failed to update course', 'error');
          },
        }
      );
    } else {
      createCourseMutation.mutate(courseData, {
        onSuccess: () => {
          showToast('Course created successfully!', 'success');
          handleCloseCourseDialog();
          refetchCourses();
        },
        onError: (error: any) => {
          showToast(error.response?.data?.message || 'Failed to create course', 'error');
        },
      });
    }
  };

  const handleSaveSubject = () => {
    if (!validateSubjectForm()) return;

    const subjectData = {
      name: subjectForm.name.trim(),
      courseId: subjectForm.courseId,
      semester: parseInt(subjectForm.semester),
      code: subjectForm.code.trim() || undefined,
      credits: subjectForm.credits ? parseFloat(subjectForm.credits) : undefined,
    };

    if (editingSubject) {
      updateSubjectMutation.mutate(
        { _id: editingSubject._id, ...subjectData },
        {
          onSuccess: () => {
            showToast('Subject updated successfully!', 'success');
            handleCloseSubjectDialog();
            refetchSubjects();
          },
          onError: (error: any) => {
            showToast(error.response?.data?.message || 'Failed to update subject', 'error');
          },
        }
      );
    } else {
      createSubjectMutation.mutate(subjectData, {
        onSuccess: () => {
          showToast('Subject created successfully!', 'success');
          handleCloseSubjectDialog();
          refetchSubjects();
        },
        onError: (error: any) => {
          showToast(error.response?.data?.message || 'Failed to create subject', 'error');
        },
      });
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    setDeleteType('course');
    setDeleteId(courseId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSubject = (subjectId: string, courseId: string, semester: number) => {
    setDeleteType('subject');
    setDeleteId(subjectId);
    setDeleteSubjectData({ courseId, semester });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteType === 'course') {
      deleteCourseMutation.mutate(deleteId, {
        onSuccess: () => {
          showToast('Course deleted successfully!', 'success');
          setDeleteDialogOpen(false);
          refetchCourses();
          refetchSubjects();
        },
        onError: (error: any) => {
          showToast(error.response?.data?.message || 'Failed to delete course', 'error');
        },
      });
    } else {
      if (deleteSubjectData) {
        deleteSubjectMutation.mutate(
          { subjectId: deleteId, courseId: deleteSubjectData.courseId, semester: deleteSubjectData.semester },
          {
            onSuccess: () => {
              showToast('Subject deleted successfully!', 'success');
              setDeleteDialogOpen(false);
              refetchSubjects();
            },
            onError: (error: any) => {
              showToast(error.response?.data?.message || 'Failed to delete subject', 'error');
            },
          }
        );
      }
    }
  };

  // Get course name by ID
  const getCourseName = (courseId: string) => {
    const course = courses.find((c) => c._id === courseId);
    return course?.name || 'Unknown Course';
  };

  // Filter and sort subjects
  const filteredAndSortedSubjects = () => {
    let filtered = [...subjects];

    // Apply search filter
    if (subjectSearch.trim()) {
      const searchLower = subjectSearch.toLowerCase();
      filtered = filtered.filter(
        (subject) =>
          subject.name.toLowerCase().includes(searchLower) ||
          getCourseName(subject.courseId).toLowerCase().includes(searchLower) ||
          subject.code?.toLowerCase().includes(searchLower) ||
          subject.credits?.toString().includes(searchLower)
      );
    }

    // Apply course filter
    if (filterCourse) {
      filtered = filtered.filter((subject) => subject.courseId === filterCourse);
    }

    // Apply semester filter
    if (filterSemester) {
      filtered = filtered.filter((subject) => subject.semester.toString() === filterSemester);
    }

    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortField) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'course':
            aValue = getCourseName(a.courseId).toLowerCase();
            bValue = getCourseName(b.courseId).toLowerCase();
            break;
          case 'semester':
            aValue = a.semester;
            bValue = b.semester;
            break;
          case 'code':
            aValue = a.code || '';
            bValue = b.code || '';
            break;
          case 'credits':
            aValue = a.credits || 0;
            bValue = b.credits || 0;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortableTableCell = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <TableCell
      sx={{
        fontWeight: 600,
        cursor: 'pointer',
        userSelect: 'none',
        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
      }}
      onClick={() => handleSort(field)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
        )}
      </Box>
    </TableCell>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Course & Subject Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage courses, subjects, and semesters for the system
        </Typography>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="course management tabs">
            <Tab icon={<School />} iconPosition="start" label="Courses" />
            <Tab icon={<Book />} iconPosition="start" label="Subjects" />
          </Tabs>
        </Box>

        {/* Courses Tab */}
        <TabPanel value={tabValue} index={0}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">All Courses ({courses.length})</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenCourseDialog()}
                sx={{ borderRadius: 2 }}
              >
                Add Course
              </Button>
            </Box>

            {coursesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : courses.length === 0 ? (
              <Alert severity="info">No courses found. Create your first course!</Alert>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Course Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Duration (Years)</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course._id} hover>
                        <TableCell>{course.name}</TableCell>
                        <TableCell>{course.code || '-'}</TableCell>
                        <TableCell>{course.duration || '-'}</TableCell>
                        <TableCell>{course.description || '-'}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenCourseDialog(course)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteCourse(course._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </TabPanel>

        {/* Subjects Tab */}
        <TabPanel value={tabValue} index={1}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                All Subjects ({filteredAndSortedSubjects().length} of {subjects.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenSubjectDialog()}
                sx={{ borderRadius: 2 }}
                disabled={courses.length === 0}
              >
                Add Subject
              </Button>
            </Box>

            {courses.length === 0 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Please create at least one course before adding subjects.
              </Alert>
            )}

            {/* Search and Filter Section */}
            {subjects.length > 0 && (
              <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  placeholder="Search subjects by name, course, code..."
                  value={subjectSearch}
                  onChange={(e) => setSubjectSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{
                    flex: 1,
                    minWidth: '250px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
                <FormControl
                  sx={{
                    minWidth: 200,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                >
                  <InputLabel>Filter by Course</InputLabel>
                  <Select
                    value={filterCourse}
                    label="Filter by Course"
                    onChange={(e) => setFilterCourse(e.target.value)}
                  >
                    <MenuItem value="">All Courses</MenuItem>
                    {courses.map((course) => (
                      <MenuItem key={course._id} value={course._id}>
                        {course.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  sx={{
                    minWidth: 150,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                >
                  <InputLabel>Filter by Semester</InputLabel>
                  <Select
                    value={filterSemester}
                    label="Filter by Semester"
                    onChange={(e) => setFilterSemester(e.target.value)}
                  >
                    <MenuItem value="">All Semesters</MenuItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <MenuItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {(subjectSearch || filterCourse || filterSemester) && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSubjectSearch('');
                      setFilterCourse('');
                      setFilterSemester('');
                    }}
                    sx={{ borderRadius: 2 }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Box>
            )}

            {subjectsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : subjects.length === 0 ? (
              <Alert severity="info">No subjects found. Create your first subject!</Alert>
            ) : filteredAndSortedSubjects().length === 0 ? (
              <Alert severity="info">
                No subjects match your search criteria. Try adjusting your filters.
              </Alert>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <SortableTableCell field="name">Subject Name</SortableTableCell>
                      <SortableTableCell field="course">Course</SortableTableCell>
                      <SortableTableCell field="semester">Semester</SortableTableCell>
                      <SortableTableCell field="code">Code</SortableTableCell>
                      <SortableTableCell field="credits">Credits</SortableTableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAndSortedSubjects().map((subject) => (
                      <TableRow key={subject._id} hover>
                        <TableCell>{subject.name}</TableCell>
                        <TableCell>{getCourseName(subject.courseId)}</TableCell>
                        <TableCell>
                          <Chip label={`Semester ${subject.semester}`} size="small" color="primary" />
                        </TableCell>
                        <TableCell>{subject.code || '-'}</TableCell>
                        <TableCell>{subject.credits || '-'}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenSubjectDialog(subject)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteSubject(subject._id, subject.courseId, subject.semester)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </TabPanel>
      </Card>

      {/* Course Dialog */}
      <Dialog 
        open={courseDialogOpen} 
        onClose={handleCloseCourseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <School sx={{ fontSize: '2rem' }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {editingCourse ? 'Update course information' : 'Create a new course for the system'}
            </Typography>
          </Box>
        </Box>
        <DialogContent sx={{ p: 4, mt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Course Name"
                placeholder="Enter course name"
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                error={!!formErrors.name}
                helperText={formErrors.name || 'The full name of the course'}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Course Code"
                placeholder="e.g., DNTT, PGDCA"
                value={courseForm.code}
                onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value.toUpperCase() })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Duration (Years)"
                placeholder="e.g., 1, 2, 3"
                value={courseForm.duration}
                onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                inputProps={{ min: 0, max: 10 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                placeholder="Enter course description (optional)"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
          <Button 
            onClick={handleCloseCourseDialog}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              borderColor: '#e2e8f0',
              color: '#64748b',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#cbd5e1',
                backgroundColor: '#f8fafc',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveCourse}
            variant="contained"
            disabled={createCourseMutation.isPending || updateCourseMutation.isPending}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3d8f 100%)',
                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
              },
              '&:disabled': {
                background: '#cbd5e1',
              },
            }}
          >
            {createCourseMutation.isPending || updateCourseMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              editingCourse ? 'Update Course' : 'Create Course'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Subject Dialog */}
      <Dialog 
        open={subjectDialogOpen} 
        onClose={handleCloseSubjectDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Book sx={{ fontSize: '2rem' }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {editingSubject ? 'Edit Subject' : 'Add New Subject'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {editingSubject ? 'Update subject information' : 'Add a new subject to a course'}
            </Typography>
          </Box>
        </Box>
        <DialogContent sx={{ p: 4, mt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Subject Name"
                placeholder="Enter subject name"
                value={subjectForm.name}
                onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                error={!!formErrors.name}
                helperText={formErrors.name || 'The full name of the subject'}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl 
                fullWidth 
                required 
                error={!!formErrors.courseId}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                    },
                  },
                }}
              >
                <InputLabel>Course</InputLabel>
                <Select
                  value={subjectForm.courseId}
                  label="Course"
                  onChange={(e) => setSubjectForm({ ...subjectForm, courseId: e.target.value })}
                >
                  {courses.map((course) => (
                    <MenuItem key={course._id} value={course._id}>
                      {course.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.courseId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {formErrors.courseId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl 
                fullWidth 
                required 
                error={!!formErrors.semester}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                    },
                  },
                }}
              >
                <InputLabel>Semester</InputLabel>
                <Select
                  value={subjectForm.semester}
                  label="Semester"
                  onChange={(e) => setSubjectForm({ ...subjectForm, semester: e.target.value })}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <MenuItem key={sem} value={sem}>
                      Semester {sem}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.semester && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {formErrors.semester}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Subject Code"
                placeholder="e.g., SOA101, AEP101"
                value={subjectForm.code}
                onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Credits"
                placeholder="e.g., 3, 4, 5"
                value={subjectForm.credits}
                onChange={(e) => setSubjectForm({ ...subjectForm, credits: e.target.value })}
                inputProps={{ min: 0, max: 10, step: 0.5 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8fafc',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
          <Button 
            onClick={handleCloseSubjectDialog}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              borderColor: '#e2e8f0',
              color: '#64748b',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#cbd5e1',
                backgroundColor: '#f8fafc',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveSubject}
            variant="contained"
            disabled={createSubjectMutation.isPending || updateSubjectMutation.isPending}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0d9668 0%, #047857 100%)',
                boxShadow: '0 6px 16px rgba(16, 185, 129, 0.5)',
              },
              '&:disabled': {
                background: '#cbd5e1',
              },
            }}
          >
            {createSubjectMutation.isPending || updateSubjectMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              editingSubject ? 'Update Subject' : 'Create Subject'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title={`Delete ${deleteType === 'course' ? 'Course' : 'Subject'}`}
        message={`Are you sure you want to delete this ${deleteType}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        severity="error"
        isLoading={deleteCourseMutation.isPending || deleteSubjectMutation.isPending}
      />
    </Container>
  );
};

export default CourseManagementPage;

