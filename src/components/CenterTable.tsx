import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  CheckCircle, 
  Cancel,
  PowerSettingsNew,
} from '@mui/icons-material';
import { type Center } from '../hooks/useCenterList';
// import { useState } from 'react';

interface CenterTableProps {
  centers: Center[];
  onCenterAction: (action: string, center: Center) => void;
}

const CenterTable = ({ centers, onCenterAction }: CenterTableProps) => {
  const theme = useTheme();
  // const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

  // const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, centerId: string) => {
  //   setAnchorEl(prev => ({
  //     ...prev,
  //     [centerId]: event.currentTarget
  //   }));
  // };

  // const handleMenuClose = (centerId: string) => {
  //   setAnchorEl(prev => ({
  //     ...prev,
  //     [centerId]: null
  //   }));
  // };

  const getStatusColor = (status: Center['status']) => {
    switch (status) {
      case 'Approve':
        return 'warning';
      case 'Published':
        return 'success';
      case 'Active':
        return 'success';
      case 'Pending':
        return 'info';
      case 'Deactivated':
        return 'error';
      case 'Refenisted':
        return 'default';
      case 'Renning':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: Center['status']) => {
    switch (status) {
      case 'Approve':
        return 'Approve';
      case 'Published':
        return 'Published';
      case 'Active':
        return 'Active';
      case 'Pending':
        return 'Pending';
      case 'Deactivated':
        return 'Deactivated';
      case 'Refenisted':
        return 'Refenisted';
      case 'Renning':
        return 'Renning';
      default:
        return status;
    }
  };

  const getActionButtons = (center: Center) => {
    const actions = [];
    
    switch (center.status) {
      case 'Approve':
        actions.push(
          { label: 'Approve', icon: <CheckCircle />, color: 'success' },
          { label: 'Reject', icon: <Cancel />, color: 'error' }
        );
        break;
      case 'Published':
      case 'Active':
        actions.push(
          { label: 'Edit', icon: <Edit />, color: 'primary' },
          { label: 'Deactivate', icon: <PowerSettingsNew />, color: 'warning' }
        );
        break;
      case 'Pending':
        actions.push(
          { label: 'Approve', icon: <CheckCircle />, color: 'success' },
          { label: 'Edit', icon: <Edit />, color: 'primary' }
        );
        break;
      case 'Deactivated':
        actions.push(
          { label: 'Activate', icon: <PowerSettingsNew />, color: 'success' },
          { label: 'Delete', icon: <Delete />, color: 'error' }
        );
        break;
      case 'Refenisted':
      case 'Renning':
        actions.push(
          { label: 'Edit', icon: <Edit />, color: 'primary' },
          { label: 'Deactivate', icon: <PowerSettingsNew />, color: 'warning' }
        );
        break;
    }
    
    return actions;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Table - Takes remaining space */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <TableContainer 
          component={Paper} 
          sx={{ 
            flexGrow: 1,
            height: '100%',
            maxHeight: 'calc(100vh - 400px)', // Prevent overflow
            borderRadius: 3,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f1f5f9',
            overflow: 'auto',
            boxSizing: 'border-box',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#a8a8a8',
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Center ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Center Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contact Person</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Students</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {centers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No centers found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                centers.map((center) => (
                  <TableRow
                    key={center.id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.grey[50],
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {center.centerId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {center.centerName}
                      </Typography>
                    </TableCell>
                    <TableCell>{center.location}</TableCell>
                    <TableCell>{center.contactPerson}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {center.students}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(center.status)}
                        size="small"
                        color={getStatusColor(center.status) as any}
                        variant="outlined"
                        sx={{
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {getActionButtons(center).map((action, index) => (
                          <Button
                            key={index}
                            size="small"
                            variant="outlined"
                            startIcon={action.icon}
                            onClick={() => onCenterAction(action.label, center)}
                            sx={{
                              textTransform: 'none',
                              fontSize: '0.75rem',
                              minWidth: 'auto',
                              px: 1,
                              py: 0.5,
                              borderColor: (theme.palette as any)[action.color]?.main || action.color,
                              color: (theme.palette as any)[action.color]?.main || action.color,
                              '&:hover': {
                                backgroundColor: (theme.palette as any)[action.color]?.light + '20' || action.color + '20',
                              },
                            }}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default CenterTable;
