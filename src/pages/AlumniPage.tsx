import { useState } from 'react';
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
  Chip,
  IconButton,
} from '@mui/material';
import { 
  Business, 
  School, 
  Computer, 
  Spa, 
  Agriculture, 
  Star,
  TrendingUp,
  People,
  Work,
  ArrowForward,
  LinkedIn,
  Twitter,
  Facebook,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';

const AlumniPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % Math.ceil(testimonials.length / 2));
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + Math.ceil(testimonials.length / 2)) % Math.ceil(testimonials.length / 2));
  };

  const testimonials = [
    {
      quote: "The practical training in DMLT helped me secure a hospital job within a month of completing the course. The hands-on experience was invaluable.",
      author: "Priya Sharma",
      program: "DMLT",
      role: "Lab Technician at Apollo Hospital",
      year: "2022",
      initials: "PS",
      rating: 5,
      company: "Apollo Hospital, Delhi"
    },
    {
      quote: "With the skills I gained in Yoga & Naturopathy, I started my own wellness center. The business knowledge was crucial for my success.",
      author: "Rajesh Kumar",
      program: "Yoga & Naturopathy",
      role: "Wellness Center Owner",
      year: "2021",
      initials: "RK",
      rating: 5,
      company: "Rajesh Wellness Center, Mumbai"
    },
    {
      quote: "My IT diploma gave me the foundation to become a web developer. The institute's support was excellent throughout my journey.",
      author: "Anita Singh",
      program: "IT Diploma",
      role: "Web Developer at TechCorp",
      year: "2023",
      initials: "AS",
      rating: 5,
      company: "TechCorp Solutions, Bangalore"
    },
    {
      quote: "The Fire Safety program prepared me for real-world emergencies. I now work as a Safety Officer in a major manufacturing company.",
      author: "Vikram Patel",
      program: "Fire Safety",
      role: "Safety Officer",
      year: "2022",
      initials: "VP",
      rating: 5,
      company: "Reliance Industries, Gujarat"
    },
    {
      quote: "The Beauty & Wellness course helped me start my own salon. The practical training and business guidance were exceptional.",
      author: "Sunita Devi",
      program: "Beauty & Wellness",
      role: "Salon Owner",
      year: "2021",
      initials: "SD",
      rating: 5,
      company: "Sunita's Beauty Parlor, Chennai"
    },
    {
      quote: "Agriculture program taught me modern farming techniques. I now run a successful organic farm and supply to local markets.",
      author: "Ramesh Yadav",
      program: "Agriculture",
      role: "Organic Farmer",
      year: "2020",
      initials: "RY",
      rating: 5,
      company: "Green Fields Organic, Punjab"
    }
  ];

  const employmentSectors = [
    { icon: <Business />, name: "Hospitals", color: "#2563eb", count: "150+", description: "Healthcare professionals" },
    { icon: <Computer />, name: "IT Companies", color: "#0ea5e9", count: "200+", description: "Tech professionals" },
    { icon: <School />, name: "Educational Institutions", color: "#059669", count: "80+", description: "Teachers & trainers" },
    { icon: <Spa />, name: "Wellness Centers", color: "#1d4ed8", count: "120+", description: "Wellness professionals" },
    { icon: <Work />, name: "Manufacturing", color: "#34d399", count: "90+", description: "Industrial workers" },
    { icon: <Agriculture />, name: "Agriculture", color: "#0284c7", count: "60+", description: "Farmers & agripreneurs" },
    { icon: <Business />, name: "Entrepreneurs", color: "#dc2626", count: "180+", description: "Business owners" }
  ];

  const stats = [
    { number: "1000+", label: "Alumni Across India", icon: <People />, color: "#2563eb" },
    { number: "95%", label: "Employment Rate", icon: <TrendingUp />, color: "#10b981" },
    { number: "180+", label: "Entrepreneurs", icon: <Work />, color: "#f59e0b" },
    { number: "25+", label: "Indian States", icon: <Business />, color: "#8b5cf6" }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: `
            linear-gradient(135deg, rgba(37, 99, 235, 0.6) 0%, rgba(16, 185, 129, 0.6) 100%),
            url('https://images.unsplash.com/photo-1523240798034-6c2165d3b3b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          py: 12,
          textAlign: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.8) 0%, rgba(16, 185, 129, 0.8) 100%)',
            zIndex: 1,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box
            sx={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50px',
              px: 4,
              py: 1,
              mb: 3,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              🎓 Alumni Success Stories
            </Typography>
          </Box>
          
          <Typography
            variant="h1"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '2.5rem', md: '4rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Our Alumni Network
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
            Inspiring Success Stories from Our Graduates
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.2rem',
              lineHeight: 1.8,
              opacity: 0.9,
              maxWidth: '800px',
              mx: 'auto',
              mb: 4,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            The core success of the Mahavir Institute is attributed to the achievements of its students. Our graduates are making a difference across various industries and many have successfully launched their own businesses.
          </Typography>
        </Container>
      </Box>

      <Box 
        sx={{ 
          flex: 1, 
          py: 8, 
          background: `
            linear-gradient(135deg, rgba(248, 250, 252, 0.5) 0%, rgba(241, 245, 249, 0.5) 100%),
            url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <Container maxWidth="lg">
          {/* Statistics Section */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: '#1e293b',
                mb: 6,
                textAlign: 'center',
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Alumni Impact in Numbers
            </Typography>
            
            <Grid container spacing={4}>
              {stats.map((stat, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      borderRadius: 4,
                      boxShadow: `0 15px 35px ${stat.color}20`,
                      border: '2px solid transparent',
                      background: `linear-gradient(135deg, #ffffff 0%, ${stat.color}10 100%)`,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}80 100%)`,
                      },
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 20px 40px ${stat.color}30`,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}80 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3,
                          boxShadow: `0 8px 20px ${stat.color}40`,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 'bold',
                          color: stat.color,
                          mb: 1,
                          fontSize: { xs: '2rem', md: '2.5rem' }
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#64748b',
                          fontWeight: '600'
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Alumni Employment Sectors */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: '#1e293b',
                mb: 2,
                textAlign: 'center',
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Where Our Alumni Work
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#3b82f6',
                fontWeight: '600',
                mb: 6,
                textAlign: 'center'
              }}
            >
              Making Impact Across Industries
            </Typography>
            
            <Grid container spacing={4}>
              {employmentSectors.map((sector, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      borderRadius: 4,
                      boxShadow: `0 15px 35px ${sector.color}20`,
                      border: '2px solid transparent',
                      background: `linear-gradient(135deg, #ffffff 0%, ${sector.color}10 100%)`,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(135deg, ${sector.color} 0%, ${sector.color}80 100%)`,
                      },
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 20px 40px ${sector.color}30`,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${sector.color} 0%, ${sector.color}80 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3,
                          boxShadow: `0 8px 20px ${sector.color}40`,
                        }}
                      >
                        {sector.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 'bold',
                          color: '#1e293b',
                          mb: 1,
                          fontSize: '1.2rem'
                        }}
                      >
                        {sector.name}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 'bold',
                          color: sector.color,
                          mb: 1
                        }}
                      >
                        {sector.count}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          fontSize: '0.9rem'
                        }}
                      >
                        {sector.description}
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
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: '#1e293b',
                mb: 2,
                textAlign: 'center',
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              What Our Alumni Say
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#3b82f6',
                fontWeight: '600',
                mb: 6,
                textAlign: 'center'
              }}
            >
              Real Stories from Real Success
            </Typography>
            
            {/* Carousel Container */}
            <Box sx={{ position: 'relative', maxWidth: '100%', mx: 'auto' }}>
              {/* Navigation Buttons */}
              <IconButton
                onClick={prevTestimonial}
                sx={{
                  position: 'absolute',
                  left: -20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  backgroundColor: 'white',
                  color: '#2563eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                    transform: 'translateY(-50%) scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                  width: 50,
                  height: 50,
                }}
              >
                <ChevronLeft />
              </IconButton>
              
              <IconButton
                onClick={nextTestimonial}
                sx={{
                  position: 'absolute',
                  right: -20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  backgroundColor: 'white',
                  color: '#2563eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                    transform: 'translateY(-50%) scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                  width: 50,
                  height: 50,
                }}
              >
                <ChevronRight />
              </IconButton>

              {/* Carousel Content */}
              <Box
                sx={{
                  display: 'flex',
                  overflow: 'hidden',
                  borderRadius: 4,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    transform: `translateX(-${currentTestimonial * 50}%)`,
                    transition: 'transform 0.5s ease-in-out',
                    width: '100%',
                  }}
                >
                  {testimonials.map((testimonial, index) => (
                    <Box
                      key={index}
                      sx={{
                        minWidth: '50%',
                        px: 2,
                      }}
                    >
                      <Card
                        sx={{
                          borderRadius: 4,
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                          border: '2px solid transparent',
                          background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <CardContent sx={{ p: 6, position: 'relative', zIndex: 1 }}>
                          {/* Quote Icon */}
                          <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3,
                                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
                              }}
                            >
                              <Typography sx={{ color: 'white', fontSize: '32px' }}>
                                💬
                              </Typography>
                            </Box>
                          </Box>

                          {/* Quote */}
                          <Typography
                            variant="h5"
                            sx={{
                              fontSize: '1.3rem',
                              lineHeight: 1.8,
                              color: '#475569',
                              fontStyle: 'italic',
                              mb: 4,
                              textAlign: 'center',
                              maxWidth: '800px',
                              mx: 'auto',
                            }}
                          >
                            "{testimonial.quote}"
                          </Typography>
                          
                          <Divider sx={{ mb: 4 }} />
                          
                          {/* Author Info */}
                          <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                              <Avatar
                                sx={{
                                  width: 80,
                                  height: 80,
                                  mr: 3,
                                  border: '3px solid #e2e8f0',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                  background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '1.5rem'
                                }}
                              >
                                {testimonial.initials}
                              </Avatar>
                              <Box>
                                <Typography
                                  variant="h4"
                                  sx={{
                                    fontWeight: 'bold',
                                    color: '#1e293b',
                                    mb: 1
                                  }}
                                >
                                  {testimonial.author}
                                </Typography>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: '#64748b',
                                    fontSize: '1rem'
                                  }}
                                >
                                  Class of {testimonial.year}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Chip
                              label={testimonial.program}
                              sx={{
                                backgroundColor: '#2563eb',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                mb: 2,
                                px: 3,
                                py: 1,
                                height: 'auto'
                              }}
                            />
                            
                            <Typography
                              variant="h6"
                              sx={{
                                color: '#64748b',
                                fontWeight: '600',
                                mb: 1
                              }}
                            >
                              {testimonial.role}
                            </Typography>
                            
                            <Typography
                              variant="h6"
                              sx={{
                                color: '#3b82f6',
                                fontWeight: '600',
                                fontSize: '1rem'
                              }}
                            >
                              {testimonial.company}
                            </Typography>

                            {/* Rating */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} sx={{ color: '#fbbf24', fontSize: '1.5rem' }} />
                              ))}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Carousel Indicators */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1 }}>
                {Array.from({ length: Math.ceil(testimonials.length / 2) }).map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: index === currentTestimonial ? '#2563eb' : '#e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: index === currentTestimonial ? '#1d4ed8' : '#cbd5e1',
                        transform: 'scale(1.2)',
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Alumni Network Section */}
          <Box sx={{ mb: 8 }}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 25px 50px rgba(37, 99, 235, 0.2)',
                border: '2px solid transparent',
                p: 8,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: '150px',
                  height: '150px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  zIndex: 0,
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -30,
                  left: -30,
                  width: '100px',
                  height: '100px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  zIndex: 0,
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 4,
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  }}
                >
                  <People sx={{ fontSize: 50, color: 'white' }} />
                </Box>
                
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    mb: 3,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Stay Connected, Keep Growing
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '1.2rem',
                    lineHeight: 1.8,
                    mb: 6,
                    maxWidth: '700px',
                    mx: 'auto',
                    opacity: 0.9,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  We encourage our alumni to stay involved with the institute, mentor new students, and participate in community and career development events.
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      backgroundColor: 'white',
                      color: '#2563eb',
                      '&:hover': {
                        backgroundColor: '#f8fafc',
                        color: '#1d4ed8',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                      },
                      textTransform: 'none',
                      borderRadius: 4,
                      px: 6,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Join the Alumni Network
                  </Button>
                </Box>

                {/* Social Media Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: '600',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                    }}
                  >
                    Connect with us on Social Media
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                    <Button
                      startIcon={<LinkedIn />}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: 3,
                        px: 3,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                        },
                        transition: 'all 0.3s ease',
                        fontWeight: '600',
                        textTransform: 'none',
                      }}
                    >
                      LinkedIn
                    </Button>
                    <Button
                      startIcon={<Twitter />}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: 3,
                        px: 3,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                        },
                        transition: 'all 0.3s ease',
                        fontWeight: '600',
                        textTransform: 'none',
                      }}
                    >
                      Twitter
                    </Button>
                    <Button
                      startIcon={<Facebook />}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: 3,
                        px: 3,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                        },
                        transition: 'all 0.3s ease',
                        fontWeight: '600',
                        textTransform: 'none',
                      }}
                    >
                      Facebook
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Box>
        </Container>
      </Box>

      <FooterSection />
    </Box>
  );
};

export default AlumniPage;

