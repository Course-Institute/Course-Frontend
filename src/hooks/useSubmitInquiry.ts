import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export interface InquiryFormData {
  fullName: string;
  email: string;
  phone: string;
  programOfInterest: string;
  message: string;
  inquiryType: 'student' | 'center';
}

export interface InquiryResponse {
  status: boolean;
  message: string;
  data?: any;
}

export const useSubmitInquiry = () => {
  return useMutation<InquiryResponse, Error, InquiryFormData>({
    mutationFn: async (data: InquiryFormData) => {
      const response = await axiosInstance.post('/api/inquiry/newInquiry', data);
      return response.data;
    },
    onError: (error: any) => {
      console.error('Error submitting inquiry:', error);
      throw error;
    },
  });
};
