import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { Close, Send, School, CheckCircle, Error } from '@mui/icons-material';
import { useSubmitInquiry } from '../hooks/useSubmitInquiry';

interface InquiryDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

const InquiryDialog = ({ open, onClose, title = "Ready to Start Your Journey?", subtitle = "Take the first step toward a brighter future. Connect with our admissions team to explore your best-fit program and career opportunities." }: InquiryDialogProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    programOfInterest: '',
    message: '',
    inquiryType: 'student' as 'student' | 'center'
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    programOfInterest: '',
    message: '',
    inquiryType: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const submitInquiryMutation = useSubmitInquiry();

  const programs = [
    ' ograms',
    'Vocational Programs',
    'Yoga & Naturopathy',
    'IT Programmes',
    'Fire Safety',
    'NTT (Nursery Teacher Training)',
    'Beauty & Wellness',
    'Apparel & Fashion',
    'Agriculture'
  ];

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {
      fullName: '',
      email: '',
      phone: '',
      programOfInterest: '',
      message: '',
      inquiryType: ''
    };

    let isValid = true;

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
      isValid = false;
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full Name must be at least 2 characters';
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
      isValid = false;
    }

    // Program of Interest validation
    if (!formData.programOfInterest) {
      newErrors.programOfInterest = 'Please select a program of interest';
      isValid = false;
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: string) => (event: any) => {
    const value = event.target.value;
    
    // Phone number formatting - only allow digits and limit to 10
    if (field === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setFormData(prev => ({
          ...prev,
          [field]: digitsOnly
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShowError(true);
      setErrorMessage('Please fill in all required fields correctly');
      return;
    }

    submitInquiryMutation.mutate(formData, {
      onSuccess: (data) => {
        console.log('Inquiry submitted successfully:', data);
        setShowSuccess(true);
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            programOfInterest: '',
            message: '',
            inquiryType: 'student'
          });
          setErrors({
            fullName: '',
            email: '',
            phone: '',
            programOfInterest: '',
            message: '',
            inquiryType: ''
          });
          onClose();
        }, 2000);
      },
      onError: (error: any) => {
        console.error('Submission error:', error);
        setErrorMessage(error?.response?.data?.message || 'Failed to submit inquiry. Please try again.');
        setShowError(true);
      },
    });
  };

  const handleClose = () => {
    if (!submitInquiryMutation.isPending) {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        programOfInterest: '',
        message: '',
        inquiryType: 'student'
      });
      setErrors({
        fullName: '',
        email: '',
        phone: '',
        programOfInterest: '',
        message: '',
        inquiryType: ''
      });
      onClose();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            mt:10,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
            position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
              borderRadius: '50%',
              zIndex: 0,
            }
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                  color: 'white',
                  borderRadius: 3,
                  p: 2,
                  mr: 3,
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <School sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}
                >
                  {title}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#64748b', 
                    fontSize: '1.1rem',
                    lineHeight: 1.6
                  }}
                >
                  {subtitle}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={handleClose}
              disabled={submitInquiryMutation.isPending}
              sx={{
                color: '#64748b',
                backgroundColor: 'rgba(100, 116, 139, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(100, 116, 139, 0.2)',
                  color: '#1e293b'
                },
                '&:disabled': {
                  opacity: 0.5,
                  cursor: 'not-allowed'
                },
                borderRadius: 2,
                p: 1.5
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

      <Divider />

        <DialogContent sx={{ pt: 3, position: 'relative', zIndex: 1 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
              {/* Full Name */}
              <TextField
                fullWidth
                label="Full Name"
                value={formData.fullName}
                onChange={handleInputChange('fullName')}
                error={!!errors.fullName}
                helperText={errors.fullName}
                disabled={submitInquiryMutation.isPending}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2563eb',
                      borderWidth: 2,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2563eb',
                      borderWidth: 2,
                    },
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#dc2626',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#2563eb',
                  },
                  '& .MuiInputLabel-root.Mui-error': {
                    color: '#dc2626',
                  },
                }}
              />

              {/* Email */}
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                disabled={submitInquiryMutation.isPending}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2563eb',
                      borderWidth: 2,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2563eb',
                      borderWidth: 2,
                    },
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#dc2626',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#2563eb',
                  },
                  '& .MuiInputLabel-root.Mui-error': {
                    color: '#dc2626',
                  },
                }}
              />
            </Box>

            {/* Inquiry Type */}
            <FormControl fullWidth error={!!errors.inquiryType} disabled={submitInquiryMutation.isPending} sx={{ mb: 3 }}>
              <InputLabel>Inquiry Type</InputLabel>
              <Select
                value={formData.inquiryType}
                onChange={handleInputChange('inquiryType')}
                label="Inquiry Type"
                sx={{
                  borderRadius: 3,
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2563eb',
                    borderWidth: 2,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2563eb',
                    borderWidth: 2,
                  },
                  '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#dc2626',
                    borderWidth: 2,
                  },
                }}
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="center">Center</MenuItem>
              </Select>
              {errors.inquiryType && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errors.inquiryType}
                </Typography>
              )}
            </FormControl>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
              {/* Phone */}
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                error={!!errors.phone}
                helperText={errors.phone || "Enter 10-digit phone number"}
                disabled={submitInquiryMutation.isPending}
                inputProps={{ maxLength: 10 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2563eb',
                      borderWidth: 2,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2563eb',
                      borderWidth: 2,
                    },
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#dc2626',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#2563eb',
                  },
                  '& .MuiInputLabel-root.Mui-error': {
                    color: '#dc2626',
                  },
                }}
              />

              {/* Program of Interest */}
              <FormControl fullWidth error={!!errors.programOfInterest} disabled={submitInquiryMutation.isPending}>
                <InputLabel>Program of Interest</InputLabel>
                <Select
                  value={formData.programOfInterest}
                  onChange={handleInputChange('programOfInterest')}
                  label="Program of Interest"
                  sx={{
                    borderRadius: 3,
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2563eb',
                      borderWidth: 2,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2563eb',
                      borderWidth: 2,
                    },
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#dc2626',
                      borderWidth: 2,
                    },
                  }}
                >
                  {programs.map((program) => (
                    <MenuItem key={program} value={program}>
                      {program}
                    </MenuItem>
                  ))}
                </Select>
                {errors.programOfInterest && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.programOfInterest}
                  </Typography>
                )}
              </FormControl>
            </Box>

            {/* Message */}
            <TextField
              fullWidth
              label="Your Message"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleInputChange('message')}
              error={!!errors.message}
              helperText={errors.message || "Tell us about your goals and any specific questions you have..."}
              disabled={submitInquiryMutation.isPending}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2563eb',
                    borderWidth: 2,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2563eb',
                    borderWidth: 2,
                  },
                  '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#dc2626',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2563eb',
                },
                '& .MuiInputLabel-root.Mui-error': {
                  color: '#dc2626',
                },
              }}
            />

            <Box sx={{ 
              mt: 4, 
              p: 3, 
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
              borderRadius: 3,
              border: '1px solid rgba(37, 99, 235, 0.1)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                borderRadius: '3px 3px 0 0',
              }
            }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#475569',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  fontSize: '0.95rem',
                  lineHeight: 1.6
                }}
              >
                💡 <strong>Note:</strong> Tuition and registration fees are shared upon inquiry or by contacting the admissions office directly.
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 4, gap: 2, position: 'relative', zIndex: 1 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={submitInquiryMutation.isPending}
            sx={{
              borderColor: '#d1d5db',
              color: '#64748b',
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: '600',
              '&:hover': {
                borderColor: '#9ca3af',
                backgroundColor: '#f9fafb',
                color: '#374151',
              },
              '&:disabled': {
                opacity: 0.5,
                cursor: 'not-allowed'
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitInquiryMutation.isPending}
            endIcon={submitInquiryMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <Send />}
            sx={{
              background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #059669 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
              },
              '&:disabled': {
                background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                cursor: 'not-allowed'
              },
              borderRadius: 3,
              px: 6,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
              transition: 'all 0.3s ease',
            }}
          >
            {submitInquiryMutation.isPending ? 'Submitting...' : 'Submit Inquiry'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          icon={<CheckCircle />}
          sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
            '& .MuiAlert-action': {
              color: 'white',
            },
          }}
        >
          <Typography sx={{ fontWeight: 'bold' }}>
            🎉 Inquiry submitted successfully! We'll get back to you soon.
          </Typography>
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity="error"
          icon={<Error />}
          sx={{
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
            '& .MuiAlert-action': {
              color: 'white',
            },
          }}
        >
          <Typography sx={{ fontWeight: 'bold' }}>
            ❌ {errorMessage || 'Please check the form and try again.'}
          </Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

export default InquiryDialog;
