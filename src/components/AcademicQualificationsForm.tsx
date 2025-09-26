import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

interface AcademicQualificationsFormProps {
  onNext: (data: AcademicData) => void;
  onBack: () => void;
}

interface AcademicData {
  secondary: QualificationData;
  srSecondary: QualificationData;
  graduation: QualificationData;
  postGraduation: QualificationData;
  other: QualificationData;
}

interface QualificationData {
  yearOfPassing: string;
  boardUniversity: string;
  totalMarks: string;
  marksObtained: string;
  grade: string;
  document: File | null;
}

const AcademicQualificationsForm = ({ onNext, onBack }: AcademicQualificationsFormProps) => {
  const [academicData, setAcademicData] = useState<AcademicData>({
    secondary: {
      yearOfPassing: '',
      boardUniversity: '',
      totalMarks: '',
      marksObtained: '',
      grade: '',
      document: null,
    },
    srSecondary: {
      yearOfPassing: '',
      boardUniversity: '',
      totalMarks: '',
      marksObtained: '',
      grade: '',
      document: null,
    },
    graduation: {
      yearOfPassing: '',
      boardUniversity: '',
      totalMarks: '',
      marksObtained: '',
      grade: '',
      document: null,
    },
    postGraduation: {
      yearOfPassing: '',
      boardUniversity: '',
      totalMarks: '',
      marksObtained: '',
      grade: '',
      document: null,
    },
    other: {
      yearOfPassing: '',
      boardUniversity: '',
      totalMarks: '',
      marksObtained: '',
      grade: '',
      document: null,
    },
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (level: keyof AcademicData, field: keyof QualificationData, value: string | File | null) => {
    setAcademicData(prev => ({
      ...prev,
      [level]: {
        ...prev[level],
        [field]: value,
      },
    }));
    
    // Clear error when user starts typing
    const errorKey = `${level}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleFileChange = (level: keyof AcademicData, file: File | null) => {
    if (file) {
      // Check file type
      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, [`${level}_document`]: 'Only JPG and PDF files are allowed' }));
        return;
      }
      
      // Check file size (2MB = 2 * 1024 * 1024 bytes)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, [`${level}_document`]: 'File size cannot exceed 2MB' }));
        return;
      }
    }
    
    // Clear any existing errors for this field
    setErrors(prev => ({ ...prev, [`${level}_document`]: '' }));
    handleInputChange(level, 'document', file);
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Validate each qualification level
    Object.entries(academicData).forEach(([level, data]) => {
      // Check if at least one field is filled for each level
      const hasData = Object.values(data).some(value => 
        value !== null && value !== '' && !(value instanceof File)
      );

      if (hasData) {
        // If any field is filled, validate required fields
        if (!data.yearOfPassing) {
          newErrors[`${level}_yearOfPassing`] = 'Year of Passing is required';
        }
        if (!data.boardUniversity) {
          newErrors[`${level}_boardUniversity`] = 'Board/University is required';
        }
        if (!data.totalMarks) {
          newErrors[`${level}_totalMarks`] = 'Total Marks is required';
        }
        if (!data.marksObtained) {
          newErrors[`${level}_marksObtained`] = 'Marks Obtained is required';
        }
        if (!data.grade) {
          newErrors[`${level}_grade`] = 'Grade is required';
        }

        // Validate numeric fields
        if (data.totalMarks && isNaN(Number(data.totalMarks))) {
          newErrors[`${level}_totalMarks`] = 'Total Marks must be a number';
        }
        if (data.marksObtained && isNaN(Number(data.marksObtained))) {
          newErrors[`${level}_marksObtained`] = 'Marks Obtained must be a number';
        }

        // Validate year
        if (data.yearOfPassing && (Number(data.yearOfPassing) < 1950 || Number(data.yearOfPassing) > new Date().getFullYear())) {
          newErrors[`${level}_yearOfPassing`] = 'Please enter a valid year';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onNext(academicData);
  };

  const renderQualificationRow = (level: keyof AcademicData, label: string) => {
    const data = academicData[level];
    
    return (
      <TableRow key={level}>
        <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
          {label}
        </TableCell>
        <TableCell>
          <TextField
            fullWidth
            size="small"
            value={data.yearOfPassing}
            onChange={(e) => handleInputChange(level, 'yearOfPassing', e.target.value)}
            error={!!errors[`${level}_yearOfPassing`]}
            helperText={errors[`${level}_yearOfPassing`]}
            placeholder="Year"
            type="number"
            inputProps={{ min: 1950, max: new Date().getFullYear() }}
          />
        </TableCell>
        <TableCell>
          <TextField
            fullWidth
            size="small"
            value={data.boardUniversity}
            onChange={(e) => handleInputChange(level, 'boardUniversity', e.target.value)}
            error={!!errors[`${level}_boardUniversity`]}
            helperText={errors[`${level}_boardUniversity`]}
            placeholder="Board/University"
          />
        </TableCell>
        <TableCell>
          <TextField
            fullWidth
            size="small"
            value={data.totalMarks}
            onChange={(e) => handleInputChange(level, 'totalMarks', e.target.value)}
            error={!!errors[`${level}_totalMarks`]}
            helperText={errors[`${level}_totalMarks`]}
            placeholder="Total Marks"
            type="number"
            inputProps={{ min: 0 }}
          />
        </TableCell>
        <TableCell>
          <TextField
            fullWidth
            size="small"
            value={data.marksObtained}
            onChange={(e) => handleInputChange(level, 'marksObtained', e.target.value)}
            error={!!errors[`${level}_marksObtained`]}
            helperText={errors[`${level}_marksObtained`]}
            placeholder="Marks Obtained"
            type="number"
            inputProps={{ min: 0 }}
          />
        </TableCell>
        <TableCell>
          <TextField
            fullWidth
            size="small"
            value={data.grade}
            onChange={(e) => handleInputChange(level, 'grade', e.target.value)}
            error={!!errors[`${level}_grade`]}
            helperText={errors[`${level}_grade`]}
            placeholder="Grade"
          />
        </TableCell>
        <TableCell>
          <Box>
            <input
              type="file"
              accept=".jpg,.jpeg,.pdf"
              onChange={(e) => handleFileChange(level, e.target.files?.[0] || null)}
              style={{ display: 'none' }}
              id={`${level}-upload`}
            />
            <label htmlFor={`${level}-upload`}>
              <Button
                variant="outlined"
                component="span"
                size="small"
                fullWidth
                sx={{ textTransform: 'none' }}
              >
                {data.document ? data.document.name : 'Choose File'}
              </Button>
            </label>
            {data.document && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {data.document.name}
              </Typography>
            )}
            {errors[`${level}_document`] && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {errors[`${level}_document`]}
              </Typography>
            )}
          </Box>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1e293b' }}>
        Academic Qualifications
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#3b82f6' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Examination</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Year of Passing</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Board/University</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total Marks</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Marks Obtained</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Grade</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Upload Documents</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderQualificationRow('secondary', 'Secondary')}
            {renderQualificationRow('srSecondary', 'Sr. Secondary')}
            {renderQualificationRow('graduation', 'Graduation')}
            {renderQualificationRow('postGraduation', 'Post Graduation')}
            {renderQualificationRow('other', 'Other')}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{
            borderColor: '#6b7280',
            color: '#6b7280',
            '&:hover': { 
              borderColor: '#4b5563',
              backgroundColor: '#f9fafb',
            },
            textTransform: 'none',
            px: 4,
            py: 1.5,
          }}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#3b82f6',
            '&:hover': { backgroundColor: '#2563eb' },
            textTransform: 'none',
            px: 4,
            py: 1.5,
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default AcademicQualificationsForm;
