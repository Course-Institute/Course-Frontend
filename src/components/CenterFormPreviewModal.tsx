import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import { Close as CloseIcon, Download as DownloadIcon } from '@mui/icons-material';
import { generateCenterFormPDF } from '../utils/pdfGenerator';

interface CenterFormData {
  // Center Details
  centerName: string;
  centerCode: string;
  centerType: string;
  yearOfEstablishment: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  officialEmail: string;
  website?: string;

  // Authorized Person Details
  authName: string;
  designation: string;
  contactNo: string;
  email: string;
  idProofNo: string;

  // Infrastructure Details
  numClassrooms: string;
  numComputers: string;
  internetFacility: string;
  seatingCapacity: string;

  // Bank Details
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  branchName: string;

  // Documents
  gstCertificate: string;
  panCard: string;
  addressProof: string;
  directorIdProof: string;

  // Login Credentials
  username: string;
  password: string;
  confirmPassword: string;
}

interface CenterFormPreviewModalProps {
  open: boolean;
  onClose: () => void;
  formData: CenterFormData;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const CenterFormPreviewModal: React.FC<CenterFormPreviewModalProps> = ({
  open,
  onClose,
  formData,
  onSubmit,
  isSubmitting = false,
}) => {
  const handleDownload = () => {
    generateCenterFormPDF(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Center Registration Form Preview</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        <Box
          sx={{
            height: '100%',
            overflow: 'auto',
            p: 2,
            backgroundColor: '#f8f9fa',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              p: 3,
              borderRadius: 1,
              boxShadow: 1,
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Mahavir Institute
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Center Registration & Login Panel
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Place Institute Logo Here
              </Typography>
            </Box>

            {/* Section Title */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontStyle: 'italic', mb: 2 }}>
              SECTION 1: CENTER REGISTRATION FORM
            </Typography>

            {/* Form Content */}
            <Box sx={{ display: 'grid', gap: 2 }}>
              {/* Center Details */}
              <Box sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
                <Box sx={{ backgroundColor: '#f0f0f0', p: 1, fontWeight: 'bold' }}>
                  Center Details
                </Box>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, fontSize: '0.9rem' }}>
                    <Box>Center Name:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.centerName || ''}</Box>
                    <Box>Center Code (if any):</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.centerCode || ''}</Box>
                    <Box>Center Type:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.centerType || ''}</Box>
                    <Box>Year of Establishment:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.yearOfEstablishment || ''}</Box>
                    <Box>Full Address:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.address || ''}</Box>
                    <Box>City:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.city || ''}</Box>
                    <Box>State:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.state || ''}</Box>
                    <Box>Pin Code:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.pinCode || ''}</Box>
                    <Box>Official Email ID:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.officialEmail || ''}</Box>
                    <Box>Website (if any):</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.website || ''}</Box>
                  </Box>
                </Box>
              </Box>

              {/* Authorized Person Details */}
              <Box sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
                <Box sx={{ backgroundColor: '#f0f0f0', p: 1, fontWeight: 'bold' }}>
                  Authorized Person Details
                </Box>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, fontSize: '0.9rem' }}>
                    <Box>Name:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.authName || ''}</Box>
                    <Box>Designation:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.designation || ''}</Box>
                    <Box>Contact No.:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.contactNo || ''}</Box>
                    <Box>Email ID:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.email || ''}</Box>
                    <Box>Aadhaar / ID Proof No.:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.idProofNo || ''}</Box>
                    <Box>Upload Photograph:</Box>
                    <Box sx={{ fontWeight: 'bold', color: 'text.secondary' }}>[File Upload]</Box>
                  </Box>
                </Box>
              </Box>

              {/* Infrastructure Details */}
              <Box sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
                <Box sx={{ backgroundColor: '#f0f0f0', p: 1, fontWeight: 'bold' }}>
                  Infrastructure Details
                </Box>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, fontSize: '0.9rem' }}>
                    <Box>No. of Classrooms:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.numClassrooms || ''}</Box>
                    <Box>No. of Computers:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.numComputers || ''}</Box>
                    <Box>Internet Facility (Yes/No):</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.internetFacility || ''}</Box>
                    <Box>Seating Capacity:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.seatingCapacity || ''}</Box>
                    <Box>Upload Infrastructure Photos:</Box>
                    <Box sx={{ fontWeight: 'bold', color: 'text.secondary' }}>[File Upload]</Box>
                  </Box>
                </Box>
              </Box>

              {/* Bank Details */}
              <Box sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
                <Box sx={{ backgroundColor: '#f0f0f0', p: 1, fontWeight: 'bold' }}>
                  Bank Details
                </Box>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, fontSize: '0.9rem' }}>
                    <Box>Bank Name:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.bankName || ''}</Box>
                    <Box>Account Holder Name:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.accountHolder || ''}</Box>
                    <Box>Account Number:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.accountNumber || ''}</Box>
                    <Box>IFSC Code:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.ifsc || ''}</Box>
                    <Box>Branch Name:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.branchName || ''}</Box>
                    <Box>Upload Cancelled Cheque:</Box>
                    <Box sx={{ fontWeight: 'bold', color: 'text.secondary' }}>[File Upload]</Box>
                  </Box>
                </Box>
              </Box>

              {/* Documents */}
              <Box sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
                <Box sx={{ backgroundColor: '#f0f0f0', p: 1, fontWeight: 'bold' }}>
                  Documents Upload
                </Box>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, fontSize: '0.9rem' }}>
                    <Box>Documents Upload:</Box>
                    <Box sx={{ fontWeight: 'bold', color: 'text.secondary' }}>[File Upload]</Box>
                    <Box>Registration/GST Certificate:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.gstCertificate || ''}</Box>
                    <Box>PAN Card:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.panCard || ''}</Box>
                    <Box>Address Proof:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.addressProof || ''}</Box>
                    <Box>Director ID Proof:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.directorIdProof || ''}</Box>
                  </Box>
                </Box>
              </Box>

              {/* Login Credentials */}
              <Box sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
                <Box sx={{ backgroundColor: '#f0f0f0', p: 1, fontWeight: 'bold' }}>
                  Login Credentials
                </Box>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, fontSize: '0.9rem' }}>
                    <Box>Create Username:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>{formData.username || ''}</Box>
                    <Box>Create Password:</Box>
                    <Box sx={{ fontWeight: 'bold', color: 'text.secondary' }}>[HIDDEN]</Box>
                    <Box>Confirm Password:</Box>
                    <Box sx={{ fontWeight: 'bold', color: 'text.secondary' }}>[HIDDEN]</Box>
                  </Box>
                </Box>
              </Box>

              {/* Declaration */}
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #e9ecef', 
                borderRadius: 1,
                mt: 2
              }}>
                <Typography variant="body2">
                  I hereby declare that all information provided is true and correct to the best of my knowledge.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Signature / Stamp: _________________________
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleDownload}
          variant="outlined"
          startIcon={<DownloadIcon />}
          sx={{
            borderColor: '#1e293b',
            color: '#1e293b',
            '&:hover': {
              borderColor: '#334155',
              backgroundColor: '#f8f9fa'
            }
          }}
        >
          Download PDF
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={isSubmitting}
          sx={{
            backgroundColor: '#1e293b',
            '&:hover': {
              backgroundColor: '#334155'
            }
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Registration'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CenterFormPreviewModal;
