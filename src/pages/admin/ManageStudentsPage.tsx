import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useStudentsData } from '../../hooks/useStudentsData';
import { useApproveStudent } from '../../hooks/useApproveStudent';
import { useApproveMarksheet } from '../../hooks/useApproveMarksheet';
import { useToast } from '../../contexts/ToastContext';
import { useQueryClient } from '@tanstack/react-query';
import Table, { type Column } from '../../components/core-components/Table';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import ErrorBoundary from '../../components/ErrorBoundary';

const ManageStudentsPage = () => {
  const navigate = useNavigate();
  const [searchTerm] = useState('');
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [approveMarksheetDialogOpen, setApproveMarksheetDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  const { 
    students, 
    lastElementRef,
    tableContainerRef,
    isError, 
    error, 
    isFetchingNextPage
  } = useStudentsData({ limit: 10 });


  const approveStudentMutation = useApproveStudent();
  const approveMarksheetMutation = useApproveMarksheet();
  const queryClient = useQueryClient();

  const { showToast } = useToast();

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registrationNo.includes(searchTerm) ||
    student.emailAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );



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

  // Handle approve marksheet
  const handleApproveMarksheetClick = (student: any) => {
    setSelectedStudent(student);
    setApproveMarksheetDialogOpen(true);
  };

  const handleApproveMarksheetConfirm = () => {
    if (selectedStudent) {
      approveMarksheetMutation.mutate(
        { registrationNo: selectedStudent.registrationNo },
        {
          onSuccess: (data: any) => {
            showToast(data.message || 'Marksheet approved successfully!', 'success');
            queryClient.invalidateQueries({ queryKey: ['students'] });
            setApproveMarksheetDialogOpen(false);
            setSelectedStudent(null);
          },
          onError: (error: any) => {
            showToast(error?.message || 'Failed to approve marksheet', 'error');
            setApproveMarksheetDialogOpen(false);
            setSelectedStudent(null);
          },
        }
      );
    }
  };

  const handleApproveMarksheetCancel = () => {
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
                {row.isMarksheetApproved ? (
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
                onClick={() => navigate(`/admin/view-marksheet/${row.registrationNo}`)}
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
            sx={{ height: '95%', display: 'flex', flexDirection: 'column' }}
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

      {/* Approve Marksheet Confirmation Dialog */}
      <ConfirmationDialog
        open={approveMarksheetDialogOpen}
        onClose={handleApproveMarksheetCancel}
        onConfirm={handleApproveMarksheetConfirm}
        title="Approve Marksheet"
        message={`Are you sure you want to approve marksheet for student ${selectedStudent?.candidateName} (${selectedStudent?.registrationNo})? This action cannot be undone.`}
        confirmText="Approve"
        cancelText="Cancel"
        isLoading={approveMarksheetMutation.isPending}
        severity="info"
      />
    </Box>
    </ErrorBoundary>
  );
};

export default ManageStudentsPage;
