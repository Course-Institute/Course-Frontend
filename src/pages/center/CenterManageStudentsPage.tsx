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
import { Search, Clear, FilterList, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useCenterStudentsData } from '../../hooks/useCenterStudentsData';
import { useToast } from '../../contexts/ToastContext';
import Table, { type Column } from '../../components/core-components/Table';
import ErrorBoundary from '../../components/ErrorBoundary';
import MarksheetPreviewDialog from '../../components/MarksheetPreviewDialog';
import { programsData } from '../../constants/programsData';

const CenterManageStudentsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');
  const [centerInfo, setCenterInfo] = useState<{ centerId: string; centerName: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [filtersExpanded, setFiltersExpanded] = useState(!isMobile);
  
  // Filter state - client-side filtering since API doesn't support filters yet
  const [programCategory, setProgramCategory] = useState<string>('');
  const [course, setCourse] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [session, setSession] = useState<string>('');
  const [isMarksheetGenerated, setIsMarksheetGenerated] = useState<string>('');
  
  // Debounced search term to avoid too many re-renders
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  const { showToast } = useToast();

  useEffect(() => {
    // Get center information from localStorage
    const centerId = localStorage.getItem('centerId');
    const centerName = localStorage.getItem('centerName');
    
    if (centerId && centerName) {
      setCenterInfo({ centerId, centerName });
    } else {
      showToast('Center information not found. Please login again.', 'error');
    }
    setIsLoading(false);
  }, [showToast]);

  // Update debounced search term after 500ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Only call the hook when we have a valid centerId
  const { 
    students: allStudents, 
    pagination,
    lastElementRef,
    tableContainerRef,
    isError, 
    error, 
    isFetchingNextPage,
    isLoading: studentsLoading
  } = useCenterStudentsData({ 
    centerId: centerInfo?.centerId || '', 
    limit: 10 
  });

  // Client-side filtering
  const students = useMemo(() => {
    let filtered = allStudents || [];

    // Search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(student =>
        student.candidateName?.toLowerCase().includes(searchLower) ||
        student.registrationNo?.includes(searchLower) ||
        student.emailAddress?.toLowerCase().includes(searchLower)
      );
    }

    // Course filter
    if (course) {
      filtered = filtered.filter(student => student.course === course);
    }

    // Year filter
    if (year) {
      filtered = filtered.filter(student => student.year === year);
    }

    // Session filter
    if (session) {
      filtered = filtered.filter(student => student.session === session);
    }

    // Marksheet status filter
    if (isMarksheetGenerated) {
      const isGenerated = isMarksheetGenerated === 'true';
      filtered = filtered.filter(student => student.isMarksheetGenerated === isGenerated);
    }

    return filtered;
  }, [allStudents, debouncedSearchTerm, course, year, session, isMarksheetGenerated]);

  // Get unique values for filter dropdowns
  const uniqueValues = useMemo(() => {
    const courses = [...new Set(allStudents.map(s => s.course).filter(Boolean))];
    const years = [...new Set(allStudents.map(s => s.year).filter(Boolean))];
    const sessions = [...new Set(allStudents.map(s => s.session).filter(Boolean))];
    
    // Get all program categories from programsData
    const programCategories = programsData.map(program => program.category);
    
    return { 
      courses, 
      years, 
      sessions, 
      programCategories: [...new Set(programCategories)],
    };
  }, [allStudents]);

  // Handle program category change - filter courses based on selected category
  const handleProgramCategoryChange = (category: string) => {
    setProgramCategory(category);
    setCourse(''); // Reset course when category changes
  };

  // Get courses for selected program category
  const getCoursesForCategory = (category: string) => {
    if (!category) return uniqueValues.courses;
    const program = programsData.find(p => p.category === category);
    if (!program) return [];
    return program.levels.flatMap(level => 
      level.courses.map(course => course.name)
    );
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setProgramCategory('');
    setCourse('');
    setYear('');
    setSession('');
    setIsMarksheetGenerated('');
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    return [
      searchTerm,
      programCategory,
      course,
      year,
      session,
      isMarksheetGenerated,
    ].filter(Boolean).length;
  }, [searchTerm, programCategory, course, year, session, isMarksheetGenerated]);

  // Define table columns matching backend data structure
  const columns: Column[] = [
    {
      field: 'registrationNo',
      headerName: 'Registration No.',
      width: '140px',
      renderCell: (value: string) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#3b82f6', fontSize: '0.875rem' }}>
          {value}
        </Typography>
      ),
    },
    {
      field: 'candidateName',
      headerName: 'Student Name',
      minWidth: '150px',
      flex: 1,
      renderCell: (value: string) => (
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
          {value}
        </Typography>
      ),
    },
    {
      field: 'dateOfBirth',
      headerName: 'DOB',
      width: '100px',
      align: 'center',
      renderCell: (value: string) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {value ? new Date(value).toLocaleDateString('en-GB') : 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'course',
      headerName: 'Course',
      width: '120px',
      renderCell: (value: string) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {value}
        </Typography>
      ),
    },
    {
      field: 'year',
      headerName: 'Year',
      width: '80px',
      align: 'center',
      renderCell: (value: string) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {value}
        </Typography>
      ),
    },
    {
      field: 'session',
      headerName: 'Session',
      width: '80px',
      align: 'center',
      renderCell: (value: string) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {value}
        </Typography>
      ),
    },
    {
      field: 'contactNumber',
      headerName: 'Contact',
      width: '120px',
      align: 'center',
      renderCell: (value: string) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {value}
        </Typography>
      ),
    },
    {
      field: 'emailAddress',
      headerName: 'Email',
      minWidth: '180px',
      renderCell: (value: string) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#64748b' }}>
          {value}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Admission Date',
      width: '120px',
      align: 'center',
      renderCell: (value: string) => {
        const date = new Date(value);
        return (
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            {date.toLocaleDateString('en-GB')}
          </Typography>
        );
      },
    },
    {
      field: 'approvalStatus',
      headerName: 'Approval Status',
      width: '120px',
      align: 'center',
      renderCell: (_value: any, row: any) => (
        <Typography
          variant="body2"
          sx={{
            color: row.isApprovedByAdmin ? '#10b981' : '#f59e0b',
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
          }}
        >
          {row.isApprovedByAdmin ? 'Approved' : 'Pending'}
        </Typography>
      ),
    },
    {
      field: 'marksheetStatus',
      headerName: 'Marksheet Status',
      width: '140px',
      align: 'center',
      renderCell: (_value: any, row: any) => {
        if (row.isMarksheetGenerated) {
          return (
            <Typography
              variant="body2"
              sx={{
                color: row.isMarksheetAndCertificateApproved ? '#10b981' : '#f59e0b',
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
              }}
            >
              {row.isMarksheetAndCertificateApproved ? 'Approved' : 'Pending'}
            </Typography>
          );
        }
        return (
          <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
            Not Generated
          </Typography>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: '150px',
      align: 'center',
      getActions: (row: any) => {
        // Check if student has whichSemesterMarksheetIsGenerated array
        const semestersWithMarksheet: string[] = row.whichSemesterMarksheetIsGenerated || [];
        const approvedSemesters: string[] = row.approvedSemesters || [];
        
        // For backward compatibility: if approvedSemesters is empty but isMarksheetAndCertificateApproved is true,
        // treat all semesters as approved
        const allSemestersApproved = row.isMarksheetAndCertificateApproved && approvedSemesters.length === 0;
        
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            {row.isMarksheetGenerated && semestersWithMarksheet.length > 0 ? (
              semestersWithMarksheet.length > 1 ? (
                // Multiple semesters - show all with different labels for approved/unapproved
                semestersWithMarksheet.map((sem: string) => {
                  const isApproved = allSemestersApproved || approvedSemesters.includes(sem);
                  return (
                    <Button
                      key={sem}
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/center/view-marksheet/${row.studentId || row._id || row.id}/${sem}`)}
                      sx={{
                        borderColor: isApproved ? '#10b981' : '#3b82f6',
                        color: isApproved ? '#10b981' : '#3b82f6',
                        textTransform: 'none',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        px: 1.5,
                        py: 0.4,
                        borderRadius: 2,
                        minWidth: 100,
                        '&:hover': {
                          borderColor: isApproved ? '#059669' : '#2563eb',
                          backgroundColor: isApproved ? '#ecfdf5' : '#eff6ff',
                        },
                      }}
                    >
                      {isApproved ? `Sem ${sem}` : `View Marks ${sem}`}
                    </Button>
                  );
                })
              ) : (
                // Single semester
                (() => {
                  const sem = semestersWithMarksheet[0];
                  const isApproved = allSemestersApproved || approvedSemesters.includes(sem);
                  return (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/center/view-marksheet/${row.studentId || row._id || row.id}/${sem}`)}
                      sx={{
                        borderColor: isApproved ? '#10b981' : '#3b82f6',
                        color: isApproved ? '#10b981' : '#3b82f6',
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        '&:hover': {
                          borderColor: isApproved ? '#059669' : '#2563eb',
                          backgroundColor: isApproved ? '#ecfdf5' : '#eff6ff',
                        },
                      }}
                    >
                      {isApproved ? 'VIEW MARKSHEET' : 'VIEW MARKS'}
                    </Button>
                  );
                })()
              )
            ) : row.isMarksheetGenerated ? (
              // Fallback for backward compatibility
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate(`/center/view-marksheet/${row.studentId || row._id || row.id}/1`)}
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
                VIEW MARKSHEET
              </Button>
            ) : null}
          </Box>
        );
      },
    },
  ];

  if (isLoading || studentsLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading students...</Typography>
      </Box>
    );
  }

  if (!centerInfo) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Center information not found. Please login again.
        </Alert>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Container maxWidth={false} sx={{ 
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1.5, sm: 2 },
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
      }}>
        {/* Error Alert */}
        {isError && (
          <Fade in={isError}>
            <Alert 
              severity="error" 
              sx={{ 
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
                        value={programCategory}
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
                        value={course}
                        label="Course"
                        onChange={(e) => setCourse(e.target.value)}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <MenuItem value="">All Courses</MenuItem>
                        {getCoursesForCategory(programCategory).map((courseName) => (
                          <MenuItem key={courseName} value={courseName}>
                            {courseName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                    <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                      <InputLabel sx={{ fontWeight: 500 }}>Year</InputLabel>
                      <Select
                        value={year}
                        label="Year"
                        onChange={(e) => setYear(e.target.value)}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <MenuItem value="">All Years</MenuItem>
                        {uniqueValues.years.map((yearValue) => (
                          <MenuItem key={yearValue} value={yearValue}>
                            {yearValue}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
                    <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                      <InputLabel sx={{ fontWeight: 500 }}>Session</InputLabel>
                      <Select
                        value={session}
                        label="Session"
                        onChange={(e) => setSession(e.target.value)}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <MenuItem value="">All Sessions</MenuItem>
                        {uniqueValues.sessions.map((sessionValue) => (
                          <MenuItem key={sessionValue} value={sessionValue}>
                            {sessionValue}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                      <InputLabel sx={{ fontWeight: 500 }}>Marksheet Status</InputLabel>
                      <Select
                        value={isMarksheetGenerated}
                        label="Marksheet Status"
                        onChange={(e) => setIsMarksheetGenerated(e.target.value)}
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
                        '&:hover': { color: '#2563eb' },
                      },
                    }}
                  />
                )}
                {programCategory && (
                  <Chip
                    label={`Category: ${programCategory}`}
                    onDelete={() => handleProgramCategoryChange('')}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderColor: '#3b82f6',
                      '& .MuiChip-deleteIcon': {
                        color: '#3b82f6',
                        '&:hover': { color: '#2563eb' },
                      },
                    }}
                  />
                )}
                {course && (
                  <Chip
                    label={`Course: ${course}`}
                    onDelete={() => setCourse('')}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderColor: '#3b82f6',
                      '& .MuiChip-deleteIcon': {
                        color: '#3b82f6',
                        '&:hover': { color: '#2563eb' },
                      },
                    }}
                  />
                )}
                {year && (
                  <Chip
                    label={`Year: ${year}`}
                    onDelete={() => setYear('')}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderColor: '#3b82f6',
                      '& .MuiChip-deleteIcon': {
                        color: '#3b82f6',
                        '&:hover': { color: '#2563eb' },
                      },
                    }}
                  />
                )}
                {session && (
                  <Chip
                    label={`Session: ${session}`}
                    onDelete={() => setSession('')}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderColor: '#3b82f6',
                      '& .MuiChip-deleteIcon': {
                        color: '#3b82f6',
                        '&:hover': { color: '#2563eb' },
                      },
                    }}
                  />
                )}
                {isMarksheetGenerated && (
                  <Chip
                    label={`Marksheet: ${isMarksheetGenerated === 'true' ? 'Generated' : 'Not Generated'}`}
                    onDelete={() => setIsMarksheetGenerated('')}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderColor: '#3b82f6',
                      '& .MuiChip-deleteIcon': {
                        color: '#3b82f6',
                        '&:hover': { color: '#2563eb' },
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
              pb: 1.5,
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
                Students List - {centerInfo.centerName}
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
                      '& .MuiTable-root': {
                        tableLayout: 'fixed',
                        width: '100%',
                      },
                      '& .MuiTableCell-root': {
                        padding: { xs: '8px 4px', sm: '12px 8px' },
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      },
                      '& .MuiTableHead-root .MuiTableCell-root': {
                        backgroundColor: '#f8fafc',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: '#374151',
                        borderBottom: '2px solid #e5e7eb',
                      },
                      '& .MuiTableBody-root .MuiTableRow-root': {
                        '&:hover': {
                          backgroundColor: '#f9fafb',
                        },
                        '&:nth-of-type(even)': {
                          backgroundColor: '#fafafa',
                        },
                      },
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

        {/* Marksheet Preview Dialog */}
        <MarksheetPreviewDialog
          open={previewDialogOpen}
          onClose={() => {
            setPreviewDialogOpen(false);
            setSelectedStudentId('');
          }}
          marksheetId={selectedStudentId}
        />
      </Container>
    </ErrorBoundary>
  );
};

export default CenterManageStudentsPage;
