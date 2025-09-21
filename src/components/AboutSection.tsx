import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  School,
  Groups,
  EmojiEvents,
  SupportAgent,
} from '@mui/icons-material';


const AboutSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <School sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      title: "Quality Education",
      description: "Comprehensive curriculum designed by industry experts to provide practical, job-ready skills."
    },
    {
      icon: <Groups sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      title: "Expert Faculty",
      description: "Learn from experienced professionals who bring real-world knowledge to the classroom."
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      title: "Career Support",
      description: "Get assistance with job placement, resume building, and interview preparation."
    },
    {
      icon: <SupportAgent sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      title: "24/7 Support",
      description: "Round-the-clock academic and technical support to help you succeed in your studies."
    }
  ];

  return (
    <Box 
      id="about" 
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
          backgroundColor: 'rgba(248, 249, 250, 0.95)',
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
              color: theme.palette.primary.main,
              mb: 2,
            }}
          >
            About Course Institute
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            We are committed to providing world-class education that empowers students to achieve their career goals and make a positive impact in their chosen fields.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ maxWidth: '1000px', mx: 'auto' }}>
          {features.map((feature, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6 }}>
              <Card
                sx={{
                  height: 300, // Fixed height for all cards
                  textAlign: 'center',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      color: theme.palette.primary.main,
                      mb: 2,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                      fontSize: '1rem',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Grid container spacing={4} justifyContent="center">
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                  }}
                >
                  10,000+
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Students Enrolled
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                  }}
                >
                  500+
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Expert Instructors
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                  }}
                >
                  95%
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Success Rate
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutSection;
