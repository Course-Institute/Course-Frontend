import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, Download as DownloadIcon } from '@mui/icons-material';
import { type Bill } from '../hooks/useBillList';
import jsPDF from 'jspdf';

interface BillReceiptDialogProps {
  open: boolean;
  onClose: () => void;
  bill: Bill | null;
}

const BillReceiptDialog: React.FC<BillReceiptDialogProps> = ({ open, onClose, bill }) => {
  const handleDownloadPDF = () => {
    if (!bill) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 20;

    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BILL RECEIPT', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Receipt No: ${bill._id}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Date: ${new Date(bill.billDate).toLocaleDateString()}`, margin, yPosition);
    yPosition += 20;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Student Details:', margin, yPosition);
    yPosition += 10;

    pdf.setFont('helvetica', 'normal');
    pdf.text(`Name: ${bill.studentName}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Registration No: ${bill.registrationNo}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Course: ${bill.course}`, margin, yPosition);
    yPosition += 20;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Payment Details:', margin, yPosition);
    yPosition += 10;

    pdf.setFont('helvetica', 'normal');
    pdf.text(`Amount: ₹${bill.amount}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Payment Method: ${bill.paymentMethod}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Status: ${bill.status.toUpperCase()}`, margin, yPosition);
    yPosition += 8;
    pdf.text(`Due Date: ${new Date(bill.dueDate).toLocaleDateString()}`, margin, yPosition);
    yPosition += 20;

    if (bill.description) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Description:', margin, yPosition);
      yPosition += 10;
      pdf.setFont('helvetica', 'normal');
      const descriptionLines = pdf.splitTextToSize(bill.description, pageWidth - 2 * margin);
      pdf.text(descriptionLines, margin, yPosition);
    }

    pdf.save(`bill-receipt-${bill.registrationNo}.pdf`);
  };

  if (!bill) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#10b981';
      case 'overdue': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
            Bill Receipt
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Receipt No: {bill._id}
            </Typography>
            <Box
              sx={{
                backgroundColor: getStatusColor(bill.status),
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              {bill.status}
            </Box>
          </Box>

          <Divider />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#1e293b' }}>
                Student Information
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Name:</strong> {bill.studentName}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Registration No:</strong> {bill.registrationNo}
              </Typography>
              <Typography variant="body2">
                <strong>Course:</strong> {bill.course}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#1e293b' }}>
                Payment Information
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Amount:</strong> ₹{bill.amount.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Payment Method:</strong> {bill.paymentMethod}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Bill Date:</strong> {new Date(bill.billDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                <strong>Due Date:</strong> {new Date(bill.dueDate).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          {bill.description && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#1e293b' }}>
                  Description
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {bill.description}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#64748b',
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1,
            borderRadius: 2,
          }}
        >
          Close
        </Button>
        <Button
          onClick={handleDownloadPDF}
          variant="contained"
          startIcon={<DownloadIcon />}
          sx={{
            backgroundColor: '#3b82f6',
            color: 'white',
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#2563eb',
            },
          }}
        >
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillReceiptDialog;
