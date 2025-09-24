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
} from '@mui/material';
import {
  Search,
  School,
  PendingActions,
  CheckCircle,
  Lock,
} from '@mui/icons-material';
import { useResultStats } from '../../hooks/useResultStats';
import { useResultList, type ResultFilters, type Result } from '../../hooks/useResultList';
import ResultTable from '../../components/ResultTable';
import MarksheetPreview from '../../components/MarksheetPreview';

const UploadResultsPage = () => {
  const [filters, setFilters] = useState<ResultFilters>({});
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const { data: stats, isLoading: statsLoading } = useResultStats();
  const { data: resultData, isLoading: resultLoading, isError, error } = useResultList(filters);

  const handleFilterChange = (key: keyof ResultFilters, value: string) => {
    setFilters((prev: ResultFilters) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prev: ResultFilters) => ({
      ...prev,
      search: searchTerm || undefined,
    }));
  };

  const handleResultSelect = (result: Result) => {
    setSelectedResult(result);
  };

  const handleUpload = () => {
    console.log('Uploading result...');
  };

  const statsCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents?.toLocaleString() || '0',
      icon: <School sx={{ fontSize: 40, color: '#3b82f6' }} />,
      color: '#3b82f6',
    },
    {
      title: 'Pending Results',
      value: stats?.pendingResults?.toLocaleString() || '0',
      icon: <PendingActions sx={{ fontSize: 40, color: '#f59e0b' }} />,
      color: '#f59e0b',
    },
    {
      title: 'Published Results',
      value: stats?.publishedResults?.toLocaleString() || '0',
      icon: <CheckCircle sx={{ fontSize: 40, color: '#10b981' }} />,
      color: '#10b981',
    },
    {
      title: 'Locked Results (Unpaid Fees)',
      value: stats?.lockedResults?.toLocaleString() || '0',
      icon: <Lock sx={{ fontSize: 40, color: '#ef4444' }} />,
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
        UPLOAD RESULTS
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
              placeholder="Search by Student ID / Name"
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
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Course</InputLabel>
                <Select
                  value={filters.course || ''}
                  onChange={(e) => handleFilterChange('course', e.target.value)}
                  label="Course"
                >
                  <MenuItem value="">All Courses</MenuItem>
                  <MenuItem value="B.Sc IT">B.Sc IT</MenuItem>
                  <MenuItem value="MBA">MBA</MenuItem>
                  <MenuItem value="B.Tech">B.Tech</MenuItem>
                  <MenuItem value="MCA">MCA</MenuItem>
                  <MenuItem value="BBA">BBA</MenuItem>
                </Select>
              </FormControl>

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
                  <MenuItem value="Ahmedabad Center">Ahmedabad Center</MenuItem>
                  <MenuItem value="Pune Center">Pune Center</MenuItem>
                  <MenuItem value="Kolkata Center">Kolkata Center</MenuItem>
                  <MenuItem value="Bangalore Center">Bangalore Center</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="Published">Published</MenuItem>
                  <MenuItem value="Upload">Upload</MenuItem>
                  <MenuItem value="Partial">Partial</MenuItem>
                  <MenuItem value="Locked">Locked</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                size="small"
                sx={{
                  textTransform: 'none',
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                  '&:hover': {
                    borderColor: '#2563eb',
                    backgroundColor: '#eff6ff',
                  },
                }}
              >
                Filter
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {isError && (
        <Alert severity="error" sx={{ flexShrink: 0 }}>
          Failed to load result data: {error?.message || 'Unknown error'}
        </Alert>
      )}

      {/* Main Content - Result Management */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: 500,
      }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', flexShrink: 0 }}>
          Result Management
        </Typography>
        
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          gap: 3,
          minHeight: 400,
        }}>
          {/* Result Table - Takes 2/3 of space */}
          <Box sx={{ 
            flex: '2 1 0',
            minWidth: 0,
          }}>
            {resultLoading ? (
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
              <ResultTable
                results={resultData?.results || []}
                onUpload={handleUpload}
                onResultSelect={handleResultSelect}
                selectedResultId={selectedResult?.id}
              />
            )}
          </Box>

          {/* Marksheet Preview - Takes 1/3 of space */}
          <Box sx={{ 
            flex: '1 1 0',
            minWidth: 0,
          }}>
            <MarksheetPreview 
              selectedResult={selectedResult}
              isLoading={resultLoading}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UploadResultsPage;
