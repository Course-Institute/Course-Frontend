import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { School, Work, TrendingUp, People, ChevronLeft, ChevronRight } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';
import InquiryDialog from '../components/InquiryDialog';

const HomePage = () => {
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Hero images array
  const heroImages = [
    '/images/hero/hero-image-1.png',
    '/images/hero/hero-image-2.png'
  ];

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 15000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle program highlight click
  const handleProgramClick = () => {
    navigate('/programs');
  };

  const programHighlights = [
    {
      title: "Paramedical Programs",
      description: "Step into the vital world of healthcare. Our paramedical courses train students in diagnostic, technical, and patient care skills through programs like DMLT, X-Ray Technician, ECG, and Operation Theatre Assistance.",
      icon: <Work sx={{ fontSize: 40 }} />,
      color: "#2563eb"
    },
    {
      title: "Vocational Programs",
      description: "Learn high-demand, industry-relevant trades. Designed for students who want to build stable, well-paying careers in the industrial and service sectors.",
      icon: <School sx={{ fontSize: 40 }} />,
      color: "#10b981"
    },
    {
      title: "IT Programs",
      description: "Stay future-ready in a digital world. Covering fundamental to advanced topics like Computer Applications, Web Designing, Tally, Digital Marketing, and Office Productivity Tools.",
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: "#0ea5e9"
    },
    {
      title: "Yoga & Naturopathy",
      description: "A perfect combination of traditional wisdom and modern wellness. Yoga programs focus on body, mind, and spirit. Preparing students to become certified Yoga Trainers, Naturopaths, and Wellness Therapists.",
      icon: <People sx={{ fontSize: 40 }} />,
      color: "#059669"
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      {/* Hero Banner with Carousel */}
      <Box
        sx={{
          height: '90vh',
          minHeight: '600px',
          position: 'relative',
          overflow: 'hidden',
          color: 'white',
          display: 'flex',

          alignItems: 'center',
          justifyContent: 'center'
          // No margin needed since navbar is now positioned below header
        }}
      >
        {/* Carousel Images */}
        {heroImages.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: currentImageIndex === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: 1
            }}
          />
        ))}

        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.7) 0%, rgba(16, 185, 129, 0.7) 100%)',
            zIndex: 2,
          }}
        />

        {/* Previous Button */}
        <Button
          onClick={goToPrevious}
          sx={{
            position: 'absolute',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            borderRadius: '50%',
            width: 60,
            height: 60,
            minWidth: 'auto',
            zIndex: 3,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              transform: 'translateY(-50%) scale(1.1)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <ChevronLeft sx={{ fontSize: 30 }} />
        </Button>

        {/* Next Button */}
        <Button
          onClick={goToNext}
          sx={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            borderRadius: '50%',
            width: 60,
            height: 60,
            minWidth: 'auto',
            zIndex: 3,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              transform: 'translateY(-50%) scale(1.1)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <ChevronRight sx={{ fontSize: 30 }} />
        </Button>

        {/* Carousel Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 2,
            zIndex: 3
          }}
        >
          {heroImages.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: currentImageIndex === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'white',
                  transform: 'scale(1.2)'
                }
              }}
            />
          ))}
        </Box>
        {/* Content */}
        {/* <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '2.5rem', md: '4rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Empowering Futures Through Vocational & Paramedical Excellence
          </Typography>
          
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            Welcome to Mahavir Institute of Vocational & Paramedical Association – Your Pathway to a Rewarding Career.
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/programs')}
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'grey.50',
                color: 'primary.dark'
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
        </Container> */}
      </Box>

      {/* Introduction Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
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
                  onClick={handleProgramClick}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    transition: 'transform 0.2s ease-in-out',
                    cursor: 'pointer',
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
          background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
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
              onClick={() => setInquiryDialogOpen(true)}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'grey.50',
                  color: 'primary.dark'
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
      
      {/* Inquiry Dialog */}
      <InquiryDialog
        open={inquiryDialogOpen}
        onClose={() => setInquiryDialogOpen(false)}
      />
    </Box>
  );
};

export default HomePage;
