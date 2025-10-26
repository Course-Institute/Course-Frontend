import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import { ArrowBack, School, AccessTime, People, AttachMoney } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';
import { programsData } from '../constants/programsData';
import { useState } from 'react';

const ProgramDetailPage = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(0);

  const program = programsData.find(p => p.id === programId);

  if (!program) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Program Not Found
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/programs')}
              startIcon={<ArrowBack />}
            >
              Back to Programs
            </Button>
          </Box>
        </Container>
        <FooterSection />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Box 
        sx={{ 
          flex: 1, 
          py: 8, 
          background: `
            linear-gradient(135deg, rgba(248, 250, 252, 0.5) 0%, rgba(241, 245, 249, 0.5) 100%),
            url('${program.image}')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <Container maxWidth="lg">
          {/* Back Button */}
          <Box sx={{ mb: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/programs')}
              sx={{
                borderColor: program.color,
                color: program.color,
                '&:hover': {
                  borderColor: program.color,
                  backgroundColor: `${program.color}10`,
                }
              }}
            >
              Back to Programs
            </Button>
          </Box>

          {/* Program Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box
              sx={{
                display: 'inline-block',
                background: `linear-gradient(135deg, ${program.color} 0%, ${program.color}CC 100%)`,
                borderRadius: '50px',
                px: 4,
                py: 1,
                mb: 3,
                boxShadow: `0 8px 20px ${program.color}30`,
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
                🎓 {program.category} Programmes
              </Typography>
            </Box>
            
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                background: `linear-gradient(135deg, #1e293b 0%, ${program.color} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              {program.category} - Certificate (12th)
            </Typography>
            
            <Typography
              variant="h4"
              sx={{
                color: program.color,
                fontWeight: '600',
                mb: 4,
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}
            >
              {program.focusArea}
            </Typography>
            
            <Box
              sx={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                borderRadius: 4,
                p: 4,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                border: `1px solid ${program.color}20`,
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
                  background: `linear-gradient(135deg, ${program.color} 0%, ${program.color}CC 100%)`,
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
                {program.description}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <School sx={{ color: program.color, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: '600' }}>
                    {program.levels[selectedLevelIndex].courses.length} Courses
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime sx={{ color: program.color, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: '600' }}>
                    {program.levels[selectedLevelIndex].courses[0]?.duration} {program.levels[selectedLevelIndex].courses[0]?.durationUnit || 'Year'} Duration
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <People sx={{ color: program.color, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: '600' }}>
                    {program.levels[selectedLevelIndex].eligibility} Grade Eligibility
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Program Level Tabs */}
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: `2px solid ${program.color}20`,
              overflow: 'hidden',
              position: 'relative',
              mb: 4,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: `linear-gradient(135deg, ${program.color} 0%, ${program.color}CC 100%)`,
              },
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={selectedLevelIndex}
                onChange={(_, newValue) => setSelectedLevelIndex(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                  }
                }}
              >
                {program.levels.map((level) => (
                  <Tab
                    key={level.id}
                    label={`${level.level} (${level.eligibility})`}
                    sx={{
                      color: program.color,
                      '&.Mui-selected': {
                        color: program.color,
                        backgroundColor: `${program.color}10`,
                      }
                    }}
                  />
                ))}
              </Tabs>
            </Box>
          </Card>

          {/* Courses Table */}
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: `2px solid ${program.color}20`,
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: `linear-gradient(135deg, ${program.color} 0%, ${program.color}CC 100%)`,
              },
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${program.color} 0%, ${program.color}CC 100%)`,
                  color: 'white',
                  p: 3,
                  textAlign: 'center'
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    mb: 1
                  }}
                >
                  {program.category} Programmes - {program.levels[selectedLevelIndex].level} ({program.levels[selectedLevelIndex].eligibility})
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Complete Course List with Fee Structure
                </Typography>
              </Box>

              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#1e293b' }}>
                        S.No.
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#1e293b' }}>
                        Course Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#1e293b' }}>
                        Duration ({program.levels[selectedLevelIndex].courses[0]?.durationUnit || 'Year'})
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#1e293b' }}>
                        Eligibility
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#1e293b' }}>
                        Course Fee
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#1e293b' }}>
                        Exam Fee
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#1e293b' }}>
                        Reg. Fee
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#1e293b' }}>
                        Total Fee
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {program.levels[selectedLevelIndex].courses.map((course, index) => (
                      <TableRow
                        key={course.id}
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor: '#f8fafc',
                          },
                          '&:hover': {
                            backgroundColor: `${program.color}05`,
                          },
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        <TableCell sx={{ fontWeight: '600', color: '#475569' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell sx={{ fontWeight: '600', color: '#1e293b' }}>
                          {course.name}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b' }}>
                          {course.duration}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b' }}>
                          {course.eligibility}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b', fontWeight: '600' }}>
                          ₹{course.courseFee.toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b', fontWeight: '600' }}>
                          ₹{course.examFee.toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b', fontWeight: '600' }}>
                          ₹{course.regFee.toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ color: program.color, fontWeight: 'bold', fontSize: '1.1rem' }}>
                          ₹{course.totalFee.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${program.color}10 0%, ${program.color}05 100%)`,
                  border: `1px solid ${program.color}20`,
                }}
              >
                <School sx={{ fontSize: 40, color: program.color, mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: program.color, mb: 1 }}>
                  {program.levels[selectedLevelIndex].courses.length}
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                  Total Courses
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${program.color}10 0%, ${program.color}05 100%)`,
                  border: `1px solid ${program.color}20`,
                }}
              >
                <AccessTime sx={{ fontSize: 40, color: program.color, mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: program.color, mb: 1 }}>
                  {program.levels[selectedLevelIndex].courses[0]?.duration} {program.levels[selectedLevelIndex].courses[0]?.durationUnit || 'Year'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                  Duration
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${program.color}10 0%, ${program.color}05 100%)`,
                  border: `1px solid ${program.color}20`,
                }}
              >
                <People sx={{ fontSize: 40, color: program.color, mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: program.color, mb: 1 }}>
                  {program.levels[selectedLevelIndex].eligibility}
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                  Eligibility
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${program.color}10 0%, ${program.color}05 100%)`,
                  border: `1px solid ${program.color}20`,
                }}
              >
                <AttachMoney sx={{ fontSize: 40, color: program.color, mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: program.color, mb: 1 }}>
                  ₹{program.levels[selectedLevelIndex].courses[0]?.totalFee.toLocaleString().slice(0, -3)}K
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                  Total Fee
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Call to Action */}
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/contact-us')}
              sx={{
                background: `linear-gradient(135deg, ${program.color} 0%, ${program.color}CC 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${program.color}CC 0%, ${program.color} 100%)`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 15px 35px ${program.color}40`,
                },
                textTransform: 'none',
                borderRadius: 4,
                px: 8,
                py: 3,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                boxShadow: `0 10px 25px ${program.color}30`,
                transition: 'all 0.3s ease',
              }}
            >
              Enroll Now
            </Button>
          </Box>
        </Container>
      </Box>

      <FooterSection />
    </Box>
  );
};

export default ProgramDetailPage;
