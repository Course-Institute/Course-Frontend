import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Download, Check } from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DialogBox from './core-components/DialogBox/DialogBox';
import { type AddStudentData } from '../hooks/useAddStudent';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Handle photo URL
    if (formData.photo) {
      if (formData.photo instanceof File) {
        const url = URL.createObjectURL(formData.photo);
        setPhotoUrl(url);
        return () => URL.revokeObjectURL(url);
      } else if (typeof formData.photo === 'string') {
        setPhotoUrl(formData.photo);
      }
    }
  }, [formData.photo]);

  const handleDownload = async () => {
    if (!formRef.current) return;

    setIsDownloading(true);
    try {
      // 1. Wait for images to load
      const images = formRef.current.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) resolve(true);
              img.onload = () => resolve(true);
              img.onerror = () => resolve(true);
            })
        )
      );

      await new Promise((r) => setTimeout(r, 200));

      // Your template is EXACT A4 size (595.5 × 842.25)
      const a4WidthPx = 595.5;
      const a4HeightPx = 842.25;

      // 2. Capture at high resolution (2x scale for sharp PDF)
      const scale = 2;
      const canvas = await html2canvas(formRef.current, {
        scale,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);

      // 3. Create A4 PDF in EXACT size
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [a4WidthPx, a4HeightPx], // REAL A4 SIZE
        compress: false,
      });

      // 4. Draw image EXACTLY in A4 dimensions — no stretch, no shift
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        a4WidthPx,
        862.25,
        undefined,
        "SLOW"
      );

      // 5. Save file
      const fileName = `Student_Registration_${formData.candidateName
        .replace(/\s+/g, "_")
        .trim()}_${new Date().toISOString().slice(0, 10)}.pdf`;

      pdf.save(fileName);
    } catch (err) {
      console.error("PDF Error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <DialogBox
      open={open}
      onClose={onClose}
      title="Student Registration Preview"
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
      <Box
        ref={containerRef}
        sx={{
        position: 'relative', 
          width: '100%',
        maxHeight: 'calc(90vh - 120px)',
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          p: 2,
        }}
      >
        {/* Download Button */}
        <Tooltip title={isDownloading ? 'Generating PDF...' : 'Download PDF'}>
          <IconButton
            onClick={handleDownload}
            disabled={isDownloading}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: '#10b981',
              color: 'white',
              zIndex: 10,
              '&:hover': {
                backgroundColor: '#059669',
              },
              '&:disabled': {
                backgroundColor: '#9ca3af',
              },
            }}
          >
            <Download />
          </IconButton>
        </Tooltip>

        {/* Form Template Container */}
        <Box
          ref={formRef}
          sx={{
            position: 'relative',
            width: '595.5px',
            height: '842.25px',
            backgroundColor: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          {/* SVG Template Background */}
          <Box
            component="img"
            src="/mivpsa-student-form-template.svg"
            alt="Student Form Template"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              zIndex: 1,
            }}
          />

          {/* Overlay Content - Form Data */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              height: '100%',
            }}
          >
            {/* Photo Box - Top Right */}
            <Box
              sx={{
                position: 'absolute',
                top: '52px',
                right: '41px',
                width: '105px',
                height: '110px',
                border: '2px solid #000',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {photoUrl ? (
                <Box
                  component="img"
                  src={photoUrl}
                  alt="Student Photo"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'fill',
                  }}
                />
              ) : null}
            </Box>

            {/* Personal Information - Values Only */}
            <Typography
              sx={{
                position: 'absolute',
                top: '183px',
                left: '135px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.candidateName || ''}
            </Typography>

            <Typography
              sx={{
                position: 'absolute',
                top: '183px',
                right: '147px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.fatherName || ''}
            </Typography>

            {/* Date of Birth - Left Column, Row 2 */}
            <Typography
              sx={{
                position: 'absolute',
                top: '211px',
                left: '135px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.dateOfBirth || ''}
            </Typography>

            {/* Mother Name - Right Column, Row 2 */}
            <Typography
              sx={{
                position: 'absolute',
                top: '211px',
                right: '147px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.motherName || ''}
            </Typography>

            {/* Email - Left Column, Row 3 */}
            <Typography
              sx={{
                position: 'absolute',
                top: '238px',
                left: '135px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.emailAddress || ''}
            </Typography>

            {/* Phone - Right Column, Row 3 */}
            <Typography
              sx={{
                position: 'absolute',
                top: '241px',
                right: '120px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.contactNumber || ''}
            </Typography>

            {/* Current Address - Left Column, Row 4 (full width) */}
            <Typography
              sx={{
                position: 'absolute',
                top: '265px',
                left: '135px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                maxWidth: '400px',
                wordWrap: 'break-word',
                lineHeight: 1.2,
              }}
            >
              {formData.currentAddress || ''}
            </Typography>

            {/* Aadhar Card No - Left Column, Row 5 */}
            <Typography
              sx={{
                position: 'absolute',
                top: '295px',
                left: '135px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.adharCardNo || ''}
            </Typography>

            {/* Gender - Right Column, Row 5 */}
            <Typography
              sx={{
                position: 'absolute',
                top: '295px',
                right: '159px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.gender || ''}
            </Typography>

            {/* State Name - Left Column, Row 6 */}
            <Typography
              sx={{
                position: 'absolute',
                top: '323px',
                left: '135px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.state || ''}
            </Typography>

            {/* City - Right Column, Row 6 */}
            <Typography
              sx={{
                position: 'absolute',
                top: '319px',
                right: '155px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.city || ''}
            </Typography>

            {/* Country - Left Column, Row 7 */}
            <Typography
              sx={{
                position: 'absolute',
                top: '348px',
                left: '135px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.country || ''}
            </Typography>

            {/* Pincode - Right Column, Row 7 */}
            <Typography
              sx={{
                position: 'absolute',
                top: '345px',
                right: '147px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.pincode || ''}
            </Typography>

            {/* Employment Information - Values Only */}
            {/* Employer Name - Left Column */}
            <Typography
              sx={{
                position: 'absolute',
                top: '417px',
                left: '147px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.employerName || ''}
            </Typography>

            {/* Designation - Right Column */}
            <Typography
              sx={{
                position: 'absolute',
                top: '417px',
                right: '147px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.designation || ''}
            </Typography>

            {/* Academic Information - Values Only */}
            {/* Grade - Left Column */}
            <Typography
              sx={{
                position: 'absolute',
                top: '504px',
                left: '115px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.grade || ''}
            </Typography>

            {/* Course Type - Right Column */}
            <Typography
              sx={{
                position: 'absolute',
                top: '500px',
                right: '269px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.courseType || ''}
            </Typography>

            {/* Courses - Left Column, full width */}
            <Typography
              sx={{
                position: 'absolute',
                top: '540px',
                left: '115px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                maxWidth: '400px',
                wordWrap: 'break-word',
                lineHeight: 1.2,
              }}
            >
              {formData.course || ''}
            </Typography>

            {/* Year - Left Column */}
            <Typography
              sx={{
                position: 'absolute',
                top: '572px',
                left: '115px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.year || ''}
            </Typography>

            {/* Month Session - Right Column */}
            <Typography
              sx={{
                position: 'absolute',
                top: '572px',
                right: '273px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.monthSession || ''}
            </Typography>

            {/* Session - Left Column */}
            <Typography
              sx={{
                position: 'absolute',
                top: '572px',
                right: '120px',
                fontSize: '0.65rem',
                color: '#000',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {formData.session || ''}
          </Typography>

            {/* Declaration Checkbox - Tick Mark Only */}
            <Box
              sx={{
                position: 'absolute',
                top: '649px',
                left: '65px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Check
                sx={{
                  fontSize: '1.5rem',
                  color: '#000',
                  fontWeight: 'bold',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </DialogBox>
  );
};

export default StudentFormPreviewDialog;
