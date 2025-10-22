import { useState } from 'react';
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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Search,
  Business,
  PendingActions,
  CheckCircle,
  Cancel,
  ViewList,
  ViewModule,
} from '@mui/icons-material';
import { useCenterStats } from '../../hooks/useCenterStats';
import { useCenterList, type CenterFilters, type Center } from '../../hooks/useCenterList';
import CenterTable from '../../components/CenterTable';
import CenterInfiniteList from '../../components/CenterInfiniteList';

const CenterManagementPage = () => {
  const [filters, setFilters] = useState<CenterFilters>({});
  const [viewMode, setViewMode] = useState<'table' | 'infinite'>('infinite');
  const { data: stats, isLoading: statsLoading } = useCenterStats();
  const { data: centerData, isLoading: centerLoading, isError, error } = useCenterList(filters);

  const handleFilterChange = (key: keyof CenterFilters, value: string) => {
    setFilters((prev: CenterFilters) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prev: CenterFilters) => ({
      ...prev,
      search: searchTerm || undefined,
    }));
  };

  const handleCenterAction = (action: string, center: Center) => {
    console.log(`${action} for center:`, center.centerId);
    // Handle different actions like approve, edit, deactivate, etc.
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
              value={filters.search || ''}
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
                    <MenuItem value="Approve">Approve</MenuItem>
                    <MenuItem value="Published">Published</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Deactivated">Deactivated</MenuItem>
                    <MenuItem value="Refenisted">Refenisted</MenuItem>
                    <MenuItem value="Renning">Renning</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Region</InputLabel>
                  <Select
                    value={filters.region || ''}
                    onChange={(e) => handleFilterChange('region', e.target.value)}
                    label="Region"
                  >
                    <MenuItem value="">All Regions</MenuItem>
                    <MenuItem value="Delhi">Delhi</MenuItem>
                    <MenuItem value="Mumbai">Mumbai</MenuItem>
                    <MenuItem value="Jaipur">Jaipur</MenuItem>
                    <MenuItem value="Kolkata">Kolkata</MenuItem>
                    <MenuItem value="Bangalore">Bangalore</MenuItem>
                    <MenuItem value="Chennai">Chennai</MenuItem>
                    <MenuItem value="Pune">Pune</MenuItem>
                    <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Date</InputLabel>
                  <Select
                    value={filters.date || ''}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    label="Date"
                  >
                    <MenuItem value="">All Dates</MenuItem>
                    <MenuItem value="2025-01-01">January 2025</MenuItem>
                    <MenuItem value="2025-01-15">Mid January 2025</MenuItem>
                    <MenuItem value="2025-02-01">February 2025</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* View Mode Toggle */}
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, newView) => newView && setViewMode(newView)}
                size="small"
                sx={{ ml: 'auto' }}
              >
                <ToggleButton value="infinite">
                  <ViewModule sx={{ mr: 1 }} />
                  Infinite Scroll
                </ToggleButton>
                <ToggleButton value="table">
                  <ViewList sx={{ mr: 1 }} />
                  Table View
                </ToggleButton>
              </ToggleButtonGroup>
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
        {viewMode === 'infinite' ? (
          <CenterInfiniteList
            filters={{
              query: filters.search,
              status: filters.status,
              region: filters.region,
              limit: 20,
            }}
            onCenterSelect={(center) => {
              console.log('Selected center:', center);
            }}
            height="100%"
          />
        ) : (
          centerLoading ? (
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
            <CenterTable
              centers={centerData?.centers || []}
              onCenterAction={handleCenterAction}
            />
          )
        )}
      </Box>
    </Box>
  );
};

export default CenterManagementPage;
