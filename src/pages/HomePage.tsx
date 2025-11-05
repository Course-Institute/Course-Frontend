import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  IconButton,
  Fade,
  Slide,
  Chip,
  Avatar,
  Dialog,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  School,
  Work,
  Computer,
  SelfImprovement,
  LocalHospital,
  Agriculture,
  Spa,
  TrendingUp,
  Star,
  CheckCircle,
  People,
  Verified,
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';
import InquiryDialog from '../components/InquiryDialog';
import LayoutWrapper from '../components/LayoutWrapper';

const HomePage = () => {
  const navigate = useNavigate();
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

const handleOpen = (img: string) => {
  setSelectedImage(img);
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
  setSelectedImage(null);
};

  // Hero images array
  const heroImages = [
    '/images/hero/hero-image-1.png',
    '/images/hero/hero-image-2.png'
  ];

  // Auto-rotate carousel every 15 seconds
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
      icon: <LocalHospital sx={{ fontSize: '2rem' }} />,
      color: "#2563eb",
      bgColor: "#eff6ff",
      stats: "15+ Programs",
    },
    {
      title: "Vocational Programs", 
      description: "Learn high-demand, industry-relevant trades. Designed for students who want to build stable, well-paying careers in the industrial and service sectors.",
      icon: <Work sx={{ fontSize: '2rem' }} />,
      color: "#10b981",
      bgColor: "#ecfdf5",
      stats: "25+ Programs",
    },
    {
      title: "IT Programs",
      description: "Stay future-ready in a digital world. Covering fundamental to advanced topics like Computer Applications, Web Designing, Tally, Digital Marketing, and Office Productivity Tools.",
      icon: <Computer sx={{ fontSize: '2rem' }} />,
      color: "#0ea5e9",
      bgColor: "#f0f9ff",
      stats: "20+ Programs",
    },
    {
      title: "Yoga & Naturopathy",
      description: "A perfect combination of traditional wisdom and modern wellness. Yoga programs focus on body, mind, and spirit. Preparing students to become certified Yoga Trainers, Naturopaths, and Wellness Therapists.",
      icon: <SelfImprovement sx={{ fontSize: '2rem' }} />,
      color: "#059669",
      bgColor: "#f0fdf4",
      stats: "10+ Programs",
    },
    {
      title: "Beauty & Wellness",
      description: "Unlock your creative potential in the beauty industry. From cosmetology to spa therapy, our programs prepare you for a rewarding career in personal care and wellness.",
      icon: <Spa sx={{ fontSize: '2rem' }} />,
      color: "#ec4899",
      bgColor: "#fdf2f8",
      stats: "12+ Programs",
    },
    {
      title: "Agriculture",
      description: "Modern farming techniques and sustainable agriculture practices. Learn about crop management, organic farming, and agricultural technology for a green future.",
      icon: <Agriculture sx={{ fontSize: '2rem' }} />,
      color: "#16a34a",
      bgColor: "#f0fdf4",
      stats: "8+ Programs",
    },
  ];

  const stats = [
    { number: "100+", label: "Specialized Programs", icon: <School /> },
    { number: "10,000+", label: "Students Trained", icon: <People /> },
    { number: "95%", label: "Placement Rate", icon: <TrendingUp /> },
    { number: "9", label: "Major Streams", icon: <Star /> },
  ];

  const features = [
    {
      title: "Industry-Relevant Curriculum",
      description: "Our courses are designed in collaboration with industry experts to ensure students learn the most current and practical skills.",
      icon: <CheckCircle sx={{ color: "#10b981" }} />,
    },
    {
      title: "Hands-On Training",
      description: "Practical learning through workshops, labs, and real-world projects that prepare students for immediate employment.",
      icon: <Work sx={{ color: "#3b82f6" }} />,
    },
    {
      title: "Expert Faculty",
      description: "Learn from experienced professionals who bring real-world insights and industry connections to the classroom.",
      icon: <People sx={{ color: "#8b5cf6" }} />,
    },
    {
      title: "Career Support",
      description: "Comprehensive placement assistance, resume building, and interview preparation to help students land their dream jobs.",
      icon: <TrendingUp sx={{ color: "#f59e0b" }} />,
        },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden', maxWidth: '100%' }}>  
      <Navbar />
      <LayoutWrapper>
                {/* Hero Section with Carousel */}
        <Box
          sx={{
            height: { xs: '70vh', sm: '80vh' },
            minHeight: { xs: '500px', sm: '600px' },
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '98.5%',
            borderRadius: { xs: 0, sm: 3 },
            mx: { xs: 0, sm: 2 },
            mt: { xs: 0, sm: 2 },
            boxShadow: { xs: 'none', sm: '0 20px 40px rgba(0,0,0,0.1)' },       
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
              zIndex: 1,
            }}
          />
        ))}

          {/* Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(14, 14, 14, 0.75)',
              zIndex: 2,
            }}
          />

          {/* Hero Content */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              color: 'white',
              px: { xs: 2, sm: 4 },
            }}
          >
            <Fade in timeout={1000}>
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                    color: 'white',
                    mb: 2,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    lineHeight: 1.2,
                  }}
                >
                  Shape Your Future
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                    color: 'white',
                    mb: 4,
                    opacity: 0.95,
                    maxWidth: '600px',
                    mx: 'auto',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  Transform your career with industry-relevant skills and hands-on training
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setInquiryDialogOpen(true)}
                    sx={{
                      backgroundColor: 'white',
                      color: '#2563eb',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: 'none',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                      '&:hover': {
                        backgroundColor: '#f8fafc',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 25px rgba(0,0,0,0.25)',
                      },
                    }}
                  >
                    Start Your Journey
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleProgramClick}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: 'none',
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 2,
                      },
                    }}
                  >
                    Explore Programs
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Box>

        {/* Navigation Buttons */}
          <IconButton
          onClick={goToPrevious}
            sx={{
            position: 'absolute',
              left: { xs: 1, sm: 2 },
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
              zIndex: 4,
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-50%) scale(1.05)',
              },
            }}
          >
            <ArrowBack />
          </IconButton>

          <IconButton
          onClick={goToNext}
            sx={{
            position: 'absolute',
              right: { xs: 1, sm: 2 },
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
              zIndex: 4,
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-50%) scale(1.05)',
              },
            }}
          >
            <ArrowForward />
          </IconButton>

        {/* Carousel Indicators */}
          <Box
            sx={{
          position: 'absolute',
              bottom: { xs: 2, sm: 3 },
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
              gap: 1,
              zIndex: 4,
            }}
          >
          {heroImages.map((_, index) => (
              <Box
              key={index}
              onClick={() => setCurrentImageIndex(index)}
                sx={{
                  width: { xs: 10, sm: 12 },
                  height: { xs: 10, sm: 12 },
                borderRadius: '50%',
                backgroundColor: currentImageIndex === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: currentImageIndex === index ? 'white' : 'rgba(255, 255, 255, 0.8)',
                    transform: 'scale(1.2)',
                  },
              }}
            />
          ))}
          </Box>
        </Box>

        {/* Stats Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>
          <Slide direction="up" in timeout={800}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 3 }}>
              {stats.map((stat, index) => {
                return (
                <Box key={index}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      background: '#e9e9e9ff',
                      color: '#0f172a',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.06)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 0, position: 'relative', zIndex: 2 }}>
                      <Avatar
                        sx={{
                          backgroundColor: 'rgba(37,99,235,0.1)',
                          color: '#0e4455',
                          width: 56,
                          height: 56,
                          mx: 'auto',
                          mb: 2,
                          border: '1px solid rgba(37,99,235,0.15)',
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          color: '#0f172a',
                          mb: 1,
                          fontSize: { xs: '1.5rem', sm: '2rem' },
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#475569',
                          fontWeight: 500,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
                );
              })}
            </Box>
          </Slide>
        </Container>
      
            {/* Introduction Section */}
        <Box sx={{
        background: '#e9e9e9ff',
          py: { xs: 6, sm: 8 },
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100%',
        }}>
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '400px',
              height: '400px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              transform: 'translate(30%, -30%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '300px',
              height: '300px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '50%',
              transform: 'translate(-30%, 30%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Fade in timeout={1000}>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: 'rgba(0, 0, 0, 1)',
                    mb: 3,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  About Our Institute
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#000000ff',
                    maxWidth: '800px',
                    mx: 'auto',
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    lineHeight: 1.7,
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  Bridging the gap between education and employability through hands-on practical training and industry-relevant curriculum
                </Typography>
              </Box>
            </Fade>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
              <Box>
                <Slide direction="left" in timeout={1200}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: '#1e293b',
                          mb: 3,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <School sx={{ color: '##0e4455' }} />
                        Our Mission
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#475569',
                          lineHeight: 1.8,
                fontSize: '1.1rem', 
                          mb: 3,
                        }}
                      >
                        At Mahavir Institute of Vocational & Paramedical Association, we are committed to bridging the gap between education and employability. Our focus goes beyond classroom teaching — we emphasize hands-on practical training, modern learning techniques, and industry-relevant curriculum.
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#475569',
                lineHeight: 1.8, 
                fontSize: '1.1rem', 
                        }}
                      >
                Our institute offers over 100 specialized programs across 9 major streams, including Paramedical Science, Vocational Trades, Information Technology, Yoga & Naturopathy, Fire Safety, Nursery Teacher Training (NTT), Beauty & Wellness, Apparel Design, and Agriculture.
                      </Typography>
                    </CardContent>
                  </Card>
                </Slide>
              </Box>

              <Box>
                <Slide direction="right" in timeout={1200}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: '#1e293b',
                          mb: 3,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <TrendingUp sx={{ color: '#10b981' }} />
                        Our Vision
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#475569',
                          lineHeight: 1.8,
                fontSize: '1.1rem', 
                          mb: 3,
                        }}
                      >
                We believe that skill-based education has the power to transform lives. That's why we provide an inclusive learning environment where students from different backgrounds can gain the knowledge, confidence, and technical expertise required to succeed in today's competitive job market.
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: '#f0f9ff',
                          border: '1px solid #bae6fd',
                          borderRadius: 2,
                          p: 2,
                          mt: 3,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: '#1e40af',
                            fontWeight: 700,
                            textAlign: 'center',
                            fontStyle: 'italic',
                          }}
                        >
                          "Our goal is simple: to shape individuals into professionals who create impact."
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Slide>
              </Box>
            </Box>
          </Container>
        </Box>

                {/* Program Highlights */}
        <Box sx={{
        background: '#ffffff',
          py: { xs: 6, sm: 8 },
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100%',
        }}>
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '300px',
              height: '300px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '400px',
              height: '400px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '50%',
              transform: 'translate(50%, 50%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Fade in timeout={1000}>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: '#0f172a',
                    mb: 3,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    textShadow: 'none',
                  }}
                >
                  Career Pathways for Every Ambition
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#475569',
                    maxWidth: '600px',
                    mx: 'auto',
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    textShadow: 'none',
                  }}
                >
                  Discover your passion and build a successful career with our comprehensive range of programs
                </Typography>
              </Box>
            </Fade>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {programHighlights.map((program, index) => (
                <Box key={index}>
                <Slide direction="up" in timeout={1200 + index * 200}>
                  <Card
                onClick={handleProgramClick}
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                  display: 'flex', 
                  alignItems: 'center', 
                          mb: 3,
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: 'rgba(37,99,235,0.08)',
                            color: '#0e4455',
                            borderRadius: 2,
                            p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                            minWidth: 60,
                            minHeight: 60,
                    }}
                  >
                    {program.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                    color: '#1e293b', 
                              mb: 0.5,
                            }}
                          >
                    {program.title}
                          </Typography>
                          <Chip
                            label={program.stats}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(37,99,235,0.1)',
                              color: '#2563eb',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      </Box>
                      
                      <Typography
                        variant="body2"
                        sx={{
                  color: '#64748b', 
                  lineHeight: 1.6, 
                          fontSize: '0.95rem',
                        }}
                      >
                  {program.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Slide>
              </Box>
            ))}
          </Box>
        </Container>
        </Box>

                {/* Features Section */}
        <Box sx={{
        background: '#e9e9e9ff',
          py: { xs: 6, sm: 8 },
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100%',
        }}>
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '350px',
              height: '350px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              transform: 'translate(40%, -40%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '250px',
              height: '250px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '50%',
              transform: 'translate(-40%, 40%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Fade in timeout={1000}>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: '#0f172a',
                    mb: 3,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    textShadow: 'none',
                  }}
                >
                  Why Choose Us?
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#475569',
                    maxWidth: '600px',
                    mx: 'auto',
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    textShadow: 'none',
                  }}
                >
                  We provide the perfect environment for your educational and career growth
                </Typography>
              </Box>
            </Fade>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
              {features.map((feature, index) => (
                <Box key={index}>
                  <Slide direction="up" in timeout={1200 + index * 200}>
                    <Card
                      sx={{
                        height: '100%',
                        textAlign: 'center',
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: '1px solid #e2e8f0',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 2,
                          }}
                        >
                          {feature.icon}
                        </Box>
                      <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: '#1e293b',
                            mb: 2,
                            fontSize: '1.1rem',
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#64748b',
                            lineHeight: 1.6,
                            fontSize: '0.9rem',
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Slide>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Our Certifications Section */}
        <Box sx={{
          background: '#ffffff',
          py: { xs: 6, sm: 8 },
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100%',
        }}>
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '300px',
              height: '300px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              transform: 'translate(30%, -30%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '250px',
              height: '250px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '50%',
              transform: 'translate(-30%, 30%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          
<Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
  <Fade in timeout={1000}>
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          color: '#0f172a',
          mb: 3,
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Verified sx={{ color: '#0e4455', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }} />
        Our Certifications
      </Typography>

      <Typography
        variant="h6"
        sx={{
          color: '#475569',
          maxWidth: '600px',
          mx: 'auto',
          fontSize: { xs: '1rem', sm: '1.1rem' },
        }}
      >
        Recognized and accredited by leading educational bodies and industry organizations
      </Typography>
    </Box>
  </Fade>

  {/* Cards Grid */}
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
      gap: 3,
    }}
  >
    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
      <Box key={index}>
        <Slide direction="up" in timeout={1200 + index * 100}>
          <Card onClick={() => handleOpen(`/uploads/certification-${index}.jpg`)} sx={{ cursor: "pointer" }}>
            <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
              <Box
                component="img"
                src={`/uploads/certification-${index}.jpg`}
                alt={`Certification ${index}`}
                className="cert-image"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
                onError={(e: any) => {
                  e.target.src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23e2e8f0" width="400" height="400"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ECertification ' +
                    index +
                    '%3C/text%3E%3C/svg%3E';
                }}
              />
            </Box>
          </Card>
        </Slide>
      </Box>
    ))}
  </Box>

  {/* ✅ Single Modal Outside Loop */}
  <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
    <Box sx={{ position: 'relative' }}>
      <IconButton
        onClick={handleClose}
        sx={{ position: 'absolute', top: 10, right: 10, color: 'white', zIndex: 2 }}
      >
        ✖
      </IconButton>

      <img
        src={selectedImage || ""}
        alt="Certificate"
        style={{ width: "100%", height: "auto", borderRadius: 8 }}
      />
    </Box>
  </Dialog>
</Container>

        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            background: '#ffffff',
            color: '#0f172a',
            py: { xs: 6, sm: 8 },
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '300px',
              height: '300px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              transform: 'translate(50%, -50%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '200px',
              height: '200px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '50%',
              transform: 'translate(-50%, 50%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Fade in timeout={1000}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    mb: 3,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    textShadow: 'none',
                  }}
                >
                  Ready to Start Your Journey?
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    opacity: 0.95,
                    fontSize: { xs: '1.1rem', sm: '1.3rem' },
                    maxWidth: '600px',
                    mx: 'auto',
                    textShadow: 'none',
                  }}
                >
            Take the first step toward a brighter future. Connect with our admissions team to explore your best-fit program and career opportunities.
                </Typography>
          
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
            onClick={() => setInquiryDialogOpen(true)}
                    sx={{
              backgroundColor: '#2563eb',
              color: 'white',
                      px: 4,
                      py: 1.5,
              fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 3,
                      textTransform: 'none',
                      boxShadow: '0 6px 16px rgba(37,99,235,0.25)',
                      '&:hover': {
                        backgroundColor: '#1e40af',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 20px rgba(37,99,235,0.3)',
                      },
            }}
          >
            Submit Inquiry
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleProgramClick}
                    sx={{
                      borderColor: '#2563eb',
                      color: '#2563eb',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 3,
                      textTransform: 'none',
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: '#1e40af',
                        backgroundColor: 'rgba(37,99,235,0.06)',
                        borderWidth: 2,
                      },
                    }}
                  >
                    Explore Programs
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Container>
        </Box>
      
      {/* Inquiry Dialog */}
      <InquiryDialog
        open={inquiryDialogOpen}
        onClose={() => setInquiryDialogOpen(false)}
      />
      </LayoutWrapper>
      <FooterSection />
    </Box>

    
  );
};

export default HomePage;