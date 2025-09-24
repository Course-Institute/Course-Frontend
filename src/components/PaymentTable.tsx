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
  Button,
  IconButton,
  useTheme,
  Skeleton,
} from '@mui/material';
import { 
  Download, 
  GetApp, 
  Edit, 
  Send,
  Receipt
} from '@mui/icons-material';
import { type Payment } from '../hooks/usePaymentList';

interface PaymentTableProps {
  payments: Payment[];
  onExport: () => void;
}

const PaymentTable = ({ payments, onExport }: PaymentTableProps) => {
  const theme = useTheme();

  const getStatusColor = (status: Payment['paymentStatus']) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Partial':
        return 'info';
      case 'Failed':
        return 'error';
      case 'Refunded':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
  };

  const handleAction = (action: string, payment: Payment) => {
    console.log(`${action} for payment:`, payment.transactionId);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Export Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2, flexShrink: 0 }}>
        <Button
          variant="outlined"
          startIcon={<GetApp />}
          onClick={onExport}
          sx={{
            textTransform: 'none',
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
              color: 'white',
            },
          }}
        >
          Export
        </Button>
      </Box>

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
                <TableCell sx={{ fontWeight: 'bold' }}>Transaction ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Center</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount Paid</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Method</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No payments found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.grey[50],
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {payment.transactionId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {payment.studentId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {payment.studentName}
                      </Typography>
                    </TableCell>
                    <TableCell>{payment.course}</TableCell>
                    <TableCell>{payment.center}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(payment.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payment.paymentMethod}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: 500,
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(payment.date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {payment.paymentStatus === 'Completed' && payment.receiptUrl && (
                          <IconButton
                            size="small"
                            onClick={() => handleAction('Download Receipt', payment)}
                            sx={{
                              color: theme.palette.success.main,
                              '&:hover': { backgroundColor: theme.palette.success.light + '20' },
                            }}
                            title="Download Receipt"
                          >
                            <Download fontSize="small" />
                          </IconButton>
                        )}
                        
                        {payment.paymentStatus === 'Pending' && (
                          <IconButton
                            size="small"
                            onClick={() => handleAction('Update Verify', payment)}
                            sx={{
                              color: theme.palette.warning.main,
                              '&:hover': { backgroundColor: theme.palette.warning.light + '20' },
                            }}
                            title="Update Verify"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        )}
                        
                        {payment.paymentStatus === 'Pending' && (
                          <IconButton
                            size="small"
                            onClick={() => handleAction('Remind Student', payment)}
                            sx={{
                              color: theme.palette.info.main,
                              '&:hover': { backgroundColor: theme.palette.info.light + '20' },
                            }}
                            title="Remind Student"
                          >
                            <Send fontSize="small" />
                          </IconButton>
                        )}
                        
                        {payment.paymentStatus === 'Failed' && (
                          <IconButton
                            size="small"
                            onClick={() => handleAction('Retry Payment', payment)}
                            sx={{
                              color: theme.palette.error.main,
                              '&:hover': { backgroundColor: theme.palette.error.light + '20' },
                            }}
                            title="Retry Payment"
                          >
                            <Receipt fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
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

export default PaymentTable;
