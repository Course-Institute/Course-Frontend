import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Fade,
  Slide,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Email,
  Phone,
  LocationOn,
  School,
  Work,
  Person,
  Security,
  Support,
  ArrowForward,
  Group,
  Description,
  Send,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import InstituteLogo from './InstituteLogo';
import LayoutWrapper from './LayoutWrapper';
import { useSubmitInquiry } from '../hooks/useSubmitInquiry';

const FooterSection = () => {
  const navigate = useNavigate();
  const submitInquiryMutation = useSubmitInquiry();

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
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const programs = [
    'Paramedical Programs',
    'Vocational Programs',
    'Yoga & Naturopathy',
    'IT Programmes',
    'Fire Safety',
    'NTT (Nursery Teacher Training)',
    'Beauty & Wellness',
    'Apparel & Fashion',
    'Agriculture'
  ];

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
    };

    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Required';
      isValid = false;
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Min 2 chars';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Required';
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = '10 digits';
      isValid = false;
    }

    if (!formData.programOfInterest) {
      newErrors.programOfInterest = 'Required';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Min 10 chars';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: string) => (event: any) => {
    const value = event.target.value;
    
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
      setErrorMessage('Please fill all fields correctly');
      return;
    }

    submitInquiryMutation.mutate(formData, {
      onSuccess: () => {
        setShowSuccess(true);
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
          });
        }, 2000);
      },
      onError: (error: any) => {
        setErrorMessage(error?.response?.data?.message || 'Failed to submit. Please try again.');
        setShowError(true);
      },
    });
  };

  const handleLoginClick = (loginType: string) => {
    navigate(`/login?role=${loginType.toLowerCase()}`);
  };

  const handleQuickLinkClick = (link: string) => {
    switch (link) {
      case 'About Us':
        navigate('/about-us');
        break;
      case 'Programs':
        navigate('/programs');
        break;
      case 'Alumni':
        navigate('/alumni');
        break;
      case 'Affiliation':
        navigate('/affiliation');
        break;
      case 'Contact Us':
        navigate('/contact-us');
        break;
      default:
        navigate('/');
    }
  };


  const handlePolicyClick = (policy: string) => {
    console.log(`Navigate to ${policy}`);
    alert(`${policy} page will be available soon!`);
  };

  const features = [
    { icon: <School />, title: 'Quality Education', desc: 'World-class curriculum' },
    { icon: <Work />, title: 'Career Ready', desc: 'Industry-focused training' },
    { icon: <Security />, title: 'Secure Platform', desc: 'Safe & reliable system' },
    { icon: <Support />, title: '24/7 Support', desc: 'Always here to help' },
  ];

  const quickLinks = [
    { name: 'About Us', icon: <Person /> },
    { name: 'Programs', icon: <School /> },
    { name: 'Alumni', icon: <Group /> },
    { name: 'Affiliation', icon: <Description /> },
    { name: 'Contact Us', icon: <Phone /> },
  ];

  const stats = [
    { number: '5000+', label: 'Students Trained' },
    { number: '95%', label: 'Success Rate' },
    { number: '50+', label: 'Expert Faculty' },
    { number: '15+', label: 'Years Experience' },
  ];

  return (
    <LayoutWrapper>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #243647ff 0%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          },
        }}
      >

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          {/* Hero Footer Section */}
          <Box sx={{ py: { xs: 3, md: 4 } }}>
            <Fade in timeout={1000}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 10,
                      backdropFilter: 'blur(20px)',
                      mr: 2,
                    }}
                  >
                  <InstituteLogo width={75} height={75} sx={{borderRadius:10}} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: 'white',
                        mb: 0.5,
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                      }}
                    >
                      MIVPS
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 500,
                        fontSize: { xs: '0.8rem', md: '0.9rem' },
                      }}
                    >
                      Mahavir Institute of Vocational & Paramedical Science
                    </Typography>
                  </Box>
                </Box>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    maxWidth: '600px',
                    mx: 'auto',
                    mb: 2,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    fontWeight: 400,
                    lineHeight: 1.5,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  Empowering the next generation of healthcare and technical professionals.
                </Typography>

                {/* Stats Cards */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
                  gap: 2,
                  mb: 3,
                }}>
                  {stats.map((stat, index) => (
                    <Slide direction="up" in timeout={1200 + index * 200} key={index}>
                      <Card
                        sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: 2,
                          p: 1.5,
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            background: 'rgba(255, 255, 255, 0.15)',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                          },
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            color: 'white',
                            fontWeight: 800,
                            mb: 0.5,
                            fontSize: { xs: '1.3rem', md: '1.6rem' },
                          }}
                        >
                          {stat.number}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontWeight: 500,
                            fontSize: '0.8rem',
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </Card>
                    </Slide>
                  ))}
                </Box>
              </Box>
            </Fade>

               {/* Why Choose MIVPS? - Horizontal strip below main blocks (mobile stacks) */}
               <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' }, mb: 5 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: '1.2rem', md: '1.3rem' },
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  Why Choose MIVPS?
                </Typography>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
                  gap: 2,
                }}>
                  {features.map((feature, index) => (
                    <Fade in timeout={1600 + index * 150} key={index}>
                      <Card
                        sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: 2,
                          p: 2,
                          height: '100%',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            background: 'rgba(255, 255, 255, 0.15)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              p: 1.25,
                              borderRadius: 1.5,
                              background: 'rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              flexShrink: 0,
                            }}
                          >
                            {feature.icon}
                          </Box>
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ color: 'white', fontWeight: 600, mb: 0.25, fontSize: '0.95rem' }}
                            >
                              {feature.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.85rem' }}
                            >
                              {feature.desc}
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </Fade>
                  ))}
                </Box>
              </Box>


            {/* Main Content Grid */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1.5fr' }, 
              gap: { xs: 3, md: 4 },
              mt: 6,
            }}>
              {/* Get In Touch */}
              <Slide direction="right" in timeout={1400}>
                <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          color: 'white',
                          fontWeight: 700,
                          mb: 2,
                          fontSize: { xs: '1.2rem', md: '1.3rem' },
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}
                      >
                        Get In Touch
                      </Typography>
                      {[
                        { icon: <LocationOn />, text: 'Gaur City 1, Sector-04, Greater Noida, Uttar Pradesh' },
                        { icon: <Phone />, text: '+91 93106 55232' },
                        { icon: <Email />, text: `info@mivpsa.in`, anotherText: 'admission@mivpsa.in' },
                      ].map((contact, index) => (
                        <Fade in timeout={1800 + index * 200} key={index}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 1.5,
                              mb: 1.5,
                              p: 1.5,
                              borderRadius: 1.5,
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.15)',
                                transform: 'translateY(-1px)',
                              },
                            }}
                          >
                            <Box
                              sx={{
                                p: 0.75,
                                borderRadius: 0.75,
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                              }}
                            >
                              {contact.icon}
                            </Box>
                            <Box sx={{display:"flex", flexDirection:"column"}}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                lineHeight: 1.4,
                                fontSize: '0.85rem',
                              }}
                            >
                              {contact.text}
                            </Typography>
                            {contact?.anotherText && 
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                lineHeight: 1.4,
                                fontSize: '0.85rem',
                              }}
                            >
                              {contact.anotherText}
                            </Typography>}
                            </Box>
                          </Box>
                        </Fade>
                      ))}

                      {/* Login Buttons */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                        {[
                          { label: 'Student Portal', role: 'Student', color: '#667eea' },
                          { label: 'Center Portal', role: 'Center', color: '#f093fb' },
                          { label: 'Admin Portal', role: 'App', color: '#4facfe' },
                        ].map((portal, index) => (
                          <Fade in timeout={2000 + index * 200} key={index}>
                            <Button
                              onClick={() => handleLoginClick(portal.role)}
                              sx={{
                                background: `linear-gradient(135deg, ${portal.color}, ${portal.color}dd)`,
                                color: 'white',
                                py: 1,
                                borderRadius: 1.5,
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '0.9rem',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: `0 6px 20px ${portal.color}40`,
                                  background: `linear-gradient(135deg, ${portal.color}dd, ${portal.color})`,
                                },
                              }}
                            >
                              {portal.label}
                            </Button>
                          </Fade>
                        ))}
                      </Box>
                </Box>
              </Slide>

                 {/* Quick Links */}
                 <Slide direction="up" in timeout={1500}>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      mb: 2,
                      fontSize: { xs: '1.2rem', md: '1.3rem' },
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    Quick Links
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {quickLinks.map((link, index) => (
                      <Fade in timeout={1700 + index * 200} key={index}>
                        <Button
                          onClick={() => handleQuickLinkClick(link.name)}
                          startIcon={link.icon}
                          endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
                          sx={{
                            color: 'white',
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            p: 1.5,
                            borderRadius: 1.5,
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s ease',
                            fontSize: '0.9rem',
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.2)',
                              transform: 'translateX(5px)',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            },
                          }}
                        >
                          {link.name}
                        </Button>
                      </Fade>
                    ))}
                  </Box>
                </Box>
              </Slide>

              {/* Inquiry Form */}
              <Slide direction="left" in timeout={1600}>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      mb: 2,
                      fontSize: { xs: '1.2rem', md: '1.3rem' },
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Send sx={{ fontSize: '1.3rem' }} />
                    Submit Inquiry
                  </Typography>
                  
                  <Card
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange('fullName')}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        disabled={submitInquiryMutation.isPending}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: 1.5,
                            fontSize: '0.85rem',
                            '&:hover': {
                              backgroundColor: 'white',
                            },
                            '&.Mui-focused': {
                              backgroundColor: 'white',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '0.85rem',
                          },
                          '& .MuiFormHelperText-root': {
                            fontSize: '0.7rem',
                            margin: '4px 0 0',
                          },
                        }}
                      />

                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange('email')}
                          error={!!errors.email}
                          helperText={errors.email}
                          disabled={submitInquiryMutation.isPending}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: 1.5,
                              fontSize: '0.85rem',
                              '&:hover': {
                                backgroundColor: 'white',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.85rem',
                            },
                            '& .MuiFormHelperText-root': {
                              fontSize: '0.7rem',
                              margin: '4px 0 0',
                            },
                          }}
                        />

                        <TextField
                          fullWidth
                          size="small"
                          label="Phone"
                          value={formData.phone}
                          onChange={handleInputChange('phone')}
                          error={!!errors.phone}
                          helperText={errors.phone}
                          disabled={submitInquiryMutation.isPending}
                          inputProps={{ maxLength: 10 }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: 1.5,
                              fontSize: '0.85rem',
                              '&:hover': {
                                backgroundColor: 'white',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '0.85rem',
                            },
                            '& .MuiFormHelperText-root': {
                              fontSize: '0.7rem',
                              margin: '4px 0 0',
                            },
                          }}
                        />
                      </Box>

                      <FormControl fullWidth size="small" error={!!errors.programOfInterest} disabled={submitInquiryMutation.isPending}>
                        <InputLabel sx={{ fontSize: '0.85rem' }}>Program</InputLabel>
                        <Select
                          value={formData.programOfInterest}
                          onChange={handleInputChange('programOfInterest')}
                          label="Program"
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: 1.5,
                            fontSize: '0.85rem',
                            '&:hover': {
                              backgroundColor: 'white',
                            },
                            '& .MuiSelect-select': {
                              fontSize: '0.85rem',
                            },
                          }}
                        >
                          {programs.map((program) => (
                            <MenuItem key={program} value={program} sx={{ fontSize: '0.85rem' }}>
                              {program}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.programOfInterest && (
                          <Typography variant="caption" color="error" sx={{ fontSize: '0.7rem', mt: 0.5, ml: 1.5 }}>
                            {errors.programOfInterest}
                          </Typography>
                        )}
                      </FormControl>

                      <TextField
                        fullWidth
                        size="small"
                        label="Message"
                        multiline
                        rows={3}
                        value={formData.message}
                        onChange={handleInputChange('message')}
                        error={!!errors.message}
                        helperText={errors.message}
                        disabled={submitInquiryMutation.isPending}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: 1.5,
                            fontSize: '0.85rem',
                            '&:hover': {
                              backgroundColor: 'white',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '0.85rem',
                          },
                          '& .MuiFormHelperText-root': {
                            fontSize: '0.7rem',
                            margin: '4px 0 0',
                          },
                        }}
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        disabled={submitInquiryMutation.isPending}
                        endIcon={submitInquiryMutation.isPending ? <CircularProgress size={16} color="inherit" /> : <Send />}
                        sx={{
                          background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                          color: 'white',
                          py: 1,
                          borderRadius: 1.5,
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1d4ed8 0%, #059669 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                          },
                          '&:disabled': {
                            background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                          },
                        }}
                      >
                        {submitInquiryMutation.isPending ? 'Submitting...' : 'Submit'}
                      </Button>
                    </Box>
                  </Card>
                </Box>
              </Slide>

           
           
            </Box>

            {/* Bottom Section */}
            <Fade in timeout={2200}>
              <Box>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' }, 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  gap: 2,
                }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                      textAlign: { xs: 'center', md: 'left' },
                    }}
                  >
                    © 2024 MIVPS. All rights reserved. | Empowering futures through education.
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2,
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', md: 'flex-end' },
                  }}>
                    {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link, index) => (
                      <Button
                        key={index}
                        onClick={() => handlePolicyClick(link)}
                        sx={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: 'white',
                            background: 'rgba(255, 255, 255, 0.1)',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        {link}
                      </Button>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Fade>
          </Box>
        </Container>

        {/* CSS Animation Keyframes */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
        `}</style>  
      </Box>

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
          <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
            🎉 Inquiry submitted successfully!
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
          icon={<ErrorIcon />}
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
          <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
            ❌ {errorMessage || 'Please check the form and try again.'}
          </Typography>
        </Alert>
      </Snackbar>
    </LayoutWrapper>
  );
};

export default FooterSection;