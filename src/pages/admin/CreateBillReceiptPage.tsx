import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardContent } from '@mui/material';
import { Business, Person, Category } from '@mui/icons-material';
import BillForm from '../../components/BillForm';
import CenterBillForm from '../../components/CenterBillForm';
import OtherBillForm from '../../components/OtherBillForm';

interface CreateBillReceiptPageProps {
  centerId?: string;
}

const CreateBillReceiptPage: React.FC<CreateBillReceiptPageProps> = ({ centerId }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderForm = () => {
    // If centerId is provided (center user), hide center bill tab
    const adjustedTab = centerId ? (activeTab === 1 ? 2 : activeTab) : activeTab;
    
    switch (adjustedTab) {
      case 0:
        return <BillForm centerId={centerId} />;
      case 1:
        return centerId ? <OtherBillForm centerId={centerId} /> : <CenterBillForm centerId={centerId} />;
      case 2:
        return <OtherBillForm centerId={centerId} />;
      default:
        return <BillForm centerId={centerId} />;
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      py: 3,
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        {/* <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#1e293b',
            mb: 2,
            textAlign: 'center',
          }}
        >
          Create Bill Receipt
        </Typography> */}
        
        <Typography
          variant="body1"
          sx={{
            color: '#64748b',
            mb: 4,
            textAlign: 'center',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          Generate bill receipts for different types of payments and fees
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  py: 2,
                },
                '& .Mui-selected': {
                  color: '#3b82f6',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#3b82f6',
                  height: 3,
                },
              }}
            >
              <Tab
                icon={<Person />}
                iconPosition="start"
                label="Student Bill"
                sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}
              />
              {!centerId && (
                <Tab
                  icon={<Business />}
                  iconPosition="start"
                  label="Center Bill"
                  sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}
                />
              )}
              <Tab
                icon={<Category />}
                iconPosition="start"
                label="Other Bill"
                sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}
              />
            </Tabs>
          </CardContent>
        </Card>

        {renderForm()}
      </Box>
    </Box>
  );
};

export default CreateBillReceiptPage;
