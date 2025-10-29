import { useState, useRef, useEffect, useMemo } from 'react';
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
  Container,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
  Collapse,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import {
  Search,
  Business,
  PendingActions,
  CheckCircle,
  Cancel,
  Clear,
  FilterList,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useCenterStats } from '../../hooks/useCenterStats';
import { useCenterList, type CenterFilters } from '../../hooks/useCenterList';
import Table, { type Column } from '../../components/core-components/Table';

const CenterManagementPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [filters, setFilters] = useState<CenterFilters>({});
  const [filtersExpanded, setFiltersExpanded] = useState(!isMobile);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  const { data: stats, isLoading: statsLoading } = useCenterStats();
  const { 
    data, 
    isError, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useCenterList(filters);
  
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
      width: '120px',
      renderCell: (_, row: any) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#3b82f6', fontSize: '0.875rem' }}>
          {row.centerDetails?.centerCode || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'centerName',
      headerName: 'Center Name',
      minWidth: '180px',
      flex: 1,
      renderCell: (_, row: any) => (
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
          {row.centerDetails?.centerName || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'centerType',
      headerName: 'Type',
      width: '100px',
      align: 'center',
      renderCell: (_, row: any) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {row.centerDetails?.centerType || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'city',
      headerName: 'City',
      width: '100px',
      renderCell: (_, row: any) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {row.centerDetails?.city || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'state',
      headerName: 'State',
      width: '100px',
      renderCell: (_, row: any) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {row.centerDetails?.state || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'contactPerson',
      headerName: 'Contact Person',
      minWidth: '130px',
      renderCell: (_, row: any) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {row.authorizedPersonDetails?.authName || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'contactNo',
      headerName: 'Contact No.',
      width: '120px',
      align: 'center',
      renderCell: (_, row: any) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {row.authorizedPersonDetails?.contactNo || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'username',
      headerName: 'Username',
      width: '120px',
      renderCell: (_, row: any) => (
        <Typography variant="body2" sx={{ fontWeight: 500, color: '#10b981', fontSize: '0.875rem' }}>
          {row.loginCredentials?.username || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'password',
      headerName: 'Password',
      width: '100px',
      align: 'center',
      renderCell: (_, row: any) => (
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600, 
            color: '#ef4444',
            fontFamily: 'monospace',
            letterSpacing: '0.5px',
            fontSize: '0.8rem',
          }}
        >
          {row.loginCredentials?.password || 'N/A'}
        </Typography>
      ),
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

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };
  
  // Count active filters
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);
  }, [filters, searchTerm]);


  const statsCards = [
    {
      title: 'Total Centers',
      value: stats?.totalCenters?.toLocaleString() || '0',
      icon: <Business />,
      color: '#3b82f6',
      bgColor: '#eff6ff',
    },
    {
      title: 'Pending',
      value: stats?.pendingApprovals?.toLocaleString() || '0',
      icon: <PendingActions />,
      color: '#f59e0b',
      bgColor: '#fffbeb',
    },
    {
      title: 'Active',
      value: stats?.activeCenters?.toLocaleString() || '0',
      icon: <CheckCircle />,
      color: '#10b981',
      bgColor: '#ecfdf5',
    },
    {
      title: 'Deactivated',
      value: stats?.deactivatedCenters?.toLocaleString() || '0',
      icon: <Cancel />,
      color: '#ef4444',
      bgColor: '#fef2f2',
    },
  ];

  return (
    <Container maxWidth={false} sx={{ 
      width: '100%', 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: { xs: 1.5, sm: 2 },
      backgroundColor: '#f8fafc',
      overflow: 'hidden',
    }}>
      {/* Statistics Cards - Compact */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, 
        gap: { xs: 1, sm: 1.5 },
          flexShrink: 0,
      }}>
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            sx={{
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              },
            }}
          >
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              {statsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                  <CircularProgress size={20} sx={{ color: stat.color }} />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
                  <Box sx={{
                    p: { xs: 0.75, sm: 1 },
                    borderRadius: 1.5,
                    backgroundColor: stat.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Box sx={{ color: stat.color, display: 'flex', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                      {stat.icon}
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: stat.color,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        lineHeight: 1.2,
                        mb: 0.25,
                      }}
                    >
                      {stat.value}
                    </Typography>
                  <Typography
                      variant="caption"
                    sx={{
                        color: '#64748b',
                      fontWeight: 500,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        display: 'block',
                    }}
                  >
                    {stat.title}
                  </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Search and Filters */}
      <Card sx={{ 
        borderRadius: 3,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e2e8f0',
        background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          {/* Header Section */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 1.5,
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
              placeholder="Search by Center ID, Name, Location, Contact..."
              fullWidth
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
                      onClick={() => setSearchTerm('')}
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
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                    <InputLabel sx={{ fontWeight: 500 }}>Status</InputLabel>
                  <Select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="Status"
                      sx={{
                        borderRadius: 2,
                        backgroundColor: '#ffffff',
                      }}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                  <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                    <InputLabel sx={{ fontWeight: 500 }}>Center Type</InputLabel>
                  <Select
                    value={filters.centerType || ''}
                    onChange={(e) => handleFilterChange('centerType', e.target.value)}
                    label="Center Type"
                      sx={{
                        borderRadius: 2,
                        backgroundColor: '#ffffff',
                      }}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="franchise">Franchise</MenuItem>
                    <MenuItem value="company">Company</MenuItem>
                    <MenuItem value="partner">Partner</MenuItem>
                    <MenuItem value="own">Own</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                  <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                    <InputLabel sx={{ fontWeight: 500 }}>State</InputLabel>
                  <Select
                    value={filters.state || ''}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                    label="State"
                      sx={{
                        borderRadius: 2,
                        backgroundColor: '#ffffff',
                      }}
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
                  onDelete={() => setSearchTerm('')}
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
              {filters.centerType && (
                <Chip
                  label={`Type: ${filters.centerType}`}
                  onDelete={() => handleFilterChange('centerType', '')}
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
              {filters.state && (
                <Chip
                  label={`State: ${filters.state}`}
                  onDelete={() => handleFilterChange('state', '')}
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

      {/* Error Alert */}
      {isError && (
        <Alert severity="error" sx={{ 
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)',
          flexShrink: 0,
        }}>
          Failed to load center data: {error?.message || 'Unknown error'}
        </Alert>
      )}

      {/* Centers Table */}
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
          {/* Header */}
      <Box sx={{ 
            mb: 1.5, 
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
              Centers List
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#64748b', 
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Showing <Box component="strong" sx={{ color: '#3b82f6', fontWeight: 700 }}>{filteredCenters.length}</Box> center{filteredCenters.length !== 1 ? 's' : ''}
              {totalCount > 0 && filteredCenters.length !== totalCount && (
                <span> of <Box component="strong" sx={{ color: '#3b82f6', fontWeight: 700 }}>{totalCount.toLocaleString()}</Box></span>
              )}
            </Typography>
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
        {!data && filteredCenters.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
                flex: 1,
                py: 8,
          }}>
                <CircularProgress size={40} sx={{ color: '#3b82f6' }} />
          </Box>
        ) : filteredCenters.length === 0 && allCenters.length > 0 ? (
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
                  No centers found
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  Try adjusting your search or filters
            </Typography>
          </Box>
        ) : (
              <>
          <Table
            columns={columns}
            rows={filteredCenters}
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
              Loading more centers...
            </Typography>
          </Box>
        )}
              </>
        )}
      </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CenterManagementPage;
