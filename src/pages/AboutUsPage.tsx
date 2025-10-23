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
              About Us
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: '#3b82f6',
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
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      color: '#1e293b',
                      mb: 3,
                      textAlign: 'center'
                    }}
                  >
                    Our Mission
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
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      color: '#1e293b',
                      mb: 3,
                      textAlign: 'center'
                    }}
                  >
                    Our Vision
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
                borderRadius: 3,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                p: 4
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
              ].map((item, index) => (
                <Grid size={{ xs: 12, sm: 6 }} key={index}>
                  <Card
                    sx={{
                      height: '100%',
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
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          color: '#1e293b',
                          mb: 2
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          lineHeight: 1.6
                        }}
                      >
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      <FooterSection />
    </Box>
  );
};

export default AboutUsPage;
