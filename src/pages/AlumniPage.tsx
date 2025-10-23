import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import { Business, School, Computer, Spa, Agriculture } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';

const AlumniPage = () => {
  const testimonials = [
    {
      quote: "The practical training in DMLT helped me secure a hospital job within a month of completing the course.",
      author: "Priya Sharma",
      program: "DMLT",
      role: "Lab Technician at Apollo Hospital"
    },
    {
      quote: "With the skills I gained in Yoga & Naturopathy, I started my own wellness center.",
      author: "Rajesh Kumar",
      program: "Yoga & Naturopathy",
      role: "Wellness Center Owner"
    },
    {
      quote: "My IT diploma gave me the foundation to become a web developer. The institute's support was excellent.",
      author: "Anita Singh",
      program: "IT Diploma",
      role: "Web Developer at TechCorp"
    }
  ];

  const employmentSectors = [
    { icon: <Business />, name: "Hospitals", color: "#ef4444" },
    { icon: <Business />, name: "Private Clinics", color: "#3b82f6" },
    { icon: <Computer />, name: "IT Companies", color: "#8b5cf6" },
    { icon: <School />, name: "Schools", color: "#10b981" },
    { icon: <Spa />, name: "Salons", color: "#f59e0b" },
    { icon: <Business />, name: "Design Studios", color: "#ec4899" },
    { icon: <Agriculture />, name: "Farms", color: "#22c55e" }
  ];

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
              Our Alumni
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: '#3b82f6',
                fontWeight: '600',
                mb: 4
              }}
            >
              Inspiring Success Stories
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
              The core success of the Mahavir Institute is attributed to the achievements of its students. Our graduates are making a difference across various industries and many have successfully launched their own businesses.
            </Typography>
          </Box>

          {/* Alumni Employment Sectors */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#1e293b',
                mb: 4,
                textAlign: 'center'
              }}
            >
              Where Our Alumni Work
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {employmentSectors.map((sector, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      borderRadius: 3,
                      boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                      border: '1px solid #e2e8f0',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Avatar
                        sx={{
                          backgroundColor: sector.color,
                          width: 60,
                          height: 60,
                          mx: 'auto',
                          mb: 2
                        }}
                      >
                        {sector.icon}
                      </Avatar>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          color: '#1e293b',
                          fontSize: '1rem'
                        }}
                      >
                        {sector.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Testimonials Section */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#1e293b',
                mb: 6,
                textAlign: 'center'
              }}
            >
              What Our Alumni Say
            </Typography>
            
            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      border: '1px solid #e2e8f0',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      {/* Quote */}
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: '1.1rem',
                          lineHeight: 1.8,
                          color: '#475569',
                          fontStyle: 'italic',
                          mb: 3,
                          textAlign: 'justify'
                        }}
                      >
                        "{testimonial.quote}"
                      </Typography>
                      
                      <Divider sx={{ mb: 3 }} />
                      
                      {/* Author Info */}
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            color: '#1e293b',
                            mb: 1
                          }}
                        >
                          {testimonial.author}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#3b82f6',
                            fontWeight: '600',
                            mb: 1
                          }}
                        >
                          {testimonial.program}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#64748b'
                          }}
                        >
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Alumni Network Section */}
          <Box sx={{ mb: 8 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                p: 6,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  mb: 3
                }}
              >
                Stay Connected, Keep Growing
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  mb: 4,
                  maxWidth: '600px',
                  mx: 'auto'
                }}
              >
                We encourage our alumni to stay involved with the institute, mentor new students, and participate in community and career development events.
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: 'white',
                  color: '#667eea',
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                    color: '#667eea'
                  },
                  textTransform: 'none',
                  borderRadius: 3,
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                Join the Alumni Network
              </Button>
            </Card>
          </Box>
        </Container>
      </Box>

      <FooterSection />
    </Box>
  );
};

export default AlumniPage;
