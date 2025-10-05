import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  IconButton,
  CircularProgress,
  Alert,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useInfiniteStudents } from '../../hooks/useInfiniteStudents';
import Table, { type Column } from '../../components/core-components/Table';

const ManageStudentsPage = () => {
  const [filters] = useState({});
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    data: students,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } = useInfiniteStudents(filters, 10);

  // The useInfiniteData hook already returns flattened data
  const allStudents = students || [];

  // Debug logging
  useEffect(() => {
    console.log('Students data structure:', {
      students,
      allStudents,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
      isError,
      error,
      totalStudents: allStudents.length
    });
  }, [students, allStudents, hasNextPage, isFetchingNextPage, isLoading, isError, error]);

  // Test API call directly and check authentication
  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Testing API call directly...');
        console.log('Auth token:', localStorage.getItem('authToken'));
        console.log('User role:', localStorage.getItem('userRole'));
        console.log('Backend API:', import.meta.env.VITE_APP_ENDPOINT || 'https://mivpsa.in/');
        
        const { getStudentsData } = await import('../../api/studentsApi');
        const result = await getStudentsData(1, 10);
        console.log('Direct API call result:', result);
      } catch (error) {
        console.error('Direct API call error:', error);
        console.error('Error details:', {
          message: (error as any).message,
          response: (error as any).response?.data,
          status: (error as any).response?.status
        });
      }
    };
    testAPI();
  }, []);

  // Direct scroll event listener
  useEffect(() => {
    const tableContainer = tableContainerRef.current;
    if (!tableContainer) return;

    const handleDirectScroll = (event: Event) => {
      const target = event.target as HTMLDivElement;
      const { scrollTop, scrollHeight, clientHeight } = target;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      
      console.log('Direct scroll event:', {
        scrollTop,
        scrollHeight,
        clientHeight,
        distanceFromBottom,
        hasNextPage,
        isFetchingNextPage,
        isLoading
      });
      
      if (
        distanceFromBottom <= 100 &&
        hasNextPage &&
        !isFetchingNextPage &&
        !isLoading
      ) {
        console.log('Direct scroll: Fetching next page...');
        fetchNextPage();
      }
    };

    tableContainer.addEventListener('scroll', handleDirectScroll);
    
    return () => {
      tableContainer.removeEventListener('scroll', handleDirectScroll);
    };
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);



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
      width: '120px',
      align: 'center',
      getActions: (_row: any) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <IconButton
            size="small"
            sx={{
              color: '#3b82f6',
              '&:hover': { backgroundColor: '#eff6ff' },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color: '#ef4444',
              '&:hover': { backgroundColor: '#fee2e2' },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];
  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
    }}>


      {/* Debug Info - Remove this after testing */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Scroll Debug:</strong>
        <div>Students Count: {allStudents.length}</div>
        <div>Has Next Page: {hasNextPage ? 'Yes' : 'No'}</div>
        <div>Is Fetching Next: {isFetchingNextPage ? 'Yes' : 'No'}</div>
        <div>Is Loading: {isLoading ? 'Yes' : 'No'}</div>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => {
            console.log('Manual fetch test');
            console.log('hasNextPage:', hasNextPage);
            console.log('isFetchingNextPage:', isFetchingNextPage);
            console.log('isLoading:', isLoading);
            if (hasNextPage && !isFetchingNextPage && !isLoading) {
              console.log('Calling fetchNextPage...');
              fetchNextPage();
            } else {
              console.log('Cannot fetch next page - conditions not met');
            }
          }}
          sx={{ mt: 1 }}
        >
          Test Fetch Next Page
        </Button>
      </Alert>

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

      {/* Three Action Cards */}
      <Grid container spacing={3} sx={{ flexShrink: 0 }}>
        {/* Student Status Update */}
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
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={<Switch size="small" />}
                  label="FULL PAYMENT"
                  sx={{ width: '100%', justifyContent: 'space-between' }}
                />
              </Box>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#3b82f6',
                  '&:hover': { backgroundColor: '#2563eb' },
                  textTransform: 'none',
                  borderRadius: 2,
                  py: 1.5,
                }}
              >
                SAVE
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Results Management */}
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

        {/* Student Details */}
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
      </Grid>

      {/* Students Data Table - Takes remaining space */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 400 }}>
        {isLoading && !students?.length ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            flexGrow: 1,
            p: 4 
          }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Box sx={{ position: 'relative', height: '100%', flexGrow: 1 }}>
            <Box
              ref={tableContainerRef}
              sx={{
                height: '300px',
                overflow: 'auto',
                border: '1px solid #f1f5f9',
                borderRadius: 3,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
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
              }}
            >
              <Table
                columns={columns}
                rows={allStudents}
                stickyHeader={true}
                tableContainerSx={{
                  height: 'auto',
                  minHeight: 'auto',
                  maxHeight: 'none',
                  overflow: 'visible',
                  boxShadow: 'none',
                  border: 'none',
                }}
              />
            </Box>
            {isFetchingNextPage && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                p: 2,
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
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
        )}
      </Box>
    </Box>
  );
};

export default ManageStudentsPage;
