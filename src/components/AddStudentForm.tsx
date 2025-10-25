import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAddStudent, type AddStudentData } from '../hooks/useAddStudent';
import { useToast } from '../contexts/ToastContext';
import DateInput from './DateInput';
import StudentFormPreviewDialog from './StudentFormPreviewDialog';
import ApiBasedAutoComplete from './core-components/apiBasedAutoComplete';

interface AddStudentFormProps {
  onClose: () => void;
  onNext?: (data: AddStudentData) => void;
  isStepMode?: boolean;
  preFilledCenter?: {
    centerId: string;
    centerName: string;
    name: string;
  };
}

interface FormData {
  candidateName: string;
  motherName: string;
  fatherName: string;
  dateOfBirth: string;
  gender: string;
  adharCardNo: string;
  category: string;
  adharCardFront: File | null;
  adharCardBack: File | null;
  photo: File | null;
  signature: File | null;
  employerName: string;
  isEmployed: string;
  designation: string;
  contactNumber: string;
  alternateNumber: string;
  emailAddress: string;
  permanentAddress: string;
  currentAddress: string;
  state: string;
  city: string;
  country: string;
  nationality: string;
  pincode: string;
  courseType: string;
  course: string;
  faculty: string;
  stream: string;
  year: string;
  session: string;
  monthSession: string;
  courseFee: string;
  hostelFacility: string;
  duration: string;
  center: any;
  centerId: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialFormData: FormData = {
  candidateName: '',
  motherName: '',
  fatherName: '',
  dateOfBirth: '',
  gender: 'Male',
  adharCardNo: '',
  category: '',
  adharCardFront: null,
  adharCardBack: null,
  photo: null,
  signature: null,
  employerName: '',
  isEmployed: 'No',
  designation: '',
  contactNumber: '',
  alternateNumber: '',
  emailAddress: '',
  permanentAddress: '',
  currentAddress: '',
  state: '',
  city: '',
  country: '',
  nationality: '',
  pincode: '',
  courseType: '',
  course: '',
  faculty: '',
  stream: '',
  year: '2025',
  session: '2025',
  monthSession: 'July',
  courseFee: '',
  hostelFacility: 'No',
  duration: '',
  center: null,
  centerId: '',
};

const AddStudentForm = ({ onClose, onNext, isStepMode = false, preFilledCenter }: AddStudentFormProps) => {
  const { addStudent, isSubmitting, error: submitError } = useAddStudent();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState<FormData>(() => {
    if (preFilledCenter) {
      return {
        ...initialFormData,
        centerId: preFilledCenter.centerId,
        center: {
          centerId: preFilledCenter.centerId,
          name: preFilledCenter.centerName
        }
      };
    }
    return initialFormData;
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPreview, setShowPreview] = useState(false);

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleInputChange = (field: keyof FormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Name validations (no character limit)
    if (!formData.candidateName) {
      newErrors.candidateName = 'Candidate Name is required';
    }
    
    if (!formData.motherName) {
      newErrors.motherName = 'Mother Name is required';
    }
    
    if (!formData.fatherName) {
      newErrors.fatherName = 'Father Name is required';
    }
    
    // Date of birth validation (no future dates)
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of Birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dateOfBirth = 'Date of Birth cannot be in the future';
      }
    }
    
    // Aadhar card validation (12 digits, numbers only)
    if (!formData.adharCardNo) {
      newErrors.adharCardNo = 'Aadhar Card Number is required';
    } else if (!/^\d{12}$/.test(formData.adharCardNo)) {
      newErrors.adharCardNo = 'Aadhar Card Number must be exactly 12 digits';
    }
    
    // Contact number validation (10 digits, numbers only)
    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact Number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact Number must be exactly 10 digits';
    }
    
    // Alternate number validation (10 digits, numbers only)
    if (formData.alternateNumber && !/^\d{10}$/.test(formData.alternateNumber)) {
      newErrors.alternateNumber = 'Alternate Number must be exactly 10 digits';
    }
    
    // Email validation
    if (!formData.emailAddress) {
      newErrors.emailAddress = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Email is invalid';
    }
    
    // Address validations (300 characters max)
    if (!formData.permanentAddress) {
      newErrors.permanentAddress = 'Permanent Address is required';
    } else if (formData.permanentAddress.length > 300) {
      newErrors.permanentAddress = 'Permanent Address cannot exceed 300 characters';
    }
    
    if (!formData.currentAddress) {
      newErrors.currentAddress = 'Current Address is required';
    } else if (formData.currentAddress.length > 300) {
      newErrors.currentAddress = 'Current Address cannot exceed 300 characters';
    }
    
    // Pincode validation (6 digits)
    if (!formData.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be exactly 6 digits';
    }
    
    // Course fee validation (numbers only)
    if (!formData.courseFee) {
      newErrors.courseFee = 'Course Fee is required';
    } else if (!/^\d+$/.test(formData.courseFee)) {
      newErrors.courseFee = 'Course Fee must contain only numbers';
    }
    
    // Center validation
    if (!formData.centerId) {
      newErrors.centerId = 'Center is required';
    }
    
    // Other required fields
    const otherRequiredFields = ['gender', 'category', 'state', 'city', 'country', 'nationality', 'courseType', 'course', 'faculty', 'stream', 'year', 'session'];
    otherRequiredFields.forEach(field => {
      if (!formData[field as keyof FormData]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
    // File validations with size limits (2MB = 2 * 1024 * 1024 bytes)
    const maxFileSize = 2 * 1024 * 1024; // 2MB
    
    if (!formData.photo) {
      newErrors.photo = 'Photo is required';
    } else if (formData.photo.size > maxFileSize) {
      newErrors.photo = 'Photo size cannot exceed 2MB';
    }
    
    if (!formData.adharCardFront) {
      newErrors.adharCardFront = 'Aadhar Card Front is required';
    } else if (formData.adharCardFront.size > maxFileSize) {
      newErrors.adharCardFront = 'Aadhar Card Front size cannot exceed 2MB';
    }
    
    if (!formData.adharCardBack) {
      newErrors.adharCardBack = 'Aadhar Card Back is required';
    } else if (formData.adharCardBack.size > maxFileSize) {
      newErrors.adharCardBack = 'Aadhar Card Back size cannot exceed 2MB';
    }
    
    if (!formData.signature) {
      newErrors.signature = 'Signature is required';
    } else if (formData.signature.size > maxFileSize) {
      newErrors.signature = 'Signature size cannot exceed 2MB';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isStepMode && onNext) {
      // In step mode, just pass data to next step
      onNext(formData as AddStudentData);
    } else {
      // Show preview dialog instead of directly submitting
      setShowPreview(true);
    }
  };

  const handlePreviewSave = async () => {
    try {
      const formDataToSend = new FormData();
      
      // Add all text fields (excluding empty values and center object)
      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof FormData];
        if (key === 'center') {
          // Handle center object separately
          if (value && typeof value === 'object') {
            formDataToSend.append('center', JSON.stringify(value));
          }
        } else if (value && typeof value === 'string' && value.trim() !== '') {
          formDataToSend.append(key, value);
        }
      });
      
      // Add file fields
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }
      if (formData.adharCardFront) {
        formDataToSend.append('adharCardFront', formData.adharCardFront);
      }
      if (formData.adharCardBack) {
        formDataToSend.append('adharCardBack', formData.adharCardBack);
      }
      if (formData.signature) {
        formDataToSend.append('signature', formData.signature);
      }
      
      await addStudent(formDataToSend as any);
      
      // Show success toast and reset form
      showSuccess('Student added successfully!');
      resetForm();
      setShowPreview(false);
      
      // Close dialog after a short delay to show success state
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error submitting form:', error);
      showError('Failed to add student. Please try again.');
    }
  };

  const handlePreviewCancel = () => {
    setShowPreview(false);
  };

  const handleFileChange = (field: keyof FormData, file: File | null) => {
    if (file && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      setErrors(prev => ({ ...prev, [field]: 'Only JPG images are allowed' }));
      return;
    }
    handleInputChange(field, file);
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        {/* Center Selection - Full Width */}
        <Grid size={12}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1e293b' }}>
              Center Information
            </Typography>
            {preFilledCenter ? (
              <Box sx={{ 
                p: 2, 
                border: '1px solid #e5e7eb', 
                borderRadius: 2, 
                backgroundColor: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#374151' }}>
                  Selected Center: <strong>{preFilledCenter.centerName}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  (Pre-filled from your center login)
                </Typography>
              </Box>
            ) : (
              <ApiBasedAutoComplete
                label="Select Center *"
                apiPath="/api/center/getCenterAutoCompleteList"
                searchKey="query"
                keyToPick="name"
                idKey="centerId"
                customActionMethod="GET"
                onSelect={(opt) => {
                  handleInputChange('centerId', opt?.centerId ? opt.centerId : '');
                  handleInputChange('center', opt);
                }}
                selectedOptions={formData?.center ?? null}
                error={!!errors.centerId}
                helperText={errors.centerId}
                required
              />
            )}
          </Box>
        </Grid>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={3}>
              {/* Candidate Name */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Candidate Name *"
                  value={formData.candidateName}
                  onChange={(e) => handleInputChange('candidateName', e.target.value)}
                  error={!!errors.candidateName}
                  helperText={errors.candidateName}
                  placeholder="Candidate Name"
                />
              </Grid>

              {/* Mother's Name */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Mother's Name *"
                  value={formData.motherName}
                  onChange={(e) => handleInputChange('motherName', e.target.value)}
                  error={!!errors.motherName}
                  helperText={errors.motherName}
                  placeholder="Mother's Name"
                />
              </Grid>

              {/* Photo */}
              <Grid size={12}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Photo *
                  </Typography>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg"
                    onChange={(e) => handleFileChange('photo', e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload">
                    <Button variant="outlined" component="span" fullWidth>
                      {formData.photo ? formData.photo.name : 'Choose Photo'}
                    </Button>
                  </label>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Image only in jpg
                  </Typography>
                  {errors.photo && (
                    <Typography variant="caption" color="error">
                      {errors.photo}
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* Gender */}
              <Grid size={12}>
                <FormControl fullWidth error={!!errors.gender}>
                  <InputLabel>Gender *</InputLabel>
                  <Select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    label="Gender *"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Adhar Card No */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Adharcard No. *"
                  value={formData.adharCardNo}
                  type='number'
                  onChange={(e) => handleInputChange('adharCardNo', e.target.value)}
                  error={!!errors.adharCardNo}
                  helperText={errors.adharCardNo}
                  placeholder="12-digit Aadhar Number"
                  inputProps={{ maxLength: 12 }}
                />
              </Grid>

              {/* Adhar Card Back */}
              <Grid size={12}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Aadhar Card Back *
                  </Typography>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg"
                    onChange={(e) => handleFileChange('adharCardBack', e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                    id="adhar-back-upload"
                  />
                  <label htmlFor="adhar-back-upload">
                    <Button variant="outlined" component="span" fullWidth>
                      {formData.adharCardBack ? formData.adharCardBack.name : 'Choose Aadhar Back'}
                    </Button>
                  </label>
                </Box>
              </Grid>

              {/* Employer Name */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Employer Name"
                  value={formData.employerName}
                  onChange={(e) => handleInputChange('employerName', e.target.value)}
                  placeholder="Employer Name"
                />
              </Grid>

              {/* Contact Number */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Contact Number *"
                  type="number"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  error={!!errors.contactNumber}
                  helperText={errors.contactNumber}
                  placeholder="10-digit Contact Number"
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>

              {/* Email Address */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Email Address *"
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                  error={!!errors.emailAddress}
                  helperText={errors.emailAddress}
                  placeholder="Email Address"
                />
              </Grid>

              {/* Permanent Address */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Permanent Address *"
                  multiline
                  rows={3}
                  value={formData.permanentAddress}
                  onChange={(e) => {
                    if (e.target.value.length <= 300) {
                      handleInputChange('permanentAddress', e.target.value);
                    }
                  }}
                  error={!!errors.permanentAddress}
                  helperText={errors.permanentAddress}
                  placeholder="Permanent Address"
                />
              </Grid>

              {/* State */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="State *"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  error={!!errors.state}
                  helperText={errors.state}
                  placeholder="State"
                />
              </Grid>

              {/* Country */}
              <Grid size={12}>
                <FormControl fullWidth error={!!errors.country}>
                  <InputLabel>Country *</InputLabel>
                  <Select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    label="Country *"
                  >
                    <MenuItem value="">Select Country</MenuItem>
                    <MenuItem value="India">India</MenuItem>
                    <MenuItem value="USA">USA</MenuItem>
                    <MenuItem value="UK">UK</MenuItem>
                    <MenuItem value="Canada">Canada</MenuItem>
                    <MenuItem value="Australia">Australia</MenuItem>
                  </Select>
                  {errors.country && <FormHelperText>{errors.country}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Course Type */}
              <Grid size={12}>
                <FormControl fullWidth error={!!errors.courseType}>
                  <InputLabel>Course Type *</InputLabel>
                  <Select
                    value={formData.courseType}
                    onChange={(e) => handleInputChange('courseType', e.target.value)}
                    label="Course Type *"
                  >
                    <MenuItem value="">Select course Type</MenuItem>
                    <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                    <MenuItem value="Postgraduate">Postgraduate</MenuItem>
                    <MenuItem value="Diploma">Diploma</MenuItem>
                    <MenuItem value="Certificate">Certificate</MenuItem>
                  </Select>
                  {errors.courseType && <FormHelperText>{errors.courseType}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Course */}
              <Grid size={12}>
                <FormControl fullWidth error={!!errors.course}>
                  <InputLabel>Course *</InputLabel>
                  <Select
                    value={formData.course}
                    onChange={(e) => handleInputChange('course', e.target.value)}
                    label="Course *"
                  >
                    <MenuItem value="">Select Course</MenuItem>
                    <MenuItem value="B.Tech">B.Tech</MenuItem>
                    <MenuItem value="B.Sc">B.Sc</MenuItem>
                    <MenuItem value="MBA">MBA</MenuItem>
                    <MenuItem value="MCA">MCA</MenuItem>
                    <MenuItem value="BBA">BBA</MenuItem>
                  </Select>
                  {errors.course && <FormHelperText>{errors.course}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Year */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Year *"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  error={!!errors.year}
                  helperText={errors.year}
                />
              </Grid>

              {/* Session */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Session *"
                  value={formData.session}
                  onChange={(e) => handleInputChange('session', e.target.value)}
                  error={!!errors.session}
                  helperText={errors.session}
                />
              </Grid>

              {/* Course Fee */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Course Fee (in Rs.)"
                  type="number"
                  value={formData.courseFee}
                  onChange={(e) => handleInputChange('courseFee', e.target.value)}
                  placeholder="Course Fee in Rs."
                  error={!!errors.courseFee}
                  helperText={errors.courseFee}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Right Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={3}>
              {/* Father's Name */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Father's Name *"
                  value={formData.fatherName}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                  error={!!errors.fatherName}
                  helperText={errors.fatherName}
                  placeholder="Father's Name"
                />
              </Grid>

              {/* Date of Birth */}
              <Grid size={12}>
                <DateInput
                  label="Date of Birth *"
                  value={formData.dateOfBirth}
                  onChange={(value) => handleInputChange('dateOfBirth', value)}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                  required
                />
              </Grid>

              {/* Signature */}
              <Grid size={12}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Signature *
                  </Typography>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg"
                    onChange={(e) => handleFileChange('signature', e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                    id="signature-upload"
                  />
                  <label htmlFor="signature-upload">
                    <Button variant="outlined" component="span" fullWidth>
                      {formData.signature ? formData.signature.name : 'Choose Signature'}
                    </Button>
                  </label>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Image only in jpg
                  </Typography>
                  {errors.signature && (
                    <Typography variant="caption" color="error">
                      {errors.signature}
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* Category */}
              <Grid size={12}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Category *</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    label="Category *"
                  >
                    <MenuItem value="">Select Category</MenuItem>
                    <MenuItem value="General">General</MenuItem>
                    <MenuItem value="OBC">OBC</MenuItem>
                    <MenuItem value="SC">SC</MenuItem>
                    <MenuItem value="ST">ST</MenuItem>
                    <MenuItem value="EWS">EWS</MenuItem>
                  </Select>
                  {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Adhar Card Front */}
              <Grid size={12}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Aadhar Card Front *
                  </Typography>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg"
                    onChange={(e) => handleFileChange('adharCardFront', e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                    id="adhar-front-upload"
                  />
                  <label htmlFor="adhar-front-upload">
                    <Button variant="outlined" component="span" fullWidth>
                      {formData.adharCardFront ? formData.adharCardFront.name : 'Choose Aadhar Front'}
                    </Button>
                  </label>
                </Box>
              </Grid>

              {/* Are you employed? */}
              <Grid size={12}>
                <FormControl fullWidth error={!!errors.isEmployed}>
                  <InputLabel>Are you employed? *</InputLabel>
                  <Select
                    value={formData.isEmployed}
                    onChange={(e) => handleInputChange('isEmployed', e.target.value)}
                    label="Are you employed? *"
                  >
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="Yes">Yes</MenuItem>
                  </Select>
                  {errors.isEmployed && <FormHelperText>{errors.isEmployed}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Designation */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Designation"
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  placeholder="Designation"
                />
              </Grid>

              {/* Alternate Number */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Alternate No."
                  type="number"
                  value={formData.alternateNumber}
                  onChange={(e) => handleInputChange('alternateNumber', e.target.value)}
                  error={!!errors.alternateNumber}
                  helperText={errors.alternateNumber}
                  placeholder="10-digit Alternate Number"
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>

              {/* Current Address */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Current Address *"
                  multiline
                  rows={3}
                  value={formData.currentAddress}
                  onChange={(e) => {
                    if (e.target.value.length <= 300) {
                      handleInputChange('currentAddress', e.target.value);
                    }
                  }}
                  error={!!errors.currentAddress}
                  helperText={errors.currentAddress}
                  placeholder="Current Address"
                />
              </Grid>

              {/* City */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="City *"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  error={!!errors.city}
                  helperText={errors.city}
                  placeholder="City"
                />
              </Grid>

              {/* Nationality */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Nationality *"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  error={!!errors.nationality}
                  helperText={errors.nationality}
                  placeholder="Nationality"
                />
              </Grid>

              {/* Pincode */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Pincode *"
                  type="number"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  error={!!errors.pincode}
                  helperText={errors.pincode}
                  placeholder="6-digit Pincode"
                  inputProps={{ maxLength: 6 }}
                />
              </Grid>

              {/* Faculty */}
              <Grid size={12}>
                <FormControl fullWidth error={!!errors.faculty}>
                  <InputLabel>Faculty *</InputLabel>
                  <Select
                    value={formData.faculty}
                    onChange={(e) => handleInputChange('faculty', e.target.value)}
                    label="Faculty *"
                  >
                    <MenuItem value="">Select Faculty</MenuItem>
                    <MenuItem value="Engineering">Engineering</MenuItem>
                    <MenuItem value="Management">Management</MenuItem>
                    <MenuItem value="Science">Science</MenuItem>
                    <MenuItem value="Arts">Arts</MenuItem>
                    <MenuItem value="Commerce">Commerce</MenuItem>
                  </Select>
                  {errors.faculty && <FormHelperText>{errors.faculty}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Stream */}
              <Grid size={12}>
                <FormControl fullWidth error={!!errors.stream}>
                  <InputLabel>Stream *</InputLabel>
                  <Select
                    value={formData.stream}
                    onChange={(e) => handleInputChange('stream', e.target.value)}
                    label="Stream *"
                  >
                    <MenuItem value="">Select Stream</MenuItem>
                    <MenuItem value="Computer Science">Computer Science</MenuItem>
                    <MenuItem value="Electronics">Electronics</MenuItem>
                    <MenuItem value="Mechanical">Mechanical</MenuItem>
                    <MenuItem value="Civil">Civil</MenuItem>
                    <MenuItem value="Electrical">Electrical</MenuItem>
                  </Select>
                  {errors.stream && <FormHelperText>{errors.stream}</FormHelperText>}
                </FormControl>
              </Grid>

              {/* Month Session */}
              <Grid size={12}>
                <FormControl fullWidth>
                  <InputLabel>Month Session</InputLabel>
                  <Select
                    value={formData.monthSession}
                    onChange={(e) => handleInputChange('monthSession', e.target.value)}
                    label="Month Session"
                  >
                    <MenuItem value="January">January</MenuItem>
                    <MenuItem value="February">February</MenuItem>
                    <MenuItem value="March">March</MenuItem>
                    <MenuItem value="April">April</MenuItem>
                    <MenuItem value="May">May</MenuItem>
                    <MenuItem value="June">June</MenuItem>
                    <MenuItem value="July">July</MenuItem>
                    <MenuItem value="August">August</MenuItem>
                    <MenuItem value="September">September</MenuItem>
                    <MenuItem value="October">October</MenuItem>
                    <MenuItem value="November">November</MenuItem>
                    <MenuItem value="December">December</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Hostel Facility */}
              <Grid size={12}>
                <FormControl fullWidth>
                  <InputLabel>Hostel Facility</InputLabel>
                  <Select
                    value={formData.hostelFacility}
                    onChange={(e) => handleInputChange('hostelFacility', e.target.value)}
                    label="Hostel Facility"
                  >
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="Yes">Yes</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Duration */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="Duration"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{
              backgroundColor: '#3b82f6',
              '&:hover': { backgroundColor: '#2563eb' },
              textTransform: 'none',
              borderRadius: 2,
              px: 6,
              py: 1.5,
            }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Submitting...
              </>
            ) : (
              isStepMode ? 'Next' : 'Preview & Submit'
            )}
          </Button>
        </Box>
      </Box>

      {/* Preview Dialog */}
      <StudentFormPreviewDialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        onSave={handlePreviewSave}
        onCancel={handlePreviewCancel}
        formData={formData as AddStudentData}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default AddStudentForm;
