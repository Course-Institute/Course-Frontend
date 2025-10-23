import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import { Email, LocationOn, AccessTime, Send } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';

const ContactUsPage = () => {
  const [inquiryForm, setInquiryForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    programOfInterest: '',
    message: ''
  });

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

  const handleInputChange = (field: string) => (event: any) => {
    setInquiryForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Inquiry submitted:', inquiryForm);
    // Reset form
    setInquiryForm({
      fullName: '',
      email: '',
      phone: '',
      programOfInterest: '',
      message: ''
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Box sx={{ flex: 1, py: 8, backgroundColor: '#f8fafc' }}>
        <Container maxWidth="lg">
          {/* Page Header */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                color: '#1e293b',
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              Contact Us
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: '#3b82f6',
                fontWeight: '600',
                mb: 4
              }}
            >
              Connect with Mahavir Institute of Vocational & Paramedical Association
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: '#64748b',
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              We're here to help you make informed decisions about your future. Whether you want to explore courses, seek admission guidance, or get more information, our admissions team is just a call or message away.
            </Typography>
          </Box>

          <Grid container spacing={6}>
            {/* Contact Information */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      color: '#1e293b',
                      mb: 4
                    }}
                  >
                    Get in Touch
                  </Typography>

                  {/* Address */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <LocationOn sx={{ color: '#3b82f6', fontSize: 30, mr: 2, mt: 0.5 }} />
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            color: '#1e293b',
                            mb: 1
                          }}
                        >
                          Address
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#64748b',
                            lineHeight: 1.6
                          }}
                        >
                          Mahavir Institute of Vocational & Paramedical Association<br />
                          First Floor, Parmal 14, near SBI South<br />
                          Badarpur Village, New Delhi, Delhi 110044
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 4 }} />

                  {/* Email */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Email sx={{ color: '#3b82f6', fontSize: 30, mr: 2 }} />
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            color: '#1e293b',
                            mb: 1
                          }}
                        >
                          Email
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#64748b'
                          }}
                        >
                          admissions@mivpsa.in
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#64748b'
                          }}
                        >
                          info@mivpsa.in
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 4 }} />

                  {/* Working Hours */}
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTime sx={{ color: '#3b82f6', fontSize: 30, mr: 2 }} />
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            color: '#1e293b',
                            mb: 1
                          }}
                        >
                          Working Hours
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#64748b'
                          }}
                        >
                          Monday - Friday: 9:00 AM – 5:00 PM
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#64748b'
                          }}
                        >
                          Saturday: 9:00 AM – 1:00 PM
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Inquiry Form */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      color: '#1e293b',
                      mb: 2
                    }}
                  >
                    Submit Your Detailed Query
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#64748b',
                      mb: 4
                    }}
                  >
                    Ready to start your journey? Take the first step toward a brighter future.
                  </Typography>

                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      {/* Full Name */}
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={inquiryForm.fullName}
                          onChange={handleInputChange('fullName')}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                      </Grid>

                      {/* Email */}
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          value={inquiryForm.email}
                          onChange={handleInputChange('email')}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                      </Grid>

                      {/* Phone */}
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={inquiryForm.phone}
                          onChange={handleInputChange('phone')}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                      </Grid>

                      {/* Program of Interest */}
                      <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth required>
                          <InputLabel>Program of Interest</InputLabel>
                          <Select
                            value={inquiryForm.programOfInterest}
                            onChange={handleInputChange('programOfInterest')}
                            label="Program of Interest"
                            sx={{
                              borderRadius: 2
                            }}
                          >
                            {programs.map((program) => (
                              <MenuItem key={program} value={program}>
                                {program}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Message */}
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Your Message"
                          multiline
                          rows={4}
                          value={inquiryForm.message}
                          onChange={handleInputChange('message')}
                          placeholder="Tell us about your goals and any specific questions you have..."
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        />
                      </Grid>

                      {/* Submit Button */}
                      <Grid size={{ xs: 12 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          fullWidth
                          endIcon={<Send />}
                          sx={{
                            backgroundColor: '#3b82f6',
                            '&:hover': {
                              backgroundColor: '#2563eb'
                            },
                            textTransform: 'none',
                            borderRadius: 2,
                            py: 2,
                            fontSize: '1.1rem',
                            fontWeight: 'bold'
                          }}
                        >
                          Submit Inquiry
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ mt: 3, p: 2, backgroundColor: '#f1f5f9', borderRadius: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        fontStyle: 'italic',
                        textAlign: 'center'
                      }}
                    >
                      Note: Tuition and registration fees are shared upon inquiry or by contacting the admissions office directly.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <FooterSection />
    </Box>
  );
};

export default ContactUsPage;
