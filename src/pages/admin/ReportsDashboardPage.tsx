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
  Alert,
  Grid,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  Search,
  GetApp,
  PictureAsPdf,
  TableChart,
  Assessment,
  Download,
} from '@mui/icons-material';
import { useReportsData } from '../../hooks/useReportsData';
import { useDownloadReport } from '../../hooks/useDownloadReport';
import ReportsTable from '../../components/ReportsTable';
import ErrorBoundary from '../../components/ErrorBoundary';

const ReportsDashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'all' | 'pending' | 'partial' | 'completed' | 'overdue'>('all');
  const [resultsStatusFilter, setResultsStatusFilter] = useState<'all' | 'pending' | 'uploaded' | 'published' | 'not_available'>('all');
  const [facultyFilter, setFacultyFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sessionFilter, setSessionFilter] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const {
    students,
    lastElementRef,
    tableContainerRef,
    error,
    isError,
    isFetchingNextPage
  } = useReportsData({
    limit: 10,
    search: searchTerm || undefined,
    paymentStatus: paymentStatusFilter !== 'all' ? paymentStatusFilter : undefined,
    resultsStatus: resultsStatusFilter !== 'all' ? resultsStatusFilter : undefined,
    faculty: facultyFilter || undefined,
    course: courseFilter || undefined,
    year: yearFilter || undefined,
    session: sessionFilter || undefined,
  });

  const {
    downloadPaymentReport,
    downloadResultsReport,
    downloadStudentDetailsReport,
    downloadCombinedReport,
    isDownloading
  } = useDownloadReport();

  const handleDownload = (type: 'payment' | 'results' | 'student_details' | 'combined') => {
    const currentFilters = {
      paymentStatus: paymentStatusFilter !== 'all' ? paymentStatusFilter : undefined,
      resultsStatus: resultsStatusFilter !== 'all' ? resultsStatusFilter : undefined,
      faculty: facultyFilter || undefined,
      course: courseFilter || undefined,
      year: yearFilter || undefined,
      session: sessionFilter || undefined,
      search: searchTerm || undefined,
    };

    switch (type) {
      case 'payment':
        downloadPaymentReport(currentFilters);
        break;
      case 'results':
        downloadResultsReport(currentFilters);
        break;
      case 'student_details':
        downloadStudentDetailsReport(currentFilters);
        break;
      case 'combined':
        downloadCombinedReport(currentFilters);
        break;
    }

    setSnackbarMessage(`Downloading ${type} report...`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const exportOptions = [
    {
      title: 'Student Details Report',
      description: 'Download complete student data with payment and results status',
      icon: <TableChart sx={{ fontSize: 40, color: '#3b82f6' }} />,
      color: '#3b82f6',
      type: 'student_details' as const,
    },
    {
      title: 'Payment Report',
      description: 'Download payment status and fee analytics',
      icon: <Assessment sx={{ fontSize: 40, color: '#10b981' }} />,
      color: '#10b981',
      type: 'payment' as const,
    },
    {
      title: 'Results Report',
      description: 'Download exam results and grade analytics',
      icon: <PictureAsPdf sx={{ fontSize: 40, color: '#f59e0b' }} />,
      color: '#f59e0b',
      type: 'results' as const,
    },
    {
      title: 'Combined Report',
      description: 'Download comprehensive analytics report',
      icon: <GetApp sx={{ fontSize: 40, color: '#8b5cf6' }} />,
      color: '#8b5cf6',
      type: 'combined' as const,
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
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
                  <Button
                    variant="contained"
                    size="medium"
                    startIcon={isDownloading ? <CircularProgress size={16} color="inherit" /> : <Download />}
                    onClick={() => handleDownload(option.type)}
                    disabled={isDownloading}
                    sx={{
                      textTransform: 'none',
                      backgroundColor: option.color,
                      color: 'white',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: option.color,
                        opacity: 0.9,
                      },
                      '&:disabled': {
                        backgroundColor: option.color,
                        opacity: 0.6,
                      },
                    }}
                  >
                    {isDownloading ? 'Downloading...' : 'Download Report'}
                  </Button>
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
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Payment Status</InputLabel>
                  <Select
                    value={paymentStatusFilter}
                    label="Payment Status"
                    onChange={(e) => setPaymentStatusFilter(e.target.value as any)}
                  >
                    <MenuItem value="all">All Payment Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="partial">Partial</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Results Status</InputLabel>
                  <Select
                    value={resultsStatusFilter}
                    label="Results Status"
                    onChange={(e) => setResultsStatusFilter(e.target.value as any)}
                  >
                    <MenuItem value="all">All Results Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="uploaded">Uploaded</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="not_available">Not Available</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Faculty</InputLabel>
                  <Select
                    value={facultyFilter}
                    label="Faculty"
                    onChange={(e) => setFacultyFilter(e.target.value)}
                  >
                    <MenuItem value="">All Faculties</MenuItem>
                    <MenuItem value="Engineering">Engineering</MenuItem>
                    <MenuItem value="Management">Management</MenuItem>
                    <MenuItem value="Science">Science</MenuItem>
                    <MenuItem value="Arts">Arts</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={courseFilter}
                    label="Course"
                    onChange={(e) => setCourseFilter(e.target.value)}
                  >
                    <MenuItem value="">All Courses</MenuItem>
                    <MenuItem value="B.Tech">B.Tech</MenuItem>
                    <MenuItem value="MBA">MBA</MenuItem>
                    <MenuItem value="B.Sc">B.Sc</MenuItem>
                    <MenuItem value="MCA">MCA</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={yearFilter}
                    label="Year"
                    onChange={(e) => setYearFilter(e.target.value)}
                  >
                    <MenuItem value="">All Years</MenuItem>
                    <MenuItem value="2023">2023</MenuItem>
                    <MenuItem value="2024">2024</MenuItem>
                    <MenuItem value="2025">2025</MenuItem>
                    <MenuItem value="2026">2026</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Session</InputLabel>
                  <Select
                    value={sessionFilter}
                    label="Session"
                    onChange={(e) => setSessionFilter(e.target.value)}
                  >
                    <MenuItem value="">All Sessions</MenuItem>
                    <MenuItem value="2023">2023</MenuItem>
                    <MenuItem value="2024">2024</MenuItem>
                    <MenuItem value="2025">2025</MenuItem>
                    <MenuItem value="2026">2026</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
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
          students={students}
          lastElementRef={lastElementRef}
          tableContainerRef={tableContainerRef}
          isFetchingNextPage={isFetchingNextPage}
        />
      </Box>

      {/* Snackbar for download notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
    </ErrorBoundary>
  );
};

export default ReportsDashboardPage;
