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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  useTheme,
  Skeleton,
} from '@mui/material';
import { Search, GetApp } from '@mui/icons-material';
  import { useStudentList,type Student, type StudentListFilters } from '../hooks/useStudentList';
import { useState } from 'react';

interface StudentTableProps {
  onStudentSelect: (studentId: string) => void;
  selectedStudentId: string | null;
  onExport: () => void;
}

const StudentTable = ({ onStudentSelect, selectedStudentId, onExport }: StudentTableProps) => {
  const theme = useTheme();
  const [filters, setFilters] = useState<StudentListFilters>({});

  const { data: studentData, isLoading } = useStudentList(filters);

  const handleFilterChange = (key: keyof StudentListFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const getStatusColor = (status: Student['feeStatus']) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Not Available':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleRowClick = (student: Student) => {
    onStudentSelect(student.id);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Filters */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <TextField
          placeholder="Search by Student ID / Name"
          size="small"
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ minWidth: 250 }}
        />
        
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
            <MenuItem value="Bangalore Center">Bangalore Center</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={filters.year || ''}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            label="Year"
          >
            <MenuItem value="">All Years</MenuItem>
            <MenuItem value="2024">2024</MenuItem>
            <MenuItem value="2025">2025</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table - Takes remaining space */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <TableContainer 
          component={Paper} 
          sx={{ 
            flexGrow: 1,
            height: '100%',
            borderRadius: 3,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f1f5f9',
            overflow: 'auto',
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
                <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Semester</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Center</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fee Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton width={80} /></TableCell>
                  </TableRow>
                ))
              ) : (
                studentData?.students.map((student) => (
                  <TableRow
                    key={student.id}
                    hover
                    onClick={() => handleRowClick(student)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: selectedStudentId === student.id 
                        ? theme.palette.primary.light + '20' 
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: selectedStudentId === student.id 
                          ? theme.palette.primary.light + '30' 
                          : theme.palette.grey[50],
                      },
                    }}
                  >
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {student.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>{student.semester}</TableCell>
                    <TableCell>{student.center}</TableCell>
                    <TableCell>
                      <Chip
                        label={student.feeStatus}
                        color={getStatusColor(student.feeStatus)}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          ...(student.feeStatus === 'Pending' && {
                            '&::after': {
                              content: '""',
                              display: 'inline-block',
                              width: 4,
                              height: 4,
                              backgroundColor: theme.palette.warning.main,
                              borderRadius: '50%',
                              marginLeft: 0.5,
                            },
                          }),
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Export Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2, flexShrink: 0 }}>
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
      </Box>
    </Box>
  );
};

export default StudentTable;
