import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
} from '@mui/material';
import { CreditCard, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface IdCardManagementProps {
  sidebarOpen?: boolean;
}

const IdCardManagement = ({}: IdCardManagementProps = {}) => {
  const navigate = useNavigate();

  const handleGenerateIdCard = () => {
    navigate('/admin/generate-id-card');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          ID Card Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Generate and manage student ID cards
        </Typography>

        <Card
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f1f5f9',
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Generate Student ID Card
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Click the button below to generate a new student ID card
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<CreditCard />}
              endIcon={<ArrowForward />}
              onClick={handleGenerateIdCard}
              sx={{
                backgroundColor: '#3b82f6',
                '&:hover': { backgroundColor: '#2563eb' },
                textTransform: 'none',
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
              }}
            >
              Generate ID Card
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default IdCardManagement;