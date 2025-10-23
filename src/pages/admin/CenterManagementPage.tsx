import { useState, useRef, useEffect } from 'react';
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
  Business,
  PendingActions,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useCenterStats, useRefreshCenterStats } from '../../hooks/useCenterStats';
import { useCenterList, type CenterFilters } from '../../hooks/useCenterList';
import Table, { type Column } from '../../components/core-components/Table';

const CenterManagementPage = () => {
  const [filters, setFilters] = useState<CenterFilters>({});
  const { data: stats, isLoading: statsLoading } = useCenterStats();
  const { 
    data, 
    isError, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useCenterList(filters);

  const allCenters = data?.pages.flatMap(page => page.data.centers) || [];
  const totalCount = data?.pages[0]?.data.totalCount || 0;

  // Frontend filtering logic
  const filteredCenters = allCenters.filter((center) => {
    // Search filter
    if (filters.query) {
      const searchTerm = filters.query.toLowerCase();
      const matchesSearch = 
        center.centerDetails?.centerCode?.toLowerCase().includes(searchTerm) ||
        center.centerDetails?.centerName?.toLowerCase().includes(searchTerm) ||
        center.centerDetails?.city?.toLowerCase().includes(searchTerm) ||
        center.centerDetails?.state?.toLowerCase().includes(searchTerm) ||
        center.authorizedPersonDetails?.authName?.toLowerCase().includes(searchTerm) ||
        center.authorizedPersonDetails?.contactNo?.includes(searchTerm) ||
        center.authorizedPersonDetails?.email?.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status) {
      if (center.status !== filters.status) return false;
    }

    // Center type filter
    if (filters.centerType) {
      if (center.centerDetails?.centerType !== filters.centerType) return false;
    }

    // State filter
    if (filters.state) {
      if (center.centerDetails?.state !== filters.state) return false;
    }

    return true;
  });

  // Define table columns for centers
  const columns: Column[] = [
    {
      field: 'centerCode',
      headerName: 'Center Code',
      width: '140px',
      renderCell: (_, row: any) => row.centerDetails?.centerCode || 'N/A',
    },
    {
      field: 'centerName',
      headerName: 'Center Name',
      minWidth: '200px',
      renderCell: (_, row: any) => row.centerDetails?.centerName || 'N/A',
    },
    {
      field: 'centerType',
      headerName: 'Type',
      width: '120px',
      align: 'center',
      renderCell: (_, row: any) => row.centerDetails?.centerType || 'N/A',
    },
    {
      field: 'city',
      headerName: 'City',
      width: '120px',
      renderCell: (_, row: any) => row.centerDetails?.city || 'N/A',
    },
    {
      field: 'state',
      headerName: 'State',
      width: '120px',
      renderCell: (_, row: any) => row.centerDetails?.state || 'N/A',
    },
    {
      field: 'contactPerson',
      headerName: 'Contact Person',
      minWidth: '150px',
      renderCell: (_, row: any) => row.authorizedPersonDetails?.authName || 'N/A',
    },
    {
      field: 'contactNo',
      headerName: 'Contact No.',
      width: '130px',
      align: 'center',
      renderCell: (_, row: any) => row.authorizedPersonDetails?.contactNo || 'N/A',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: '100px',
      align: 'center',
      renderCell: (value: string) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'pending': return '#f59e0b';
            case 'approved': return '#10b981';
            case 'rejected': return '#ef4444';
            default: return '#6b7280';
          }
        };
        return (
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
        );
      },
    },
  ];

  // Infinite scroll logic
  const lastElementRef = useRef<HTMLTableRowElement | null>(null);

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

  const handleFilterChange = (key: keyof CenterFilters, value: string) => {
    setFilters((prev: CenterFilters) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prev: CenterFilters) => ({
      ...prev,
      query: searchTerm || undefined,
    }));
  };


  const statsCards = [
    {
      title: 'Total Centers',
      value: stats?.totalCenters?.toLocaleString() || '0',
      icon: <Business sx={{ fontSize: 40, color: '#3b82f6' }} />,
      color: '#3b82f6',
    },
    {
      title: 'Pending Approval Requests',
      value: stats?.pendingApprovals?.toLocaleString() || '0',
      icon: <PendingActions sx={{ fontSize: 40, color: '#f59e0b' }} />,
      color: '#f59e0b',
    },
    {
      title: 'Active Centers',
      value: stats?.activeCenters?.toLocaleString() || '0',
      icon: <CheckCircle sx={{ fontSize: 40, color: '#10b981' }} />,
      color: '#10b981',
    },
    {
      title: 'Deactivated Centers',
      value: stats?.deactivatedCenters?.toLocaleString() || '0',
      icon: <Cancel sx={{ fontSize: 40, color: '#ef4444' }} />,
      color: '#ef4444',
    },
  ];

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      boxSizing: 'border-box',
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
        Center Management
      </Typography>

      {/* Statistics Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, flexShrink: 0 }}>
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              background: 'white',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {statsLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2">Loading...</Typography>
                </Box>
              ) : (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 'bold',
                        color: stat.color,
                        fontSize: '1.8rem',
                      }}
                    >
                      {stat.value}
                    </Typography>
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 500,
                    }}
                  >
                    {stat.title}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Search and Filters */}
      <Card sx={{ flexShrink: 0 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Search Bar */}
            <TextField
              placeholder="Search by Center ID / Name / Location"
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

            {/* Filter Row */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
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
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Center Type</InputLabel>
                  <Select
                    value={filters.centerType || ''}
                    onChange={(e) => handleFilterChange('centerType', e.target.value)}
                    label="Center Type"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="franchise">Franchise</MenuItem>
                    <MenuItem value="company">Company</MenuItem>
                    <MenuItem value="partner">Partner</MenuItem>
                    <MenuItem value="own">Own</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>State</InputLabel>
                  <Select
                    value={filters.state || ''}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                    label="State"
                  >
                    <MenuItem value="">All States</MenuItem>
                    <MenuItem value="Delhi">Delhi</MenuItem>
                    <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                    <MenuItem value="Rajasthan">Rajasthan</MenuItem>
                    <MenuItem value="West Bengal">West Bengal</MenuItem>
                    <MenuItem value="Karnataka">Karnataka</MenuItem>
                    <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
                    <MenuItem value="Uttar Pradesh">Uttar Pradesh</MenuItem>
                    <MenuItem value="Telangana">Telangana</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {isError && (
        <Alert severity="error" sx={{ flexShrink: 0 }}>
          Failed to load center data: {error?.message || 'Unknown error'}
        </Alert>
      )}

      {/* Centers Display - Takes remaining space */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: 500,
      }}>
        {!data && filteredCenters.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            flexGrow: 1,
            p: 4 
          }}>
            <CircularProgress size={40} />
          </Box>
        ) : filteredCenters.length === 0 && allCenters.length > 0 ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            flexGrow: 1,
            p: 4 
          }}>
            <Typography variant="h6" color="text.secondary">
              No centers found matching your filters
            </Typography>
          </Box>
        ) : (
          <Table
            columns={columns}
            rows={filteredCenters}
            lastRowRef={lastElementRef as React.RefObject<HTMLTableRowElement>}
            tableContainerSx={{
              height: '90%',
              maxHeight: '70vh',
            }}
          />
        )}
        
        {/* Loading indicator for next page */}
        {isFetchingNextPage && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            p: 2 
          }}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Loading more centers...
            </Typography>
          </Box>
        )}
        
        {/* Total count display */}
        {totalCount > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, pt: 1 }}>
            Showing {filteredCenters.length} of {allCenters.length} centers
            {filteredCenters.length !== allCenters.length && (
              <span> (filtered from {totalCount} total)</span>
            )}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CenterManagementPage;
