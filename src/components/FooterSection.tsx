import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Fade,
  Slide,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Email,
  Phone,
  LocationOn,
  School,
  Work,
  Person,
  Security,
  Support,
  ArrowForward,
  Group,
  Description,
} from '@mui/icons-material';
import InstituteLogo from './InstituteLogo';
import LayoutWrapper from './LayoutWrapper';

const FooterSection = () => {
  const navigate = useNavigate();

  const handleLoginClick = (loginType: string) => {
    navigate(`/login?role=${loginType.toLowerCase()}`);
  };

  const handleQuickLinkClick = (link: string) => {
    switch (link) {
      case 'About Us':
        navigate('/about-us');
        break;
      case 'Programs':
        navigate('/programs');
        break;
      case 'Alumni':
        navigate('/alumni');
        break;
      case 'Affiliation':
        navigate('/affiliation');
        break;
      case 'Contact Us':
        navigate('/contact-us');
        break;
      default:
        navigate('/');
    }
  };


  const handlePolicyClick = (policy: string) => {
    console.log(`Navigate to ${policy}`);
    alert(`${policy} page will be available soon!`);
  };

  const features = [
    { icon: <School />, title: 'Quality Education', desc: 'World-class curriculum' },
    { icon: <Work />, title: 'Career Ready', desc: 'Industry-focused training' },
    { icon: <Security />, title: 'Secure Platform', desc: 'Safe & reliable system' },
    { icon: <Support />, title: '24/7 Support', desc: 'Always here to help' },
  ];

  const quickLinks = [
    { name: 'About Us', icon: <Person /> },
    { name: 'Programs', icon: <School /> },
    { name: 'Alumni', icon: <Group /> },
    { name: 'Affiliation', icon: <Description /> },
    { name: 'Contact Us', icon: <Phone /> },
  ];

  const stats = [
    { number: '5000+', label: 'Students Trained' },
    { number: '95%', label: 'Success Rate' },
    { number: '50+', label: 'Expert Faculty' },
    { number: '15+', label: 'Years Experience' },
  ];

  return (
    <LayoutWrapper>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
            `,
            zIndex: 1,
          },
        }}
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '100px',
            height: '100px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            right: '15%',
            width: '60px',
            height: '60px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse',
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '20%',
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '50%',
            animation: 'float 10s ease-in-out infinite',
            zIndex: 1,
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          {/* Hero Footer Section */}
          <Box sx={{ py: { xs: 3, md: 4 } }}>
            <Fade in timeout={1000}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      mr: 2,
                    }}
                  >
                    <InstituteLogo width={40} height={40} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: 'white',
                        mb: 0.5,
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                      }}
                    >
                      MIVPS
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 500,
                        fontSize: { xs: '0.8rem', md: '0.9rem' },
                      }}
                    >
                      Mahavir Institute of Vocational & Paramedical Science
                    </Typography>
                  </Box>
                </Box>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    maxWidth: '600px',
                    mx: 'auto',
                    mb: 2,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    fontWeight: 400,
                    lineHeight: 1.5,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  Empowering the next generation of healthcare and technical professionals.
                </Typography>

                {/* Stats Cards */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
                  gap: 2,
                  mb: 3,
                }}>
                  {stats.map((stat, index) => (
                    <Slide direction="up" in timeout={1200 + index * 200} key={index}>
                      <Card
                        sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: 2,
                          p: 1.5,
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            background: 'rgba(255, 255, 255, 0.15)',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                          },
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            color: 'white',
                            fontWeight: 800,
                            mb: 0.5,
                            fontSize: { xs: '1.3rem', md: '1.6rem' },
                          }}
                        >
                          {stat.number}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontWeight: 500,
                            fontSize: '0.8rem',
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </Card>
                    </Slide>
                  ))}
                </Box>
              </Box>
            </Fade>

            {/* Main Content Grid */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr 1fr' }, 
              gap: { xs: 3, md: 4 },
              mb: 3,
            }}>
              {/* Features Section */}
              <Slide direction="right" in timeout={1400}>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      mb: 2,
                      fontSize: { xs: '1.2rem', md: '1.5rem' },
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    Why Choose MIVPS?
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    {features.map((feature, index) => (
                      <Fade in timeout={1600 + index * 200} key={index}>
                        <Card
                          sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 2,
                            p: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateX(5px)',
                              background: 'rgba(255, 255, 255, 0.15)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: 1.5,
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                              }}
                            >
                              {feature.icon}
                            </Box>
                            <Box>
                              <Typography
                                variant="body1"
                                sx={{
                                  color: 'white',
                                  fontWeight: 600,
                                  mb: 0.25,
                                  fontSize: '0.9rem',
                                }}
                              >
                                {feature.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  fontSize: '0.8rem',
                                }}
                              >
                                {feature.desc}
                              </Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Fade>
                    ))}
                  </Box>
                </Box>
              </Slide>

              {/* Quick Links */}
              <Slide direction="up" in timeout={1500}>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      mb: 2,
                      fontSize: { xs: '1.2rem', md: '1.3rem' },
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    Quick Links
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {quickLinks.map((link, index) => (
                      <Fade in timeout={1700 + index * 200} key={index}>
                        <Button
                          onClick={() => handleQuickLinkClick(link.name)}
                          startIcon={link.icon}
                          endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
                          sx={{
                            color: 'white',
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            p: 1.5,
                            borderRadius: 1.5,
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s ease',
                            fontSize: '0.9rem',
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.2)',
                              transform: 'translateX(5px)',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            },
                          }}
                        >
                          {link.name}
                        </Button>
                      </Fade>
                    ))}
                  </Box>
                </Box>
              </Slide>

              {/* Contact & Login */}
              <Slide direction="left" in timeout={1600}>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      mb: 2,
                      fontSize: { xs: '1.2rem', md: '1.3rem' },
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    Get In Touch
                  </Typography>
                  
                  {/* Contact Info */}
                  <Box sx={{ mb: 2 }}>
                    {[
                      { icon: <LocationOn />, text: 'Near Railway Station, Main Road, Delhi, India - 110001' },
                      { icon: <Phone />, text: '+91 98765 43210' },
                      { icon: <Email />, text: 'info@mahavirinstitute.com' },
                    ].map((contact, index) => (
                      <Fade in timeout={1800 + index * 200} key={index}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                            mb: 2,
                            p: 1.5,
                            borderRadius: 1.5,
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.15)',
                              transform: 'translateY(-1px)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              p: 0.75,
                              borderRadius: 0.75,
                              background: 'rgba(255, 255, 255, 0.2)',
                              color: 'white',
                            }}
                          >
                            {contact.icon}
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              lineHeight: 1.4,
                              fontSize: '0.85rem',
                            }}
                          >
                            {contact.text}
                          </Typography>
                        </Box>
                      </Fade>
                    ))}
                  </Box>

                  {/* Login Buttons */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {[
                      { label: 'Student Portal', role: 'Student', color: '#667eea' },
                      { label: 'Center Portal', role: 'Center', color: '#f093fb' },
                      { label: 'Admin Portal', role: 'App', color: '#4facfe' },
                    ].map((portal, index) => (
                      <Fade in timeout={2000 + index * 200} key={index}>
                        <Button
                          onClick={() => handleLoginClick(portal.role)}
                          sx={{
                            background: `linear-gradient(135deg, ${portal.color}, ${portal.color}dd)`,
                            color: 'white',
                            py: 1,
                            borderRadius: 1.5,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '0.9rem',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: `0 6px 20px ${portal.color}40`,
                              background: `linear-gradient(135deg, ${portal.color}dd, ${portal.color})`,
                            },
                          }}
                        >
                          {portal.label}
                        </Button>
                      </Fade>
                    ))}
                  </Box>
                </Box>
              </Slide>
            </Box>

            {/* Bottom Section */}
            <Fade in timeout={2200}>
              <Box>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' }, 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  gap: 2,
                }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                      textAlign: { xs: 'center', md: 'left' },
                    }}
                  >
                    © 2024 MIVPS. All rights reserved. | Empowering futures through education.
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2,
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'center', md: 'flex-end' },
                  }}>
                    {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link, index) => (
                      <Button
                        key={index}
                        onClick={() => handlePolicyClick(link)}
                        sx={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: 'white',
                            background: 'rgba(255, 255, 255, 0.1)',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        {link}
                      </Button>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Fade>
          </Box>
        </Container>

        {/* CSS Animation Keyframes */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
        `}</style>  
      </Box>
    </LayoutWrapper>
  );
};

export default FooterSection;