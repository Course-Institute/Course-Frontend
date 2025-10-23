import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';
import InquiryDialog from '../components/InquiryDialog';

const ProgramsPage = () => {
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);

  const programs = [
    {
      category: "Paramedical",
      focusArea: "Healthcare support, diagnostics",
      exampleCourses: ["DMLT", "X-Ray Technician", "ECG", "Patient Care"],
      description: "Step into the vital world of healthcare. Our paramedical courses train students in diagnostic, technical, and patient care skills. Graduates are prepared to work in hospitals, labs, and clinics.",
      color: "#2563eb",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      category: "Vocational",
      focusArea: "Industry trades, management, technical skills",
      exampleCourses: ["Supply Chain Management", "Fitter", "Electrician"],
      description: "Learn high-demand, industry-relevant trades. Designed for students who want to build stable, well-paying careers in the industrial and service sectors.",
      color: "#10b981",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      category: "Yoga & Naturopathy",
      focusArea: "Holistic health, therapy",
      exampleCourses: ["Yoga Therapy", "Ayurveda", "Diet & Nutrition"],
      description: "A perfect combination of traditional wisdom and modern wellness. Yoga programs focus on body, mind, and spirit. Preparing students to become certified Yoga Trainers, Naturopaths, and Wellness Therapists.",
      color: "#059669",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      category: "IT Programmes",
      focusArea: "Software, networking, digital skills",
      exampleCourses: ["DCA", "Tally", "Web Designing", "Digital Marketing"],
      description: "Stay future-ready in a digital world. Covering fundamental to advanced topics like Computer Applications, Web Designing, Tally, Digital Marketing, and Office Productivity Tools.",
      color: "#0ea5e9",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      category: "Fire Safety",
      focusArea: "Emergency response, safety training",
      exampleCourses: ["Fire Safety Diploma", "Industrial Safety"],
      description: "Specialized training that saves lives. Learn how to handle emergencies, prevent hazards, and manage fire safety equipment. Prepares students for roles in industries, buildings, safety departments, and government sectors.",
      color: "#1d4ed8",
      image: "https://images.unsplash.com/photo-1581578731548-c6a0c3f15f30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      category: "NTT",
      focusArea: "Early childhood education",
      exampleCourses: ["Pre-Primary Education", "NTT Diploma"],
      description: "Shape young minds and build a career in education. Provides insights into child development, classroom management, and early learning strategies.",
      color: "#34d399",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      category: "Beauty & Wellness",
      focusArea: "Aesthetics, hair, spa therapy",
      exampleCourses: ["Hair Stylist", "Spa Therapy"],
      description: "Master the art of grooming, beauty therapy, hair styling, and spa management. Ideal for students aspiring to work in the beauty industry or start their own businesses.",
      color: "#3b82f6",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      category: "Apparel",
      focusArea: "Fashion and garment design",
      exampleCourses: ["Fashion Designing", "Cutting & Tailoring"],
      description: "Unleash creativity with programs in fashion design, garment construction, and pattern making. Learn both traditional craftsmanship and modern techniques for the apparel industry.",
      color: "#38bdf8",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      category: "Agriculture",
      focusArea: "Modern farming, food technology",
      exampleCourses: ["Organic Farming", "Agriculture Management"],
      description: "Modern farming meets technology. Programs cover organic farming, food technology, sustainable cultivation methods, and agri-business management. Students are trained to innovate and lead in the farming sector.",
      color: "#0284c7",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Box 
        sx={{ 
          flex: 1, 
          py: 8, 
          background: `
            linear-gradient(135deg, rgba(248, 250, 252, 0.5) 0%, rgba(241, 245, 249, 0.5) 100%),
            url('https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <Container maxWidth="lg">
          {/* Page Header */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box
              sx={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                borderRadius: '50px',
                px: 4,
                py: 1,
                mb: 3,
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
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
                🎓 Educational Excellence
              </Typography>
            </Box>
            
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              Our Programs
            </Typography>
            
            <Typography
              variant="h4"
              sx={{
                color: '#3b82f6',
                fontWeight: '600',
                mb: 4,
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}
            >
              Our Diverse Range of Vocational & Paramedical Programs
            </Typography>
            
            <Box
              sx={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                borderRadius: 4,
                p: 4,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                maxWidth: '900px',
                mx: 'auto',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                  borderRadius: '4px 4px 0 0',
                }
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  color: '#475569',
                  textAlign: 'justify',
                  mb: 2
                }}
              >
                Mahavir Institute of Vocational & Paramedical Association offers a comprehensive portfolio of diploma and certificate courses that open doors to multiple industries. Each program is designed to enhance employability, build confidence, and provide a clear career pathway.
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2563eb' }} />
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: '600' }}>
                    9 Program Categories
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: '600' }}>
                    100+ Courses
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: '600' }}>
                    Industry Ready
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Programs Grid */}
          <Grid container spacing={4}>
            {programs.map((program, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                 <Card
                   sx={{
                     height: '100%',
                     borderRadius: 3,
                     boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                     border: '1px solid #e2e8f0',
                     transition: 'transform 0.2s ease-in-out',
                     overflow: 'hidden',
                     '&:hover': {
                       transform: 'translateY(-5px)',
                       boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
                     }
                   }}
                 >
                   {/* Program Image */}
                   <Box
                     sx={{
                       height: 200,
                       backgroundImage: `url(${program.image})`,
                       backgroundSize: 'cover',
                       backgroundPosition: 'center',
                       position: 'relative',
                       '&::before': {
                         content: '""',
                         position: 'absolute',
                         top: 0,
                         left: 0,
                         right: 0,
                         bottom: 0,
                         background: `linear-gradient(135deg, ${program.color}40 0%, ${program.color}80 100%)`,
                       }
                     }}
                   />
                   <CardContent sx={{ p: 4 }}>
                    {/* Category Header */}
                    <Box sx={{ mb: 3 }}>
                      <Chip
                        label={program.category}
                        sx={{
                          backgroundColor: program.color,
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          mb: 2
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          color: '#1e293b',
                          mb: 1
                        }}
                      >
                        {program.focusArea}
                      </Typography>
                    </Box>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        lineHeight: 1.6,
                        mb: 3
                      }}
                    >
                      {program.description}
                    </Typography>

                    {/* Example Courses */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 'bold',
                          color: '#1e293b',
                          mb: 1
                        }}
                      >
                        Example Courses:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {program.exampleCourses.map((course, courseIndex) => (
                          <Chip
                            key={courseIndex}
                            label={course}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: program.color,
                              color: program.color,
                              fontSize: '0.75rem'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Detailed Program Example Section */}
          <Box sx={{ mt: 8 }}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(37, 99, 235, 0.15)',
                border: '2px solid transparent',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                p: 6,
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
                  width: '120px',
                  height: '120px',
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                  borderRadius: '50%',
                  zIndex: 0,
                },
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 25px 50px rgba(37, 99, 235, 0.25)',
                  '&::after': {
                    transform: 'scale(1.2)',
                    transition: 'transform 0.3s ease',
                  }
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
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
                    boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
                  }}
                >
                  <Typography sx={{ color: 'white', fontSize: '32px' }}>
                    🏥
                  </Typography>
                </Box>
                
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2
                  }}
                >
                  Detailed Program Example – Paramedical
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: '600',
                    color: '#3b82f6',
                    mb: 3
                  }}
                >
                  Overview:
                </Typography>
              </Box>
              
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.2rem',
                  lineHeight: 1.8,
                  color: '#475569',
                  textAlign: 'justify',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                The Paramedical stream is one of the most sought-after fields for students looking for stable, impactful careers. It focuses on diagnostic procedures, patient care, and clinical skills required in hospitals and medical facilities.
              </Typography>
            </Card>
          </Box>

          {/* Call to Action */}
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => setInquiryDialogOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #059669 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 35px rgba(37, 99, 235, 0.4)',
                },
                textTransform: 'none',
                borderRadius: 4,
                px: 8,
                py: 3,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.3s ease',
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      <FooterSection />
      
      {/* Inquiry Dialog */}
      <InquiryDialog
        open={inquiryDialogOpen}
        onClose={() => setInquiryDialogOpen(false)}
        title="Explore Our Programs"
        subtitle="Get detailed information about our programs and career opportunities. Our admissions team is here to help you choose the right path."
      />
    </Box>
  );
};

export default ProgramsPage;
