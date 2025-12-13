import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Container,
  Grid,
  Avatar,
  Divider,
  Paper,
} from '@mui/material';
import {
  Business,
  Person,
  LocationOn,
  Email,
  Phone,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useCenterProfile } from '../../hooks/useCenterProfile';

const CenterProfilePage = () => {
  const centerId = localStorage.getItem('centerId');
  const { data, isLoading, isError, error } = useCenterProfile(centerId);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error instanceof Error ? error.message : 'Failed to load center profile. Please try again.'}
        </Alert>
      </Container>
    );
  }

  const center = data?.data;
  if (!center) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">No center data available.</Alert>
      </Container>
    );
  }

  const centerDetails = center.centerDetails || {};
  const directorDetails = center.authorizedPersonDetails || {};
  const fullAddress = [
    centerDetails.address,
    centerDetails.city,
    centerDetails.state,
    centerDetails.pinCode,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          mb: 4,
          color: '#1e293b',
        }}
      >
        Center Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Center Information Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: '100%',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Business sx={{ fontSize: 32, color: '#3b82f6', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                  Center Information
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Center Photo */}
              {centerDetails.photo || center.infrastructureDetails?.infraPhotos?.[0] ? (
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      display: 'inline-block',
                    }}
                  >
                    <img
                      src={
                        centerDetails.photo ||
                        center.infrastructureDetails?.infraPhotos?.[0] ||
                        ''
                      }
                      alt="Center"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </Paper>
                </Box>
              ) : (
                <Box
                  sx={{
                    mb: 3,
                    textAlign: 'center',
                    p: 3,
                    bgcolor: '#f1f5f9',
                    borderRadius: 2,
                  }}
                >
                  <ImageIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No center photo available
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}
                  >
                    Center Name
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600 }}>
                    {centerDetails.centerName || 'N/A'}
                  </Typography>
                </Box>

                {centerDetails.centerCode && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}
                    >
                      Center Code
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#1e293b' }}>
                      {centerDetails.centerCode}
                    </Typography>
                  </Box>
                )}

                {centerDetails.centerType && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}
                    >
                      Center Type
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#1e293b' }}>
                      {centerDetails.centerType}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}
                  >
                    Address
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <LocationOn sx={{ color: '#64748b', fontSize: 20, mt: 0.5 }} />
                    <Typography variant="body1" sx={{ color: '#1e293b' }}>
                      {fullAddress || 'N/A'}
                    </Typography>
                  </Box>
                </Box>

                {centerDetails.officialEmail && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}
                    >
                      Email
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email sx={{ color: '#64748b', fontSize: 20 }} />
                      <Typography variant="body1" sx={{ color: '#1e293b' }}>
                        {centerDetails.officialEmail}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {centerDetails.primaryContactNo && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}
                    >
                      Contact Number
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone sx={{ color: '#64748b', fontSize: 20 }} />
                      <Typography variant="body1" sx={{ color: '#1e293b' }}>
                        {centerDetails.primaryContactNo}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Director Information Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: '100%',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Person sx={{ fontSize: 32, color: '#10b981', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                  Director Information
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Director Photo */}
              {directorDetails.photo ? (
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <Avatar
                    src={directorDetails.photo}
                    alt={directorDetails.authName || 'Director'}
                    sx={{
                      width: 150,
                      height: 150,
                      mx: 'auto',
                      mb: 2,
                      border: '4px solid #e2e8f0',
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    mb: 3,
                    textAlign: 'center',
                    p: 3,
                    bgcolor: '#f1f5f9',
                    borderRadius: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 150,
                      height: 150,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: '#cbd5e1',
                      fontSize: 48,
                    }}
                  >
                    <Person sx={{ fontSize: 80 }} />
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    No director photo available
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}
                  >
                    Director Name
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600 }}>
                    {directorDetails.authName || 'N/A'}
                  </Typography>
                </Box>

                {directorDetails.designation && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}
                    >
                      Designation
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#1e293b' }}>
                      {directorDetails.designation}
                    </Typography>
                  </Box>
                )}

                {directorDetails.email && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}
                    >
                      Email
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email sx={{ color: '#64748b', fontSize: 20 }} />
                      <Typography variant="body1" sx={{ color: '#1e293b' }}>
                        {directorDetails.email}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {directorDetails.contactNo && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}
                    >
                      Contact Number
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone sx={{ color: '#64748b', fontSize: 20 }} />
                      <Typography variant="body1" sx={{ color: '#1e293b' }}>
                        {directorDetails.contactNo}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {directorDetails.idProofNo && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}
                    >
                      ID Proof Number
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#1e293b' }}>
                      {directorDetails.idProofNo}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CenterProfilePage;

