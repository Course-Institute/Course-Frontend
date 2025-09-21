import { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Box } from '@mui/material';
import axiosInstance from '../api/axiosInstance';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance().get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Courses
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
          justifyContent: 'center',
          maxWidth: '1200px',
          mx: 'auto',
        }}
      >
        {courses.map((course) => (
          <Card
            key={course._id}
            sx={{
              height: 300, // Fixed height for all cards
              width: '100%', // Full width within grid
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {course.description}
                </Typography>
              </Box>
              <Box sx={{ mt: 'auto' }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  ₹{course.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration: {course.duration}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default CoursesPage;
