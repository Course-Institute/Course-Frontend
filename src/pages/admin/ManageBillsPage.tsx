import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search,
} from '@mui/icons-material';
import { useBillList, type BillFilters, type Bill } from '../../hooks/useBillList';
import Table, { type Column } from '../../components/core-components/Table';
import BillReceiptDialog from '../../components/BillReceiptDialog';
import ErrorBoundary from '../../components/ErrorBoundary';

const ManageBillsPage = () => {
  const [filters, setFilters] = useState<BillFilters>({});
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const lastElementRef = useRef<HTMLTableRowElement | null>(null);

  const { 
    data, 
    isError, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useBillList(filters);

  const allBills = data?.pages.flatMap(page => page.data.bills) || [];
  const totalCount = data?.pages[0]?.data.totalCount || 0;

  const handleFilterChange = (key: keyof BillFilters, value: string) => {
    setFilters((prev: BillFilters) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prev: BillFilters) => ({
      ...prev,
      query: searchTerm || undefined,
    }));
  };

  const handleRowClick = (bill: Bill) => {
    setSelectedBill(bill);
    setReceiptDialogOpen(true);
  };

  const handleCloseReceiptDialog = () => {
    setReceiptDialogOpen(false);
    setSelectedBill(null);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (lastElementRef.current) {
      observer.observe(lastElementRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#10b981';
      case 'overdue': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const columns: Column[] = [
    {
      field: 'registrationNo',
      headerName: 'Registration No.',
      width: '140px',
      renderCell: (value: string, row: any) => (
        <Box 
          sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          onClick={() => handleRowClick(row)}
        >
          {value}
        </Box>
      ),
    },
    {
      field: 'studentName',
      headerName: 'Student Name',
      minWidth: '150px',
    },
    {
      field: 'course',
      headerName: 'Course',
      minWidth: '120px',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: '100px',
      align: 'center',
      renderCell: (value: number) => `₹${value.toLocaleString()}`,
    },
    {
      field: 'paymentMethod',
      headerName: 'Payment Method',
      width: '120px',
      align: 'center',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: '100px',
      align: 'center',
      renderCell: (value: string) => (
        <Box
          sx={{
            backgroundColor: getStatusColor(value),
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 500,
            textTransform: 'capitalize',
          }}
        >
          {value}
        </Box>
      ),
    },
    {
      field: 'billDate',
      headerName: 'Bill Date',
      width: '100px',
      align: 'center',
      renderCell: (value: string) => new Date(value).toLocaleDateString('en-GB'),
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      width: '100px',
      align: 'center',
      renderCell: (value: string) => new Date(value).toLocaleDateString('en-GB'),
    },
  ];

  return (
    <ErrorBoundary>
      <Box sx={{ 
        width: '100%', 
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        boxSizing: 'border-box',
      }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#1e293b',
            flexShrink: 0,
          }}
        >
          Manage Bills
        </Typography>

        <Card sx={{ flexShrink: 0 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                placeholder="Search by Student Name, Registration No, or Course"
                fullWidth
                value={filters.query || ''}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={filters.paymentMethod || ''}
                    onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                    label="Payment Method"
                  >
                    <MenuItem value="">All Methods</MenuItem>
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="card">Card</MenuItem>
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                    <MenuItem value="upi">UPI</MenuItem>
                    <MenuItem value="cheque">Cheque</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={filters.course || ''}
                    onChange={(e) => handleFilterChange('course', e.target.value)}
                    label="Course"
                  >
                    <MenuItem value="">All Courses</MenuItem>
                    <MenuItem value="Computer Science">Computer Science</MenuItem>
                    <MenuItem value="Business Administration">Business Administration</MenuItem>
                    <MenuItem value="Engineering">Engineering</MenuItem>
                    <MenuItem value="Medicine">Medicine</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {isError && (
          <Alert severity="error" sx={{ flexShrink: 0 }}>
            Failed to load bills data: {error?.message || 'Unknown error'}
          </Alert>
        )}

        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: 500,
        }}>
          {!data && allBills.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              flexGrow: 1,
              p: 4 
            }}>
              <CircularProgress size={40} />
            </Box>
          ) : allBills.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              flexGrow: 1,
              p: 4 
            }}>
              <Typography variant="h6" color="text.secondary">
                No bills found
              </Typography>
            </Box>
          ) : (
            <Table
              columns={columns}
              rows={allBills}
              lastRowRef={lastElementRef as React.RefObject<HTMLTableRowElement>}
              tableContainerSx={{
                height: '90%',
                maxHeight: '70vh',
              }}
            />
          )}
          
          {isFetchingNextPage && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              p: 2 
            }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Loading more bills...
              </Typography>
            </Box>
          )}
          
          {totalCount > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, pt: 1 }}>
              Showing {allBills.length} of {totalCount} bills
            </Typography>
          )}
        </Box>

        <BillReceiptDialog
          open={receiptDialogOpen}
          onClose={handleCloseReceiptDialog}
          bill={selectedBill}
        />
      </Box>
    </ErrorBoundary>
  );
};

export default ManageBillsPage;
