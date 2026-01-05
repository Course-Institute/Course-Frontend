import {
  Box,
  Typography,
  Button,
  Container,
} from '@mui/material';
import {
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef, useState, useEffect } from 'react';

interface StudentData {
  _id: string;
  candidateName: string;
  registrationNo: string;
  course: string;
  session: string;
  year: string;
  faculty: string;
  stream: string;
  contactNumber: string;
  emailAddress: string;
  dateOfBirth?: string;
  photo?: string;
}

const IdCardGenerationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const idCardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [containerWidth, setContainerWidth] = useState(400);

  // Calculate scale factor based on container width
  const getScaleFactor = (width: number) => {
    const baseWidth = 401; // Desktop reference width
    return width / baseWidth;
  };

  const scaleFactor = getScaleFactor(containerWidth);

  // Helper function to calculate responsive positions
  const getResponsivePosition = (basePosition: number) => {
    return basePosition * scaleFactor;
  };

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (idCardRef.current) {
        setContainerWidth(idCardRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  
  // Get student data from navigation state or use default values
  const studentData: StudentData = location.state?.studentData || {
    _id: '',
    candidateName: 'John Doe',
    registrationNo: '123456789',
    course: 'B.Tech',
    session: '2025',
    year: '2025',
    faculty: 'Engineering',
    stream: 'Computer Science',
    contactNumber: '9876543210',
    emailAddress: 'john.doe@example.com',
    dateOfBirth: '2000-01-01',
    photo: undefined
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownload = async () => {
    if (idCardRef.current) {
      setIsDownloading(true);
      try {
        // Wait for all images to load
        const images = idCardRef.current.querySelectorAll('img');
        
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
        
        const width = idCardRef.current.offsetWidth;
        const height = idCardRef.current.offsetHeight;
        const scale = 2;
        
        const canvas = await html2canvas(idCardRef.current, {
          backgroundColor: '#ffffff',
          scale: scale,
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: width,
          height: height,
        });
        
        const imgData = canvas.toDataURL('image/png', 1.0);
        
        // Create PDF with the actual dimensions
        const pdf = new jsPDF({
          orientation: width > height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [width, height],
          compress: false,
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, width, height, undefined, 'SLOW');
        
        const fileName = `student-id-card-${studentData.candidateName.replace(/\s+/g, '-')}.pdf`;
        pdf.save(fileName);
      } catch (error) {
        console.error('Error generating ID card PDF:', error);
        alert('Error generating ID card PDF. Please try again.');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Student ID Card
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Student ID Card for MIVPSA Institute
        </Typography>
      </Box>

          {/* Student ID Card with SVG Background */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Box
              ref={idCardRef}
              sx={{
                position: 'relative',
                width: { xs: 'clamp(300px, 90vw, 400px)', sm: 'clamp(350px, 80vw, 400px)', md: '400px' },
                maxWidth: '400px',
                borderRadius: 2,
                boxShadow: 3,
                border: '1px solid #e0e0e0',
                overflow: 'hidden',
              }}
            >
              {/* SVG Background */}
              <Box
                component="img"
                src="/student-id-card.svg"
                alt="Student ID Card"
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
              
              {/* Overlay Student Data */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  color: 'black',
                }}
              >
                {/* Student Photo - Positioned in the photo box on the right */}
                <Box sx={{ 
                  position: 'absolute', 
                  right: getResponsivePosition(127), 
                  top: getResponsivePosition(180), 
                  width: getResponsivePosition(140), 
                  height: getResponsivePosition(140),
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid #fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}>
                  <Box
                    component="img"
                    src={studentData.photo}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      backgroundColor: '#f5f5f5',
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div style="
                            width: 100%; 
                            height: 100%; 
                            background-color: #f5f5f5; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center;
                          ">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="#999">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          </div>
                        `;
                      }
                    }}
                  />
                </Box>

                {/* Student Name - Positioned in the "Student Name:" field */}
                <Box sx={{ 
                  position: 'absolute', 
                  left: getResponsivePosition(20), 
                  top: getResponsivePosition(143.1), 
                  width: getResponsivePosition(200) 
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1.2rem' },
                      color: 'black',
                      position: 'absolute',
                      left: getResponsivePosition(195),
                      top: getResponsivePosition(202),
                      width: getResponsivePosition(200),
                      height: getResponsivePosition(100),
                    }}
                  >
                    {studentData.candidateName}
                  </Typography>
                </Box>

                {/* Roll No - Positioned in the "Roll No." field */}
                <Box sx={{ 
                  position: 'absolute', 
                  left: getResponsivePosition(15), 
                  top: getResponsivePosition(175.4), 
                  width: getResponsivePosition(200) 
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.95rem' },
                      color: 'black',
                      position: 'absolute',
                      left: getResponsivePosition(135),
                      top: getResponsivePosition(204),
                      width: getResponsivePosition(200),
                      height: getResponsivePosition(100),
                    }}
                  >
                    {studentData.registrationNo}
                  </Typography>
                </Box>

                {/* Session - Positioned in the "Session:" field */}
                <Box sx={{ 
                  position: 'absolute', 
                  left: getResponsivePosition(22), 
                  top: getResponsivePosition(218), 
                  width: getResponsivePosition(200) 
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.95rem' },
                      color: 'black',
                      position: 'absolute',
                      left: getResponsivePosition(75),
                      top: getResponsivePosition(211.5),
                      width: getResponsivePosition(200),
                      height: getResponsivePosition(100),
                    }}
                  >
                    {studentData.session}
                  </Typography>
                </Box>

                {/* Course - Positioned in the "Course:" field */}
                <Box sx={{ 
                  position: 'absolute', 
                  left: getResponsivePosition(15), 
                  top: getResponsivePosition(201), 
                  width: getResponsivePosition(200) 
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.95rem' },
                      color: 'black',
                      position: 'absolute',
                      left: getResponsivePosition(75),
                      top: getResponsivePosition(252),
                      width: getResponsivePosition(180),
                      maxHeight: getResponsivePosition(40),
                      overflow: 'hidden',
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {studentData.course}
                  </Typography>
                </Box>

                {/* DOB - Positioned in the "DOB:" field */}
                <Box sx={{ 
                  position: 'absolute', 
                  left: getResponsivePosition(20), 
                  top: getResponsivePosition(247), 
                  width: getResponsivePosition(200) 
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.95rem' },
                      color: 'black',
                      position: 'absolute',
                      left: getResponsivePosition(50),
                      top: getResponsivePosition(286),
                      width: getResponsivePosition(200),
                      height: getResponsivePosition(100),
                    }}
                  >
                    {studentData.dateOfBirth 
                      ? new Date(studentData.dateOfBirth).toLocaleDateString('en-GB')
                      : 'N/A'
                    }
                  </Typography>
                </Box>

                {/* Phone - Positioned in the "Phone:" field */}
                <Box sx={{ 
                  position: 'absolute', 
                  left: getResponsivePosition(19), 
                  top: getResponsivePosition(267.8), 
                  width: getResponsivePosition(200) 
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.95rem' },
                      color: 'black',
                      position: 'absolute',
                      left: getResponsivePosition(65),
                      top: getResponsivePosition(290),
                      width: getResponsivePosition(200),
                      height: getResponsivePosition(100),
                    }}
                  >
                    {studentData.contactNumber}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleDownload}
          disabled={isDownloading}
          sx={{ textTransform: 'none' }}
        >
          {isDownloading ? 'Generating PDF...' : 'Download ID Card (PDF)'}
        </Button>
      </Box>
    </Container>
  );
};

export default IdCardGenerationPage;
