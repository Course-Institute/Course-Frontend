import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import axiosInstance from '../api/axiosInstance';

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
  photo?: File;

  // Infrastructure Details
  numClassrooms: string;
  numComputers: string;
  internetFacility: string;
  seatingCapacity: string;
  infraPhotos?: File[];

  // Bank Details
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  branchName: string;
  cancelledCheque?: File;

  // Documents
  gstCertificate?: File;
  panCard?: File;
  addressProof?: File;
  directorIdProof?: File;
  signature?: File;

  // Login Credentials
  username: string;
  password: string;
  confirmPassword: string;
}

interface SaveCenterResponse {
  success: boolean;
  message: string;
  data?: any;
}

const saveCenter = async (data: CenterFormData): Promise<SaveCenterResponse> => {
  const formData = new FormData();
  
  // Append all text fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'photo' && value instanceof File) {
        formData.append('photo', value);
      } else if (key === 'infraPhotos' && Array.isArray(value)) {
        value.forEach((file) => {
          formData.append('infraPhotos', file);
        });
      } else if (key === 'documents' && Array.isArray(value)) {
        value.forEach((file, index) => {
          formData.append(`documents[${index}]`, file);
        });
      } else if (key === 'cancelledCheque' && value instanceof File) {
        formData.append('cancelledCheque', value);
      } else if (key === 'gstCertificate' && value instanceof File) {
        formData.append('gstCertificate', value);
      } else if (key === 'panCard' && value instanceof File) {
        formData.append('panCard', value);
      } else if (key === 'addressProof' && value instanceof File) {
        formData.append('addressProof', value);
      } else if (key === 'directorIdProof' && value instanceof File) {
        formData.append('directorIdProof', value);
      } else if (key === 'signature' && value instanceof File) {
        formData.append('signature', value);
      } else if (typeof value === 'string') {
        formData.append(key, value);
      }
    }
  });

  try {
    const response = await axiosInstance.post('/api/admin/register-center', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Check if the response indicates success
    if (response.data.status === true) {
      return {
        success: true,
        message: response.data.message,
        data: response.data.data
      };
    } else {
      // Handle validation errors
      throw new Error(JSON.stringify({
        status: false,
        message: response.data.message,
        errors: response.data.errors
      }));
    }
  } catch (error: any) {
    // Handle axios errors or validation errors
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.status === false && errorData.errors) {
        // Format validation errors
        const errorMessage = errorData.errors.join(', ');
        throw new Error(errorMessage);
      } else {
        throw new Error(errorData.message || 'Failed to register center');
      }
    } else if (error.message && error.message.includes('[')) {
      // Handle our custom formatted error
      try {
        const parsedError = JSON.parse(error.message);
        if (parsedError.errors) {
          throw new Error(parsedError.errors.join(', '));
        }
      } catch {
        throw error;
      }
    }
    throw error;
  }
};

export const useSaveCenter = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation<SaveCenterResponse, Error, CenterFormData>({
    mutationFn: saveCenter,
    onSuccess: (data) => {
      showToast(data.message || 'Center registered successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['centers'] });
      navigate('/admin/centers');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to register center', 'error');
    },
  });

  return {
    saveCenterMutation: mutation.mutate,
    isSavingCenter: mutation.isPending,
    saveCenterError: mutation.error,
    savedCenterData: mutation.data,
  };
};
