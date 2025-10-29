import { useState, useMemo } from 'react';
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
} from '@mui/material';
import { Search, Clear, FilterList } from '@mui/icons-material';
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

const ManageStudentsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<StudentsFilters>({});
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [approveMarksheetDialogOpen, setApproveMarksheetDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  // Debounced search term to avoid too many API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Update debounced search term after 500ms delay
  useMemo(() => {
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

  const { showToast } = useToast();

  // Get unique values for filter dropdowns
  const uniqueValues = useMemo(() => {
    const courses = [...new Set(students.map(s => s.course).filter(Boolean))];
    const faculties = [...new Set(students.map(s => s.faculty).filter(Boolean))];
    const streams = [...new Set(students.map(s => s.stream).filter(Boolean))];
    const years = [...new Set(students.map(s => s.year).filter(Boolean))];
    const sessions = [...new Set(students.map(s => s.session).filter(Boolean))];
    
    return { courses, faculties, streams, years, sessions };
  }, [students]);

  // Filter handlers
  const handleFilterChange = (key: keyof StudentsFilters, value: string | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
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
      field: 'faculty',
      headerName: 'Faculty',
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
      field: 'actions',
      headerName: 'Actions',
      width: '180px',
      align: 'center',
      getActions: (row: any) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {row.isApprovedByAdmin ? (
              <Button
                size="small"
                variant="contained"
                disabled
                sx={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  '&:disabled': {
                    backgroundColor: '#10b981',
                    color: 'white',
                    opacity: 0.8,
                  },
                }}
              >
                APPROVED
              </Button>
            ) : (
              <Button
                size="small"
                variant="contained"
                onClick={() => handleApproveClick(row)}
                disabled={approveStudentMutation.isPending}
                sx={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#d97706',
                  },
                  '&:disabled': {
                    backgroundColor: '#9ca3af',
                    color: 'white',
                  },
                }}
              >
                APPROVE
              </Button>
            )}
          </Box>
          
          {/* Approve Marksheet Button - Show only if isMarksheetGenerated is true */}
          {row.isMarksheetGenerated && (
            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {row.isMarksheetAndCertificateApproved ? (
                  <Button
                    size="small"
                    variant="contained"
                    disabled
                    sx={{
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      '&:disabled': {
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        opacity: 0.8,
                      },
                    }}
                  >
                    MARKSHEET APPROVED
                  </Button>
                ) : (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleApproveMarksheetClick(row)}
                    disabled={approveMarksheetMutation.isPending}
                    sx={{
                      backgroundColor: '#6366f1',
                      color: 'white',
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: '#4f46e5',
                      },
                      '&:disabled': {
                        backgroundColor: '#9ca3af',
                        color: 'white',
                      },
                    }}
                  >
                    APPROVE MARKSHEET
                  </Button>
                )}
              </Box>
              
              {/* Show Marksheet Button */}
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate(`/admin/view-marksheet/${row.studentId || row._id || row.id}`)}
                sx={{
                  borderColor: '#10b981',
                  color: '#10b981',
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#059669',
                    backgroundColor: '#ecfdf5',
                  },
                }}
              >
                SHOW MARKSHEET
              </Button>
            </Box>
          )}
        </Box>
      ),
    },
  ];
  return (
    <ErrorBoundary>
      <Box sx={{ 
        width: '100%', 
        // height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        overflow: 'hidden',
      }}>



      {/* Error Alert */}
      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load students data: {error?.message || 'Unknown error'}
          {(error as any)?.response?.status === 401 && (
            <div style={{ marginTop: 8 }}>
              <strong>Authentication Error:</strong> Please login again.
            </div>
          )}
          {(error as any)?.response?.status === 403 && (
            <div style={{ marginTop: 8 }}>
              <strong>Access Denied:</strong> You don't have permission to access this data.
            </div>
          )}
          {(error as any)?.code === 'NETWORK_ERROR' && (
            <div style={{ marginTop: 8 }}>
              <strong>Network Error:</strong> Please check your internet connection.
            </div>
          )}
        </Alert>
      )}

      {/* Search and Filter Section */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #f1f5f9' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FilterList sx={{ mr: 1, color: '#6b7280' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
              Search & Filters
            </Typography>
            {activeFiltersCount > 0 && (
              <Chip 
                label={`${activeFiltersCount} active`} 
                size="small" 
                color="primary" 
                sx={{ ml: 2 }} 
              />
            )}
          </Box>

          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search by name, registration number, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={handleClearSearch}
                      edge="end"
                      size="small"
                    >
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Filter Row */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Course</InputLabel>
                <Select
                  value={filters.course || ''}
                  label="Course"
                  onChange={(e) => handleFilterChange('course', e.target.value)}
                >
                  <MenuItem value="">All Courses</MenuItem>
                  {uniqueValues.courses.map((course) => (
                    <MenuItem key={course} value={course}>
                      {course}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Faculty</InputLabel>
                <Select
                  value={filters.faculty || ''}
                  label="Faculty"
                  onChange={(e) => handleFilterChange('faculty', e.target.value)}
                >
                  <MenuItem value="">All Faculties</MenuItem>
                  {uniqueValues.faculties.map((faculty) => (
                    <MenuItem key={faculty} value={faculty}>
                      {faculty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Stream</InputLabel>
                <Select
                  value={filters.stream || ''}
                  label="Stream"
                  onChange={(e) => handleFilterChange('stream', e.target.value)}
                >
                  <MenuItem value="">All Streams</MenuItem>
                  {uniqueValues.streams.map((stream) => (
                    <MenuItem key={stream} value={stream}>
                      {stream}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Year</InputLabel>
                <Select
                  value={filters.year || ''}
                  label="Year"
                  onChange={(e) => handleFilterChange('year', e.target.value)}
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
              <FormControl fullWidth size="small">
                <InputLabel>Session</InputLabel>
                <Select
                  value={filters.session || ''}
                  label="Session"
                  onChange={(e) => handleFilterChange('session', e.target.value)}
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
              <FormControl fullWidth size="small">
                <InputLabel>Approval Status</InputLabel>
                <Select
                  value={filters.isApprovedByAdmin === undefined ? '' : filters.isApprovedByAdmin.toString()}
                  label="Approval Status"
                  onChange={(e) => handleFilterChange('isApprovedByAdmin', e.target.value === '' ? undefined : e.target.value === 'true')}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="false">Pending</MenuItem>
                  <MenuItem value="true">Approved</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<Clear />}
                sx={{
                  height: '40px',
                  borderColor: '#d1d5db',
                  color: '#6b7280',
                  '&:hover': {
                    borderColor: '#9ca3af',
                    backgroundColor: '#f9fafb',
                  },
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#6b7280', mr: 1, alignSelf: 'center' }}>
                Active filters:
              </Typography>
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  onDelete={handleClearSearch}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.course && (
                <Chip
                  label={`Course: ${filters.course}`}
                  onDelete={() => handleFilterChange('course', undefined)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.faculty && (
                <Chip
                  label={`Faculty: ${filters.faculty}`}
                  onDelete={() => handleFilterChange('faculty', undefined)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.stream && (
                <Chip
                  label={`Stream: ${filters.stream}`}
                  onDelete={() => handleFilterChange('stream', undefined)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.year && (
                <Chip
                  label={`Year: ${filters.year}`}
                  onDelete={() => handleFilterChange('year', undefined)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.session && (
                <Chip
                  label={`Session: ${filters.session}`}
                  onDelete={() => handleFilterChange('session', undefined)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.isApprovedByAdmin !== undefined && (
                <Chip
                  label={`Status: ${filters.isApprovedByAdmin ? 'Approved' : 'Pending'}`}
                  onDelete={() => handleFilterChange('isApprovedByAdmin', undefined)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* <Grid container spacing={3} sx={{ flexShrink: 0 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  textAlign:"center",
                  fontWeight: 'bold',
                  color: '#1e293b',
                  mb: 3,
                }}
              >
                Student Status Update
              </Typography>
              <TextField
                fullWidth
                label="Registration Number"
                variant="outlined"
                value={registrationNo}
                onChange={(e) => setRegistrationNo(e.target.value)}
                sx={{ mb: 3 }}
                disabled={isUpdating}
                placeholder="Enter registration number"
              />
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch 
                      size="small" 
                      checked={fullPayment}
                      onChange={(e) => setFullPayment(e.target.checked)}
                      disabled={isUpdating}
                    />
                  }
                  label="FULL PAYMENT"
                  sx={{ width: '100%', justifyContent: 'space-between', }}
                />
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleStatusUpdate}
                disabled={isUpdating || !registrationNo.trim()}
                sx={{
                  backgroundColor: '#3b82f6',
                  '&:hover': { backgroundColor: '#2563eb' },
                  '&:disabled': { backgroundColor: '#9ca3af' },
                  textTransform: 'none',
                  borderRadius: 2,
                  py: 1.5,
                }}
              >
                {isUpdating ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} color="inherit" />
                    Updating...
                  </Box>
                ) : (
                  'SAVE'
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  textAlign:"center",
                  fontWeight: 'bold',
                  color: '#1e293b',
                  mb: 3,
                }}
              >
                Results Management
              </Typography>
              <TextField
                fullWidth
                label="STUDENTS ID"
                variant="outlined"
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#10b981',
                    '&:hover': { backgroundColor: '#059669' },
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5,
                  }}
                >
                  UPLOAD RESULT
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    '&:hover': { 
                      borderColor: '#2563eb',
                      backgroundColor: '#eff6ff',
                    },
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5,
                  }}
                >
                  EDIT RESULT
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9',
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  textAlign:"center",
                  fontWeight: 'bold',
                  color: '#1e293b',
                  mb: 3,
                }}
              >
                Student Details
              </Typography>
              <TextField
                fullWidth
                label="STUDENTS ID"
                variant="outlined"
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#8b5cf6',
                    '&:hover': { backgroundColor: '#7c3aed' },
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5,
                  }}
                >
                  View Forms
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#f59e0b',
                    color: '#f59e0b',
                    '&:hover': { 
                      borderColor: '#d97706',
                      backgroundColor: '#fffbeb',
                    },
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1.5,
                  }}
                >
                  VIEW ID CARD
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid> */}

      {/* Students Data Table - Takes remaining space */}
      <Box sx={{ }}>
        {isError ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            flexGrow: 1,
            p: 4 ,
            height: '90%',
          }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Box 
            ref={tableContainerRef}
            sx={{ height: '95%', display: 'flex', flexDirection: 'column', flex: 1 }}
          >
            {/* Student Count Display */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                Students List
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Showing <strong style={{ color: '#3b82f6' }}>{students.length}</strong> student{students.length !== 1 ? 's' : ''}
                  {pagination?.totalCount && pagination.totalCount > students.length && (
                    <span> of <strong style={{ color: '#3b82f6' }}>{pagination.totalCount.toLocaleString()}</strong></span>
                  )}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Table
                columns={columns}
                rows={students}
                stickyHeader={true}
                lastRowRef={lastElementRef as React.RefObject<HTMLTableRowElement>}
                tableContainerSx={{
                  height: '100%',
                  maxHeight: '100%',
                borderRadius: 3,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f1f5f9',
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#c1c1c1',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#a8a8a8',
                },
                '& .MuiTable-root': {
                  '& .MuiTableHead-root': {
                    '& .MuiTableCell-root': {
                      backgroundColor: '#f5f5f5',
                      color: '#333',
                      fontWeight: 'bold',
                      borderBottom: '2px solid #e0e0e0',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    },
                  },
                  '& .MuiTableBody-root': {
                    '& .MuiTableRow-root': {
                      '&:hover': {
                        backgroundColor: '#e3f2fd !important',
                      },
                      '& .MuiTableCell-root': {
                        borderBottom: '1px solid #f0f0f0',
                      },
                    },
                  },
                },
              }}
            />
            
            {isFetchingNextPage && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                p: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(4px)',
                zIndex: 2,
              }}>
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Loading more students...
                </Typography>
              </Box>
            )}
            </Box>
          </Box>
        )}
      </Box>


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
    </Box>
    </ErrorBoundary>
  );
};

export default ManageStudentsPage;
