import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  TrendingUp,
  School,
  EmojiEvents,
  Public,
} from '@mui/icons-material';

const StatisticsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const stats = [
    {
      icon: <School sx={{ fontSize: 60, color: 'white' }} />,
      number: "15,000+",
      label: "Students Graduated",
      description: "Successful graduates working in top companies worldwide"
    },
    {
      icon: <TrendingUp sx={{ fontSize: 60, color: 'white' }} />,
      number: "98%",
      label: "Job Placement Rate",
      description: "Our graduates find employment within 6 months"
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 60, color: 'white' }} />,
      number: "50+",
      label: "Industry Awards",
      description: "Recognition from leading educational institutions"
    },
    {
      icon: <Public sx={{ fontSize: 60, color: 'white' }} />,
      number: "25+",
      label: "Countries Served",
      description: "Students from around the globe trust our education"
    },
    {
      icon: <School sx={{ fontSize: 60, color: 'white' }} />,
      number: "500+",
      label: "Expert Instructors",
      description: "Industry professionals teaching our courses"
    },
    {
      icon: <TrendingUp sx={{ fontSize: 60, color: 'white' }} />,
      number: "95%",
      label: "Success Rate",
      description: "Students who complete their programs successfully"
    }
  ];

  return (
    <Box
      id="impact"
      sx={{
        py: 8,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            Our Impact in Numbers
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Join thousands of successful students who have transformed their careers with our programs
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 4,
            justifyContent: 'center',
            maxWidth: '1200px',
            mx: 'auto',
          }}
        >
          {stats.map((stat, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                height: 280, // Fixed height
                width: '100%', // Full width within grid
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                },
              }}
            >
                <Box sx={{ mb: 2 }}>
                  {stat.icon}
                </Box>
                <Typography
                  variant={isMobile ? 'h4' : 'h3'}
                  sx={{
                    fontWeight: 'bold',
                    mb: 1,
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    mb: 2,
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    
                    opacity: 0.9,
                    lineHeight: 1.6,
                  }}
                >
                  {stat.description}
                </Typography>
              </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default StatisticsSection;
