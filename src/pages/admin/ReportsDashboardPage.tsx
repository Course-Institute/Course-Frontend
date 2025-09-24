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
  Button,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import {
  Search,
  GetApp,
  PictureAsPdf,
  TableChart,
  Assessment,
} from '@mui/icons-material';
import { useReportsData, type ReportFilters } from '../../hooks/useReportsData';
import ReportsTable from '../../components/ReportsTable';

const ReportsDashboardPage = () => {
  const [filters, setFilters] = useState<ReportFilters>({});
  const { data: reportsData, isLoading: reportsLoading, isError, error } = useReportsData(filters);

  const handleFilterChange = (key: keyof ReportFilters, value: string) => {
    setFilters((prev: ReportFilters) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prev: ReportFilters) => ({
      ...prev,
      search: searchTerm || undefined,
    }));
  };

  const handleExport = (type: string, format: string) => {
    console.log(`Exporting ${type} as ${format}...`);
  };

  const exportOptions = [
    {
      title: 'Export Student List',
      description: 'Download complete student data',
      icon: <TableChart sx={{ fontSize: 40, color: '#3b82f6' }} />,
      color: '#3b82f6',
    },
    {
      title: 'Export Payment Report',
      description: 'Download payment analytics',
      icon: <Assessment sx={{ fontSize: 40, color: '#10b981' }} />,
      color: '#10b981',
    },
    {
      title: 'Export Analytics',
      description: 'Download comprehensive analytics',
      icon: <GetApp sx={{ fontSize: 40, color: '#8b5cf6' }} />,
      color: '#8b5cf6',
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
        Reports Dashboard
      </Typography>

      {/* Export Options */}
      <Box sx={{ flexShrink: 0 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Export Options
        </Typography>
        <Grid container spacing={3}>
          {exportOptions.map((option, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
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
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {option.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {option.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<GetApp />}
                      onClick={() => handleExport(option.title, 'Excel')}
                      sx={{
                        textTransform: 'none',
                        borderColor: option.color,
                        color: option.color,
                        '&:hover': {
                          backgroundColor: option.color + '20',
                        },
                      }}
                    >
                      Excel
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PictureAsPdf />}
                      onClick={() => handleExport(option.title, 'PDF')}
                      sx={{
                        textTransform: 'none',
                        borderColor: option.color,
                        color: option.color,
                        '&:hover': {
                          backgroundColor: option.color + '20',
                        },
                      }}
                    >
                      PDF
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Filter and Search */}
      <Card sx={{ flexShrink: 0 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Filter Row */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small"
                label="From"
                type="date"
                value={filters.fromDate || ''}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 120 }}
              />
              <TextField
                size="small"
                label="To"
                type="date"
                value={filters.toDate || ''}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 120 }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Semester</InputLabel>
                <Select
                  value={filters.semester || ''}
                  onChange={(e) => handleFilterChange('semester', e.target.value)}
                  label="Semester"
                >
                  <MenuItem value="">All Semesters</MenuItem>
                  <MenuItem value="Sem 1">Sem 1</MenuItem>
                  <MenuItem value="Sem 2">Sem 2</MenuItem>
                  <MenuItem value="Sem 3">Sem 3</MenuItem>
                  <MenuItem value="Sem 4">Sem 4</MenuItem>
                  <MenuItem value="Sem 5">Sem 5</MenuItem>
                  <MenuItem value="Sem 6">Sem 6</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Center</InputLabel>
                <Select
                  value={filters.center || ''}
                  onChange={(e) => handleFilterChange('center', e.target.value)}
                  label="Center"
                >
                  <MenuItem value="">All Centers</MenuItem>
                  <MenuItem value="Delhi Center">Delhi Center</MenuItem>
                  <MenuItem value="Mumbai Center">Mumbai Center</MenuItem>
                  <MenuItem value="Jaipur Center">Jaipur Center</MenuItem>
                  <MenuItem value="Kolkata Center">Kolkata Center</MenuItem>
                  <MenuItem value="Bangalore Center">Bangalore Center</MenuItem>
                  <MenuItem value="Chennai Center">Chennai Center</MenuItem>
                  <MenuItem value="Pune Center">Pune Center</MenuItem>
                  <MenuItem value="Hyderabad Center">Hyderabad Center</MenuItem>
                </Select>
              </FormControl>
              <TextField
                size="small"
                placeholder="Search by Student ID..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ minWidth: 200 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {isError && (
        <Alert severity="error" sx={{ flexShrink: 0 }}>
          Failed to load reports data: {error?.message || 'Unknown error'}
        </Alert>
      )}

      {/* Reports Table - Takes remaining space */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: 500,
      }}>
        <ReportsTable
          students={reportsData?.students || []}
          isLoading={reportsLoading}
        />
      </Box>
    </Box>
  );
};

export default ReportsDashboardPage;
