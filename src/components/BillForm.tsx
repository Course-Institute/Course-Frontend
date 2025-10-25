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

interface BillFormData {
  studentName: string;
  registrationNo: string;
  course: string;
  amount: number;
  paymentMethod: string;
  billDate: string;
  dueDate: string;
  description: string;
  status: string;
  centerId?: string;
}

interface BillFormProps {
  centerId?: string;
}

const BillForm: React.FC<BillFormProps> = ({ centerId }) => {
  const [formData, setFormData] = useState<BillFormData>({
    studentName: '',
    registrationNo: '',
    course: '',
    amount: 0,
    paymentMethod: '',
    billDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    description: '',
    status: 'pending',
    centerId: centerId || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createBillMutation = useCreateBill();
  const { showToast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required';
    if (!formData.registrationNo.trim()) newErrors.registrationNo = 'Registration number is required';
    if (!formData.course.trim()) newErrors.course = 'Course is required';
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    if (!formData.billDate.trim()) newErrors.billDate = 'Bill date is required';
    if (!formData.dueDate.trim()) newErrors.dueDate = 'Due date is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof BillFormData, value: any) => {
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
        showToast(data.message || 'Bill created successfully!', 'success');
        setFormData({
          studentName: '',
          registrationNo: '',
          course: '',
          amount: 0,
          paymentMethod: '',
          billDate: new Date().toISOString().split('T')[0],
          dueDate: new Date().toISOString().split('T')[0],
          description: '',
          status: 'pending',
        });
        setErrors({});
      },
      onError: (error: any) => {
        showToast(error?.message || 'Failed to create bill', 'error');
      },
    });
  };

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', mt: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1e293b' }}>
          Create Bill Receipt
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Student Name"
                value={formData.studentName}
                onChange={(e) => handleInputChange('studentName', e.target.value)}
                error={!!errors.studentName}
                helperText={errors.studentName}
                required
              />
              <TextField
                fullWidth
                label="Registration Number"
                value={formData.registrationNo}
                onChange={(e) => handleInputChange('registrationNo', e.target.value)}
                error={!!errors.registrationNo}
                helperText={errors.registrationNo}
                required
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Course"
                value={formData.course}
                onChange={(e) => handleInputChange('course', e.target.value)}
                error={!!errors.course}
                helperText={errors.course}
                required
              />
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
              {createBillMutation.isPending ? 'Creating Bill...' : 'Create Bill'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BillForm;