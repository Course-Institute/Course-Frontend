import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
} from '@mui/material';
import { Home, ArrowBack, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSearch = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 600,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            {/* 404 Icon */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: '8rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                  mb: 2,
                }}
              >
                404
              </Typography>
            </Box>

            {/* Error Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                mb: 2,
              }}
            >
              Page Not Found
            </Typography>

            {/* Error Message */}
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 4,
                lineHeight: 1.6,
                maxWidth: 400,
                mx: 'auto',
              }}
            >
              Sorry, we couldn't find the page you're looking for. The page might have been moved, 
              deleted, or you might have entered the wrong URL.
            </Typography>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant="contained"
                startIcon={<Home />}
                onClick={handleGoHome}
                sx={{
                  textTransform: 'none',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                Go to Home
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleGoBack}
                sx={{
                  textTransform: 'none',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Go Back
              </Button>
              
              <Button
                variant="text"
                startIcon={<Search />}
                onClick={handleSearch}
                sx={{
                  textTransform: 'none',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Search
              </Button>
            </Box>

            {/* Additional Help Text */}
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mt: 4,
                fontSize: '0.875rem',
              }}
            >
              Need help? Contact our support team or check our documentation.
            </Typography>
          </CardContent>
        </Card>

        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.1), rgba(66, 165, 245, 0.1))',
            zIndex: -1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.05), rgba(66, 165, 245, 0.05))',
            zIndex: -1,
          }}
        />
      </Box>
    </Container>
  );
};

export default NotFoundPage;
