import { useState } from 'react';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';
import LayoutWrapper from '../components/LayoutWrapper';
import { verifyStudentByRegistrationNo } from '../api/studentApi';
import { Box, Typography, TextField, Button, Alert, CircularProgress, Card, CardContent } from '@mui/material';
import { CheckCircle, Cancel, Search } from '@mui/icons-material';

interface VerificationResult {
  verified: boolean;
  student?: {
    registrationNo: string;
    candidateName: string;
    course: string;
    faculty: string;
    stream: string;
    year: string;
    session: string;
    isApprovedByAdmin?: boolean;
    isMarksheetAndCertificateApproved?: boolean;
  };
  message?: string;
}

const VerificationPage = () => {
  const [registrationNo, setRegistrationNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!registrationNo.trim()) {
      setError('Please enter a registration number');
      return;
    }

    setLoading(true);
    try {
      const response = await verifyStudentByRegistrationNo(registrationNo.trim());
      setResult({
        verified: true,
        student: {
          registrationNo: response.data.registrationNo,
          candidateName: response.data.candidateName,
          course: response.data.course,
          faculty: response.data.faculty,
          stream: response.data.stream,
          year: response.data.year,
          session: response.data.session,
          isApprovedByAdmin: response.data.isApprovedByAdmin,
          isMarksheetAndCertificateApproved: response.data.isMarksheetAndCertificateApproved,
        },
      });
    } catch (err: any) {
      if (err.response?.status === 404) {
        setResult({
          verified: false,
          message: 'Student not found with this registration number',
        });
      } else {
        setError(err.response?.data?.message || 'Failed to verify student. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <LayoutWrapper backgroundColor="transparent">
        <Box
          sx={{
            flex: 1,
            py: 8,
            background: `
              linear-gradient(135deg, rgba(248, 250, 252, 0.85) 0%, rgba(241, 245, 249, 0.85) 100%),
              url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            width: '100%',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(248, 250, 252, 0.5) 100%)',
              zIndex: 0,
            },
          }}
        >
          <Box sx={{ maxWidth: '800px', margin: '0 auto', px: 4, position: 'relative', zIndex: 1 }}>
            {/* Page Header */}
            <Box 
              sx={{ 
                textAlign: 'center', 
                mb: 6,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                p: 4,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3rem' },
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                Student Verification
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#475569',
                  maxWidth: '600px',
                  margin: '0 auto',
                  lineHeight: 1.6,
                  fontWeight: 500,
                }}
              >
                Verify student registration status by entering the registration number below
              </Typography>
            </Box>

            {/* Verification Form */}
            <Card
              sx={{
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                borderRadius: 3,
                mb: 4,
                border: '1px solid rgba(37, 99, 235, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <form onSubmit={handleSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                      label="Registration Number"
                      variant="outlined"
                      value={registrationNo}
                      onChange={(e) => setRegistrationNo(e.target.value)}
                      required
                      fullWidth
                      disabled={loading}
                      placeholder="Enter student registration number"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          fontSize: '1rem',
                          '& fieldset': {
                            borderWidth: 2,
                            borderColor: '#e5e7eb',
                          },
                          '&:hover fieldset': {
                            borderColor: '#2563eb',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2563eb',
                            borderWidth: 2,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem',
                          fontWeight: 500,
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading || !registrationNo.trim()}
                      size="large"
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Search />}
                      sx={{
                        background: registrationNo.trim() && !loading
                          ? 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)'
                          : '#9ca3af',
                        color: 'white',
                        py: 1.8,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        fontSize: '1.15rem',
                        textTransform: 'none',
                        boxShadow: registrationNo.trim() && !loading
                          ? '0 10px 25px rgba(37, 99, 235, 0.4)'
                          : 'none',
                        '&:hover': {
                          background: registrationNo.trim() && !loading
                            ? 'linear-gradient(135deg, #1d4ed8 0%, #059669 100%)'
                            : '#9ca3af',
                          transform: registrationNo.trim() && !loading ? 'translateY(-2px)' : 'none',
                          boxShadow: registrationNo.trim() && !loading
                            ? '0 15px 35px rgba(37, 99, 235, 0.5)'
                            : 'none',
                        },
                        '&:disabled': {
                          background: '#9ca3af',
                          color: 'white',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {loading ? 'Verifying...' : 'Verify Student'}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>

            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Verification Result */}
            {result && (
              <Card
                sx={{
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                  borderRadius: 3,
                  border: result.verified ? '3px solid #10b981' : '3px solid #ef4444',
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  animation: 'fadeIn 0.5s ease-in',
                  '@keyframes fadeIn': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(20px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {result.verified && result.student ? (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <CheckCircle sx={{ color: '#10b981', fontSize: 40 }} />
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#10b981' }}>
                          Student Verified
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                              Registration Number
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                              {result.student.registrationNo}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                              Student Name
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                              {result.student.candidateName}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                              Course
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                              {result.student.course}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                              Faculty
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                              {result.student.faculty}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                              Stream
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                              {result.student.stream}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                              Year
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                              {result.student.year}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                              Session
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                              {result.student.session}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                              Admin Approval Status
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 'bold',
                                color: result.student.isApprovedByAdmin ? '#10b981' : '#ef4444',
                              }}
                            >
                              {result.student.isApprovedByAdmin ? 'Approved' : 'Pending'}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Status Badges */}
                        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#475569' }}>
                            Additional Status:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {result.student.isMarksheetAndCertificateApproved && (
                              <Box
                                sx={{
                                  px: 2,
                                  py: 0.5,
                                  backgroundColor: '#2563eb',
                                  color: 'white',
                                  borderRadius: 1,
                                  fontSize: '0.875rem',
                                  fontWeight: 'bold',
                                }}
                              >
                                Certificate Approved
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                        <Cancel sx={{ color: '#ef4444', fontSize: 40 }} />
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ef4444' }}>
                          Student Not Found
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: '#64748b' }}>
                        {result.message || 'No student found with the provided registration number. Please verify the registration number and try again.'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
      </LayoutWrapper>
      
      <FooterSection />
    </div>
  );
};

export default VerificationPage;

