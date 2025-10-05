import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
import { useInfiniteStudents, type StudentListFilters } from '../hooks/useInfiniteStudents';
import { useState } from 'react';
import InfiniteScrollContainer from './InfiniteScrollContainer';

interface StudentTableProps {
  onStudentSelect: (studentId: string) => void;
  selectedStudentId: string | null;
  onExport: () => void;
}

const StudentTable = ({ onStudentSelect, selectedStudentId, onExport }: StudentTableProps) => {
  const theme = useTheme();
  const [filters, setFilters] = useState<StudentListFilters>({});

  const {
    data: studentsData,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch
  } = useInfiniteStudents(filters, 10);

  // The useInfiniteData hook already returns flattened data
  const students = studentsData || [];

  const handleFilterChange = (key: keyof StudentListFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };


  const handleRowClick = (student: any) => {
    onStudentSelect(student._id);
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
          placeholder="Search by Registration No / Name"
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
          <InputLabel>Faculty</InputLabel>
          <Select
            value={filters.faculty || ''}
            onChange={(e) => handleFilterChange('faculty', e.target.value)}
            label="Faculty"
          >
            <MenuItem value="">All Faculties</MenuItem>
            <MenuItem value="Engineering">Engineering</MenuItem>
            <MenuItem value="Management">Management</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
            <MenuItem value="Arts">Arts</MenuItem>
            <MenuItem value="Commerce">Commerce</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Stream</InputLabel>
          <Select
            value={filters.stream || ''}
            onChange={(e) => handleFilterChange('stream', e.target.value)}
            label="Stream"
          >
            <MenuItem value="">All Streams</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Computer Science">Computer Science</MenuItem>
            <MenuItem value="Mechanical">Mechanical</MenuItem>
            <MenuItem value="Civil">Civil</MenuItem>
            <MenuItem value="Information Technology">Information Technology</MenuItem>
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
        <InfiniteScrollContainer
          onLoadMore={fetchNextPage}
          hasNextPage={hasNextPage}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          error={isError ? error?.message : null}
          onRetry={refetch}
          height="100%"
          maxHeight="600px"
          loadingText="Loading more students..."
          errorText="Failed to load students"
          noMoreDataText="No more students to load"
          showScrollToTop={true}
        >
          <TableContainer 
            component={Paper} 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9',
              overflow: 'visible',
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Registration No</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>DOB</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Faculty</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Stream</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Year</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Session</TableCell>
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
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  students?.map((student: any) => (
                    <TableRow
                      key={student._id}
                      hover
                      onClick={() => handleRowClick(student)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: selectedStudentId === student._id 
                          ? theme.palette.primary.light + '20' 
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: selectedStudentId === student._id 
                            ? theme.palette.primary.light + '30' 
                            : theme.palette.grey[50],
                        },
                      }}
                    >
                      <TableCell>{student.registrationNo}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {student.candidateName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-GB') : 'N/A'}
                      </TableCell>
                      <TableCell>{student.contactNumber}</TableCell>
                      <TableCell>{student.emailAddress}</TableCell>
                      <TableCell>{student.faculty}</TableCell>
                      <TableCell>{student.course}</TableCell>
                      <TableCell>{student.stream}</TableCell>
                      <TableCell>{student.year}</TableCell>
                      <TableCell>{student.session}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </InfiniteScrollContainer>

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
