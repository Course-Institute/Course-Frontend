import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Divider,
  Chip,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Download,
  Person,
  School,
  LocationOn,
  Phone,
  Email,
  Work,
  Home,
} from '@mui/icons-material';
import DialogBox from './core-components/DialogBox/DialogBox';
import { type AddStudentData } from '../hooks/useAddStudent';
import { generateStudentFormPDF } from '../utils/pdfGenerator';
import InstituteLogo from './InstituteLogo';

interface StudentFormPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  onCancel: () => void;
  formData: AddStudentData;
  isSubmitting?: boolean;
}

const StudentFormPreviewDialog: React.FC<StudentFormPreviewDialogProps> = ({
  open,
  onClose,
  onSave,
  onCancel,
  formData,
  isSubmitting = false,
}) => {
  const handleDownload = () => {
    try {
      generateStudentFormPDF(formData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to text download if PDF generation fails
      const formText = `
STUDENT REGISTRATION FORM - PREVIEW
=====================================

PERSONAL INFORMATION
-------------------
Name: ${formData.candidateName}
Father's Name: ${formData.fatherName}
Mother's Name: ${formData.motherName}
Date of Birth: ${formData.dateOfBirth}
Gender: ${formData.gender}
Category: ${formData.category}
Aadhar Card No: ${formData.adharCardNo}

CONTACT INFORMATION
------------------
Contact Number: ${formData.contactNumber}
Alternate Number: ${formData.alternateNumber || 'N/A'}
Email: ${formData.emailAddress}

ADDRESS INFORMATION
------------------
Permanent Address: ${formData.permanentAddress}
Current Address: ${formData.currentAddress}
City: ${formData.city}
State: ${formData.state}
Country: ${formData.country}
Nationality: ${formData.nationality}
Pincode: ${formData.pincode}

EMPLOYMENT INFORMATION
--------------------
Employed: ${formData.isEmployed}
Employer Name: ${formData.employerName || 'N/A'}
Designation: ${formData.designation || 'N/A'}

ACADEMIC INFORMATION
-------------------
Course Type: ${formData.courseType}
Grade: ${formData.grade}
Course: ${formData.course}
Stream: ${formData.stream}
Year: ${formData.year}
Session: ${formData.session}
Month Session: ${formData.monthSession}
Duration: ${formData.duration || 'N/A'}
Course Fee: ₹${formData.courseFee}
Hostel Facility: ${formData.hostelFacility}

DOCUMENTS UPLOADED
-----------------
Photo: ${formData.photo ? 'Uploaded' : 'Not uploaded'}
Aadhar Front: ${formData.adharCardFront ? 'Uploaded' : 'Not uploaded'}
Aadhar Back: ${formData.adharCardBack ? 'Uploaded' : 'Not uploaded'}
Signature: ${formData.signature ? 'Uploaded' : 'Not uploaded'}

Generated on: ${new Date().toLocaleString()}
      `.trim();

      // Create and download the text file as fallback
      const blob = new Blob([formText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Student_Registration_${formData.candidateName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const InfoCard = ({ title, children, icon }: { title: string; children: React.ReactNode; icon: React.ReactNode }) => (
    <Card sx={{ mb: 1.5, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <CardContent sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold', color: '#1e293b', fontSize: '1rem' }}>
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );

  const InfoRow = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
      {icon && <Box sx={{ mr: 1, color: 'text.secondary' }}>{icon}</Box>}
      <Typography variant="body2" sx={{ fontWeight: 'medium', minWidth: '120px', color: '#64748b', fontSize: '0.875rem' }}>
        {label}:
      </Typography>
      <Typography variant="body2" sx={{ ml: 1, color: '#1e293b', fontSize: '0.875rem' }}>
        {value || 'N/A'}
      </Typography>
    </Box>
  );

  // Robust avatar/photo preview
  let photoUrl: string | undefined = undefined;
  if (formData.photo) {
    if (formData.photo instanceof File) {
      photoUrl = URL.createObjectURL(formData.photo);
    } else if (typeof formData.photo === 'string') {
      photoUrl = formData.photo;
    }
  }

  return (
    <DialogBox
      open={open}
      onClose={onClose}
      title="Student Registration Preview"
    //   maxWidth="lg"
      width="95%"
      maxHeight="90vh"
      hideScrollbar={true}
      showCloseIcon={true}
      actions={[
        {
          text: 'Cancel',
          variant: 'outlined',
          color: 'secondary',
          handler: onCancel,
          disabled: isSubmitting,
        },
        {
          text: isSubmitting ? 'Saving...' : 'Save Student',
          variant: 'contained',
          color: 'primary',
          handler: onSave,
          disabled: isSubmitting,
        },
      ]}
    >
      <Box sx={{ 
        position: 'relative', 
        boxSizing: 'border-box',
        maxHeight: 'calc(90vh - 120px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Branding Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1.5,
          borderRadius: 2,
          mb: 1.5,
          background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
          flexShrink: 0,
        }}>
          <Box sx={{ p: 1, borderRadius: 2, backgroundColor: 'white', border: '1px solid #e5e7eb' }}>
            <InstituteLogo width={44} height={44} sx={{ borderRadius: 1 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
              Mahavir Institute of Vocational & Paramedical Science
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Student Registration Preview
            </Typography>
          </Box>
        </Box>
        {/* Download Button */}
        <Tooltip title="Download PDF">
          <IconButton
            onClick={handleDownload}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              backgroundColor: '#10b981',
              color: 'white',
              '&:hover': {
                backgroundColor: '#059669',
              },
              zIndex: 1,
            }}
          >
            <Download />
          </IconButton>
        </Tooltip>

        {/* Header with Photo */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1.5, backgroundColor: '#f8fafc', borderRadius: 2, flexShrink: 0 }}>
          <Avatar
            src={photoUrl}
            sx={{ width: 60, height: 60, mr: 2, border: '2px solid #e2e8f0' }}
          >
            {formData.candidateName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 0.5, fontSize: '1.5rem' }}>
              {formData.candidateName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1, fontSize: '1rem' }}>
              {formData.course} - {formData.stream}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Chip label={formData.gender} size="small" color="primary" variant="outlined" />
              <Chip label={formData.category} size="small" color="secondary" variant="outlined" />
              <Chip label={`₹${formData.courseFee}`} size="small" color="success" variant="outlined" />
            </Box>
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', pr: 1 }}>
          <Grid container spacing={2}>
            {/* Personal Information */}
            <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard title="Personal Information" icon={<Person color="primary" />}>
              <InfoRow label="Full Name" value={formData.candidateName} />
              <InfoRow label="Father's Name" value={formData.fatherName} />
              <InfoRow label="Mother's Name" value={formData.motherName} />
              <InfoRow label="Date of Birth" value={formData.dateOfBirth} />
              <InfoRow label="Gender" value={formData.gender} />
              <InfoRow label="Category" value={formData.category} />
              <InfoRow label="Aadhar No" value={formData.adharCardNo} />
            </InfoCard>

            {/* Contact Information */}
            <InfoCard title="Contact Information" icon={<Phone color="primary" />}>
              <InfoRow label="Contact Number" value={formData.contactNumber} icon={<Phone fontSize="small" />} />
              <InfoRow label="Alternate Number" value={formData.alternateNumber || 'N/A'} icon={<Phone fontSize="small" />} />
              <InfoRow label="Email Address" value={formData.emailAddress} icon={<Email fontSize="small" />} />
            </InfoCard>

            {/* Employment Information */}
            <InfoCard title="Employment Information" icon={<Work color="primary" />}>
              <InfoRow label="Employed" value={formData.isEmployed} />
              <InfoRow label="Employer Name" value={formData.employerName || 'N/A'} />
              <InfoRow label="Designation" value={formData.designation || 'N/A'} />
            </InfoCard>
          </Grid>

          {/* Address & Academic Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Address Information */}
            <InfoCard title="Address Information" icon={<LocationOn color="primary" />}>
              <InfoRow label="Permanent Address" value={formData.permanentAddress} icon={<Home fontSize="small" />} />
              <InfoRow label="Current Address" value={formData.currentAddress} icon={<Home fontSize="small" />} />
              <InfoRow label="City" value={formData.city} />
              <InfoRow label="State" value={formData.state} />
              <InfoRow label="Country" value={formData.country} />
              <InfoRow label="Nationality" value={formData.nationality} />
              <InfoRow label="Pincode" value={formData.pincode} />
            </InfoCard>

            {/* Academic Information */}
            <InfoCard title="Academic Information" icon={<School color="primary" />}>
              <InfoRow label="Course Type" value={formData.courseType} />
              <InfoRow label="Grade" value={formData.grade} />
              <InfoRow label="Course" value={formData.course} />
              <InfoRow label="Stream" value={formData.stream} />
              <InfoRow label="Year" value={formData.year} />
              <InfoRow label="Session" value={formData.session} />
              <InfoRow label="Month Session" value={formData.monthSession || ''} />
              <InfoRow label="Duration" value={formData.duration || 'N/A'} />
              <InfoRow label="Course Fee" value={`₹${formData.courseFee}`} />
              <InfoRow label="Hostel Facility" value={formData.hostelFacility || 'No'} />
            </InfoCard>

          </Grid>
        </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ textAlign: 'center', py: 1, flexShrink: 0 }}>
          <Typography variant="body2" color="text.secondary">
            Please review all the information above before saving. You can download a PDF copy for your records.
          </Typography>
        </Box>
      </Box>
    </DialogBox>
  );
};

export default StudentFormPreviewDialog;
