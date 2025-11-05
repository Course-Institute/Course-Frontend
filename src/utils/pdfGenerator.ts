import jsPDF from 'jspdf';
// Provide a minimal declaration so TypeScript won't error for the plugin types

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

  // Bank Details
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  branchName: string;

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

  photo?: File | null;
}

const loadLogoBase64 = async () => {
  const res = await fetch("/preview-header.png"); // path from public folder
  const blob = await res.blob();

  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

const loadWaterMarkBase64 = async () => {
  const res = await fetch("/institute-watermark.png"); // path from public folder
  const blob = await res.blob();

  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

// Render the watermark into a temporary canvas with reduced opacity and add that image to the PDF.
const createFadedDataUrl = (dataUrl: string, alpha = 0.1) =>
  new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;   // ✅ full resolution
      canvas.height = img.height; // ✅ full resolution

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject("Canvas context failed");

      ctx.clearRect(0, 0, img.width, img.height);
      ctx.globalAlpha = alpha; // watermark fade
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });



export const generateCenterFormPDF = async (formData: CenterFormData): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  // doc.text("Mahavir Institute", pageWidth / 2, 60, { align: "center" });
  const logo = await loadLogoBase64();
  doc.addImage(logo, "PNG", pageWidth / 2 - 75, 0, 150, 60);
  
  // Set font
  doc.setFont('helvetica');
  
  // // Header
  // doc.setFontSize(20);
  // doc.setFont('helvetica', 'bold');
  // doc.text('Mahavir Institute', pageWidth / 2, 30, { align: 'center' });
  
  // doc.setFontSize(14);
  // doc.setFont('helvetica', 'bold');
  // doc.text('Center Registration & Login Panel', pageWidth / 2, 40, { align: 'center' });
  
  // // Logo placeholder
  // doc.setFontSize(10);
  // doc.setFont('helvetica', 'normal');
  // doc.text('Place Institute Logo Here', pageWidth / 2, 50, { align: 'center' });
  
  // Section 1 heading
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bolditalic');
  doc.text('CENTER REGISTRATION FORM', pageWidth / 2, 70, { align: 'center' });
  
  let yPosition = 80;
  const lineHeight = 7;
  const leftColumn = 20;
  const rightColumn = 110;
  
  // Helper function to add a row
  const addRow = (label: string, value: string, isHeader: boolean = false) => {
    if (isHeader) {
      // Header row with background
      // doc.setFillColor(240, 240, 240);
      // doc.rect(leftColumn - 2, yPosition - 5, pageWidth - 40, lineHeight + 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(label, leftColumn, yPosition);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(label, leftColumn, yPosition);
      doc.text(value || '', rightColumn, yPosition);
    }
    yPosition += lineHeight;
  };
  
  // Center Details Section
  addRow('Center Details', '', true);
  addRow('Center Name:', formData.centerName);
  addRow('Center Type:', formData.centerType);
  addRow('Year of Establishment:', formData.yearOfEstablishment);
  addRow('Full Address:', formData.address);
  addRow('City:', formData.city);
  addRow('State:', formData.state);
  addRow('Pin Code:', formData.pinCode);
  addRow('Official Email ID:', formData.officialEmail);
  addRow('Website (if any):', formData.website || '');
  
  // Check if we need a new page
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }
  const waterMark = await loadWaterMarkBase64();
  const fadedWatermark = await createFadedDataUrl(waterMark, 0.1);

  doc.addImage(
    fadedWatermark,
    "PNG",
    pageWidth / 2 - 60,
    pageHeight / 2 - 60,
    120,
    120
  );
  
  // Authorized Person Details Section
  addRow('Authorized Person Details', '', true);
  addRow('Name:', formData.authName);
  addRow('Designation:', formData.designation);
  addRow('Contact No.:', formData.contactNo);
  addRow('Email ID:', formData.email);
  addRow('Aadhaar / ID Proof No.:', formData.idProofNo);
  addRow('Upload Photograph:', '[File Upload]');
  
  // Check if we need a new page
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Infrastructure Details Section
  addRow('Infrastructure Details', '', true);
  addRow('No. of Classrooms:', formData.numClassrooms);
  addRow('No. of Computers:', formData.numComputers);
  addRow('Internet Facility (Yes/No):', formData.internetFacility);
  addRow('Seating Capacity:', formData.seatingCapacity);
  addRow('Upload Infrastructure Photos:', '[File Upload]');
  
  // Check if we need a new page
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Bank Details Section
  addRow('Bank Details', '', true);
  addRow('Bank Name:', formData.bankName);
  addRow('Account Holder Name:', formData.accountHolder);
  addRow('Account Number:', formData.accountNumber);
  addRow('IFSC Code:', formData.ifsc);
  addRow('Branch Name:', formData.branchName);
  addRow('Upload Cancelled Cheque:', '[File Upload]');
  
  // Check if we need a new page
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Documents Section
  addRow('Documents Upload', '', true);
  addRow('Documents Upload:', '[File Upload]');
  addRow('Registration/GST Certificate:', formData.gstCertificate ? 
    (Array.isArray(formData.gstCertificate) ? 
      formData.gstCertificate.map(f => f.name).join(', ') : 
      formData.gstCertificate.name) : 
    'No file uploaded');
  addRow('PAN Card:', formData.panCard ? 
    (Array.isArray(formData.panCard) ? 
      formData.panCard.map(f => f.name).join(', ') : 
      formData.panCard.name) : 
    'No file uploaded');
  addRow('Address Proof:', formData.addressProof ? 
    (Array.isArray(formData.addressProof) ? 
      formData.addressProof.map(f => f.name).join(', ') : 
      formData.addressProof.name) : 
    'No file uploaded');
  addRow('Director ID Proof:', formData.directorIdProof ? 
    (Array.isArray(formData.directorIdProof) ? 
      formData.directorIdProof.map(f => f.name).join(', ') : 
      formData.directorIdProof.name) : 
    'No file uploaded');
  addRow('Signature:', formData.signature ? 
    (Array.isArray(formData.signature) ? 
      formData.signature.map(f => f.name).join(', ') : 
      formData.signature.name) : 
    'No file uploaded');
  
  // Check if we need a new page
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Login Credentials Section
  addRow('Login Credentials', '', true);
  addRow('Create Username:', formData.username);
  addRow('Create Password:', '[HIDDEN]');
  addRow('Confirm Password:', '[HIDDEN]');
  
  // Declaration
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('I hereby declare that all information provided is true and correct to the best of my knowledge.', leftColumn, yPosition);
  
  yPosition += 15;
  doc.text('Signature / Stamp:', leftColumn, yPosition);
  
  // Save the PDF
  const fileName = `Center_Registration_${formData.centerName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

interface StudentFormData {
  candidateName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  category: string;
  adharCardNo: string;
  contactNumber: string;
  alternateNumber?: string;
  emailAddress: string;
  permanentAddress: string;
  currentAddress: string;
  city: string;
  state: string;
  country: string;
  nationality: string;
  pincode: string;
  isEmployed: string;
  employerName?: string;
  designation?: string;
  courseType: string;
  grade: string;
  course: string;
  stream: string;
  year: string;
  session: string;
  monthSession?: string;
  duration?: string;
  courseFee?: string;
  hostelFacility?: string;
  photo?: File;
  adharCardFront?: File;
  adharCardBack?: File;
  signature?: File;
}

export const generateStudentFormPDF = async (formData: StudentFormData): Promise<void>   => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  async function urlToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
if(formData.photo){
const base64Photo = await urlToBase64(formData.photo);

  const imgWidth = 28;
  const imgHeight = 28;

  const imgX = pageWidth - imgWidth - 28;  // your positioning
  const imgY = 63;

  // ✅ Draw image
  doc.addImage(base64Photo, "JPEG", imgX, imgY, imgWidth, imgHeight);

  // ✅ Add border box
  const borderPadding = 2;
   doc.setDrawColor(14, 68, 85); // change here

doc.setLineWidth(0.3);
doc.roundedRect(
  imgX - borderPadding,
  imgY - borderPadding,
  imgWidth + borderPadding * 2,
  imgHeight + borderPadding * 2,
  3, 3, "S" // corner radius + style (stroke)
);
}
  
  // Set font
  doc.setFont('helvetica');
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  // doc.text('Mahavir Institute', pageWidth / 2, 30, { align: 'center' });
  const logo = await loadLogoBase64();
  doc.addImage(logo, "PNG", pageWidth / 2 - 75, 0, 150, 60);

  // Section 1 heading
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bolditalic');
  doc.text('STUDENT REGISTRATION FORM', pageWidth / 2, 70, { align: 'center' });

let yPosition = 80;
  // const lineHeight = 7;
  const leftColumn = 20;
  // const rightColumn = 110;

const fieldWidth = 80;
const fieldHeight = 8;
const gap = 10;

const drawField = (x: number, y: number, label: string, value: string) => {
 const safeLabel = label ? label.toUpperCase() : "";
  const safeValue = value ? value : "";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(safeLabel, x, y);

  // box
  doc.setDrawColor(14, 68, 85);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y + 2, fieldWidth, fieldHeight, 2, 3, "S");

  // text inside
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(safeValue, x + 2, y + 2 + 6);
};

const addRow = (label1: any, value1: any, label2?: any, value2?: any) => {
  const x1 = 15;
  const x2 = x1 + fieldWidth + gap;

  const rowY = yPosition; // lock starting Y for row

  drawField(x1, rowY, label1, value1);
  drawField(x2, rowY, label2, value2);

  // move down for next row AFTER both fields
  yPosition += fieldHeight + 14
};

const addSection = (title: string) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(title.toUpperCase(), 15, yPosition + 6);

  yPosition += 14;
};

const waterMark = await loadWaterMarkBase64();
const fadedWatermark = await createFadedDataUrl(waterMark, 0.1);

doc.addImage(
  fadedWatermark,
  "PNG",
  (pageWidth / 2) - 60,
  (pageHeight / 2) - 60,
  120,
  120
);
  
  // Personal Information Section
addSection("PERSONAL DETAILS");

yPosition = 80; // after logo + heading

addSection("Personal Details");

addRow("Name", formData.candidateName, "Father's Name", formData.fatherName);
addRow("Mother's Name", formData.motherName, "Date Of Birth", formData.dateOfBirth);
addRow("Gender", formData.gender, "Category", formData.category);
addRow("Aadhar Card No", formData.adharCardNo, "Contact Number", formData.contactNumber);
addRow("Alternate Number", formData.alternateNumber, "Email", formData.emailAddress);


  
  // Check if we need a new page
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Contact Information Section
addSection("Contact Information");

  addRow('Contact Number:', formData.contactNumber, 'Alternate Number:', formData.alternateNumber || '');
  addRow('Email Address:', formData.emailAddress);
  
  // Check if we need a new page
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Address Information Section
  addSection("Address Information");

  addRow('Permanent Address:', formData.permanentAddress, 'City:', formData.city);
  addRow('Current Address:', formData.currentAddress, 'State:', formData.state);
  addRow('Country:', formData.country, 'Pincode:', formData.pincode);
  addRow('Nationality:', formData.nationality);
  
  // Check if we need a new page
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.addImage(
  fadedWatermark,
  "PNG",
  (pageWidth / 2) - 60,
  (pageHeight / 2) - 60,
  120,
  120
);
  // Employment Information Section
addSection("Employment Information");
  addRow('Employed:', formData.isEmployed, 'Employer Name:', formData.employerName || '');
  addRow('Designation:', formData.designation || '');
  
  // Check if we need a new page
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Academic Information Section
addSection("Academic Information");
  addRow('Course Type:', formData.courseType, 'Grade:', formData.grade);
  addRow('Course:', formData.course, 'Stream:', formData.stream);
  addRow('Year:', formData.year, 'Session:', formData.session);
  addRow('Month Session:', formData.monthSession || '', 'Duration:', formData.duration || '');
  addRow('Course Fee:', formData.courseFee ? `${formData.courseFee}` : 'N/A', 'Hostel Facility:', formData.hostelFacility || '');
  
  // Check if we need a new page
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.addImage(
  fadedWatermark,
  "PNG",
  (pageWidth / 2) - 60,
  (pageHeight / 2) - 60,
  120,
  120
);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('I hereby declare that all information provided is true and correct to the best of my knowledge.', leftColumn, yPosition);
  
  yPosition += 15;
  doc.text('Student Signature:', leftColumn, yPosition);

  // Save the PDF
  const fileName = `Student_Registration_${formData.candidateName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export const generateCenterFormPreview = (formData: CenterFormData): string => {
  // Generate HTML for preview
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Center Registration Form</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          background: white;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .institute-name {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .form-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .logo-placeholder {
          font-size: 12px;
          color: #666;
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 14px;
          font-weight: bold;
          font-style: italic;
          margin: 20px 0 10px 0;
        }
        .form-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .form-table th {
          padding: 8px;
          text-align: left;
          font-weight: bold;
          border: 1px solid #ddd;
        }
        .form-table td {
          padding: 8px;
          border: 1px solid #ddd;
          vertical-align: top;
        }
        .form-table td:first-child {
          width: 40%;
          font-weight: normal;
        }
        .form-table td:last-child {
          width: 60%;
        }
        .declaration {
          margin-top: 30px;
          padding: 15px;
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 4px;
        }
        .signature-line {
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="institute-name">Mahavir Institute</div>
        <div class="form-title">Center Registration & Login Panel</div>
        <div class="logo-placeholder">Place Institute Logo Here</div>
      </div>
      
      <div class="section-title">SECTION 1: CENTER REGISTRATION FORM</div>
      
      <table class="form-table">
        <tr><th colspan="2">Center Details</th></tr>
        <tr><td>Center Name:</td><td>${formData.centerName || ''}</td></tr>
        <tr><td>Center Type:</td><td>${formData.centerType || ''}</td></tr>
        <tr><td>Year of Establishment:</td><td>${formData.yearOfEstablishment || ''}</td></tr>
        <tr><td>Full Address:</td><td>${formData.address || ''}</td></tr>
        <tr><td>City:</td><td>${formData.city || ''}</td></tr>
        <tr><td>State:</td><td>${formData.state || ''}</td></tr>
        <tr><td>Pin Code:</td><td>${formData.pinCode || ''}</td></tr>
        <tr><td>Official Email ID:</td><td>${formData.officialEmail || ''}</td></tr>
        <tr><td>Website (if any):</td><td>${formData.website || ''}</td></tr>
      </table>
      
      <table class="form-table">
        <tr><th colspan="2">Authorized Person Details</th></tr>
        <tr><td>Name:</td><td>${formData.authName || ''}</td></tr>
        <tr><td>Designation:</td><td>${formData.designation || ''}</td></tr>
        <tr><td>Contact No.:</td><td>${formData.contactNo || ''}</td></tr>
        <tr><td>Email ID:</td><td>${formData.email || ''}</td></tr>
        <tr><td>Aadhaar / ID Proof No.:</td><td>${formData.idProofNo || ''}</td></tr>
        <tr><td>Upload Photograph:</td><td>[File Upload]</td></tr>
      </table>
      
      <table class="form-table">
        <tr><th colspan="2">Infrastructure Details</th></tr>
        <tr><td>No. of Classrooms:</td><td>${formData.numClassrooms || ''}</td></tr>
        <tr><td>No. of Computers:</td><td>${formData.numComputers || ''}</td></tr>
        <tr><td>Internet Facility (Yes/No):</td><td>${formData.internetFacility || ''}</td></tr>
        <tr><td>Seating Capacity:</td><td>${formData.seatingCapacity || ''}</td></tr>
        <tr><td>Upload Infrastructure Photos:</td><td>[File Upload]</td></tr>
      </table>
      
      <table class="form-table">
        <tr><th colspan="2">Bank Details</th></tr>
        <tr><td>Bank Name:</td><td>${formData.bankName || ''}</td></tr>
        <tr><td>Account Holder Name:</td><td>${formData.accountHolder || ''}</td></tr>
        <tr><td>Account Number:</td><td>${formData.accountNumber || ''}</td></tr>
        <tr><td>IFSC Code:</td><td>${formData.ifsc || ''}</td></tr>
        <tr><td>Branch Name:</td><td>${formData.branchName || ''}</td></tr>
        <tr><td>Upload Cancelled Cheque:</td><td>[File Upload]</td></tr>
      </table>
      
      <table class="form-table">
        <tr><th colspan="2">Documents Upload</th></tr>
        <tr><td>Documents Upload:</td><td>[File Upload]</td></tr>
        <tr><td>Registration/GST Certificate:</td><td>${formData.gstCertificate ? 
          (Array.isArray(formData.gstCertificate) ? 
            formData.gstCertificate.map(f => f.name).join(', ') : 
            formData.gstCertificate.name) : 
          'No file uploaded'}</td></tr>
        <tr><td>PAN Card:</td><td>${formData.panCard ? 
          (Array.isArray(formData.panCard) ? 
            formData.panCard.map(f => f.name).join(', ') : 
            formData.panCard.name) : 
          'No file uploaded'}</td></tr>
        <tr><td>Address Proof:</td><td>${formData.addressProof ? 
          (Array.isArray(formData.addressProof) ? 
            formData.addressProof.map(f => f.name).join(', ') : 
            formData.addressProof.name) : 
          'No file uploaded'}</td></tr>
        <tr><td>Director ID Proof:</td><td>${formData.directorIdProof ? 
          (Array.isArray(formData.directorIdProof) ? 
            formData.directorIdProof.map(f => f.name).join(', ') : 
            formData.directorIdProof.name) : 
          'No file uploaded'}</td></tr>
        <tr><td>Signature:</td><td>${formData.signature ? 
          (Array.isArray(formData.signature) ? 
            formData.signature.map(f => f.name).join(', ') : 
            formData.signature.name) : 
          'No file uploaded'}</td></tr>
      </table>
      
      <table class="form-table">
        <tr><th colspan="2">Login Credentials</th></tr>
        <tr><td>Create Username:</td><td>${formData.username || ''}</td></tr>
        <tr><td>Create Password:</td><td>[HIDDEN]</td></tr>
        <tr><td>Confirm Password:</td><td>[HIDDEN]</td></tr>
      </table>
      
      <div class="declaration">
        I hereby declare that all information provided is true and correct to the best of my knowledge.
      </div>
      
      <div class="signature-line">
        <strong>Signature / Stamp:</strong> _________________________
      </div>
    </body>
    </html>
  `;
  
  return html;
};