import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Skeleton,
  Divider,
} from '@mui/material';
import { QrCode } from '@mui/icons-material';
import { type Result } from '../hooks/useResultList';

interface MarksheetPreviewProps {
  selectedResult: Result | null;
  isLoading?: boolean;
}

const MarksheetPreview = ({ selectedResult, isLoading = false }: MarksheetPreviewProps) => {
  const theme = useTheme();

  if (!selectedResult) {
    return (
      <Box sx={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            border: `2px dashed ${theme.palette.grey[300]}`,
            borderRadius: 3,
            backgroundColor: theme.palette.grey[50],
            p: 4,
          }}
        >
          <QrCode sx={{ fontSize: 64, color: theme.palette.grey[400], mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Preview Marksheet
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Select a student from the table to preview their marksheet
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
      }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
          Preview Marksheet
        </Typography>
        <Card sx={{ 
          width: '100%', 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <CardContent sx={{ p: 3, flexGrow: 1 }}>
            <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" width="100%" height={200} />
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      p: 3,
    }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.text.primary }}>
        Preview Marksheet
      </Typography>
      
      <Card
        sx={{
          width: '100%',
          height: '100%',
          background: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: 3,
          border: '1px solid #e2e8f0',
        }}
      >
        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Student Information */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
              Student Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Student ID:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{selectedResult.studentId}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Name:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{selectedResult.studentName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Course:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{selectedResult.course}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Year:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>2025</Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Subject Marks Table */}
          {selectedResult.subjects && selectedResult.subjects.length > 0 ? (
            <Box sx={{ mb: 3, flexGrow: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
                Subject Marks
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Marks</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Out of</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>%</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedResult.subjects.map((subject, index) => (
                      <TableRow key={index}>
                        <TableCell>{subject.name}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>{subject.marks}</TableCell>
                        <TableCell>{subject.outOf}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                          {subject.percentage.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexGrow: 1,
              border: `2px dashed ${theme.palette.grey[300]}`,
              borderRadius: 2,
              backgroundColor: theme.palette.grey[50],
            }}>
              <Typography variant="body2" color="text.secondary">
                No marks available for this student
              </Typography>
            </Box>
          )}

          {/* Summary */}
          {selectedResult.totalMarks && selectedResult.percentage && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 'auto',
              pt: 2,
              borderTop: `1px solid ${theme.palette.grey[200]}`,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Marks:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                    {selectedResult.totalMarks}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Percentage:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                    {selectedResult.percentage.toFixed(2)}%
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e2e8f0',
                }}
              >
                <QrCode sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default MarksheetPreview;
