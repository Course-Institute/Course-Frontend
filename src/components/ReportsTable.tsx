import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  useTheme,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Download,
  Visibility,
} from '@mui/icons-material';
import type { ReportStudent } from '../hooks/useReportsData';

interface ReportsTableProps {
  students: ReportStudent[];
  lastElementRef?: React.RefObject<HTMLDivElement | null>;
  tableContainerRef?: React.RefObject<HTMLDivElement | null>;
  isFetchingNextPage?: boolean;
}

const ReportsTable = ({ 
  students, 
  lastElementRef, 
  tableContainerRef, 
  isFetchingNextPage = false 
}: ReportsTableProps) => {
  const theme = useTheme();

  const getResultStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'uploaded':
        return 'info';
      case 'pending':
        return 'warning';
      case 'not_available':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'partial':
        return 'warning';
      case 'pending':
        return 'error';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string, type: 'payment' | 'results') => {
    if (type === 'payment') {
      switch (status) {
        case 'completed': return 'Completed';
        case 'partial': return 'Partial';
        case 'pending': return 'Pending';
        case 'overdue': return 'Overdue';
        default: return status;
      }
    } else {
      switch (status) {
        case 'published': return 'Published';
        case 'uploaded': return 'Uploaded';
        case 'pending': return 'Pending';
        case 'not_available': return 'Not Available';
        default: return status;
      }
    }
  };

  const handleDownloadStudentReport = (studentId: string, studentName: string) => {
    // TODO: Implement individual student report download
    console.log(`Downloading report for student: ${studentName} (${studentId})`);
  };

  const handleViewDetails = (studentId: string) => {
    // TODO: Implement view student details
    console.log(`Viewing details for student: ${studentId}`);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Table - Takes remaining space */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <TableContainer 
          ref={tableContainerRef}
          component={Paper} 
          sx={{ 
            flexGrow: 1,
            height: '100%',
            maxHeight: 'calc(100vh - 400px)', // Prevent overflow
            borderRadius: 3,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f1f5f9',
            overflow: 'auto',
            boxSizing: 'border-box',
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
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Registration No</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Faculty</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Payment Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Results Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Total Paid</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Grade</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No students found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student, index) => {
                  const isLastRow = index === students.length - 1;
                  return (
                    <TableRow 
                      key={student._id || index}
                      ref={isLastRow ? (lastElementRef as React.RefObject<HTMLTableRowElement>) : null}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: theme.palette.grey[50] 
                        } 
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {student.registrationNo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {student.candidateName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {student.course} - {student.stream}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {student.faculty}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(student.paymentStatus, 'payment')}
                          color={getPaymentStatusColor(student.paymentStatus) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(student.resultsStatus, 'results')}
                          color={getResultStatusColor(student.resultsStatus) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          ₹{student.totalPaid || '0'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {student.grade || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(student._id)}
                              sx={{ color: theme.palette.primary.main }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download Report">
                            <IconButton
                              size="small"
                              onClick={() => handleDownloadStudentReport(student._id, student.candidateName)}
                              sx={{ color: theme.palette.success.main }}
                            >
                              <Download fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Loading indicator for infinite scroll */}
        {isFetchingNextPage && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 2,
            borderTop: '1px solid #f1f5f9',
          }}>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Loading more reports...
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReportsTable;