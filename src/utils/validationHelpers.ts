export interface ValidationResult {
  isValid: boolean;
  error?: string;
  helperText?: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true };
};

// Phone number validation (Indian format)
export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
    return { isValid: false, error: 'Please enter a valid 10-digit phone number' };
  }
  return { isValid: true };
};

// Aadhaar number validation (12 digits)
export const validateAadhaar = (aadhaar: string): ValidationResult => {
  if (!aadhaar) {
    return { isValid: false, error: 'Aadhaar number is required' };
  }
  const aadhaarRegex = /^\d{12}$/;
  if (!aadhaarRegex.test(aadhaar.replace(/\D/g, ''))) {
    return { isValid: false, error: 'Aadhaar number must be exactly 12 digits' };
  }
  return { isValid: true };
};

// Address validation (minimum 20 characters)
export const validateAddress = (address: string): ValidationResult => {
  if (!address) {
    return { isValid: false, error: 'Address is required' };
  }
  if (address.trim().length < 20) {
    return { isValid: false, error: 'Address must be at least 20 characters long' };
  }
  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }
  return { isValid: true };
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  return { isValid: true };
};

// File size validation (2MB limit)
export const validateFileSize = (file: File | null, maxSizeMB: number = 2): ValidationResult => {
  if (!file) {
    return { isValid: false, error: 'File is required' };
  }
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }
  return { isValid: true };
};

// File field validation (handles File, File[], or null)
export const validateFileField = (file: File | File[] | null): ValidationResult => {
  if (!file) {
    return { isValid: false, error: 'File is required' };
  }
  
  // Handle single file
  if (file instanceof File) {
    return validateFileSize(file);
  }
  
  // Handle file array
  if (Array.isArray(file)) {
    if (file.length === 0) {
      return { isValid: false, error: 'At least one file is required' };
    }
    // Validate each file in the array
    for (const f of file) {
      const result = validateFileSize(f);
      if (!result.isValid) {
        return result;
      }
    }
  }
  
  return { isValid: true };
};

// Required field validation
export const validateRequired = (value: string): ValidationResult => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: 'This field is required' };
  }
  return { isValid: true };
};

// Number validation
export const validateNumber = (value: string): ValidationResult => {
  if (!value) {
    return { isValid: false, error: 'This field is required' };
  }
  if (isNaN(Number(value)) || Number(value) < 0) {
    return { isValid: false, error: 'Please enter a valid positive number' };
  }
  return { isValid: true };
};

// Pin code validation (exactly 6 digits)
export const validatePinCode = (value: string): ValidationResult => {
  if (!value) {
    return { isValid: false, error: 'Pin code is required' };
  }
  const pinCodeRegex = /^\d{6}$/;
  if (!pinCodeRegex.test(value)) {
    return { isValid: false, error: 'Pin code must be exactly 6 digits' };
  }
  return { isValid: true };
};

// Year validation
export const validateYear = (year: string): ValidationResult => {
  if (!year) {
    return { isValid: false, error: 'Year is required' };
  }
  const currentYear = new Date().getFullYear();
  const yearNum = Number(year);
  if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) {
    return { isValid: false, error: `Please enter a valid year between 1900 and ${currentYear}` };
  }
  return { isValid: true };
};

// Website URL validation
export const validateWebsite = (website: string): ValidationResult => {
  if (!website) {
    return { isValid: true }; // Website is optional
  }
  const urlRegex = /^https?:\/\/.+\..+/;
  if (!urlRegex.test(website)) {
    return { isValid: false, error: 'Please enter a valid website URL (e.g., https://example.com)' };
  }
  return { isValid: true };
};

// IFSC code validation
export const validateIFSC = (ifsc: string): ValidationResult => {
  if (!ifsc) {
    return { isValid: false, error: 'IFSC code is required' };
  }
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  if (!ifscRegex.test(ifsc.toUpperCase())) {
    return { isValid: false, error: 'Please enter a valid IFSC code (e.g., SBIN0001234)' };
  }
  return { isValid: true };
};

// Account number validation
export const validateAccountNumber = (accountNumber: string): ValidationResult => {
  if (!accountNumber) {
    return { isValid: false, error: 'Account number is required' };
  }
  const accountRegex = /^\d{9,18}$/;
  if (!accountRegex.test(accountNumber.replace(/\D/g, ''))) {
    return { isValid: false, error: 'Account number must be 9-18 digits' };
  }
  return { isValid: true };
};
