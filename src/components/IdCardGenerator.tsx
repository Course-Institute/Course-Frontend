import React, { useRef, useEffect } from 'react';
import type { StudentProfile } from '../api/studentApi';

interface IdCardGeneratorProps {
  studentData: StudentProfile;
  onDownload?: () => void;
}

const IdCardGenerator: React.FC<IdCardGeneratorProps> = ({ studentData, onDownload }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (studentData && canvasRef.current) {
      generateIdCard();
    }
  }, [studentData]);

  const generateIdCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (standard ID card size: 3.375" x 2.125" at 300 DPI)
    const width = 1012; // 3.375 * 300
    const height = 637;  // 2.125 * 300
    canvas.width = width;
    canvas.height = height;

    // Clear canvas with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Draw diagonal design elements
    // Green diagonal band
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width * 0.4, 0);
    ctx.lineTo(width * 0.3, height * 0.4);
    ctx.lineTo(0, height * 0.3);
    ctx.closePath();
    ctx.fill();

    // Dark blue diagonal band
    ctx.fillStyle = '#1E3A8A';
    ctx.beginPath();
    ctx.moveTo(width * 0.2, 0);
    ctx.lineTo(width * 0.6, 0);
    ctx.lineTo(width * 0.5, height * 0.35);
    ctx.lineTo(width * 0.1, height * 0.25);
    ctx.closePath();
    ctx.fill();

    // Draw institute logo (simplified version)
    const logoX = width / 2;
    const logoY = 80;
    const logoRadius = 35;

    // Outer ring (dark blue) with text around it
    ctx.fillStyle = '#1E3A8A';
    ctx.beginPath();
    ctx.arc(logoX, logoY, logoRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Outer ring text (white, small)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MAHAVIR INSTITUTE OF VOCATIONAL & PARAMEDICAL SCIENCE ASSOCIATION', logoX, logoY - logoRadius + 10);

    // Inner circle (green)
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(logoX, logoY, logoRadius - 8, 0, 2 * Math.PI);
    ctx.fill();

    // Simple seated figure representation (white)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('M', logoX, logoY - 5);

    // Logo text "MIVPS"
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MIVPS', logoX, logoY + 8);

    // Institute name
    ctx.fillStyle = '#1E3A8A';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MAHAVIR INSTITUTE OF VOCATIONAL', logoX, logoY + 50);
    ctx.fillText('& PARAMEDICAL SCIENCE', logoX, logoY + 75);

    // Student photo placeholder
    const photoX = logoX;
    const photoY = logoY + 120;
    const photoWidth = 120;
    const photoHeight = 90;

    // Photo border (dark blue)
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 4;
    ctx.strokeRect(photoX - photoWidth/2, photoY - photoHeight/2, photoWidth, photoHeight);

    // Photo background (light gray)
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(photoX - photoWidth/2 + 2, photoY - photoHeight/2 + 2, photoWidth - 4, photoHeight - 4);

    // Try to load and draw student photo
    if (studentData.photo) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, photoX - photoWidth/2 + 2, photoY - photoHeight/2 + 2, photoWidth - 4, photoHeight - 4);
      };
      img.src = `${import.meta.env.VITE_APP_ENDPOINT || 'https://mivpsa.in/'}${studentData.photo}`;
    }

    // Student name
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Student Name :', photoX, photoY + 70);
    ctx.font = 'bold 18px Arial';
    ctx.fillText(studentData.candidateName || 'N/A', photoX, photoY + 95);

    // Roll number
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Roll No. :', photoX, photoY + 120);
    ctx.font = 'bold 18px Arial';
    ctx.fillText(studentData.registrationNo || 'N/A', photoX, photoY + 145);

    // Horizontal line
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, photoY + 170);
    ctx.lineTo(width - 50, photoY + 170);
    ctx.stroke();

    // Course details (left side)
    const leftX = 60;
    let currentY = photoY + 200;

    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Course :', leftX, currentY);
    ctx.fillText(studentData.course || 'N/A', leftX + 60, currentY);

    currentY += 25;
    ctx.fillText('Session :', leftX, currentY);
    ctx.fillText(`${studentData.monthSession} ${studentData.year} - ${studentData.session}`, leftX + 60, currentY);

    currentY += 25;
    ctx.fillText('Enroll. No. :', leftX, currentY);
    ctx.fillText(studentData.registrationNo || 'N/A', leftX + 80, currentY);

    currentY += 25;
    ctx.fillText('DOB :', leftX, currentY);
    const dob = studentData.dateOfBirth ? new Date(studentData.dateOfBirth).toLocaleDateString('en-GB') : 'N/A';
    ctx.fillText(dob, leftX + 40, currentY);

    currentY += 25;
    ctx.fillText('Phone :', leftX, currentY);
    ctx.fillText(studentData.contactNumber || 'N/A', leftX + 60, currentY);

    // QR Code placeholder (right side)
    const qrX = width - 120;
    const qrY = photoY + 200;
    const qrSize = 80;

    ctx.fillStyle = '#000000';
    ctx.fillRect(qrX - qrSize/2, qrY - qrSize/2, qrSize, qrSize);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('QR CODE', qrX, qrY - 5);
    ctx.fillText('WEBSITE', qrX, qrY + 5);

    // Authorised Signatory
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('Authorised Signatory', width - 60, qrY + 120);

    // Footer background (dark teal)
    const footerY = height - 80;
    ctx.fillStyle = '#2D5A5A';
    ctx.fillRect(0, footerY, width, 80);

    // Footer text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Student must carry this card before entering the college premises.', width/2, footerY + 20);
    ctx.fillText('This card is the property of college, if found return it to the college.', width/2, footerY + 40);
    ctx.fillText('If lost, immediately inform the office.', width/2, footerY + 60);

    // Call download callback if provided
    if (onDownload) {
      onDownload();
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `id-card-${studentData.registrationNo || 'student'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <canvas
        ref={canvasRef}
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          maxWidth: '100%',
          height: 'auto'
        }}
      />
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleDownload}
          style={{
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Download ID Card
        </button>
      </div>
    </div>
  );
};

export default IdCardGenerator;
