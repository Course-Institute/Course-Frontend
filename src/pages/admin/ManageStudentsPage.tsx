import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Chip,
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
  Check as ApproveIcon,
  Close as RejectIcon,
} from '@mui/icons-material';
import { useStudentsData } from '../../hooks/useStudentsData';
import Table, { type Column } from '../../components/core-components/Table';

const ManageStudentsPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const { data: studentsData, isLoading, isError, error } = useStudentsData({ page, limit });

  // Update allStudents when new data arrives
  useEffect(() => {
    if (studentsData?.data) {
      if (page === 1) {
        setAllStudents(studentsData.data);
      } else {
        setAllStudents(prev => [...prev, ...studentsData.data]);
      }
      setHasMore(studentsData.data.length === limit);
    }
  }, [studentsData, page, limit]);

  // Infinite scroll handler
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loadingMore && !isLoading) {
      setLoadingMore(true);
      setPage(prev => prev + 1);
    }
  }, [hasMore, loadingMore, isLoading]);

  // Reset loading more when new data arrives
  useEffect(() => {
    if (studentsData) {
      setLoadingMore(false);
    }
  }, [studentsData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'ID Generated':
        return 'info';
      default:
        return 'default';
    }
  };

  const getFeeStatusColor = (feeStatus: string) => {
    switch (feeStatus) {
      case 'Full Payment':
        return 'success';
      case 'Partial':
        return 'warning';
      case 'Pending':
        return 'error';
      default:
        return 'default';
    }
  };

  // Define table columns
  const columns: Column[] = [
    {
      field: 'studentId',
      headerName: 'Student ID',
      width: '120px',
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: '150px',
    },
    {
      field: 'course',
      headerName: 'Course',
      minWidth: '120px',
    },
    {
      field: 'semester',
      headerName: 'Semester',
      width: '100px',
      align: 'center',
    },
    {
      field: 'admissionYear',
      headerName: 'Admission Year',
      width: '120px',
      align: 'center',
    },
    {
      field: 'center',
      headerName: 'Center',
      minWidth: '120px',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: '120px',
      align: 'center',
      renderCell: (value: string) => (
        <Chip
          label={value}
          size="small"
          color={getStatusColor(value) as any}
          variant="outlined"
        />
      ),
    },
    {
      field: 'feeStatus',
      headerName: 'Fee Status',
      width: '120px',
      align: 'center',
      renderCell: (value: string) => (
        <Chip
          label={value}
          size="small"
          color={getFeeStatusColor(value) as any}
          variant="outlined"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: '120px',
      align: 'center',
      getActions: (row: any) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {row.status === 'Pending' ? (
            <>
              <IconButton
                size="small"
                sx={{
                  color: '#10b981',
                  '&:hover': { backgroundColor: '#dcfce7' },
                }}
              >
                <ApproveIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: '#ef4444',
                  '&:hover': { backgroundColor: '#fee2e2' },
                }}
              >
                <RejectIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <>
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
            </>
          )}
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


      {/* Error Alert */}
      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load students data: {error?.message || 'Unknown error'}
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
        {isLoading && page === 1 ? (
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
          <Box 
            sx={{ position: 'relative', height: '100%' }}
            onScroll={handleScroll}
          >
            <Table
              columns={columns}
              rows={allStudents}
              stickyHeader={true}
              tableContainerSx={{
                height: '100%',
                minHeight: '400px',
                maxHeight: '600px',
                borderRadius: 3,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f1f5f9',
                overflow: 'auto',
                flexGrow: 1,
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
            {loadingMore && (
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
