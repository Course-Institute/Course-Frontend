import { Box, Typography, TextField, MenuItem, Button, Divider, Paper, FormControlLabel, Checkbox, Autocomplete } from '@mui/material';
import { useCenterForm } from '../../hooks/useCenterForm';
import CenterFormPreviewModal from '../../components/CenterFormPreviewModal';
import { useState } from 'react';
import { statesAndCities } from '../../api/statesAndCitites';
import {
  validateEmail,
  validatePhoneNumber,
  validateAadhaar,
  validateAddress,
  validatePassword,
  validateConfirmPassword,
  validateRequired,
  validateNumber,
  validatePinCode,
  validateYear,
  validateWebsite,
  type ValidationResult
} from '../../utils/validationHelpers';

const AddCenterPage = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const {
    formValues,
    errors,
    helperTexts,
    declarationAccepted,
    updateField,
    updateFile,
    setDeclarationAccepted,
    onSave,
    isSavingCenter,
    validateForm,
  } = useCenterForm();

  const handlePreview = () => {
    // First run validation from the hook
    const isValid = validateForm();
    if (isValid) {
      setPreviewOpen(true);
    }
    // If validation fails, errors will be shown in the form fields
  };

  const handleSubmitFromPreview = () => {
    setPreviewOpen(false);
    onSave();
  };

  const handleChange = (key: string, validator?: (value: string) => ValidationResult) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateField(key, value, validator);
  };

  const handleFileChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (key === 'photo' || key === 'gstCertificate' || key === 'panCard' || key === 'addressProof' || key === 'directorIdProof' || key === 'signature') {
        updateFile(key, files[0]);
      } else {
        const fileList = Array.from(files);
        updateFile(key, fileList);
      }
    } else {
      updateFile(key, null);
    }
  };


  return (

    <>
    <Paper elevation={2} sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Box component="form" onSubmit={onSave} sx={{ width: '100%' }}>

        {/* SECTION 1: CENTER REGISTRATION FORM */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#1e293b' }}>
          Center Registration Form
        </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' }, gap: 2 }}>
        {/* Center Details */}
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            fullWidth 
            required
            label="Center Name" 
            value={formValues.centerName || ''}
            onChange={handleChange('centerName', validateRequired)}
            error={!!errors.centerName}
            helperText={errors.centerName || helperTexts.centerName}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            select 
            fullWidth 
            required
            label="Center Type" 
            value={formValues.centerType || ''}
            onChange={handleChange('centerType', validateRequired)}
            error={!!errors.centerType}
            helperText={errors.centerType || helperTexts.centerType}
          >
            <MenuItem value="franchise">Franchise</MenuItem>
            <MenuItem value="partner">Partner</MenuItem>
            <MenuItem value="company">Company</MenuItem>
            <MenuItem value="own">Own Center</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            fullWidth 
            required
            type="number"
            label="Year of Establishment" 
            value={formValues.yearOfEstablishment || ''}
            onChange={handleChange('yearOfEstablishment', validateYear)}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                e.preventDefault();
              }
            }}
            error={!!errors.yearOfEstablishment}
            helperText={errors.yearOfEstablishment || helperTexts.yearOfEstablishment}
          />
        </Box>
        <Box sx={{ gridColumn: '1 / -1' }}>
          <TextField 
            fullWidth 
            required
            multiline
            rows={3}
            label="Full Address" 
            value={formValues.address || ''}
            onChange={handleChange('address', validateAddress)}
            error={!!errors.address}
            helperText={errors.address || helperTexts.address}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 4' } }}>
          <Autocomplete
            fullWidth
            options={Object.keys(statesAndCities)}
            value={formValues.state || null}
            onChange={(_, newValue) => {
              updateField('state', newValue || '', validateRequired);
              updateField('city', '', validateRequired);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="State"
                error={!!errors.state}
                helperText={errors.state || helperTexts.state}
                placeholder="Search or select state"
              />
            )}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 4' } }}>
          <Autocomplete
            fullWidth
            options={
              statesAndCities[
                formValues.state as keyof typeof statesAndCities
              ] || []
            }
            value={formValues.city || null}
            onChange={(_, newValue) => {
              updateField('city', newValue || '', validateRequired);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="City"
                error={!!errors.city}
                helperText={errors.city || helperTexts.city}
                placeholder={formValues.state ? 'Search or select city' : 'Select state first'}
              />
            )}
            disabled={!formValues.state}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 4' } }}>
          <TextField 
            fullWidth 
            required
            type="number"
            label="Pin Code" 
            value={formValues.pinCode || ''}
            onChange={handleChange('pinCode', validatePinCode)}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                e.preventDefault();
              }
            }}
            error={!!errors.pinCode}
            helperText={errors.pinCode || helperTexts.pinCode}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            fullWidth 
            required
            type="email"
            label="Official Email ID" 
            value={formValues.officialEmail || ''}
            onChange={handleChange('officialEmail', validateEmail)}
            error={!!errors.officialEmail}
            helperText={errors.officialEmail || helperTexts.officialEmail}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            fullWidth 
            type="url"
            label="Website (if any)" 
            value={formValues.website || ''}
            onChange={handleChange('website', validateWebsite)}
            error={!!errors.website}
            helperText={errors.website || helperTexts.website}
          />
        </Box>

        {/* Authorized Person Details */}
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1e293b' }}>
            Authorized Person Details
          </Typography>
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 4' } }}>
          <TextField 
            fullWidth 
            required
            label="Name" 
            value={formValues.authName || ''}
            onChange={handleChange('authName', validateRequired)}
            error={!!errors.authName}
            helperText={errors.authName || helperTexts.authName}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 4' } }}>
          <TextField 
            fullWidth 
            required
            label="Designation" 
            value={formValues.designation || ''}
            onChange={handleChange('designation', validateRequired)}
            error={!!errors.designation}
            helperText={errors.designation || helperTexts.designation}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 4' } }}>
          <TextField 
            fullWidth 
            required
            label="Contact No." 
            type="number"
            value={formValues.contactNo || ''}
            onChange={handleChange('contactNo', validatePhoneNumber)}
            error={!!errors.contactNo}
            helperText={errors.contactNo || helperTexts.contactNo}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            fullWidth 
            required
            type="email"
            label="Email ID" 
            value={formValues.email || ''}
            onChange={handleChange('email', validateEmail)}
            error={!!errors.email}
            helperText={errors.email || helperTexts.email}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            fullWidth 
            required
            type="number"
            label="Aadhaar / ID Proof No." 
            value={formValues.idProofNo || ''}
            onChange={handleChange('idProofNo', validateAadhaar)}
            error={!!errors.idProofNo}
            helperText={errors.idProofNo || helperTexts.idProofNo}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <Button 
            variant="outlined" 
            component="label" 
            fullWidth
            sx={{ 
              height: '56px',
              borderColor: errors.photo ? '#ef4444' : undefined,
              color: errors.photo ? '#ef4444' : undefined
            }}
          >
            {formValues.photo ? (Array.isArray(formValues.photo) ? `${formValues.photo.length} file(s) selected` : formValues.photo.name) : 'Upload Photograph'}
            <input hidden type="file" accept="image/*" onChange={handleFileChange('photo')} />
          </Button>
          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
            File size should be within 200KB
          </Typography>
          {errors.photo && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
              {errors.photo}
            </Typography>
          )}
        </Box>

        {/* Infrastructure Details */}
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1e293b' }}>
            Infrastructure Details
          </Typography>
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 4' } }}>
          <TextField 
            fullWidth 
            required
            type="number"
            label="No. of Classrooms" 
            value={formValues.numClassrooms || ''}
            onChange={handleChange('numClassrooms', validateNumber)}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                e.preventDefault();
              }
            }}
            error={!!errors.numClassrooms}
            helperText={errors.numClassrooms || helperTexts.numClassrooms}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 4' } }}>
          <TextField 
            fullWidth 
            required
            type="number"
            label="No. of Computers" 
            value={formValues.numComputers || ''}
            onChange={handleChange('numComputers', validateNumber)}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                e.preventDefault();
              }
            }}
            error={!!errors.numComputers}
            helperText={errors.numComputers || helperTexts.numComputers}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 4' } }}>
          <TextField 
            select 
            fullWidth 
            required
            label="Internet Facility" 
            value={formValues.internetFacility || ''}
            onChange={handleChange('internetFacility', validateRequired)}
            error={!!errors.internetFacility}
            helperText={errors.internetFacility || helperTexts.internetFacility}
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 4' } }}>
          <TextField 
            fullWidth 
            required
            type="number"
            label="Seating Capacity" 
            value={formValues.seatingCapacity || ''}
            onChange={handleChange('seatingCapacity', validateNumber)}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                e.preventDefault();
              }
            }}
            error={!!errors.seatingCapacity}
            helperText={errors.seatingCapacity || helperTexts.seatingCapacity}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 8' } }}>
          <Button 
            variant="outlined" 
            component="label" 
            fullWidth
            sx={{ 
              height: '56px',
              borderColor: errors.infraPhotos ? '#ef4444' : undefined,
              color: errors.infraPhotos ? '#ef4444' : undefined
            }}
          >
            {formValues.infraPhotos && Array.isArray(formValues.infraPhotos) ? `${formValues.infraPhotos.length} file(s) selected` : 'Upload Infrastructure Photos'}
            <input hidden type="file" multiple accept="image/*" onChange={handleFileChange('infraPhotos')} />
          </Button>
          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
            File size should be within 200KB per file
          </Typography>
          {errors.infraPhotos && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
              {errors.infraPhotos}
            </Typography>
          )}
        </Box>

        {/* Documents Upload */}
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1e293b' }}>
            Documents Upload
          </Typography>
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <Button 
            variant="outlined" 
            component="label" 
            fullWidth
            sx={{ 
              height: '56px',
              borderColor: errors.gstCertificate ? '#ef4444' : undefined,
              color: errors.gstCertificate ? '#ef4444' : undefined
            }}
          >
            {formValues.gstCertificate ? (Array.isArray(formValues.gstCertificate) ? `${formValues.gstCertificate.length} file(s) selected` : formValues.gstCertificate.name) : 'Upload Registration/GST Certificate'}
            <input hidden type="file" accept="image/*,application/pdf" onChange={handleFileChange('gstCertificate')} />
          </Button>
          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
            File size should be within 200KB
          </Typography>
          {errors.gstCertificate && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
              {errors.gstCertificate}
            </Typography>
          )}
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <Button 
            variant="outlined" 
            component="label" 
            fullWidth
            sx={{ 
              height: '56px',
              borderColor: errors.panCard ? '#ef4444' : undefined,
              color: errors.panCard ? '#ef4444' : undefined
            }}
          >
            {formValues.panCard ? (Array.isArray(formValues.panCard) ? `${formValues.panCard.length} file(s) selected` : formValues.panCard.name) : 'Upload PAN Card'}
            <input hidden type="file" accept="image/*,application/pdf" onChange={handleFileChange('panCard')} />
          </Button>
          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
            File size should be within 200KB
          </Typography>
          {errors.panCard && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
              {errors.panCard}
            </Typography>
          )}
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <Button 
            variant="outlined" 
            component="label" 
            fullWidth
            sx={{ 
              height: '56px',
              borderColor: errors.addressProof ? '#ef4444' : undefined,
              color: errors.addressProof ? '#ef4444' : undefined
            }}
          >
            {formValues.addressProof ? (Array.isArray(formValues.addressProof) ? `${formValues.addressProof.length} file(s) selected` : formValues.addressProof.name) : 'Upload Address Proof'}
            <input hidden type="file" accept="image/*,application/pdf" onChange={handleFileChange('addressProof')} />
          </Button>
          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
            File size should be within 200KB
          </Typography>
          {errors.addressProof && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
              {errors.addressProof}
            </Typography>
          )}
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <Button 
            variant="outlined" 
            component="label" 
            fullWidth
            sx={{ 
              height: '56px',
              borderColor: errors.directorIdProof ? '#ef4444' : undefined,
              color: errors.directorIdProof ? '#ef4444' : undefined
            }}
          >
            {formValues.directorIdProof ? (Array.isArray(formValues.directorIdProof) ? `${formValues.directorIdProof.length} file(s) selected` : formValues.directorIdProof.name) : 'Upload Director ID Proof'}
            <input hidden type="file" accept="image/*,application/pdf" onChange={handleFileChange('directorIdProof')} />
          </Button>
          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
            File size should be within 200KB
          </Typography>
          {errors.directorIdProof && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
              {errors.directorIdProof}
            </Typography>
          )}
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <Button 
            variant="outlined" 
            component="label" 
            fullWidth
            sx={{ 
              height: '56px',
              borderColor: errors.signature ? '#ef4444' : undefined,
              color: errors.signature ? '#ef4444' : undefined
            }}
          >
            {formValues.signature ? (Array.isArray(formValues.signature) ? `${formValues.signature.length} file(s) selected` : formValues.signature.name) : 'Upload Signature'}
            <input hidden type="file" accept="image/*,application/pdf" onChange={handleFileChange('signature')} />
          </Button>
          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
            File size should be within 200KB
          </Typography>
          {errors.signature && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
              {errors.signature}
            </Typography>
          )}
        </Box>

        {/* Login Credentials */}
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1e293b' }}>
            Login Credentials
          </Typography>
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            fullWidth 
            required
            disabled
            label="Create Username" 
            value={formValues.username || ''}
            onChange={handleChange('username', validateRequired)}
            error={!!errors.username}
            helperText={errors.username || helperTexts.username || "Username will be auto-filled from Official Email ID"}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            type="password" 
            fullWidth 
            required
            label="Create Password" 
            value={formValues.password || ''}
            onChange={handleChange('password', validatePassword)}
            error={!!errors.password}
            helperText={errors.password || helperTexts.password}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            type="password" 
            fullWidth 
            required
            label="Confirm Password" 
            value={formValues.confirmPassword || ''}
            onChange={handleChange('confirmPassword', (value) => validateConfirmPassword(formValues.password || '', value))}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword || helperTexts.confirmPassword}
          />
        </Box>

        {/* Declaration */}
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 1, border: '1px solid #e2e8f0' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={declarationAccepted}
                  onChange={(e) => setDeclarationAccepted(e.target.checked)}
                  sx={{ color: '#1e293b' }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.95rem' }}>
                  I hereby declare that all information provided is true and correct to the best of my knowledge.
                </Typography>
              }
            />
          </Box>
        </Box>
        <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            type="button" 
            variant="contained" 
            size="large"
            disabled={!declarationAccepted}
            onClick={handlePreview}
            sx={{ 
              px: 6, 
              py: 1.5, 
              fontSize: '1.1rem',
              backgroundColor: declarationAccepted ? '#1e293b' : '#94a3b8',
              '&:hover': {
                backgroundColor: declarationAccepted ? '#334155' : '#94a3b8'
              }
            }}
          >
            Preview & Submit
          </Button>
        </Box>
      </Box>
      </Box>
    </Paper>
    
    {/* Preview Modal */}
    <CenterFormPreviewModal
      open={previewOpen}
      onClose={() => setPreviewOpen(false)}
      formData={formValues}
      onSubmit={handleSubmitFromPreview}
      isSubmitting={isSavingCenter}
    />
    </>
  );
};

export default AddCenterPage;


