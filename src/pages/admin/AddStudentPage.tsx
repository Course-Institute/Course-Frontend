import { useState } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddStudentForm from '../../components/AddStudentForm';
import AcademicQualificationsForm from '../../components/AcademicQualificationsForm';
import { useAddStudent, type AddStudentData } from '../../hooks/useAddStudent';

interface AcademicData {
  secondary: any;
  srSecondary: any;
  graduation: any;
  postGraduation: any;
  other: any;
}

const steps = ['Personal Information', 'Academic Qualifications'];

const AddStudentPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [personalData, setPersonalData] = useState<AddStudentData | null>(null);
  const [, setAcademicData] = useState<AcademicData | null>(null);
  
  const { addStudent, isSubmitting, error: submitError, isSuccess } = useAddStudent();

  const handlePersonalDataNext = (data: AddStudentData) => {
    setPersonalData(data);
    setActiveStep(1);
  };

  const handleAcademicDataNext = (data: AcademicData) => {
    setAcademicData(data);
    handleFinalSubmit(data);
  };

  const handleBack = () => {
    setActiveStep(0);
  };

  const handleFinalSubmit = async (academicData: AcademicData) => {
    if (!personalData) return;

    try {
      // Create FormData and filter out empty values
      const formDataToSend = new FormData();
      
      // Add personal data (excluding empty values)
      Object.keys(personalData).forEach(key => {
        const value = personalData[key as keyof AddStudentData];
        if (value && typeof value === 'string' && value.trim() !== '') {
          formDataToSend.append(key, value);
        } else if (value instanceof File) {
          formDataToSend.append(key, value);
        }
      });
      
      // Add academic qualifications (excluding empty values)
      Object.keys(academicData).forEach(level => {
        const qualification = academicData[level as keyof AcademicData];
        if (qualification) {
          Object.keys(qualification).forEach(field => {
            const value = qualification[field as keyof typeof qualification];
            if (value && typeof value === 'string' && value.trim() !== '') {
              formDataToSend.append(`academicQualifications[${level}][${field}]`, value);
            } else if (value instanceof File) {
              formDataToSend.append(`academicQualifications[${level}][${field}]`, value);
            }
          });
        }
      });

      await addStudent(formDataToSend);
      
      // Reset form after successful submission
      setTimeout(() => {
        setActiveStep(0);
        setPersonalData(null);
        setAcademicData(null);
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <AddStudentForm
            onNext={handlePersonalDataNext}
            onClose={() => {}} // Not used in page mode
            isStepMode={true}
          />
        );
      case 1:
        return (
          <AcademicQualificationsForm
            onNext={handleAcademicDataNext}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      p: 3,
    }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 2 }}>
            Add New Student
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Complete the student registration process by filling out the personal information and academic qualifications.
          </Typography>
        </Box>

        {/* Stepper */}
        <Card sx={{ mb: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontWeight: activeStep === steps.indexOf(label) ? 'bold' : 'normal',
                        color: activeStep === steps.indexOf(label) ? '#3b82f6' : '#6b7280',
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        {/* Success Alert */}
        {isSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Student added successfully! Redirecting...
          </Alert>
        )}

        {/* Form Content */}
        <Card sx={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            {isSubmitting ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                py: 8 
              }}>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Submitting student information...
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Please wait while we process your request.
                </Typography>
              </Box>
            ) : (
              renderStepContent(activeStep)
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AddStudentPage;
