import { useState, useCallback } from 'react';
import { useSaveCenter } from './useSaveCenter';
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
} from '../utils/validationHelpers';

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
  photo?: File | File[] | null;

  // Infrastructure Details
  numClassrooms: string;
  numComputers: string;
  internetFacility: string;
  seatingCapacity: string;
  infraPhotos?: File | File[] | null;

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

export function useCenterForm(): {
  formValues: CenterFormData;
  errors: Record<string, string>;
  helperTexts: Record<string, string>;
  declarationAccepted: boolean;
  updateField: (key: string, value: any, validator?: (value: string) => ValidationResult) => void;
  updateFile: (key: string, files: File | File[] | null) => void;
  setDeclarationAccepted: (accepted: boolean) => void;
  onSave: (event?: React.FormEvent) => void;
  isSavingCenter: boolean;
  saveCenterError: unknown;
  savedCenterData: unknown;
  validateForm: () => boolean;
} {
  const [formValues, setFormValues] = useState<CenterFormData>({
    centerName: '',
    centerType: '',
    yearOfEstablishment: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    officialEmail: '',
    website: '',
    authName: '',
    designation: '',
    contactNo: '',
    email: '',
    idProofNo: '',
    photo: null,
    numClassrooms: '',
    numComputers: '',
    internetFacility: '',
    seatingCapacity: '',
    infraPhotos: null,
    gstCertificate: null,
    panCard: null,
    addressProof: null,
    directorIdProof: null,
    signature: null,
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [helperTexts, setHelperTexts] = useState<Record<string, string>>({});
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  const { saveCenterMutation, isSavingCenter, saveCenterError, savedCenterData } = useSaveCenter();

  const updateField = useCallback(
    (key: string, value: any, validator?: (value: string) => ValidationResult) => {
      setFormValues((prev) => ({ ...prev, [key]: value }));
      
      // Auto-fill username when official email changes
      if (key === 'officialEmail' && value) {
        setFormValues((prev) => ({ ...prev, username: value }));
      }
      
      // Re-validate confirm password when password changes
      if (key === 'password' && formValues.confirmPassword) {
        const result = validateConfirmPassword(value, formValues.confirmPassword);
        setErrors((prev) => ({ ...prev, confirmPassword: result.error || '' }));
      }
      
      if (validator) {
        const result = validator(value);
        setErrors((prev) => ({ ...prev, [key]: result.error || '' }));
        setHelperTexts((prev) => ({ ...prev, [key]: result.helperText || '' }));
      }
    },
    [formValues.confirmPassword]
  );

  const validateFileField = useCallback((files: File | File[] | null | undefined): ValidationResult => {
    if (!files) {
      return { isValid: false, error: 'File is required' };
    }
    
    const maxSizeBytes = 200 * 1024; // 200KB
    
    if (Array.isArray(files)) {
      // Multiple files validation
      const hasInvalidFile = files.some(file => file.size > maxSizeBytes);
      if (hasInvalidFile) {
        return { isValid: false, error: 'One or more files exceed the 200KB limit' };
      }
      return { isValid: true };
    } else {
      // Single file validation
      if (files.size > maxSizeBytes) {
        return { isValid: false, error: 'File size must be less than 200KB' };
      }
      return { isValid: true };
    }
  }, []);

  const updateFile = useCallback((key: string, files: File | File[] | null) => {
    setFormValues((prev) => ({ ...prev, [key]: files }));
    
    const result = validateFileField(files);
    setErrors((prev) => ({ ...prev, [key]: result.error || '' }));
  }, [validateFileField]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Center Details
    const centerNameResult = validateRequired(formValues.centerName || '');
    if (!centerNameResult.isValid) newErrors.centerName = centerNameResult.error || '';

    const centerTypeResult = validateRequired(formValues.centerType || '');
    if (!centerTypeResult.isValid) newErrors.centerType = centerTypeResult.error || '';

    const yearResult = validateYear(formValues.yearOfEstablishment || '');
    if (!yearResult.isValid) newErrors.yearOfEstablishment = yearResult.error || '';

    const addressResult = validateAddress(formValues.address || '');
    if (!addressResult.isValid) newErrors.address = addressResult.error || '';

    const cityResult = validateRequired(formValues.city || '');
    if (!cityResult.isValid) newErrors.city = cityResult.error || '';

    const stateResult = validateRequired(formValues.state || '');
    if (!stateResult.isValid) newErrors.state = stateResult.error || '';

    const pinCodeResult = validatePinCode(formValues.pinCode || '');
    if (!pinCodeResult.isValid) newErrors.pinCode = pinCodeResult.error || '';

    const emailResult = validateEmail(formValues.officialEmail || '');
    if (!emailResult.isValid) newErrors.officialEmail = emailResult.error || '';

    const websiteResult = validateWebsite(formValues.website || '');
    if (!websiteResult.isValid) newErrors.website = websiteResult.error || '';

    // Authorized Person Details
    const authNameResult = validateRequired(formValues.authName || '');
    if (!authNameResult.isValid) newErrors.authName = authNameResult.error || '';

    const designationResult = validateRequired(formValues.designation || '');
    if (!designationResult.isValid) newErrors.designation = designationResult.error || '';

    const contactResult = validatePhoneNumber(formValues.contactNo || '');
    if (!contactResult.isValid) newErrors.contactNo = contactResult.error || '';

    const authEmailResult = validateEmail(formValues.email || '');
    if (!authEmailResult.isValid) newErrors.email = authEmailResult.error || '';

    const aadhaarResult = validateAadhaar(formValues.idProofNo || '');
    if (!aadhaarResult.isValid) newErrors.idProofNo = aadhaarResult.error || '';

    const photoResult = validateFileField(formValues.photo);
    if (!photoResult.isValid) newErrors.photo = photoResult.error || '';

    // Infrastructure Details
    const classroomsResult = validateNumber(formValues.numClassrooms || '');
    if (!classroomsResult.isValid) newErrors.numClassrooms = classroomsResult.error || '';

    const computersResult = validateNumber(formValues.numComputers || '');
    if (!computersResult.isValid) newErrors.numComputers = computersResult.error || '';

    const internetResult = validateRequired(formValues.internetFacility || '');
    if (!internetResult.isValid) newErrors.internetFacility = internetResult.error || '';

    const seatingResult = validateNumber(formValues.seatingCapacity || '');
    if (!seatingResult.isValid) newErrors.seatingCapacity = seatingResult.error || '';

    const infraPhotosResult = validateFileField(formValues.infraPhotos);
    if (!infraPhotosResult.isValid) newErrors.infraPhotos = infraPhotosResult.error || '';

    // Documents
    const gstResult = validateFileField(formValues.gstCertificate);
    if (!gstResult.isValid) newErrors.gstCertificate = gstResult.error || '';

    const panResult = validateFileField(formValues.panCard);
    if (!panResult.isValid) newErrors.panCard = panResult.error || '';

    const addressProofResult = validateFileField(formValues.addressProof);
    if (!addressProofResult.isValid) newErrors.addressProof = addressProofResult.error || '';

    const directorIdResult = validateFileField(formValues.directorIdProof);
    if (!directorIdResult.isValid) newErrors.directorIdProof = directorIdResult.error || '';

    const signatureResult = validateFileField(formValues.signature);
    if (!signatureResult.isValid) newErrors.signature = signatureResult.error || '';

    // Login Credentials
    const usernameResult = validateRequired(formValues.username || '');
    if (!usernameResult.isValid) newErrors.username = usernameResult.error || '';

    const passwordResult = validatePassword(formValues.password || '');
    if (!passwordResult.isValid) newErrors.password = passwordResult.error || '';

    const confirmPasswordResult = validateConfirmPassword(formValues.password || '', formValues.confirmPassword || '');
    if (!confirmPasswordResult.isValid) newErrors.confirmPassword = confirmPasswordResult.error || '';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formValues]);

  const transformFormDataForAPI = useCallback((data: CenterFormData) => {
    return {
      // Center Details
      centerName: data.centerName,
      centerType: data.centerType,
      yearOfEstablishment: data.yearOfEstablishment,
      address: data.address,
      city: data.city,
      state: data.state,
      pinCode: data.pinCode,
      officialEmail: data.officialEmail,
      website: data.website,

      // Authorized Person Details
      authName: data.authName,
      designation: data.designation,
      contactNo: data.contactNo,
      email: data.email,
      idProofNo: data.idProofNo,
      photo: Array.isArray(data.photo) ? data.photo[0] : (data.photo || undefined),

      // Infrastructure Details
      numClassrooms: data.numClassrooms,
      numComputers: data.numComputers,
      internetFacility: data.internetFacility,
      seatingCapacity: data.seatingCapacity,
      infraPhotos: Array.isArray(data.infraPhotos) ? data.infraPhotos : (data.infraPhotos ? [data.infraPhotos] : []),

      // Documents
      gstCertificate: Array.isArray(data.gstCertificate) ? data.gstCertificate[0] : (data.gstCertificate || undefined),
      panCard: Array.isArray(data.panCard) ? data.panCard[0] : (data.panCard || undefined),
      addressProof: Array.isArray(data.addressProof) ? data.addressProof[0] : (data.addressProof || undefined),
      directorIdProof: Array.isArray(data.directorIdProof) ? data.directorIdProof[0] : (data.directorIdProof || undefined),
      signature: Array.isArray(data.signature) ? data.signature[0] : (data.signature || undefined),

      // Login Credentials
      username: data.username,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };
  }, []);

  const onSave = useCallback(
    (event?: React.FormEvent) => {
      event?.preventDefault();
      
      if (!declarationAccepted) {
        return;
      }
      
      const isValid = validateForm();
      if (isValid) {
        const apiData = transformFormDataForAPI(formValues);
        saveCenterMutation(apiData);
      }
    },
    [formValues, validateForm, declarationAccepted, saveCenterMutation, transformFormDataForAPI]
  );

  return {
    formValues,
    errors,
    helperTexts,
    declarationAccepted,
    updateField,
    updateFile,
    setDeclarationAccepted,
    onSave,
    isSavingCenter,
    saveCenterError,
    savedCenterData,
    validateForm,
  };
}
