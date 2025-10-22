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

  // Login Credentials
  username: string;
  password: string;
  confirmPassword: string;
}

interface SaveCenterResponse {
  id: string;
  message: string;
}

const saveCenter = async (data: CenterFormData): Promise<SaveCenterResponse> => {
  const formData = new FormData();
  
  // Append all text fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'photo' && value instanceof File) {
        formData.append('photo', value);
      } else if (key === 'infraPhotos' && Array.isArray(value)) {
        value.forEach((file, index) => {
          formData.append(`infraPhotos[${index}]`, file);
        });
      } else if (key === 'documents' && Array.isArray(value)) {
        value.forEach((file, index) => {
          formData.append(`documents[${index}]`, file);
        });
      } else if (key === 'cancelledCheque' && value instanceof File) {
        formData.append('cancelledCheque', value);
      } else if (typeof value === 'string') {
        formData.append(key, value);
      }
    }
  });

  const response = await axiosInstance.post<SaveCenterResponse>('/api/admin/register-center', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const useSaveCenter = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation<SaveCenterResponse, Error, CenterFormData>({
    mutationFn: saveCenter,
    onSuccess: () => {
      showToast('Center registered successfully!', 'success');
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
