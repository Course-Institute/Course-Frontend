import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  Button,
  Skeleton,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useState } from 'react';
import { useIdCardStats } from '../hooks/useIdCardStats';
import IdCardStudentTable from './IdCardStudentTable';
import IdCardPreview from './IdCardPreview';

interface IdCardManagementProps {
  sidebarOpen?: boolean;
}

const IdCardManagement = ({}: IdCardManagementProps = {}) => {
  const theme = useTheme();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  
  const { 
    idCardStats: stats, 
    isIdCardStatsLoading: statsLoading 
  } = useIdCardStats();

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  const handleExport = () => {
    // Handle export functionality
    console.log('Exporting data...');
  };

  const handleBulkGenerate = () => {
    // Handle bulk generate functionality
    console.log('Bulk generating ID cards...');
  };

  const statsCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      color: theme.palette.primary.main,
    },
    {
      title: 'Pending ID Cards',
      value: stats?.pendingIdCards || 0,
      color: theme.palette.warning.main,
    },
    {
      title: 'Generated ID Cards',
      value: stats?.generatedIdCards || 0,
      color: theme.palette.success.main,
    },
    {
      title: 'Rejected Applications',
      value: stats?.rejectedApplications || 0,
      color: theme.palette.error.main,
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        boxSizing: 'border-box',
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          color: theme.palette.text.primary,
          flexShrink: 0,
        }}
      >
        ID Card Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ flexShrink: 0 }}>
        {statsCards.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card
              sx={{
                height: '100%',
                background: 'white',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {statsLoading ? (
                  <>
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="40%" height={32} sx={{ mt: 1 }} />
                  </>
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        color: stat.color,
                        fontSize: '1.5rem',
                        mb: 1,
                      }}
                    >
                      {stat.value.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                      }}
                    >
                      {stat.title}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

        {/* Main Content - Takes remaining space */}
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 500,
        }}>
        <Grid container spacing={3} sx={{ 
          flexGrow: 1,
          minHeight: 400,
        }}>
          {/* ID Card Student Table */}
          <Grid size={{ xs: 12, lg: selectedStudentId ? 8 : 12 }}>
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              minHeight: 400,
            }}>
              <IdCardStudentTable
                onStudentSelect={handleStudentSelect}
                selectedStudentId={selectedStudentId}
                onExport={handleExport}
              />
            </Box>
          </Grid>

          {/* ID Card Preview */}
          {selectedStudentId && (
            <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              gap: 2,
              minHeight: 400,
            }}>
                <Box sx={{ 
                  flexGrow: 1,
                  minHeight: 0,
                  overflow: 'auto',
                }}>
                  <IdCardPreview selectedStudentId={selectedStudentId} />
                </Box>
                
                {/* Bulk Generate Button */}
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleBulkGenerate}
                  sx={{
                    alignSelf: 'flex-start',
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: theme.palette.secondary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.secondary.dark,
                    },
                    flexShrink: 0,
                  }}
                >
                  Bulk Generate
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default IdCardManagement;
