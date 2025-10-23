import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import { Verified, School, Handshake } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';

const AffiliationPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Box 
        sx={{ 
          flex: 1, 
          py: 8, 
          background: `
            linear-gradient(135deg, rgba(217, 217, 218, 0.9) 0%, rgba(198, 199, 199, 0.9) 100%),
            url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=2086&q=80')
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
              Affiliation & Recognition
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: 'primary.main',
                fontWeight: '600',
                mb: 4
              }}
            >
              Quality Assured: Recognized by Mahavir Institute of Vocational & Paramedical Association
            </Typography>
          </Box>

          {/* Introduction Section */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              p: 4,
              mb: 6
            }}
          >
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
              The Mahavir Institute of Vocational & Paramedical Association is a{' '}
              <strong>self-recognized</strong> and <strong>credible educational institution</strong>{' '}
              that ensures academic programs meet <strong>high educational standards</strong> and{' '}
              <strong>industry relevance</strong>.
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
              An internal academic board regularly reviews and enhances the curriculum to meet modern industry expectations, ensuring programs deliver{' '}
              <strong>quality education, practical knowledge,</strong> and <strong>recognized certification</strong>.
            </Typography>
          </Card>

          {/* Key Recognition Section */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#1e293b',
                mb: 6,
                textAlign: 'center'
              }}
            >
              Key Recognition
            </Typography>

            <Grid container spacing={4}>
              {/* Academic Council */}
              <Grid size={{ xs: 12, sm: 6 }}>
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
                       <Verified sx={{ color: 'secondary.main', fontSize: 40, mr: 2 }} />
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 'bold',
                          color: '#1e293b'
                        }}
                      >
                        Academic Council
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
                      <strong>Mahavir Institute of Vocational & Paramedical Association – Academic Council</strong>{' '}
                      Our in-house board guarantees academic integrity, updated curriculum, and credible assessments.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Knowledge Partner */}
              <Grid size={{ xs: 12, sm: 6 }}>
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
                       <Handshake sx={{ color: 'primary.main', fontSize: 40, mr: 2 }} />
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 'bold',
                          color: '#1e293b'
                        }}
                      >
                        Knowledge Partner
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
                      <strong>Knowledge Partner: OM Sterling Global University</strong>{' '}
                      We collaborate with OM Sterling Global University to strengthen our academic base and create more learning opportunities, adding value to our vocational education framework.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Quality Assurance Statement */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              p: 6,
              textAlign: 'center',
               background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
              color: 'white'
            }}
          >
            <School sx={{ fontSize: 60, mb: 3 }} />
            
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                mb: 4
              }}
            >
              Quality Assurance Statement
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.2rem',
                lineHeight: 1.8,
                fontStyle: 'italic',
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              "Our programs are structured to meet professional standards, ensuring students graduate with skills that are relevant, practical, and widely accepted in the job market."
            </Typography>
          </Card>

          {/* Recognition Badges */}
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#1e293b',
                mb: 4
              }}
            >
              Our Credentials
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
               <Chip
                 label="Self-Recognized Institution"
                 sx={{
                   backgroundColor: 'secondary.main',
                   color: 'white',
                   fontWeight: 'bold',
                   fontSize: '1rem',
                   px: 3,
                   py: 2,
                   height: 'auto'
                 }}
               />
               <Chip
                 label="Industry-Relevant Curriculum"
                 sx={{
                   backgroundColor: 'primary.main',
                   color: 'white',
                   fontWeight: 'bold',
                   fontSize: '1rem',
                   px: 3,
                   py: 2,
                   height: 'auto'
                 }}
               />
               <Chip
                 label="Quality Education Standards"
                 sx={{
                   backgroundColor: 'info.main',
                   color: 'white',
                   fontWeight: 'bold',
                   fontSize: '1rem',
                   px: 3,
                   py: 2,
                   height: 'auto'
                 }}
               />
               <Chip
                 label="Recognized Certification"
                 sx={{
                   backgroundColor: 'primary.dark',
                   color: 'white',
                   fontWeight: 'bold',
                   fontSize: '1rem',
                   px: 3,
                   py: 2,
                   height: 'auto'
                 }}
               />
            </Box>
          </Box>
        </Container>
      </Box>

      <FooterSection />
    </Box>
  );
};

export default AffiliationPage;
