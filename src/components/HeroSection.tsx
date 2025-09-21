import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Transform Your Future with Quality Education",
      subtitle: "Join thousands of students who have achieved their dreams through our comprehensive courses",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop",
    },
    {
      title: "Expert Instructors & Modern Facilities",
      subtitle: "Learn from industry professionals in state-of-the-art learning environments",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop",
    },
    {
      title: "Flexible Learning Options For Everyone",
      subtitle: "Choose from online, hybrid, or in-person learning to fit your schedule and learn at your own pace",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop",
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <Box
      id="home"
      sx={{
        position: 'relative',
        height: isMobile ? '100vh' : '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `url(${slides[currentSlide].image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            p: 4,
            // backgroundColor: 'rgba(25, 118, 210, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            textAlign: 'center',
            maxWidth: 800,
            mx: 'auto',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Typography
            variant={isMobile ? 'h4' : 'h2'}
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'white',
              mb: 2,
            }}
          >
            {slides[currentSlide].title}
          </Typography>
          
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.6,
            }}
          >
            {slides[currentSlide].subtitle}
          </Typography>
        </Box>
      </Container>

      {/* Navigation Arrows */}
      <Button
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            transform: 'translateY(-50%) scale(1.1)',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.4)',
          },
        }}
      >
        <KeyboardArrowLeft sx={{ fontSize: 30 }} />
      </Button>
      
      <Button
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            transform: 'translateY(-50%) scale(1.1)',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.4)',
          },
        }}
      >
        <KeyboardArrowRight sx={{ fontSize: 30 }} />
      </Button>

      {/* Slide Indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 3,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentSlide(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'white',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeroSection;
