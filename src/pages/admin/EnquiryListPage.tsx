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
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { useInquiryList } from '../../hooks/useInquiryList';

const EnquiryListPage = () => {
  const { data, isLoading, error } = useInquiryList();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading enquiries: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  const inquiries = data?.data || [];
  const totalCount = data?.total || inquiries.length;

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
          Enquiry List
        </Typography>
        <Chip
          label={`Total: ${totalCount}`}
          color="primary"
          sx={{ fontWeight: 'bold', fontSize: '1rem' }}
        />
      </Box>

      {inquiries.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No enquiries found
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Full Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Inquiry Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Program of Interest</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', minWidth: 300 }}>Message</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Date</TableCell>
                {data?.data?.[0]?.status && (
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{inquiry.fullName}</TableCell>
                  <TableCell>{inquiry.email}</TableCell>
                  <TableCell>{inquiry.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={inquiry.inquiryType ? inquiry.inquiryType.charAt(0).toUpperCase() + inquiry.inquiryType.slice(1) : 'N/A'}
                      size="small"
                      sx={{
                        backgroundColor: inquiry.inquiryType === 'student' ? '#e3f2fd' : '#fff3e0',
                        color: inquiry.inquiryType === 'student' ? '#1976d2' : '#f57c00',
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={inquiry.programOfInterest}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300, whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {inquiry.message}
                  </TableCell>
                  <TableCell>
                    {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  {inquiry.status && (
                    <TableCell>
                      <Chip
                        label={inquiry.status}
                        size="small"
                        color={inquiry.status === 'Resolved' ? 'success' : 'default'}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default EnquiryListPage;
