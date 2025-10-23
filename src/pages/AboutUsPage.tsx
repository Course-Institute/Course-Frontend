import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';

const AboutUsPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Box 
        sx={{ 
          flex: 1, 
          py: 8, 
          background: `
            linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.9) 100%),
            url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2022&q=80')
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
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                color: '#1e293b',
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              About Us
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: 'primary.main',
                fontWeight: '600',
                mb: 2
              }}
            >
              Our Commitment to Excellence
            </Typography>
          </Box>

          <Grid container spacing={6}>
            {/* Mission Section */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(37, 99, 235, 0.15)',
                  border: '2px solid transparent',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                    borderRadius: '50%',
                    zIndex: 0,
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 25px 50px rgba(37, 99, 235, 0.25)',
                    '&::after': {
                      transform: 'scale(1.2)',
                      transition: 'transform 0.3s ease',
                    }
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
                      }}
                    >
                      <Typography sx={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                        🎯
                      </Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 'bold',
                        color: '#1e293b',
                        background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Our Mission
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: '1.1rem',
                      lineHeight: 1.8,
                      color: '#475569',
                      textAlign: 'justify'
                    }}
                  >
                    The mission of Mahavir Institute of Vocational & Paramedical Association is to{' '}
                    <strong>develop, train, and empower students through skill-based education.</strong>{' '}
                    We are dedicated to offering structured academic programs, practical exposure, and soft skills training that prepare individuals to become{' '}
                    <strong>competent professionals.</strong>{' '}
                    Our focus is on{' '}
                    <strong>real-world readiness,</strong>{' '}
                    ensuring that each student can confidently step into their chosen industry.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Vision Section */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(16, 185, 129, 0.15)',
                  border: '2px solid transparent',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%)',
                    borderRadius: '50%',
                    zIndex: 0,
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 25px 50px rgba(16, 185, 129, 0.25)',
                    '&::after': {
                      transform: 'scale(1.2)',
                      transition: 'transform 0.3s ease',
                    }
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <Typography sx={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                        👁️
                      </Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 'bold',
                        color: '#1e293b',
                        background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Our Vision
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: '1.1rem',
                      lineHeight: 1.8,
                      color: '#475569',
                      textAlign: 'justify'
                    }}
                  >
                    Our vision is to build a generation of skilled individuals who{' '}
                    <strong>lead industries, innovate solutions, and contribute meaningfully to society.</strong>{' '}
                    We aspire to be recognized as a{' '}
                    <strong>premier institution in India</strong>{' '}
                    for quality vocational and paramedical education, setting benchmarks for academic excellence, industry partnerships, and employability.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* What We Do Section */}
          <Box sx={{ mt: 8 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: '#1e293b',
                mb: 2,
                textAlign: 'center'
              }}
            >
              What We Do
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#3b82f6',
                fontWeight: '600',
                mb: 4,
                textAlign: 'center'
              }}
            >
              Cultivating Talent, Building Careers
            </Typography>
            
                  <Card
                    sx={{
                      borderRadius: 4,
                      boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)',
                      border: '2px solid transparent',
                      background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                      p: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '6px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: -30,
                        right: -30,
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(96, 165, 250, 0.1) 100%)',
                        borderRadius: '50%',
                        zIndex: 0,
                      },
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 25px 50px rgba(59, 130, 246, 0.25)',
                        '&::after': {
                          transform: 'scale(1.1)',
                          transition: 'transform 0.3s ease',
                        }
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: '#475569',
                  mb: 4,
                  textAlign: 'justify'
                }}
              >
                We offer a learner-centric model that blends theory with practical experience. Our programs are designed to mirror the evolving needs of industries, ensuring students graduate with skills that are immediately applicable in the workforce.
              </Typography>

              <Box component="ul" sx={{ pl: 3, mb: 4 }}>
                <Typography component="li" sx={{ mb: 2, fontSize: '1.1rem', color: '#475569' }}>
                  Regular workshops and industrial visits expose students to real-world environments.
                </Typography>
                <Typography component="li" sx={{ mb: 2, fontSize: '1.1rem', color: '#475569' }}>
                  Modern labs and equipment provide hands-on experience.
                </Typography>
                <Typography component="li" sx={{ mb: 2, fontSize: '1.1rem', color: '#475569' }}>
                  Industry tie-ups and partnerships strengthen placement opportunities.
                </Typography>
                <Typography component="li" sx={{ mb: 2, fontSize: '1.1rem', color: '#475569' }}>
                  Faculty members with deep industry experience offer guidance and mentorship.
                </Typography>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: '#475569',
                  textAlign: 'justify'
                }}
              >
                Whether a student aims to work in healthcare, IT, beauty, agriculture, or education — we provide the right foundation to build a stable, respected, and rewarding career.
              </Typography>
            </Card>
          </Box>

          {/* Why Choose Us Section */}
          <Box sx={{ mt: 8 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: '#1e293b',
                mb: 2,
                textAlign: 'center'
              }}
            >
              Why Choose Mahavir Institute?
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
              Your Future Starts Here
            </Typography>

            <Grid container spacing={4}>
              {[
                {
                  title: "Industry-Relevant Curriculum",
                  description: "Our programs are developed to match current trends and job demands, making you career-ready from day one."
                },
                {
                  title: "Experienced Faculty",
                  description: "Learn from professionals who bring years of practical experience and industry knowledge."
                },
                {
                  title: "Strong Practical Training",
                  description: "From clinical exposure in paramedical courses to on-field practice in agriculture — we emphasize learning by doing."
                },
                {
                  title: "Wide Range of Programs",
                  description: "With 9 major streams and 100+ courses, students can choose their ideal career path."
                },
                {
                  title: "Career Development Support",
                  description: "We provide guidance for interviews, job placements, and career growth."
                },
                {
                  title: "Accessible Education",
                  description: "Our programs are structured to support students from diverse educational backgrounds, starting from 10th pass level."
                }
                      ].map((item, index) => {
                        const colors = [
                          { primary: '#2563eb', secondary: '#3b82f6', light: '#dbeafe' },
                          { primary: '#10b981', secondary: '#34d399', light: '#d1fae5' },
                          { primary: '#7c3aed', secondary: '#a855f7', light: '#ede9fe' },
                          { primary: '#dc2626', secondary: '#ef4444', light: '#fee2e2' },
                          { primary: '#ea580c', secondary: '#f97316', light: '#fed7aa' },
                          { primary: '#0891b2', secondary: '#06b6d4', light: '#cffafe' }
                        ];
                        const colorSet = colors[index % colors.length];
                        
                        return (
                        <Grid size={{ xs: 12, sm: 6 }} key={index}>
                          <Card
                            sx={{
                              height: '100%',
                              borderRadius: 4,
                              boxShadow: `0 15px 35px ${colorSet.primary}20`,
                              border: '2px solid transparent',
                              background: `linear-gradient(135deg, #ffffff 0%, ${colorSet.light} 100%)`,
                              position: 'relative',
                              overflow: 'hidden',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: `linear-gradient(135deg, ${colorSet.primary} 0%, ${colorSet.secondary} 100%)`,
                              },
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: -20,
                                right: -20,
                                width: '60px',
                                height: '60px',
                                background: `linear-gradient(135deg, ${colorSet.primary}20 0%, ${colorSet.secondary}20 100%)`,
                                borderRadius: '50%',
                                zIndex: 0,
                              },
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: `0 20px 40px ${colorSet.primary}30`,
                                '&::after': {
                                  transform: 'scale(1.3)',
                                  transition: 'transform 0.3s ease',
                                }
                              }
                            }}
                          >
                            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${colorSet.primary} 0%, ${colorSet.secondary} 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                    flexShrink: 0,
                                    boxShadow: `0 4px 12px ${colorSet.primary}40`,
                                  }}
                                >
                                  <Typography sx={{ color: 'white', fontSize: '18px' }}>
                                    {['🎓', '👨‍🏫', '🔬', '📚', '💼', '🌱'][index % 6]}
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 'bold',
                                    color: '#1e293b',
                                    background: `linear-gradient(135deg, ${colorSet.primary} 0%, ${colorSet.secondary} 100%)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                  }}
                                >
                                  {item.title}
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#64748b',
                                  lineHeight: 1.6,
                                  pl: 6
                                }}
                              >
                                {item.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        );
                      })}
                    </Grid>
          </Box>
        </Container>
      </Box>

      <FooterSection />
    </Box>
  );
};

export default AboutUsPage;
