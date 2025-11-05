import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  Container,
  Collapse,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Search, Clear, FilterList, ExpandMore, ExpandLess, Edit, Delete } from '@mui/icons-material';
import { useStudentsData } from '../../hooks/useStudentsData';
import { useApproveStudent } from '../../hooks/useApproveStudent';
import { useApproveMarksheet } from '../../hooks/useApproveMarksheet';
import { useToast } from '../../contexts/ToastContext';
import { useQueryClient } from '@tanstack/react-query';
import Table, { type Column } from '../../components/core-components/Table';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import EditableMarksheetDialog from '../../components/EditableMarksheetDialog';
import ErrorBoundary from '../../components/ErrorBoundary';
import { type StudentsFilters } from '../../api/studentsApi';
import { programsData } from '../../constants/programsData';
import { useDeleteStudent } from '../../hooks/useStudentsData';

const ManageStudentsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<StudentsFilters>({});
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [approveMarksheetDialogOpen, setApproveMarksheetDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(!isMobile);
  
  // Debounced search term to avoid too many API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Update debounced search term after 500ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Combine search term with filters
  const combinedFilters = useMemo(() => ({
    ...filters,
    search: debouncedSearchTerm || undefined,
  }), [filters, debouncedSearchTerm]);
  
  const { 
    students, 
    pagination,
    lastElementRef,
    tableContainerRef,
    isError, 
    error, 
    isFetchingNextPage
  } = useStudentsData({ limit: 10, filters: combinedFilters });


  const approveStudentMutation = useApproveStudent();
  const approveMarksheetMutation = useApproveMarksheet();
  const queryClient = useQueryClient();
  const deleteStudentMutation = useDeleteStudent();

  const { showToast } = useToast();

  // Get unique values for filter dropdowns
  const uniqueValues = useMemo(() => {
    const courses = [...new Set(students.map(s => s.course).filter(Boolean))];
    const years = [...new Set(students.map(s => s.year).filter(Boolean))];
    const sessions = [...new Set(students.map(s => s.session).filter(Boolean))];
    
    // Get all program categories from programsData
    const programCategories = programsData.map(program => program.category);
    
    // Get all courses from programsData
    const allCourses = programsData.flatMap(program => 
      program.levels.flatMap(level => 
        level.courses.map(course => course.name)
      )
    );
    
    return { 
      courses, 
      years, 
      sessions, 
      programCategories: [...new Set(programCategories)],
      allCourses: [...new Set(allCourses)]
    };
  }, [students]);

  // Filter handlers
  const handleFilterChange = (key: keyof StudentsFilters, value: string | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  // Handle program category change - filter courses based on selected category
  const handleProgramCategoryChange = (category: string) => {
    setFilters(prev => ({
      ...prev,
      programCategory: category || undefined,
      course: undefined, // Reset course when category changes
    }));
  };

  // Get courses for selected program category
  const getCoursesForCategory = (category: string) => {
    if (!category) return [];
    const program = programsData.find(p => p.category === category);
    if (!program) return [];
    return program.levels.flatMap(level => 
      level.courses.map(course => course.name)
    );
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);



  // Handle approve student
  const handleApproveClick = (student: any) => {
    setSelectedStudent(student);
    setApproveDialogOpen(true);
  };

  const handleApproveConfirm = () => {
    if (selectedStudent) {
      approveStudentMutation.mutate(
        { registrationNo: selectedStudent.registrationNo },
        {
          onSuccess: (data: any) => {
            showToast(data.message || 'Student approved successfully!', 'success');
            // Refetch the students data to get updated isApprovedByAdmin status
            queryClient.invalidateQueries({ queryKey: ['students'] });
            setApproveDialogOpen(false);
            setSelectedStudent(null);
          },
          onError: (error: any) => {
            showToast(error?.message || 'Failed to approve student', 'error');
            setApproveDialogOpen(false);
            setSelectedStudent(null);
          },
        }
      );
    }
  };

  const handleApproveCancel = () => {
    setApproveDialogOpen(false);
    setSelectedStudent(null);
  };

  // Handle approve marksheet - opens editable dialog
  const handleApproveMarksheetClick = (student: any) => {
    setSelectedStudent(student);
    setApproveMarksheetDialogOpen(true);
  };

  const handleApproveMarksheetDialogClose = () => {
    setApproveMarksheetDialogOpen(false);
    setSelectedStudent(null);
  };

  const handleEditStudent = (student: any) => {
    const id = student.studentId || student._id || student.id;
    navigate(`/admin/edit-student/${id}`);
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<any>(null);

  const handleDeleteClick = (student: any) => {
    setDeletingStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingStudent) {
      try {
        await deleteStudentMutation.mutateAsync(deletingStudent.studentId || deletingStudent._id || deletingStudent.id);
        showToast(`Student ${deletingStudent.candidateName} deleted successfully!`, 'success');
      } catch (err: any) {
        showToast(err?.message || 'Failed to delete student', 'error');
      }
      setDeleteDialogOpen(false);
      setDeletingStudent(null);
    }
  };
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingStudent(null);
  };


  // Define table columns matching backend data structure
  const columns: Column[] = [
    {
      field: 'registrationNo',
      headerName: 'Registration No.',
      width: '140px',
    },
    {
      field: 'candidateName',
      headerName: 'Student Name',
      minWidth: '150px',
    },
    {
      field: 'dateOfBirth', // Try: 'dob', 'birthDate', 'dateOfBirth', etc.
      headerName: 'DOB',
      width: '100px',
      align: 'center',
      renderCell: (value: string) => {
        return value ? new Date(value).toLocaleDateString('en-GB') : 'N/A';
      },
    },
    {
      field: 'course',
      headerName: 'Course',
      minWidth: '120px',
    },
    {
      field: 'grade',
      headerName: 'Grade',
      minWidth: '120px',
    },
    {
      field: 'stream',
      headerName: 'Stream',
      minWidth: '120px',
    },
    {
      field: 'year',
      headerName: 'Year',
      width: '80px',
      align: 'center',
    },
    {
      field: 'session',
      headerName: 'Session',
      width: '80px',
      align: 'center',
    },
    {
      field: 'centerName',
      headerName: 'Center Name',
      minWidth: '220px',
      renderCell: (value: string) => (
        <Box sx={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || '—'}
        </Box>
      ),
    },
    {
      field: 'centerCode',
      headerName: 'Center Code',
      width: '160px',
      align: 'center',
      renderCell: (value: string) => (
        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || '—'}
        </Box>
      ),
    },
    {
      field: 'contactNumber',
      headerName: 'Contact',
      width: '120px',
      align: 'center',
    },
    {
      field: 'emailAddress',
      headerName: 'Email',
      minWidth: '180px',
    },
    {
      field: 'createdAt',
      headerName: 'Admission Date',
      width: '120px',
      align: 'center',
      renderCell: (value: string) => {
        const date = new Date(value);
        return date.toLocaleDateString('en-GB');
      },
    },
    {
      field: 'editDelete',
      headerName: 'Edit/Delete',
      width: '130px',
      align: 'center',
      getActions: (row: any) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleEditStudent(row)}
            sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: 2, '&:hover': { bgcolor: '#e0edff' } }}
          >
            <Edit sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleDeleteClick(row)}
            sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: 2, '&:hover': { bgcolor: '#feecec' } }}
            disabled={deleteStudentMutation.isPending}
          >
            <Delete sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      ),
    },
    {
      field: 'approval',
      headerName: 'Approval',
      width: '120px',
      align: 'center',
      getActions: (row: any) => (
        row.isApprovedByAdmin ? (
          <Button size="small" variant="outlined" disabled sx={{ color: '#22c55e', borderColor: '#22c55e', borderRadius: 10, height: 26, px: 1.5, minWidth: 96, fontSize: 11, textTransform: 'none', whiteSpace: 'nowrap' }}>
            Approved
          </Button>
        ) : (
          <Button
            size="small"
            variant="contained"
            onClick={() => handleApproveClick(row)}
            disabled={approveStudentMutation.isPending}
            sx={{ background: '#eab308', color: '#fff', borderRadius: 10, height: 26, px: 1.5, minWidth: 92, fontSize: 11, textTransform: 'none', whiteSpace: 'nowrap', boxShadow: 'none', '&:hover': { background: '#ca8a04' } }}
          >
            Approve
          </Button>
        )
      ),
    },
    {
      field: 'marksheet',
      headerName: 'Marksheet',
      width: '200px',
      align: 'center',
      getActions: (row: any) => (
        row.isMarksheetGenerated ? (
          row.isMarksheetAndCertificateApproved ? (
            <Button size="small" variant="outlined" disabled sx={{ color: '#8b5cf6', borderColor: '#8b5cf6', background: 'rgba(139,92,246,0.08)', borderRadius: 10, height: 26, px: 1.5, minWidth: 160, fontSize: 11, textTransform: 'none', whiteSpace: 'nowrap' }}>
              Marksheet Approved
            </Button>
          ) : (
            <Button
              size="small"
              variant="contained"
              onClick={() => handleApproveMarksheetClick(row)}
              disabled={approveMarksheetMutation.isPending}
              sx={{ background: '#6366f1', color: '#fff', borderRadius: 10, height: 26, px: 1.5, minWidth: 150, fontSize: 11, textTransform: 'none', whiteSpace: 'nowrap', boxShadow: 'none', '&:hover': { background: '#4f46e5' } }}
            >
              Approve Marksheet
            </Button>
          )
        ) : (
          <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: 12, whiteSpace: 'nowrap' }}>Not generated</Typography>
        )
      ),
    },
    {
      field: 'view',
      headerName: 'View',
      width: '170px',
      align: 'center',
      getActions: (row: any) => (
        row.isMarksheetGenerated ? (
          <Button
            size="small"
            variant="outlined"
            sx={{ color: '#6366f1', borderColor: '#6366f1', borderRadius: 10, height: 26, px: 1.5, minWidth: 136, fontWeight: 600, fontSize: 11, textTransform: 'none', whiteSpace: 'nowrap', background: 'white' }}
            onClick={() => navigate(`/admin/view-marksheet/${row.studentId || row._id || row.id}`)}
          >
            Show Marksheet
          </Button>
        ) : (
          <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: 12, whiteSpace: 'nowrap' }}>N/A</Typography>
        )
      ),
    },
  ];
  return (
    <ErrorBoundary>
      <Container maxWidth={false} sx={{ 
        width: '100%',
        height: '100vh',
        // py: { xs: 1.5, sm: 2 },
        // px: { xs: 2, sm: 3, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, sm: 3 },
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
      }}>

        {/* Error Alert */}
        {isError && (
          <Fade in={isError}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Failed to load students data: {error?.message || 'Unknown error'}
              </Typography>
              {(error as any)?.response?.status === 401 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Authentication Error:</strong> Please login again.
                </Typography>
              )}
              {(error as any)?.response?.status === 403 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Access Denied:</strong> You don't have permission to access this data.
                </Typography>
              )}
              {(error as any)?.code === 'NETWORK_ERROR' && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Network Error:</strong> Please check your internet connection.
                </Typography>
              )}
            </Alert>
          </Fade>
        )}

        {/* Search and Filter Section */}
        <Card sx={{ 
          // mb: { xs: 1.5, sm: 2 },
          borderRadius: 3,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
          background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
          overflow: 'hidden',
        }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            {/* Header Section */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2,
                cursor: isMobile ? 'pointer' : 'default',
              }}
              onClick={() => isMobile && setFiltersExpanded(!filtersExpanded)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                  p: 0.75,
                  borderRadius: 2,
                  backgroundColor: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <FilterList sx={{ color: '#3b82f6', fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
                </Box>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#1e293b',
                      fontSize: { xs: '0.95rem', sm: '1.1rem' },
                    }}
                  >
                    Search & Filters
                  </Typography>
                  {activeFiltersCount > 0 && (
                    <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
                      {activeFiltersCount} active filter{activeFiltersCount !== 1 ? 's' : ''}
                    </Typography>
                  )}
                </Box>
              </Box>
              {isMobile && (
                <IconButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFiltersExpanded(!filtersExpanded);
                  }}
                  sx={{ color: '#64748b' }}
                >
                  {filtersExpanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {activeFiltersCount > 0 && (
                  <>
                    <Chip 
                      label={`${activeFiltersCount} active`} 
                      size="small" 
                      color="primary"
                      sx={{ 
                        fontWeight: 600,
                        height: '28px',
                        display: { xs: 'none', sm: 'flex' },
                      }} 
                    />
                    <Button
                      variant="outlined"
                      onClick={handleClearFilters}
                      startIcon={<Clear />}
                      size="small"
                      sx={{
                        height: '32px',
                        borderColor: '#ef4444',
                        color: '#ef4444',
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 2,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: '#dc2626',
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)',
                        },
                      }}
                    >
                      Clear All
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            {/* Search Bar */}
            <Box sx={{ mb: 1.5 }}>
              <TextField
                fullWidth
                placeholder="Search by name, registration number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear search"
                        onClick={handleClearSearch}
                        edge="end"
                        size="small"
                        sx={{ color: '#64748b' }}
                      >
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
            </Box>

            {/* Filter Row */}
            <Collapse in={filtersExpanded}>
              <Box sx={{ mb: 0 }}>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                    <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                      <InputLabel sx={{ fontWeight: 500 }}>Program Category</InputLabel>
                      <Select
                        value={filters.programCategory || ''}
                        label="Program Category"
                        onChange={(e) => handleProgramCategoryChange(e.target.value)}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <MenuItem value="">All Categories</MenuItem>
                        {uniqueValues.programCategories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                    <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                      <InputLabel sx={{ fontWeight: 500 }}>Course</InputLabel>
                      <Select
                        value={filters.course || ''}
                        label="Course"
                        onChange={(e) => handleFilterChange('course', e.target.value)}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <MenuItem value="">All Courses</MenuItem>
                        {getCoursesForCategory(filters.programCategory || '').map((course) => (
                          <MenuItem key={course} value={course}>
                            {course}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                    <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                      <InputLabel sx={{ fontWeight: 500 }}>Year</InputLabel>
                      <Select
                        value={filters.year || ''}
                        label="Year"
                        onChange={(e) => handleFilterChange('year', e.target.value)}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <MenuItem value="">All Years</MenuItem>
                        {uniqueValues.years.map((year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                    <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                      <InputLabel sx={{ fontWeight: 500 }}>Session</InputLabel>
                      <Select
                        value={filters.session || ''}
                        label="Session"
                        onChange={(e) => handleFilterChange('session', e.target.value)}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <MenuItem value="">All Sessions</MenuItem>
                        {uniqueValues.sessions.map((session) => (
                          <MenuItem key={session} value={session}>
                            {session}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                      <InputLabel sx={{ fontWeight: 500 }}>Approval Status</InputLabel>
                      <Select
                        value={filters.isApprovedByAdmin === undefined ? '' : filters.isApprovedByAdmin.toString()}
                        label="Approval Status"
                        onChange={(e) => handleFilterChange('isApprovedByAdmin', e.target.value === '' ? undefined : e.target.value === 'true')}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <MenuItem value="">All Status</MenuItem>
                        <MenuItem value="false">Pending</MenuItem>
                        <MenuItem value="true">Approved</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                      <InputLabel sx={{ fontWeight: 500 }}>Marksheet Status</InputLabel>
                      <Select
                        value={filters.isMarksheetGenerated === undefined ? '' : filters.isMarksheetGenerated.toString()}
                        label="Marksheet Status"
                        onChange={(e) => handleFilterChange('isMarksheetGenerated', e.target.value === '' ? undefined : e.target.value === 'true')}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <MenuItem value="">All Status</MenuItem>
                        <MenuItem value="false">Not Generated</MenuItem>
                        <MenuItem value="true">Generated</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <Box sx={{ 
                mt: 1.5, 
                pt: 1.5,
                borderTop: '1px solid #e2e8f0',
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1,
                alignItems: 'center',
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#64748b', 
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  Active filters:
                </Typography>
                {searchTerm && (
                  <Chip
                    label={`Search: "${searchTerm}"`}
                    onDelete={handleClearSearch}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderColor: '#3b82f6',
                      '& .MuiChip-deleteIcon': {
                        color: '#3b82f6',
                        '&:hover': {
                          color: '#2563eb',
                        },
                      },
                    }}
                  />
                )}
                {filters.programCategory && (
                  <Chip
                    label={`Category: ${filters.programCategory}`}
                    onDelete={() => handleProgramCategoryChange('')}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderColor: '#3b82f6',
                      '& .MuiChip-deleteIcon': {
                        color: '#3b82f6',
                        '&:hover': {
                          color: '#2563eb',
                        },
                      },
                    }}
                  />
                )}
                {filters.course && (
                  <Chip
                    label={`Course: ${filters.course}`}
                    onDelete={() => handleFilterChange('course', undefined)}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderColor: '#3b82f6',
                      '& .MuiChip-deleteIcon': {
                        color: '#3b82f6',
                        '&:hover': {
                          color: '#2563eb',
                        },
                      },
                    }}
                  />
                )}
                {filters.year && (
                  <Chip
                    label={`Year: ${filters.year}`}
                    onDelete={() => handleFilterChange('year', undefined)}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderColor: '#3b82f6',
                      '& .MuiChip-deleteIcon': {
                        color: '#3b82f6',
                        '&:hover': {
                          color: '#2563eb',
                        },
                      },
                    }}
                  />
                )}
                {filters.session && (
                  <Chip
                    label={`Session: ${filters.session}`}
                    onDelete={() => handleFilterChange('session', undefined)}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderColor: '#3b82f6',
                      '& .MuiChip-deleteIcon': {
                        color: '#3b82f6',
                        '&:hover': {
                          color: '#2563eb',
                        },
                      },
                    }}
                  />
                )}
                {filters.isApprovedByAdmin !== undefined && (
                  <Chip
                    label={`Status: ${filters.isApprovedByAdmin ? 'Approved' : 'Pending'}`}
                    onDelete={() => handleFilterChange('isApprovedByAdmin', undefined)}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderColor: '#3b82f6',
                      '& .MuiChip-deleteIcon': {
                        color: '#3b82f6',
                        '&:hover': {
                          color: '#2563eb',
                        },
                      },
                    }}
                  />
                )}
                {filters.isMarksheetGenerated !== undefined && (
                  <Chip
                    label={`Marksheet: ${filters.isMarksheetGenerated ? 'Generated' : 'Not Generated'}`}
                    onDelete={() => handleFilterChange('isMarksheetGenerated', undefined)}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderColor: '#3b82f6',
                      '& .MuiChip-deleteIcon': {
                        color: '#3b82f6',
                        '&:hover': {
                          color: '#2563eb',
                        },
                      },
                    }}
                  />
                )}
              </Box>
            )}
          </CardContent>
        </Card>


        {/* Students Data Table */}
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        }}>
          <CardContent sx={{ 
            p: { xs: 2, sm: 3 }, 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            pb: { xs: 2, sm: 3 },
            minHeight: 0,
          }}>
            {/* Student Count Display */}
            <Box sx={{ 
              mb: 1, 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 1,
              flexShrink: 0,
              // pb: 2,
              borderBottom: '2px solid #e2e8f0',
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1e293b',
                  fontSize: { xs: '1.125rem', sm: '1.25rem' },
                }}
              >
                Students List
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#64748b', 
                    fontWeight: 500,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  Showing <Box component="strong" sx={{ color: '#3b82f6', fontWeight: 700 }}>{students.length}</Box> student{students.length !== 1 ? 's' : ''}
                  {pagination?.totalCount && pagination.totalCount > students.length && (
                    <span> of <Box component="strong" sx={{ color: '#3b82f6', fontWeight: 700 }}>{pagination.totalCount.toLocaleString()}</Box></span>
                  )}
                </Typography>
              </Box>
            </Box>
            
            <Box 
              ref={tableContainerRef}
              sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                overflow: 'hidden',
                minHeight: 0,
                position: 'relative',
              }}
            >
              {students.length === 0 && !isError ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center', 
                  alignItems: 'center',
                  flex: 1,
                  py: 8,
                  gap: 2,
                }}>
                  <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600 }}>
                    No students found
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    Try adjusting your search or filters
                  </Typography>
                </Box>
              ) : (
                <>
                  <Table
                    columns={columns}
                    rows={students}
                    stickyHeader={true}
                    lastRowRef={lastElementRef as React.RefObject<HTMLTableRowElement>}
                    tableContainerSx={{
                      height: '100%',
                      maxHeight: '100%',
                      borderRadius: 2,
                      boxShadow: 'none',
                      border: '1px solid #e2e8f0',
                      overflow: 'auto',
                      backgroundColor: '#ffffff',
                      '&::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f5f9',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#cbd5e1',
                        borderRadius: '4px',
                        '&:hover': {
                          background: '#94a3b8',
                        },
                      },
                    }}
                  />
                  
                  {isFetchingNextPage && (
                    <Box sx={{ 
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      p: 2,
                      backgroundColor: 'rgba(248, 250, 252, 0.95)',
                      backdropFilter: 'blur(4px)',
                      borderTop: '1px solid #e2e8f0',
                      zIndex: 10,
                    }}>
                      <CircularProgress size={24} sx={{ color: '#3b82f6' }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          ml: 1,
                          color: '#64748b',
                          fontWeight: 500,
                        }}
                      >
                        Loading more students...
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </CardContent>
        </Card>


        {/* Approve Student Confirmation Dialog */}
        <ConfirmationDialog
          open={approveDialogOpen}
          onClose={handleApproveCancel}
          onConfirm={handleApproveConfirm}
          title="Approve Student"
          message={`Are you sure you want to approve student ${selectedStudent?.candidateName} (${selectedStudent?.registrationNo})? This action cannot be undone.`}
          confirmText="Approve"
          cancelText="Cancel"
          isLoading={approveStudentMutation.isPending}
          severity="warning"
        />

        {/* Delete Student Confirmation Dialog */}
        <ConfirmationDialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Student"
          message={`Are you sure you want to delete student ${deletingStudent?.candidateName} (${deletingStudent?.registrationNo})? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteStudentMutation.isPending}
          severity="error"
        />

        {/* Editable Marksheet Dialog */}
        {selectedStudent && (
          <EditableMarksheetDialog
            open={approveMarksheetDialogOpen}
            onClose={handleApproveMarksheetDialogClose}
            studentId={selectedStudent.studentId || selectedStudent._id || selectedStudent.id}
            registrationNo={selectedStudent.registrationNo}
            studentName={selectedStudent.candidateName}
            marksheetId={selectedStudent.marksheetId}
          />
        )}
      </Container>
    </ErrorBoundary>
  );
};

export default ManageStudentsPage;
