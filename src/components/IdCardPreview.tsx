import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  useTheme,
  Skeleton,
  Alert,
  Button,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { useIdCardPreview } from '../hooks/useIdCardPreview';

interface IdCardPreviewProps {
  selectedStudentId: string | null;
}

const IdCardPreview = ({ selectedStudentId }: IdCardPreviewProps) => {
  const theme = useTheme();
  const { 
    idCardPreview: student, 
    isIdCardPreviewLoading: isLoading, 
    idCardPreviewError: error 
  } = useIdCardPreview(selectedStudentId || '');

  if (!selectedStudentId) {
    return (
      <Box sx={{ width: 300 }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
          ID Card Preview
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 400,
            border: `2px dashed ${theme.palette.grey[300]}`,
            borderRadius: 2,
            backgroundColor: theme.palette.grey[50],
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Select a student to preview ID card
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: 300 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          ID Card Preview
        </Typography>
        <Alert severity="error">
          {error?.message || 'Failed to load student data'}
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ width: 300 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          ID Card Preview
        </Typography>
        <Card sx={{ width: 280, height: 400 }}>
          <CardContent sx={{ p: 3 }}>
            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="50%" height={20} />
          </CardContent>
        </Card>
      </Box>
    );
  }

  const handleDownloadIdCard = () => {
    // TODO: Implement ID card download functionality
    console.log('Downloading ID card for:', student?.candidateName);
  };

  return (
    <Box sx={{ width: 400 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          ID Card Preview
        </Typography>
        {student?.idCardStatus === 'generated' && (
          <Button
            variant="contained"
            size="small"
            startIcon={<Download />}
            onClick={handleDownloadIdCard}
            sx={{ textTransform: 'none' }}
          >
            Download
          </Button>
        )}
      </Box>
      <Card
        sx={{
          width: 280,
          height: 400,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 80,
            height: 80,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
          },
        }}
      >
        <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          {/* Institution Name */}
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 3,
              fontSize: '1.1rem',
            }}
          >
            MIVPS
          </Typography>

          {/* Student Photo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar
              src={student?.photo ? (() => {
                const baseUrl = import.meta.env.VITE_APP_ENDPOINT || 'http://localhost:5000';
                const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
                const cleanPhotoPath = student.photo.startsWith('/') ? student.photo : `/${student.photo}`;
                return `${cleanBaseUrl}${cleanPhotoPath}`;
              })() : undefined}
              sx={{
                width: 80,
                height: 80,
                border: '3px solid white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              {student?.candidateName?.charAt(0)}
            </Avatar>
          </Box>

          {/* Student Details */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 1,
                fontSize: '1rem',
              }}
            >
              {student?.candidateName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                mb: 0.5,
                opacity: 0.9,
                fontSize: '0.9rem',
              }}
            >
              {student?.registrationNo}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                mb: 0.5,
                opacity: 0.9,
                fontSize: '0.9rem',
              }}
            >
              {student?.course} - {student?.stream}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                opacity: 0.9,
                fontSize: '0.9rem',
              }}
            >
              {student?.year} - {student?.session}
            </Typography>
          </Box>

          {/* QR Code */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              height: 60,
            }}
          >
            <Box
              component="img"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${encodeURIComponent(
                `${student?.candidateName} - ${student?.registrationNo} - MIVPS`
              )}`}
              alt="QR Code"
              sx={{
                width: 50,
                height: 50,
                backgroundColor: 'white',
                borderRadius: 1,
                p: 0.5,
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default IdCardPreview;
