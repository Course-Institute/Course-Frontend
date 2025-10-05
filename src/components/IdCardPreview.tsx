import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import { Person, School } from '@mui/icons-material';

interface IdCardPreviewProps {
  student?: {
    _id: string;
    candidateName: string;
    registrationNo: string;
    course: string;
    faculty: string;
    stream: string;
    year: string;
    session: string;
    contactNumber?: string;
    emailAddress?: string;
    dateOfBirth?: string;
  };
  instituteName?: string;
  instituteLogo?: string;
}

const IdCardPreview: React.FC<IdCardPreviewProps> = ({
  student,
  instituteName = "MIVPSA Institute",
  instituteLogo
}) => {
  if (!student) {
    return (
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          height: 250,
          border: '2px dashed #ccc',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No student selected
        </Typography>
      </Box>
    );
  }

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 400,
        height: 250,
        borderRadius: 3,
        boxShadow: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 100,
          height: 100,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          transform: 'translate(30px, -30px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 80,
          height: 80,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          transform: 'translate(-20px, 20px)',
        }}
      />

      <CardContent sx={{ p: 2, height: '100%', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
              {instituteName}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Student ID Card
            </Typography>
          </Box>
          {instituteLogo && (
            <Avatar
              src={instituteLogo}
              sx={{ width: 40, height: 40, border: '2px solid white' }}
            />
          )}
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />

        {/* Student Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Person sx={{ fontSize: 16, mr: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {student.candidateName}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <School sx={{ fontSize: 16, mr: 1 }} />
            <Typography variant="caption">
              {student.course} - {student.stream}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Reg No: {student.registrationNo}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Year: {student.year}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip
              label={student.faculty}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '0.7rem',
                height: 20,
              }}
            />
            <Chip
              label={student.session}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '0.7rem',
                height: 20,
              }}
            />
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            fontSize: '0.6rem',
            opacity: 0.8,
          }}
        >
          Valid for Academic Year {student.year}
        </Box>
      </CardContent>
    </Card>
  );
};

export default IdCardPreview;
