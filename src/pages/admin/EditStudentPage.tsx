import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import ErrorBoundary from '../../components/ErrorBoundary';
import AddStudentForm from '../../components/AddStudentForm';
import { getStudentDetails, updateStudent } from '../../api/studentsApi';

const EditStudentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getStudentDetails(id as string);
        // FIXED: support { success, student } BE response
        const student = res?.student || res?.data?.student || res?.data || res;
        if (!mounted) return;
        // Map BE fields to FE keys for the form
        const initialData: any = {
          // Direct string/text fields
          candidateName: student?.candidateName || '',
          motherName: student?.motherName || '',
          fatherName: student?.fatherName || '',
          dateOfBirth: student?.dateOfBirth || '',
          gender: student?.gender || 'Male',
          adharCardNo: student?.adharCardNo || student?.aadharCardNo || '',
          category: student?.category || '',
          employerName: student?.employerName || '',
          isEmployed: student?.isEmployed || 'No',
          designation: student?.designation || '',
          contactNumber: student?.contactNumber || '',
          alternateNumber: student?.alternateNumber || '',
          emailAddress: student?.emailAddress || '',
          currentAddress: student?.currentAddress || '',
          permanentAddress: student?.permanentAddress || '',
          city: student?.city || '',
          state: student?.state || '',
          nationality: student?.nationality || '',
          country: student?.country || '',
          pincode: student?.pincode || '',
          courseType: student?.courseType || student?.faculty || '',
          faculty: student?.faculty || '',
          course: student?.course || '',
          stream: student?.stream || '',
          year: student?.year || '',
          monthSession: student?.monthSession || '',
          hostelFacility: student?.hostelFacility || 'No',
          session: student?.session || '',
          duration: student?.duration || '',
          courseFee: student?.courseFee || '',
          centerId: student?.centerId || '',
          centerName: student?.centerName || '',
          centerCode: student?.centerCode || '',
          center: student?.centerName ? { centerId: student?.centerId, name: student?.centerName } : null,
          // For preview-only: these will be URLs (backwards compatible)
          adharCardFront: student?.adharCardFront || student?.aadharFront || '',
          adharCardBack: student?.adharCardBack || student?.aadharBack || '',
          photo: student?.photo || '',
          signature: student?.signature || '',
        };
        setInitialData(initialData);
        setError(null);
      } catch (e: any) {
        setError(e?.message || 'Failed to load student details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
    return () => { mounted = false; };
  }, [id]);

  const handleUpdate = async (payload: Record<string, any>) => {
    await updateStudent(id as string, payload);
    // After successful update, navigate back to students list
    navigate('/admin/students');
  };

  return (
    <ErrorBoundary>
      <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc', p: 3 }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 2 }}>
              Edit Student
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Update the student details below. Only changed fields will be updated.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          )}

          <Card sx={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              {loading || !initialData ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
                  <CircularProgress size={60} sx={{ mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Loading student details...
                  </Typography>
                </Box>
              ) : (
                <AddStudentForm
                  onClose={() => {}}
                  onNext={() => {}}
                  isStepMode={false}
                  initialData={initialData}
                  onSubmitOverride={handleUpdate}
                />
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default EditStudentPage;
