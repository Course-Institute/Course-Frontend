import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Alert,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Container,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
  Collapse,
  Fade,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import {
  Search,
  Clear,
  FilterList,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useBillList, type BillFilters, type Bill } from '../../hooks/useBillList';
import Table, { type Column } from '../../components/core-components/Table';
import BillReceiptDialog from '../../components/BillReceiptDialog';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useToast } from '../../contexts/ToastContext';

const CenterManageBillsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showToast } = useToast();
  const [centerInfo, setCenterInfo] = useState<{ centerId: string; centerName: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<BillFilters>({});
  const [filtersExpanded, setFiltersExpanded] = useState(!isMobile);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const lastElementRef = useRef<HTMLTableRowElement | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

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

  const { 
    data, 
    isError, 
    error, 
    isFetchingNextPage 
  } = useBillList(filters);
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Update filters when debounced search changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      query: debouncedSearchTerm || undefined,
    }));
  }, [debouncedSearchTerm]);

  const allBills = data?.pages.flatMap(page => page.data.bills) || [];
  const totalCount = data?.pages[0]?.data.totalCount || 0;

  const handleFilterChange = (key: keyof BillFilters, value: string) => {
    setFilters((prev: BillFilters) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };
  
  // Count active filters
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);
  }, [filters, searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleViewReceipt = (bill: Bill) => {
    setSelectedBill(bill);
    setReceiptDialogOpen(true);
  };

  // Define table columns
  const columns: Column[] = [
    {
      field: 'registrationNo',
      headerName: 'Reg. No.',
      width: '100px',
      renderCell: (value: string) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#3b82f6', fontSize: '0.875rem' }}>
          {value}
        </Typography>
      ),
    },
    {
      field: 'studentName',
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
      field: 'amount',
      headerName: 'Amount',
      width: '100px',
      align: 'center',
      renderCell: (value: number) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#059669', fontSize: '0.875rem' }}>
          ₹{value?.toLocaleString() || '0'}
        </Typography>
      ),
    },
    {
      field: 'paymentMethod',
      headerName: 'Method',
      width: '100px',
      align: 'center',
      renderCell: (value: string) => (
        <Chip
          label={value}
          size="small"
          sx={{
            backgroundColor: value === 'Online' ? '#ecfdf5' : '#fef3c7',
            color: value === 'Online' ? '#059669' : '#d97706',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: '90px',
      align: 'center',
      renderCell: (value: string) => {
        const getStatusColor = (status: string) => {
          switch (status.toLowerCase()) {
            case 'paid': return { bg: '#ecfdf5', color: '#059669' };
            case 'pending': return { bg: '#fef3c7', color: '#d97706' };
            case 'overdue': return { bg: '#fef2f2', color: '#dc2626' };
            default: return { bg: '#f3f4f6', color: '#6b7280' };
          }
        };
        const { bg, color } = getStatusColor(value);
        return (
          <Chip
            label={value}
            size="small"
            sx={{
              backgroundColor: bg,
              color: color,
              fontWeight: 600,
              fontSize: '0.75rem',
              textTransform: 'capitalize',
            }}
          />
        );
      },
    },
    {
      field: 'billDate',
      headerName: 'Bill Date',
      width: '90px',
      align: 'center',
      renderCell: (value: string) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {new Date(value).toLocaleDateString('en-GB')}
        </Typography>
      ),
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      width: '90px',
      align: 'center',
      renderCell: (value: string) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {new Date(value).toLocaleDateString('en-GB')}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: '100px',
      align: 'center',
      getActions: (row: any) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleViewReceipt(row)}
          sx={{
            borderColor: '#3b82f6',
            color: '#3b82f6',
            textTransform: 'none',
            fontSize: '0.75rem',
            fontWeight: 500,
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            '&:hover': {
              borderColor: '#2563eb',
              backgroundColor: '#eff6ff',
            },
          }}
        >
          View
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading bills...</Typography>
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
                Failed to load bills data: {error?.message || 'Unknown error'}
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
                placeholder="Search by student name, registration number, or course..."
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
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                      <InputLabel sx={{ fontWeight: 500 }}>Status</InputLabel>
                      <Select
                        value={filters.status || ''}
                        label="Status"
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <MenuItem value="">All Status</MenuItem>
                        <MenuItem value="paid">Paid</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="overdue">Overdue</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                      <InputLabel sx={{ fontWeight: 500 }}>Payment Method</InputLabel>
                      <Select
                        value={filters.paymentMethod || ''}
                        label="Payment Method"
                        onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <MenuItem value="">All Methods</MenuItem>
                        <MenuItem value="Online">Online</MenuItem>
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="Cheque">Cheque</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                      <InputLabel sx={{ fontWeight: 500 }}>Course</InputLabel>
                      <Select
                        value={filters.course || ''}
                        label="Course"
                        onChange={(e) => handleFilterChange('course', e.target.value)}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <MenuItem value="">All Courses</MenuItem>
                        {/* Add course options here */}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                      <InputLabel sx={{ fontWeight: 500 }}>Year</InputLabel>
                      <Select
                        value={filters.year || ''}
                        label="Year"
                        onChange={(e) => handleFilterChange('year', e.target.value)}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <MenuItem value="">All Years</MenuItem>
                        <MenuItem value="2024">2024</MenuItem>
                        <MenuItem value="2023">2023</MenuItem>
                        <MenuItem value="2022">2022</MenuItem>
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
                {filters.status && (
                  <Chip
                    label={`Status: ${filters.status}`}
                    onDelete={() => handleFilterChange('status', '')}
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
                {filters.paymentMethod && (
                  <Chip
                    label={`Method: ${filters.paymentMethod}`}
                    onDelete={() => handleFilterChange('paymentMethod', '')}
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
                {filters.course && (
                  <Chip
                    label={`Course: ${filters.course}`}
                    onDelete={() => handleFilterChange('course', '')}
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
                {filters.year && (
                  <Chip
                    label={`Year: ${filters.year}`}
                    onDelete={() => handleFilterChange('year', '')}
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

        {/* Bills Data Table */}
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
            {/* Bills Count Display */}
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
                Bills List - {centerInfo.centerName}
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
                  Showing <Box component="strong" sx={{ color: '#3b82f6', fontWeight: 700 }}>{allBills.length}</Box> bill{allBills.length !== 1 ? 's' : ''}
                  {totalCount > allBills.length && (
                    <span> of <Box component="strong" sx={{ color: '#3b82f6', fontWeight: 700 }}>{totalCount.toLocaleString()}</Box></span>
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
              {allBills.length === 0 && !isError ? (
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
                    No bills found
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    Try adjusting your search or filters
                  </Typography>
                </Box>
              ) : (
                <>
                  <Table
                    columns={columns}
                    rows={allBills}
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
                        Loading more bills...
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Bill Receipt Dialog */}
        <BillReceiptDialog
          open={receiptDialogOpen}
          onClose={() => setReceiptDialogOpen(false)}
          bill={selectedBill}
        />
      </Container>
    </ErrorBoundary>
  );
};

export default CenterManageBillsPage;