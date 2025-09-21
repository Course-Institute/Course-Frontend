import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  School,
  Email,
  Phone,
  LocationOn,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
} from '@mui/icons-material';

const FooterSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLoginClick = (loginType: string) => {
    // Navigate to login page with role parameter
    navigate(`/login?role=${loginType.toLowerCase()}`);
  };

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`,
        color: 'white',
        py: 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Company Info - Wider */}
          <Grid size={{ xs: 12, lg: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center', textAlign: 'center' }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  mr: 2,
                }}
              >
                <School sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    mb: 0.5,
                  }}
                >
                  Course Institute
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Excellence in Education
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.6,
                mb: 3,
                fontSize: '1rem',
                textAlign: 'center',
              }}
            >
              Empowering students with world-class education and practical skills to succeed in their chosen careers.
            </Typography>
            
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                mb: 3,
                color: 'white',
                textAlign: 'center',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 40,
                  height: 3,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
                  borderRadius: 2,
                },
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
              {['About Us', 'Courses', 'Faculty', 'Admissions', 'Career', 'Blog'].map((link, index) => (
                <Box key={index} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      textAlign: 'center',
                      '&:hover': {
                        color: theme.palette.primary.main,
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    {link}
                  </Typography>
                  {index < 5 && (
                    <Box
                      sx={{
                        width: '60%',
                        height: 1,
                        background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                        mt: 1,
                        opacity: 0.3,
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                mb: 3,
                color: 'white',
                textAlign: 'center',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 40,
                  height: 3,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
                  borderRadius: 2,
                },
              }}
            >
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, justifyContent: 'center' }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LocationOn sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
                    123 Education Street<br />
                    Learning City, LC 12345<br />
                    India
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Phone sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  +91 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Email sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  info@courseinstitute.com
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Follow Us */}
          <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 40,
                  height: 3,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
                  borderRadius: 2,
                },
              }}
            >
              Follow Us
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            {[
              { icon: <Facebook sx={{ fontSize: 24 }} />, color: '#1877F2' },
              { icon: <Twitter sx={{ fontSize: 24 }} />, color: '#1DA1F2' },
              { icon: <LinkedIn sx={{ fontSize: 24 }} />, color: '#0077B5' },
              { icon: <Instagram sx={{ fontSize: 24 }} />, color: '#E4405F' },
            ].map((social, index) => (
              <Box
                key={index}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    backgroundColor: social.color,
                    boxShadow: `0 6px 20px ${social.color}40`,
                  },
                }}
              >
                {social.icon}
              </Box>
            ))}
          </Box>
        </Grid>

          {/* Access Portal */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 40,
                  height: 3,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
                  borderRadius: 2,
                },
              }}
            >
              Access Portal
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center', maxWidth: 300, mx: 'auto' }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleLoginClick('Student')}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                },
                textTransform: 'none',
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
              }}
            >
              Student Login
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleLoginClick('Center')}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px ${theme.palette.secondary.main}40`,
                },
                textTransform: 'none',
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
              }}
            >
              Center Login
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleLoginClick('App')}
              sx={{
                background: `linear-gradient(135deg, #4caf50, #388e3c)`,
                '&:hover': {
                  background: `linear-gradient(135deg, #388e3c, #4caf50)`,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px #4caf5040',
                },
                textTransform: 'none',
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
              }}
            >
              App Login
            </Button>
          </Box>
        </Grid>

        </Grid>

        {/* Bottom Section */}
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '1.1rem',
                }}
              >
                © 2024 Course Institute. All rights reserved. | Empowering futures through education.
              </Typography>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 4 }}>
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    {link}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FooterSection;
