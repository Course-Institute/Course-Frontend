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
import InstituteLogo from './InstituteLogo';

interface CenterFormData {
  // Center Details
  centerName: string;
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

  // Documents
  gstCertificate?: File | File[] | null;
  panCard?: File | File[] | null;
  addressProof?: File | File[] | null;
  directorIdProof?: File | File[] | null;
  signature?: File | File[] | null;

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
            {/* Branding Header */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              mb: 3,
              background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)',
              border: '1px solid #e2e8f0',
            }}>
              <Box sx={{ p: 1, borderRadius: 2, backgroundColor: 'white', border: '1px solid #e5e7eb' }}>
                <InstituteLogo width={48} height={48} sx={{ borderRadius: 1 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                  Mahavir Institute of Vocational & Paramedical Science
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569' }}>
                  Center Registration Preview
                </Typography>
              </Box>
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
                    <Box sx={{ fontWeight: 'bold' }}>
                      {formData.gstCertificate ? 
                        (Array.isArray(formData.gstCertificate) ? 
                          formData.gstCertificate.map(f => f.name).join(', ') : 
                          formData.gstCertificate.name) : 
                        'No file uploaded'}
                    </Box>
                    <Box>PAN Card:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>
                      {formData.panCard ? 
                        (Array.isArray(formData.panCard) ? 
                          formData.panCard.map(f => f.name).join(', ') : 
                          formData.panCard.name) : 
                        'No file uploaded'}
                    </Box>
                    <Box>Address Proof:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>
                      {formData.addressProof ? 
                        (Array.isArray(formData.addressProof) ? 
                          formData.addressProof.map(f => f.name).join(', ') : 
                          formData.addressProof.name) : 
                        'No file uploaded'}
                    </Box>
                    <Box>Director ID Proof:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>
                      {formData.directorIdProof ? 
                        (Array.isArray(formData.directorIdProof) ? 
                          formData.directorIdProof.map(f => f.name).join(', ') : 
                          formData.directorIdProof.name) : 
                        'No file uploaded'}
                    </Box>
                    <Box>Signature:</Box>
                    <Box sx={{ fontWeight: 'bold' }}>
                      {formData.signature ? 
                        (Array.isArray(formData.signature) ? 
                          formData.signature.map(f => f.name).join(', ') : 
                          formData.signature.name) : 
                        'No file uploaded'}
                    </Box>
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
