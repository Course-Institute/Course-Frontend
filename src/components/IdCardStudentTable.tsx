import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { Search, Download, AddIcCall } from '@mui/icons-material';
import { useState } from 'react';
import { useIdCardStudentsData, type IdCardStudent } from '../hooks/useIdCardStudentsData';
import { useIdCardGeneration } from '../hooks/useIdCardGeneration';
import Table from './core-components/Table';

interface IdCardStudentTableProps {
  onStudentSelect: (studentId: string) => void;
  selectedStudentId: string | null;
  onExport?: () => void;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'center' | 'left';
  format?: (value: any) => React.ReactNode;
}

const IdCardStudentTable = ({ onStudentSelect, selectedStudentId, onExport }: IdCardStudentTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'generated' | 'rejected'>('all');
  const [facultyFilter, setFacultyFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  const { generateIdCard, isGenerating } = useIdCardGeneration();

  const {
    students,
    lastElementRef,
    tableContainerRef,
    error,
    isError,
    isFetchingNextPage
  } = useIdCardStudentsData({
    limit: 10,
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    faculty: facultyFilter || undefined,
    course: courseFilter || undefined,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'generated':
        return 'Generated';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const handleGenerateIdCard = (studentId: string, registrationNo: string) => {
    generateIdCard({
      studentId,
      registrationNo,
    }, {
      onSuccess: () => {
      },
      onError: (error: any) => {
        console.error('Error generating ID card:', error);
      }
    });
  };

  const columns: Column[] = [
    {
      id: 'registrationNo',
      label: 'Registration No',
      minWidth: 150,
      format: (value: string) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      ),
    },
    {
      id: 'candidateName',
      label: 'Student Name',
      minWidth: 200,
      format: (value: string) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      ),
    },
    {
      id: 'course',
      label: 'Course',
      minWidth: 150,
      format: (value: string) => (
        <Typography variant="body2">{value}</Typography>
      ),
    },
    {
      id: 'faculty',
      label: 'Faculty',
      minWidth: 150,
      format: (value: string) => (
        <Typography variant="body2">{value}</Typography>
      ),
    },
    {
      id: 'idCardStatus',
      label: 'ID Card Status',
      minWidth: 150,
      align: 'center',
      format: (value: string) => (
        <Chip
          label={getStatusLabel(value)}
          color={getStatusColor(value) as any}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 150,
      align: 'center',
      //@ts-ignore
      format: (value: any, row: IdCardStudent) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onStudentSelect(row._id)}
            color={selectedStudentId === row._id ? 'primary' : 'inherit'}
          >
            View
          </Button>
          {row.idCardStatus === 'pending' && (
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcCall />}
              onClick={() => handleGenerateIdCard(row._id, row.registrationNo)}
              disabled={isGenerating}
              color="primary"
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          )}
        </Box>
      ),
    },
  ];

  const rows = students.map((student) => ({
    ...student,
    actions: student._id,
  }));

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
            ID Card Students
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={onExport}
            sx={{ textTransform: 'none' }}
          >
            Export Data
          </Button>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
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
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="generated">Generated</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
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
        </Grid>

        {/* Table */}
        {isError ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error?.message || 'Failed to load students data'}
          </Alert>
        ) : (
          <Box
            ref={tableContainerRef}
            sx={{
              position: 'relative',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
            }}
          >
            <Table
              columns={columns as any}
              rows={rows}
              stickyHeader={true}
              lastRowRef={lastElementRef as React.RefObject<HTMLTableRowElement>}
              tableContainerSx={{
                height: '100%',
                maxHeight: '100%',
                borderRadius: 3,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f1f5f9',
                overflow: 'auto',
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
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 2,
                borderTop: '1px solid #f1f5f9',
              }}>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Loading more students...
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default IdCardStudentTable;
