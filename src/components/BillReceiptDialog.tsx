import React, { useRef, useState } from 'react';
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
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!bill || !receiptRef.current) return;

    setIsDownloading(true);
    try {
      // Wait for images to load
      const images = receiptRef.current.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map((img) => {
          return new Promise((resolve) => {
            if (img.complete && img.naturalWidth > 0) {
              resolve(true);
            } else {
              img.onload = () => resolve(true);
              img.onerror = () => resolve(true);
            }
          });
        })
      );

      // Additional wait to ensure everything is rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;

      // A4 dimensions in pixels at 96 DPI: 595.5px × 842.25px
      const a4WidthPx = 595.5;
      const a4HeightPx = 842.25;
      const scale = 2;

      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#ffffff',
        scale: scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: a4WidthPx,
        height: a4HeightPx,
        windowWidth: a4WidthPx,
        windowHeight: a4HeightPx,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [a4WidthPx, a4HeightPx],
        compress: false,
      });

      pdf.addImage(imgData, 'PNG', 0, 0, a4WidthPx, a4HeightPx, undefined, 'SLOW');

      const fileName = `bill-receipt-${bill.registrationNo}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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
          disabled={isDownloading}
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
          {isDownloading ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      </DialogActions>

      {/* Hidden receipt template for PDF generation */}
      <Box
        ref={receiptRef}
        sx={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '595.5px',
          height: '842.25px',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
        }}
      >
        {/* SVG Template Background */}
        <Box
          component="img"
          src="/studentReceiptTemplate.svg"
          alt="Receipt Template"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            objectFit: 'contain',
          }}
        />
        
        {/* Overlay Text Values */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            zIndex: 1,
            fontFamily: 'DMSans, Arial, sans-serif',
          }}
        >
          {/* Student Name - positioned after "Student Name:" label */}
          <Typography
            sx={{
              position: 'absolute',
              left: '280px',
              top: '184px',
              fontSize: '15.5px',
              fontWeight: 'bold',
              color: '#3b3b3b',
            }}
          >
            {bill.studentName}
          </Typography>

          {/* Registration Number - positioned after "Registration Number:" label */}
          <Typography
            sx={{
              position: 'absolute',
              left: '280px',
              top: '211px',
              fontSize: '15.5px',
              fontWeight: 'bold',
              color: '#3b3b3b',
            }}
          >
            {bill.registrationNo}
          </Typography>

          {/* Course Name - positioned after "Cource Name:" label */}
          <Typography
            sx={{
              position: 'absolute',
              left: '280px',
              top: '238px',
              fontSize: '15.5px',
              fontWeight: 'bold',
              color: '#3b3b3b',
            }}
          >
            {bill.course}
          </Typography>

          {/* Date - positioned after "Date:" label */}
          <Typography
            sx={{
              position: 'absolute',
              left: '480px',
              top: '166px',
              fontSize: '14px',
              color: '#3b3b3b',
            }}
          >
            {new Date(bill.billDate).toLocaleDateString('en-GB')}
          </Typography>

          {/* Payment Method - positioned after "PAYMENT METHOD:" label */}
          <Typography
            sx={{
              position: 'absolute',
              left: '200px',
              top: '570px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#3b3b3b',
              textTransform: 'capitalize',
            }}
          >
            {bill.paymentMethod.replace('_', ' ')}
          </Typography>

          {/* Details/Description - positioned in Details section (left side) */}
          {bill.description && (
            <Typography
              sx={{
                position: 'absolute',
                left: '108px',
                top: '320px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#000000',
                maxWidth: '300px',
                width: '300px',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                lineHeight: '1.4',
                overflow: 'hidden',
              }}
            >
              {bill.description} 
            </Typography>
          )}

          {/* Amount/Fees - positioned in FEES section (right side) */}
          <Typography
            sx={{
              position: 'absolute',
              left: '440px',
              top: '320px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#000000',
            }}
          >
            ₹{bill.amount.toLocaleString()}
          </Typography>

          {/* Receipt Number - if needed in template */}
          <Typography
            sx={{
              position: 'absolute',
              left: '280px',
              top: '140px',
              fontSize: '12px',
              color: '#3b3b3b',
            }}
          >
            {bill._id}
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};

export default BillReceiptDialog;
