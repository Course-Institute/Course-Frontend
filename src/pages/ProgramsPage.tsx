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

const ProgramsPage = () => {
  const programs = [
    {
      category: "Paramedical",
      focusArea: "Healthcare support, diagnostics",
      exampleCourses: ["DMLT", "X-Ray Technician", "ECG", "Patient Care"],
      description: "Step into the vital world of healthcare. Our paramedical courses train students in diagnostic, technical, and patient care skills. Graduates are prepared to work in hospitals, labs, and clinics.",
      color: "#ef4444"
    },
    {
      category: "Vocational",
      focusArea: "Industry trades, management, technical skills",
      exampleCourses: ["Supply Chain Management", "Fitter", "Electrician"],
      description: "Learn high-demand, industry-relevant trades. Designed for students who want to build stable, well-paying careers in the industrial and service sectors.",
      color: "#3b82f6"
    },
    {
      category: "Yoga & Naturopathy",
      focusArea: "Holistic health, therapy",
      exampleCourses: ["Yoga Therapy", "Ayurveda", "Diet & Nutrition"],
      description: "A perfect combination of traditional wisdom and modern wellness. Yoga programs focus on body, mind, and spirit. Preparing students to become certified Yoga Trainers, Naturopaths, and Wellness Therapists.",
      color: "#10b981"
    },
    {
      category: "IT Programmes",
      focusArea: "Software, networking, digital skills",
      exampleCourses: ["DCA", "Tally", "Web Designing", "Digital Marketing"],
      description: "Stay future-ready in a digital world. Covering fundamental to advanced topics like Computer Applications, Web Designing, Tally, Digital Marketing, and Office Productivity Tools.",
      color: "#8b5cf6"
    },
    {
      category: "Fire Safety",
      focusArea: "Emergency response, safety training",
      exampleCourses: ["Fire Safety Diploma", "Industrial Safety"],
      description: "Specialized training that saves lives. Learn how to handle emergencies, prevent hazards, and manage fire safety equipment. Prepares students for roles in industries, buildings, safety departments, and government sectors.",
      color: "#f59e0b"
    },
    {
      category: "NTT",
      focusArea: "Early childhood education",
      exampleCourses: ["Pre-Primary Education", "NTT Diploma"],
      description: "Shape young minds and build a career in education. Provides insights into child development, classroom management, and early learning strategies.",
      color: "#ec4899"
    },
    {
      category: "Beauty & Wellness",
      focusArea: "Aesthetics, hair, spa therapy",
      exampleCourses: ["Hair Stylist", "Spa Therapy"],
      description: "Master the art of grooming, beauty therapy, hair styling, and spa management. Ideal for students aspiring to work in the beauty industry or start their own businesses.",
      color: "#f97316"
    },
    {
      category: "Apparel",
      focusArea: "Fashion and garment design",
      exampleCourses: ["Fashion Designing", "Cutting & Tailoring"],
      description: "Unleash creativity with programs in fashion design, garment construction, and pattern making. Learn both traditional craftsmanship and modern techniques for the apparel industry.",
      color: "#84cc16"
    },
    {
      category: "Agriculture",
      focusArea: "Modern farming, food technology",
      exampleCourses: ["Organic Farming", "Agriculture Management"],
      description: "Modern farming meets technology. Programs cover organic farming, food technology, sustainable cultivation methods, and agri-business management. Students are trained to innovate and lead in the farming sector.",
      color: "#22c55e"
    }
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
              Our Programs
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: '#3b82f6',
                fontWeight: '600',
                mb: 4
              }}
            >
              Our Diverse Range of Vocational & Paramedical Programs
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
              Mahavir Institute of Vocational & Paramedical Association offers a comprehensive portfolio of diploma and certificate courses that open doors to multiple industries. Each program is designed to enhance employability, build confidence, and provide a clear career pathway.
            </Typography>
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
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
                    }
                  }}
                >
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

                    {/* Learn More Button */}
                    <Button
                      variant="contained"
                      endIcon={<ArrowForward />}
                      sx={{
                        backgroundColor: program.color,
                        '&:hover': {
                          backgroundColor: program.color,
                          opacity: 0.9
                        },
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 3,
                        py: 1
                      }}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Detailed Program Example Section */}
          <Box sx={{ mt: 8 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                p: 4
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  mb: 3,
                  textAlign: 'center'
                }}
              >
                Detailed Program Example – Paramedical
              </Typography>
              
              <Typography
                variant="h6"
                sx={{
                  fontWeight: '600',
                  color: '#3b82f6',
                  mb: 2
                }}
              >
                Overview:
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
                The Paramedical stream is one of the most sought-after fields for students looking for stable, impactful careers. It focuses on diagnostic procedures, patient care, and clinical skills required in hospitals and medical facilities.
              </Typography>
            </Card>
          </Box>

          {/* Call to Action */}
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#3b82f6',
                '&:hover': {
                  backgroundColor: '#2563eb'
                },
                textTransform: 'none',
                borderRadius: 3,
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              View All Programs
            </Button>
          </Box>
        </Container>
      </Box>

      <FooterSection />
    </Box>
  );
};

export default ProgramsPage;
