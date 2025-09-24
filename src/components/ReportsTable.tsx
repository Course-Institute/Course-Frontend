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
} from '@mui/material';
import { type ReportStudent } from '../hooks/useReportsData';

interface ReportsTableProps {
  students: ReportStudent[];
  isLoading?: boolean;
}

const ReportsTable = ({ students, isLoading = false }: ReportsTableProps) => {
  const theme = useTheme();

  const getResultStatusColor = (status: string) => {
    switch (status) {
      case 'Result Ready':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Not Available':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    const amount = parseInt(status.replace('₹', '').replace(',', ''));
    if (amount === 0) return 'error';
    if (amount < 20000) return 'warning';
    return 'success';
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: 400,
        p: 4 
      }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Table - Takes remaining space */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <TableContainer 
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
                <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Semester</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Year</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Center</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Payment Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Result Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No students found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow
                    key={student.id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.grey[50],
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {student.studentId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {student.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>{student.semester}</TableCell>
                    <TableCell>{student.year}</TableCell>
                    <TableCell>{student.center}</TableCell>
                    <TableCell>
                      <Chip
                        label={student.paymentStatus}
                        size="small"
                        color={getPaymentStatusColor(student.paymentStatus) as any}
                        variant="outlined"
                        sx={{
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.resultStatus}
                        size="small"
                        color={getResultStatusColor(student.resultStatus) as any}
                        variant="outlined"
                        sx={{
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ReportsTable;
