import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import { useCreateBill } from '../hooks/useCreateBill';
import { useToast } from '../contexts/ToastContext';

interface CenterBillFormData {
  centerName: string;
  centerCode: string;
  centerType: string;
  amount: number;
  paymentMethod: string;
  billDate: string;
  dueDate: string;
  description: string;
  status: string;
  billType: string;
}

const CenterBillForm: React.FC = () => {
  const [formData, setFormData] = useState<CenterBillFormData>({
    centerName: '',
    centerCode: '',
    centerType: '',
    amount: 0,
    paymentMethod: '',
    billDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    description: '',
    status: 'pending',
    billType: 'center_fee',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createBillMutation = useCreateBill();
  const { showToast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.centerName.trim()) newErrors.centerName = 'Center name is required';
    if (!formData.centerCode.trim()) newErrors.centerCode = 'Center code is required';
    if (!formData.centerType.trim()) newErrors.centerType = 'Center type is required';
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    if (!formData.billDate.trim()) newErrors.billDate = 'Bill date is required';
    if (!formData.dueDate.trim()) newErrors.dueDate = 'Due date is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CenterBillFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fill all required fields correctly', 'error');
      return;
    }

    createBillMutation.mutate(formData, {
      onSuccess: (data: any) => {
        showToast(data.message || 'Center bill created successfully!', 'success');
        setFormData({
          centerName: '',
          centerCode: '',
          centerType: '',
          amount: 0,
          paymentMethod: '',
          billDate: new Date().toISOString().split('T')[0],
          dueDate: new Date().toISOString().split('T')[0],
          description: '',
          status: 'pending',
          billType: 'center_fee',
        });
        setErrors({});
      },
      onError: (error: any) => {
        showToast(error?.message || 'Failed to create center bill', 'error');
      },
    });
  };

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', mt: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1e293b' }}>
          Create Center Bill Receipt
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Center Name"
                value={formData.centerName}
                onChange={(e) => handleInputChange('centerName', e.target.value)}
                error={!!errors.centerName}
                helperText={errors.centerName}
                required
              />
              <TextField
                fullWidth
                label="Center Code"
                value={formData.centerCode}
                onChange={(e) => handleInputChange('centerCode', e.target.value)}
                error={!!errors.centerCode}
                helperText={errors.centerCode}
                required
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth required error={!!errors.centerType}>
                <InputLabel>Center Type</InputLabel>
                <Select
                  value={formData.centerType}
                  onChange={(e) => handleInputChange('centerType', e.target.value)}
                  label="Center Type"
                >
                  <MenuItem value="franchise">Franchise</MenuItem>
                  <MenuItem value="company">Company</MenuItem>
                  <MenuItem value="institute">Institute</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                error={!!errors.amount}
                helperText={errors.amount}
                required
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth required error={!!errors.paymentMethod}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="cheque">Cheque</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth required error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Bill Date"
                type="date"
                value={formData.billDate}
                onChange={(e) => handleInputChange('billDate', e.target.value)}
                error={!!errors.billDate}
                helperText={errors.billDate}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                error={!!errors.dueDate}
                helperText={errors.dueDate}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              required
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={createBillMutation.isPending}
              sx={{
                backgroundColor: '#3b82f6',
                '&:hover': { backgroundColor: '#2563eb' },
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {createBillMutation.isPending ? 'Creating Center Bill...' : 'Create Center Bill'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CenterBillForm;
