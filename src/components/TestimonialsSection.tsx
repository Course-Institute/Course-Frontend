import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const TestimonialsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at TCS",
      initials: "PS",
      bgColor: "#FF6B6B",
      rating: 5,
      text: "The Web Development Bootcamp completely transformed my career. The instructors were amazing, and the hands-on projects gave me the confidence to land my dream job at TCS. I couldn't have done it without Course Institute!"
    },
    {
      name: "Arjun Patel",
      role: "Data Scientist at Infosys",
      initials: "AP",
      bgColor: "#4ECDC4",
      rating: 5,
      text: "The Data Science course exceeded all my expectations. The curriculum was comprehensive, and the real-world projects helped me build a strong portfolio. I'm now working as a Data Scientist at Infosys!"
    },
    {
      name: "Kavya Reddy",
      role: "UX Designer at Wipro",
      initials: "KR",
      bgColor: "#45B7D1",
      rating: 5,
      text: "The UI/UX Design course was incredible! The instructors provided excellent feedback, and the design challenges were exactly what I needed to break into the industry. I'm now designing user experiences at Wipro."
    },
    {
      name: "Rahul Kumar",
      role: "Digital Marketing Manager at HCL",
      initials: "RK",
      bgColor: "#96CEB4",
      rating: 5,
      text: "The Digital Marketing course gave me all the skills I needed to advance my career. The practical approach and industry insights were invaluable. I've been promoted twice since completing the program!"
    },
    {
      name: "Sneha Gupta",
      role: "Full Stack Developer at Cognizant",
      initials: "SG",
      bgColor: "#FFEAA7",
      rating: 5,
      text: "The Full Stack Development program was outstanding! The comprehensive curriculum and expert guidance helped me master both frontend and backend technologies. I'm now working as a Full Stack Developer at Cognizant."
    },
    {
      name: "Vikram Singh",
      role: "Cloud Engineer at Accenture",
      initials: "VS",
      bgColor: "#DDA0DD",
      rating: 5,
      text: "The Cloud Computing course was a game-changer for my career. The hands-on labs and real-world projects gave me the expertise needed to excel in cloud technologies. I'm now a Cloud Engineer at Accenture!"
    },
    {
      name: "Ananya Iyer",
      role: "DevOps Engineer at Capgemini",
      initials: "AI",
      bgColor: "#98D8C8",
      rating: 5,
      text: "The DevOps course provided me with all the tools and knowledge needed to streamline development processes. The practical approach and industry-relevant projects were exceptional. I'm now a DevOps Engineer at Capgemini."
    },
    {
      name: "Rohit Agarwal",
      role: "Cybersecurity Analyst at IBM",
      initials: "RA",
      bgColor: "#F7DC6F",
      rating: 5,
      text: "The Cybersecurity program was comprehensive and practical. The instructors were industry experts who provided real-world insights. The hands-on labs and case studies prepared me perfectly for my role as a Cybersecurity Analyst at IBM."
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <Box 
      id="reviews" 
      sx={{ 
        py: 8, 
        position: 'relative',
        backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'white',
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            What Our Students Say
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            Hear from our successful graduates who have transformed their careers
          </Typography>
        </Box>

        <Box sx={{ position: 'relative', maxWidth: 1000, mx: 'auto' }}>
          <Card
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 4,
              position: 'relative',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <CardContent>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 3,
                  backgroundColor: testimonials[currentTestimonial].bgColor,
                  border: `4px solid rgba(255, 255, 255, 0.3)`,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                {testimonials[currentTestimonial].initials}
              </Avatar>
              
              <Rating
                value={testimonials[currentTestimonial].rating}
                readOnly
                sx={{ mb: 3, '& .MuiRating-icon': { color: '#ffc107' } }}
              />
              
              <Typography
                variant="h6"
                sx={{
                  fontStyle: 'italic',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: 1.8,
                  mb: 4,
                  fontSize: isMobile ? '1rem' : '1.2rem',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                "{testimonials[currentTestimonial].text}"
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: 'white',
                  mb: 1,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                {testimonials[currentTestimonial].name}
              </Typography>
              
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                {testimonials[currentTestimonial].role}
              </Typography>
            </CardContent>
          </Card>

          {/* Navigation Arrows */}
          <Button
            onClick={prevTestimonial}
            sx={{
              position: 'absolute',
              left: -80,
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
              display: isMobile ? 'none' : 'flex',
            }}
          >
            <KeyboardArrowLeft sx={{ fontSize: 30 }} />
          </Button>
          
          <Button
            onClick={nextTestimonial}
            sx={{
              position: 'absolute',
              right: -80,
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
              display: isMobile ? 'none' : 'flex',
            }}
          >
            <KeyboardArrowRight sx={{ fontSize: 30 }} />
          </Button>
        </Box>

        {/* Testimonial Indicators */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            mt: 4,
            position: 'relative',
          }}
        >
          {testimonials.map((_, index) => {
            const isVisible = Math.abs(index - currentTestimonial) <= 1 || 
                             (currentTestimonial === 0 && (index === testimonials.length - 1 || index === 1)) ||
                             (currentTestimonial === testimonials.length - 1 && (index === 0 || index === testimonials.length - 2));
            const isCorner = Math.abs(index - currentTestimonial) === 2;
            
            return (
              <Box
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: index === currentTestimonial ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  opacity: isVisible ? 1 : 0.3,
                  filter: isCorner ? 'blur(1px)' : 'none',
                  transform: isCorner ? 'scale(0.8)' : 'scale(1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transform: 'scale(1.2)',
                    filter: 'none',
                    opacity: 1,
                  },
                }}
              />
            );
          })}
        </Box>

        {/* Mobile Navigation */}
        {isMobile && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="outlined"
              onClick={prevTestimonial}
              startIcon={<KeyboardArrowLeft />}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              onClick={nextTestimonial}
              endIcon={<KeyboardArrowRight />}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Next
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
