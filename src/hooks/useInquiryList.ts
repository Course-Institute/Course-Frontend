import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  programOfInterest: string;
  message: string;
  createdAt: string;
  status?: string;
  inquiryType?: 'student' | 'center';
}

export interface InquiryResponse {
  data: Inquiry[];
  total?: number;
}

export const useInquiryList = () => {
  return useQuery<InquiryResponse>({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/inquiry/list');
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });
};
