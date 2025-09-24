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
  Button,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { Upload } from '@mui/icons-material';
import { type Result } from '../hooks/useResultList';

interface ResultTableProps {
  results: Result[];
  onUpload: () => void;
  onResultSelect: (result: Result) => void;
  selectedResultId?: string;
}

const ResultTable = ({ results, onUpload, onResultSelect, selectedResultId }: ResultTableProps) => {
  const theme = useTheme();

  const getStatusColor = (status: Result['feeStatus']) => {
    switch (status) {
      case 'Published':
        return 'success';
      case 'Upload':
        return 'warning';
      case 'Partial':
        return 'info';
      case 'Locked':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: Result['feeStatus']) => {
    switch (status) {
      case 'Published':
        return 'Published';
      case 'Upload':
        return 'Upload';
      case 'Partial':
        return 'Partial';
      case 'Locked':
        return 'Locked';
      default:
        return status;
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Upload Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, flexShrink: 0 }}>
        <Button
          variant="outlined"
          startIcon={<Upload />}
          onClick={onUpload}
          sx={{
            textTransform: 'none',
            borderColor: theme.palette.grey[400],
            color: theme.palette.grey[600],
            backgroundColor: theme.palette.grey[50],
            '&:hover': {
              backgroundColor: theme.palette.grey[100],
              borderColor: theme.palette.grey[500],
            },
          }}
        >
          UPLOAD RESULT
        </Button>
      </Box>

      {/* Table - Takes remaining space */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <TableContainer 
          component={Paper} 
          sx={{ 
            flexGrow: 1,
            height: '100%',
            maxHeight: 'calc(100vh - 400px)', // Prevent overflow
            borderRadius: 3,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f1f5f9',
            overflow: 'auto',
            boxSizing: 'border-box',
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
              {results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No results found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                results.map((result) => (
                  <TableRow
                    key={result.id}
                    hover
                    onClick={() => onResultSelect(result)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: selectedResultId === result.id ? theme.palette.primary.light + '20' : 'transparent',
                      '&:hover': {
                        backgroundColor: selectedResultId === result.id 
                          ? theme.palette.primary.light + '30' 
                          : theme.palette.grey[50],
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {result.studentId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {result.studentName}
                      </Typography>
                    </TableCell>
                    <TableCell>{result.course}</TableCell>
                    <TableCell>{result.semester}</TableCell>
                    <TableCell>{result.center}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(result.feeStatus)}
                        size="small"
                        color={getStatusColor(result.feeStatus) as any}
                        variant="outlined"
                        sx={{
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Bottom Navigation */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        mt: 2, 
        flexShrink: 0,
        justifyContent: 'center',
      }}>
        <Button
          variant="outlined"
          size="small"
          sx={{
            textTransform: 'none',
            borderColor: theme.palette.warning.main,
            color: theme.palette.warning.main,
            '&:hover': {
              backgroundColor: theme.palette.warning.light + '20',
            },
          }}
        >
          Pending Results
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{
            textTransform: 'none',
            borderColor: theme.palette.success.main,
            color: theme.palette.success.main,
            '&:hover': {
              backgroundColor: theme.palette.success.light + '20',
            },
          }}
        >
          Published Results
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{
            textTransform: 'none',
            borderColor: theme.palette.error.main,
            color: theme.palette.error.main,
            '&:hover': {
              backgroundColor: theme.palette.error.light + '20',
            },
          }}
        >
          Locked Students
        </Button>
      </Box>
    </Box>
  );
};

export default ResultTable;
