import { Box, Typography, TextField, MenuItem, Button, Divider, Paper, FormControlLabel, Checkbox } from '@mui/material';
import { useCenterForm } from '../../hooks/useCenterForm';
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
  validateIFSC,
  validateAccountNumber,
  type ValidationResult
} from '../../utils/validationHelpers';

const AddCenterPage = () => {
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
  } = useCenterForm();

  const handleChange = (key: string, validator?: (value: string) => ValidationResult) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateField(key, value, validator);
  };

  const handleFileChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (key === 'photo' || key === 'cancelledCheque') {
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
            fullWidth 
            required
            type="number"
            label="Center Code" 
            value={formValues.centerCode || ''}
            onChange={handleChange('centerCode', validateNumber)}
            error={!!errors.centerCode}
            helperText={errors.centerCode || helperTexts.centerCode}
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
            <MenuItem value="own">Own Center</MenuItem>
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
          <TextField 
            fullWidth 
            required
            label="City" 
            value={formValues.city || ''}
            onChange={handleChange('city', validateRequired)}
            error={!!errors.city}
            helperText={errors.city || helperTexts.city}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 4' } }}>
          <TextField 
            fullWidth 
            required
            label="State" 
            value={formValues.state || ''}
            onChange={handleChange('state', validateRequired)}
            error={!!errors.state}
            helperText={errors.state || helperTexts.state}
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
            type="tel"
            label="Contact No." 
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
          {errors.infraPhotos && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
              {errors.infraPhotos}
            </Typography>
          )}
        </Box>

        {/* Bank Details */}
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1e293b' }}>
            Bank Details
          </Typography>
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            fullWidth 
            required
            label="Bank Name" 
            value={formValues.bankName || ''}
            onChange={handleChange('bankName', validateRequired)}
            error={!!errors.bankName}
            helperText={errors.bankName || helperTexts.bankName}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            fullWidth 
            required
            label="Account Holder Name" 
            value={formValues.accountHolder || ''}
            onChange={handleChange('accountHolder', validateRequired)}
            error={!!errors.accountHolder}
            helperText={errors.accountHolder || helperTexts.accountHolder}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            fullWidth 
            required
            type="number"
            label="Account Number" 
            value={formValues.accountNumber || ''}
            onChange={handleChange('accountNumber', validateAccountNumber)}
            error={!!errors.accountNumber}
            helperText={errors.accountNumber || helperTexts.accountNumber}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            fullWidth 
            required
            label="IFSC Code" 
            value={formValues.ifsc || ''}
            onChange={handleChange('ifsc', validateIFSC)}
            error={!!errors.ifsc}
            helperText={errors.ifsc || helperTexts.ifsc}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            fullWidth 
            required
            label="Branch Name" 
            value={formValues.branchName || ''}
            onChange={handleChange('branchName', validateRequired)}
            error={!!errors.branchName}
            helperText={errors.branchName || helperTexts.branchName}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <Button 
            variant="outlined" 
            component="label" 
            fullWidth
            sx={{ 
              height: '56px',
              borderColor: errors.cancelledCheque ? '#ef4444' : undefined,
              color: errors.cancelledCheque ? '#ef4444' : undefined
            }}
          >
            {formValues.cancelledCheque ? (Array.isArray(formValues.cancelledCheque) ? `${formValues.cancelledCheque.length} file(s) selected` : formValues.cancelledCheque.name) : 'Upload Cancelled Cheque'}
            <input hidden type="file" accept="image/*,application/pdf" onChange={handleFileChange('cancelledCheque')} />
          </Button>
          {errors.cancelledCheque && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
              {errors.cancelledCheque}
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
              borderColor: errors.documents ? '#ef4444' : undefined,
              color: errors.documents ? '#ef4444' : undefined
            }}
          >
            {formValues.documents && Array.isArray(formValues.documents) ? `${formValues.documents.length} file(s) selected` : 'Documents Upload'}
            <input hidden type="file" multiple onChange={handleFileChange('documents')} />
          </Button>
          {errors.documents && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
              {errors.documents}
            </Typography>
          )}
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            fullWidth 
            required
            label="Registration/GST Certificate" 
            value={formValues.gstCertificate || ''}
            onChange={handleChange('gstCertificate', validateRequired)}
            error={!!errors.gstCertificate}
            helperText={errors.gstCertificate || helperTexts.gstCertificate}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            fullWidth 
            required
            label="PAN Card" 
            value={formValues.panCard || ''}
            onChange={handleChange('panCard', validateRequired)}
            error={!!errors.panCard}
            helperText={errors.panCard || helperTexts.panCard}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            fullWidth 
            required
            label="Address Proof" 
            value={formValues.addressProof || ''}
            onChange={handleChange('addressProof', validateRequired)}
            error={!!errors.addressProof}
            helperText={errors.addressProof || helperTexts.addressProof}
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
          <TextField 
            fullWidth 
            required
            label="Director ID Proof" 
            value={formValues.directorIdProof || ''}
            onChange={handleChange('directorIdProof', validateRequired)}
            error={!!errors.directorIdProof}
            helperText={errors.directorIdProof || helperTexts.directorIdProof}
          />
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
            type="submit" 
            variant="contained" 
            size="large"
            disabled={!declarationAccepted || isSavingCenter}
            sx={{ 
              px: 6, 
              py: 1.5, 
              fontSize: '1.1rem',
              backgroundColor: declarationAccepted && !isSavingCenter ? '#1e293b' : '#94a3b8',
              '&:hover': {
                backgroundColor: declarationAccepted && !isSavingCenter ? '#334155' : '#94a3b8'
              }
            }}
          >
            {isSavingCenter ? 'Submitting...' : 'Submit Registration'}
          </Button>
        </Box>
      </Box>
      </Box>
    </Paper>
  );
};

export default AddCenterPage;


