import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { ArrowForward, School, Work, TrendingUp, People } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';

const HomePage = () => {
  const programHighlights = [
    {
      title: "Paramedical Programs",
      description: "Step into the vital world of healthcare. Our paramedical courses train students in diagnostic, technical, and patient care skills through programs like DMLT, X-Ray Technician, ECG, and Operation Theatre Assistance.",
      icon: <Work sx={{ fontSize: 40 }} />,
      color: "#ef4444"
    },
    {
      title: "Vocational Programs",
      description: "Learn high-demand, industry-relevant trades. Designed for students who want to build stable, well-paying careers in the industrial and service sectors.",
      icon: <School sx={{ fontSize: 40 }} />,
      color: "#3b82f6"
    },
    {
      title: "IT Programs",
      description: "Stay future-ready in a digital world. Covering fundamental to advanced topics like Computer Applications, Web Designing, Tally, Digital Marketing, and Office Productivity Tools.",
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: "#8b5cf6"
    },
    {
      title: "Yoga & Naturopathy",
      description: "A perfect combination of traditional wisdom and modern wellness. Yoga programs focus on body, mind, and spirit. Preparing students to become certified Yoga Trainers, Naturopaths, and Wellness Therapists.",
      icon: <People sx={{ fontSize: 40 }} />,
      color: "#10b981"
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      {/* Hero Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 12,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '2.5rem', md: '4rem' }
            }}
          >
            Empowering Futures Through Vocational & Paramedical Excellence
          </Typography>
          
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            Welcome to Mahavir Institute of Vocational & Paramedical Association – Your Pathway to a Rewarding Career.
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
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
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            Explore Our 9 Program Categories
          </Button>
        </Container>
      </Box>

      {/* Introduction Section */}
      <Box sx={{ py: 8, backgroundColor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              color: '#1e293b',
              mb: 6,
              textAlign: 'center'
            }}
          >
            Introduction
          </Typography>
          
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: '#475569',
                  textAlign: 'justify',
                  mb: 3
                }}
              >
                At Mahavir Institute of Vocational & Paramedical Association, we are committed to bridging the gap between education and employability. Our focus goes beyond classroom teaching — we emphasize hands-on practical training, modern learning techniques, and industry-relevant curriculum.
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: '#475569',
                  textAlign: 'justify'
                }}
              >
                Our institute offers over 100 specialized programs across 9 major streams, including Paramedical Science, Vocational Trades, Information Technology, Yoga & Naturopathy, Fire Safety, Nursery Teacher Training (NTT), Beauty & Wellness, Apparel Design, and Agriculture.
              </Typography>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: '#475569',
                  textAlign: 'justify',
                  mb: 3
                }}
              >
                We believe that skill-based education has the power to transform lives. That's why we provide an inclusive learning environment where students from different backgrounds can gain the knowledge, confidence, and technical expertise required to succeed in today's competitive job market.
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: '#475569',
                  textAlign: 'justify',
                  fontWeight: 'bold'
                }}
              >
                Our goal is simple: to shape individuals into professionals who create impact.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Program Highlights */}
      <Box sx={{ py: 8, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              color: '#1e293b',
              mb: 6,
              textAlign: 'center'
            }}
          >
            Career Pathways for Every Ambition
          </Typography>
          
          <Grid container spacing={4}>
            {programHighlights.map((program, index) => (
              <Grid size={{ xs: 12, sm: 6 }} key={index}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box
                        sx={{
                          backgroundColor: program.color,
                          color: 'white',
                          borderRadius: 2,
                          p: 2,
                          mr: 3
                        }}
                      >
                        {program.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 'bold',
                          color: '#1e293b'
                        }}
                      >
                        {program.title}
                      </Typography>
                    </Box>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#64748b',
                        lineHeight: 1.6
                      }}
                    >
                      {program.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Quick Inquiry Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                mb: 3
              }}
            >
              Ready to Start Your Journey?
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                opacity: 0.9
              }}
            >
              Take the first step toward a brighter future. Connect with our admissions team to explore your best-fit program and career opportunities.
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
              Submit Inquiry
            </Button>
          </Box>
        </Container>
      </Box>

      <FooterSection />
    </Box>
  );
};

export default HomePage;
