import { useState } from 'react';
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
  Snackbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useStudentsData } from '../../hooks/useStudentsData';
import { useStudentStatusUpdate } from '../../hooks/useStudentStatusUpdate';
import Table, { type Column } from '../../components/core-components/Table';
import ErrorBoundary from '../../components/ErrorBoundary';

const ManageStudentsPage = () => {
  const [searchTerm] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [fullPayment, setFullPayment] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  const { 
    students, 
    lastElementRef,
    tableContainerRef,
    isError, 
    error, 
    isFetchingNextPage
  } = useStudentsData({ limit: 10 });

  const { 
    updateStudentStatus, 
    isUpdating
  } = useStudentStatusUpdate();

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registrationNo.includes(searchTerm) ||
    student.emailAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle status update
  const handleStatusUpdate = () => {
    if (!registrationNo.trim()) {
      setSnackbarMessage('Please enter registration number');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    updateStudentStatus({
      registrationNo: registrationNo.trim(),
      fullPayment,
    }, {
      onSuccess: () => {
        setSnackbarMessage('Student status updated successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        // Reset form
        setRegistrationNo('');
        setFullPayment(false);
      },
      onError: (error: any) => {
        setSnackbarMessage(error?.message || 'Failed to update student status');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    });
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
    <ErrorBoundary>
      <Box sx={{ 
        width: '100%', 
        // height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        overflow: 'hidden',
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
      <Box sx={{ }}>
        {isError ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            flexGrow: 1,
            p: 4 ,
            height: '500px',
          }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Box 
            ref={tableContainerRef}
            sx={{    height: '500px', display: 'flex', flexDirection: 'column' }}
          >
            <Table
              columns={columns}
              rows={filteredStudents}
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
        )}
      </Box>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
    </ErrorBoundary>
  );
};

export default ManageStudentsPage;
