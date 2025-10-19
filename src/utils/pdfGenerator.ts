import jsPDF from 'jspdf';
import { svg2pdf } from 'svg2pdf.js';
import { type AddStudentData } from '../hooks/useAddStudent';

interface PDFGeneratorOptions {
  formData: AddStudentData;
  instituteName?: string;
  instituteIcon?: string;
}

export const generateStudentFormPDF = async ({
  formData,
  instituteName = 'MIVPS',
  instituteIcon: _instituteIcon
}: PDFGeneratorOptions): Promise<void> => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  
  // Colors
  const primaryColor = '#1976d2';
  const secondaryColor = '#64748b';
  const backgroundColor = '#f8fafc';
  const borderColor = '#e2e8f0';
  
  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10, color: string = '#000000') => {
    doc.setFontSize(fontSize);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.4);
  };

  // Helper function to draw a line
  const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string = '#e2e8f0') => {
    doc.setDrawColor(color);
    doc.line(x1, y1, x2, y2);
  };

  // Helper function to draw a rectangle
  const drawRect = (x: number, y: number, width: number, height: number, fillColor?: string, strokeColor?: string) => {
    if (fillColor) {
      doc.setFillColor(fillColor);
      doc.rect(x, y, width, height, 'F');
    }
    if (strokeColor) {
      doc.setDrawColor(strokeColor);
      doc.rect(x, y, width, height, 'S');
    }
  };

  let currentY = margin;

  // Header Section
  const headerHeight = 40;
  drawRect(margin, currentY, contentWidth, headerHeight, backgroundColor, borderColor);
  
  // Institute Icon - Load and display the actual SVG logo
  const iconSize = 20;
  const iconX = margin + 10;
  const iconY = currentY + 10;
  
  try {
    // Try to load the SVG logo and convert it using svg2pdf
    console.log('Attempting to load institute logo...');
    const logoResponse = await fetch('/institute-logo.svg');
    console.log('Logo response status:', logoResponse.status);
    
    if (logoResponse.ok) {
      const logoSvgText = await logoResponse.text();
      console.log('SVG loaded, length:', logoSvgText.length);
      
      // Create a temporary SVG element
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(logoSvgText, 'image/svg+xml');
      const svgElement = svgDoc.querySelector('svg');
      
      if (svgElement) {
        console.log('SVG element found, adding to PDF...');
        // Use svg2pdf to add the SVG to the PDF
        await svg2pdf(svgElement, doc, {
          x: iconX,
          y: iconY,
          width: iconSize,
          height: iconSize,
        });
        console.log('SVG successfully added to PDF');
      } else {
        throw new Error('Invalid SVG format');
      }
    } else {
      throw new Error('Logo not found');
    }
  } catch (error) {
    // Fallback to stylized version if logo loading fails
    console.warn('Could not load institute logo, using fallback:', error);
    
    // Create a more professional fallback logo
    // Draw the main circle background with gradient effect
    doc.setFillColor('#63BA49'); // Green color from the SVG
    doc.circle(iconX + iconSize/2, iconY + iconSize/2, iconSize/2, 'F');
    
    // Draw inner circle
    doc.setFillColor('#ffffff');
    doc.circle(iconX + iconSize/2, iconY + iconSize/2, iconSize/2 - 2, 'F');
    
    // Draw the "MIVPS" text in the center (smaller to fit)
    doc.setTextColor('#63BA49');
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.text('MIVPS', iconX + iconSize/2 - 6, iconY + iconSize/2 + 1);
    
    // Add decorative border
    doc.setDrawColor('#63BA49');
    doc.setLineWidth(0.5);
    doc.circle(iconX + iconSize/2, iconY + iconSize/2, iconSize/2, 'S');
  }
  
  // Institute Name
  doc.setTextColor(primaryColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(instituteName, iconX + iconSize + 10, iconY + iconSize/2 + 2);
  
  // Subtitle
  doc.setTextColor(secondaryColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Mahavir Institute of Vocational and Paramedical Science', iconX + iconSize + 10, iconY + iconSize/2 + 8);
  
  currentY += headerHeight + 10;

  // Separator Line
  drawLine(margin, currentY, pageWidth - margin, currentY, borderColor);
  currentY += 10;

  // Title
  doc.setTextColor('#1e293b');
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('STUDENT REGISTRATION FORM', pageWidth/2, currentY, { align: 'center' });
  currentY += 15;

  // Student Photo and Basic Info Section
  const photoSize = 30;
  const photoX = margin + 10;
  const photoY = currentY;
  
  // Draw photo or placeholder
  if (formData.photo && formData.photo instanceof File) {
    try {
      // Convert File to base64 and add to PDF
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(formData.photo as File);
      });
      
      // Add image to PDF
      doc.addImage(base64, 'JPEG', photoX, photoY, photoSize, photoSize);
    } catch (error) {
      // Fallback to placeholder if image loading fails
      drawRect(photoX, photoY, photoSize, photoSize, '#f0f0f0', borderColor);
      doc.setTextColor(secondaryColor);
      doc.setFontSize(8);
      doc.text('Photo', photoX + photoSize/2 - 5, photoY + photoSize/2);
    }
  } else {
    // Draw photo placeholder
    drawRect(photoX, photoY, photoSize, photoSize, '#f0f0f0', borderColor);
    doc.setTextColor(secondaryColor);
    doc.setFontSize(8);
    doc.text('Photo', photoX + photoSize/2 - 5, photoY + photoSize/2);
  }
  
  // Student Name and Course
  const infoX = photoX + photoSize + 15;
  doc.setTextColor('#1e293b');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(formData.candidateName, infoX, photoY + 8);
  
  doc.setTextColor(secondaryColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.course} - ${formData.stream}`, infoX, photoY + 15);
  
  // Chips for gender, category, fee
  const chipY = photoY + 22;
  const chipHeight = 6;
  const chipSpacing = 25;
  
  // Gender chip
  drawRect(infoX, chipY, 20, chipHeight, '#e3f2fd', primaryColor);
  doc.setTextColor(primaryColor);
  doc.setFontSize(8);
  doc.text(formData.gender, infoX + 2, chipY + 4);
  
  // Category chip
  drawRect(infoX + chipSpacing, chipY, 20, chipHeight, '#f3e5f5', '#9c27b0');
  doc.setTextColor('#9c27b0');
  doc.text(formData.category, infoX + chipSpacing + 2, chipY + 4);
  
  // Fee chip
  drawRect(infoX + chipSpacing * 2, chipY, 25, chipHeight, '#e8f5e8', '#4caf50');
  doc.setTextColor('#4caf50');
  doc.text(`₹${formData.courseFee}`, infoX + chipSpacing * 2 + 2, chipY + 4);
  
  currentY = photoY + photoSize + 15;

  // Create two columns for the form data
  const columnWidth = (contentWidth - 10) / 2;
  const leftColumnX = margin;
  const rightColumnX = margin + columnWidth + 10;

  // Helper function to create info section
  const createInfoSection = (title: string, data: Array<{label: string, value: string}>, x: number, startY: number) => {
    let y = startY;
    
    // Section title
    doc.setTextColor(primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, x, y);
    y += 8;
    
    // Section border
    drawRect(x, y - 5, columnWidth, 1, borderColor);
    y += 5;
    
    // Data rows
    data.forEach((item) => {
      if (y > pageHeight - 30) return; // Prevent overflow
      
      // Label
      doc.setTextColor(secondaryColor);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`${item.label}:`, x, y);
      
      // Value
      doc.setTextColor('#1e293b');
      doc.setFont('helvetica', 'normal');
      const valueY = addWrappedText(item.value || 'N/A', x + 35, y, columnWidth - 40, 9);
      y = Math.max(valueY, y + 6);
    });
    
    return y + 5;
  };

  // Left Column Data
  const personalData = [
    { label: 'Full Name', value: formData.candidateName },
    { label: 'Father\'s Name', value: formData.fatherName },
    { label: 'Mother\'s Name', value: formData.motherName },
    { label: 'Date of Birth', value: formData.dateOfBirth },
    { label: 'Gender', value: formData.gender },
    { label: 'Category', value: formData.category },
    { label: 'Aadhar No', value: formData.adharCardNo }
  ];

  const contactData = [
    { label: 'Contact Number', value: formData.contactNumber },
    { label: 'Alternate Number', value: formData.alternateNumber || 'N/A' },
    { label: 'Email Address', value: formData.emailAddress }
  ];

  const employmentData = [
    { label: 'Employed', value: formData.isEmployed },
    { label: 'Employer Name', value: formData.employerName || 'N/A' },
    { label: 'Designation', value: formData.designation || 'N/A' }
  ];

  // Right Column Data
  const addressData = [
    { label: 'Permanent Address', value: formData.permanentAddress },
    { label: 'Current Address', value: formData.currentAddress },
    { label: 'City', value: formData.city },
    { label: 'State', value: formData.state },
    { label: 'Country', value: formData.country },
    { label: 'Nationality', value: formData.nationality },
    { label: 'Pincode', value: formData.pincode }
  ];

  const academicData = [
    { label: 'Course Type', value: formData.courseType },
    { label: 'Faculty', value: formData.faculty },
    { label: 'Course', value: formData.course },
    { label: 'Stream', value: formData.stream },
    { label: 'Year', value: formData.year },
    { label: 'Session', value: formData.session },
    { label: 'Month Session', value: formData.monthSession || '' },
    { label: 'Duration', value: formData.duration || 'N/A' },
    { label: 'Course Fee', value: `₹${formData.courseFee}` },
    { label: 'Hostel Facility', value: formData.hostelFacility || 'No' }
  ];

  // Add sections to left column
  let leftY = currentY;
  leftY = createInfoSection('Personal Information', personalData, leftColumnX, leftY);
  leftY = createInfoSection('Contact Information', contactData, leftColumnX, leftY);
  leftY = createInfoSection('Employment Information', employmentData, leftColumnX, leftY);

  // Add sections to right column
  let rightY = currentY;
  rightY = createInfoSection('Address Information', addressData, rightColumnX, rightY);
  rightY = createInfoSection('Academic Information', academicData, rightColumnX, rightY);

  // Documents Status Section
  const documentsY = Math.max(leftY, rightY) + 10;
  if (documentsY < pageHeight - 40) {
    doc.setTextColor(primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Documents Status', margin, documentsY);
    
    const docY = documentsY + 8;
    const docSpacing = 30;
    const docX = margin;
    
    // Document status chips
    const documents = [
      { name: 'Photo', status: formData.photo ? 'Uploaded' : 'Not uploaded', color: formData.photo ? '#4caf50' : '#f44336' },
      { name: 'Aadhar Front', status: formData.adharCardFront ? 'Uploaded' : 'Not uploaded', color: formData.adharCardFront ? '#4caf50' : '#f44336' },
      { name: 'Aadhar Back', status: formData.adharCardBack ? 'Uploaded' : 'Not uploaded', color: formData.adharCardBack ? '#4caf50' : '#f44336' },
      { name: 'Signature', status: formData.signature ? 'Uploaded' : 'Not uploaded', color: formData.signature ? '#4caf50' : '#f44336' }
    ];
    
    documents.forEach((document, index) => {
      const chipX = docX + (index * docSpacing);
      if (chipX + 25 < pageWidth - margin) {
        drawRect(chipX, docY, 25, 6, document.color === '#4caf50' ? '#e8f5e8' : '#ffebee', document.color);
        doc.setTextColor(document.color);
        doc.setFontSize(8);
        doc.text(document.name, chipX + 2, docY + 4);
      }
    });
  }

  // Footer
  const footerY = pageHeight - 20;
  drawLine(margin, footerY - 5, pageWidth - margin, footerY - 5, borderColor);
  
  doc.setTextColor(secondaryColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Generated on: ' + new Date().toLocaleString(), margin, footerY);
  doc.text('Please review all information before submission', pageWidth - margin, footerY, { align: 'right' });

  // Save the PDF
  const fileName = `Student_Registration_${formData.candidateName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
