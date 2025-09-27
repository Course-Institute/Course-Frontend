import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddStudentForm from '../../components/AddStudentForm';
import { useAddStudent } from '../../hooks/useAddStudent';

const AddStudentPage = () => {
  const { isSubmitting, error: submitError, isSuccess } = useAddStudent();

  const handleFormSubmit = () => {
    // Form submission is now handled directly in AddStudentForm
    // This function is just a placeholder for any page-level logic if needed
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
            Complete the student registration by filling out the personal information form.
          </Typography>
        </Box>

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
              <AddStudentForm
                onClose={() => {}} // Not used in page mode
                onNext={handleFormSubmit}
                isStepMode={false} // Direct submission mode
              />
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AddStudentPage;
