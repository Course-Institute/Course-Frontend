import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  AccessTime,
  People,
  Star,
} from '@mui/icons-material';

const CoursesShowcase = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const courses = [
    {
      id: 1,
      title: "Web Development Bootcamp",
      description: "Master modern web development with HTML, CSS, JavaScript, React, and Node.js",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
      duration: "12 weeks",
      students: 1250,
      rating: 4.8,
      price: "$299",
      category: "Programming",
      level: "Beginner"
    },
    {
      id: 2,
      title: "Data Science & Analytics",
      description: "Learn Python, machine learning, and data visualization for real-world applications",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      duration: "16 weeks",
      students: 890,
      rating: 4.9,
      price: "$399",
      category: "Data Science",
      level: "Intermediate"
    },
    {
      id: 3,
      title: "Digital Marketing Mastery",
      description: "Comprehensive course covering SEO, social media, PPC, and content marketing",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      duration: "10 weeks",
      students: 2100,
      rating: 4.7,
      price: "$199",
      category: "Marketing",
      level: "Beginner"
    },
    {
      id: 4,
      title: "UI/UX Design Fundamentals",
      description: "Create beautiful and functional user interfaces with modern design principles",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
      duration: "8 weeks",
      students: 1500,
      rating: 4.8,
      price: "$249",
      category: "Design",
      level: "Beginner"
    },
    {
      id: 5,
      title: "Cybersecurity Essentials",
      description: "Protect systems and networks from cyber threats with hands-on security training",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop",
      duration: "14 weeks",
      students: 750,
      rating: 4.9,
      price: "$349",
      category: "Security",
      level: "Intermediate"
    },
    {
      id: 6,
      title: "Mobile App Development",
      description: "Build cross-platform mobile apps using React Native and Flutter",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
      duration: "12 weeks",
      students: 1100,
      rating: 4.6,
      price: "$279",
      category: "Programming",
      level: "Intermediate"
    }
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
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
            Popular Courses
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Discover our most popular courses designed to help you advance your career
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={course.image}
                  alt={course.title}
                  sx={{
                    objectFit: 'cover',
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={course.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={course.level}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      color: theme.palette.primary.main,
                    }}
                  >
                    {course.title}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      lineHeight: 1.6,
                    }}
                  >
                    {course.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {course.duration}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {course.students}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star sx={{ fontSize: 16, color: '#ffc107' }} />
                      <Typography variant="body2" color="text.secondary">
                        {course.rating}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      color: theme.palette.primary.main,
                    }}
                  >
                    {course.price}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    component={Link}
                    to="/courses"
                    sx={{
                      textTransform: 'none',
                      py: 1,
                    }}
                  >
                    Enroll Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/courses"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
            }}
          >
            View All Courses
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default CoursesShowcase;
