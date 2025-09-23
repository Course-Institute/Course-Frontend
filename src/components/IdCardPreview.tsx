import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  useTheme,
  Skeleton,
} from '@mui/material';
import { useStudentDetails } from '../hooks/useStudentDetails';

interface IdCardPreviewProps {
  selectedStudentId: string | null;
}

const IdCardPreview = ({ selectedStudentId }: IdCardPreviewProps) => {
  const theme = useTheme();
  const { data: student, isLoading } = useStudentDetails(selectedStudentId);

  if (!selectedStudentId) {
    return (
      <Box sx={{ width: 300 }}>
        <Typography variant="h1" sx={{ mb: 2, color: 'text.secondary' }}>
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

  return (
    <Box sx={{ width: 400 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        ID Card Preview
      </Typography>
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
            VIET ACADEMY
          </Typography>

          {/* Student Photo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar
              src={student?.profileImage}
              sx={{
                width: 80,
                height: 80,
                border: '3px solid white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              {student?.name?.charAt(0)}
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
              {student?.name}
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
              {student?.studentId}
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
              {student?.course}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                opacity: 0.9,
                fontSize: '0.9rem',
              }}
            >
              {student?.semester}
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
            {student?.qrCode ? (
              <Box
                component="img"
                src={student.qrCode}
                alt="QR Code"
                sx={{
                  width: 50,
                  height: 50,
                  backgroundColor: 'white',
                  borderRadius: 1,
                  p: 0.5,
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  backgroundColor: 'white',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: 'black', fontSize: '8px', textAlign: 'center' }}
                >
                  QR Code
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default IdCardPreview;
