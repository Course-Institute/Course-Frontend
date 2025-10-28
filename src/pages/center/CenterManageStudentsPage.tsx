import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useCenterStudentsData } from '../../hooks/useCenterStudentsData';
import { useToast } from '../../contexts/ToastContext';
import Table, { type Column } from '../../components/core-components/Table';
import ErrorBoundary from '../../components/ErrorBoundary';
import MarksheetPreviewDialog from '../../components/MarksheetPreviewDialog';

const CenterManageStudentsPage = () => {
  const navigate = useNavigate();
  const [searchTerm] = useState('');
  const [centerInfo, setCenterInfo] = useState<{ centerId: string; centerName: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  
  const { showToast } = useToast();

  useEffect(() => {
    // Get center information from localStorage
    const centerId = localStorage.getItem('centerId');
    const centerName = localStorage.getItem('centerName');
    
    console.log('CenterManageStudentsPage - centerId from localStorage:', centerId);
    console.log('CenterManageStudentsPage - centerName from localStorage:', centerName);
    
    if (centerId && centerName) {
      setCenterInfo({ centerId, centerName });
    } else {
      showToast('Center information not found. Please login again.', 'error');
    }
    setIsLoading(false);
  }, [showToast]);

  // Only call the hook when we have a valid centerId
  const { 
    students, 
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

  // Filter students based on search term
  const filteredStudents = students?.filter(student =>
    student.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registrationNo.includes(searchTerm) ||
    student.emailAddress.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
      field: 'dateOfBirth',
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
          {row.isApprovedByAdmin ? 'Approved' : 'Not Approved'}
        </Typography>
      ),
    },
    {
      field: 'marksheetStatus',
      headerName: 'Marksheet Status',
      width: '140px',
      align: 'center',
      renderCell: (_value: any, row: any) => {
        // Only show if marksheet is generated
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
              {row.isMarksheetAndCertificateApproved ? 'Approved' : 'Not Approved'}
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
      getActions: (row: any) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
          {/* Show Marksheet Button - Show only if isMarksheetGenerated is true */}
          {row.isMarksheetGenerated && (
            <>
              {row.isMarksheetAndCertificateApproved ? (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate(`/center/view-marksheet/${row.studentId || row._id || row.id}`)}
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
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    const idToUse = row.studentId || row._id || '';
                    setSelectedStudentId(idToUse);
                    setPreviewDialogOpen(true);
                  }}
                  sx={{
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: '#2563eb',
                      backgroundColor: '#eff6ff',
                    },
                  }}
                >
                  PREVIEW MARKSHEET
                </Button>
              )}
            </>
          )}
        </Box>
      ),
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
      <Box sx={{ 
        width: '100%', 
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        overflow: 'hidden',
      }}>
        {/* Page Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#1e293b',
            flexShrink: 0,
          }}
        >
          Manage Students - {centerInfo.centerName}
        </Typography>

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

        {/* Students Data Table */}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          {isError ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              flexGrow: 1,
              p: 4,
              height: '90%',
            }}>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <Box 
              ref={tableContainerRef}
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <Table
                columns={columns}
                rows={filteredStudents || []}
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

        {/* Marksheet Preview Dialog */}
        <MarksheetPreviewDialog
          open={previewDialogOpen}
          onClose={() => {
            setPreviewDialogOpen(false);
            setSelectedStudentId('');
          }}
          marksheetId={selectedStudentId}
        />
      </Box>
    </ErrorBoundary>
  );
};

export default CenterManageStudentsPage;