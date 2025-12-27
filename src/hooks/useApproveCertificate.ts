import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

interface ApproveCertificateRequest {
  registrationNo: string;
}

interface ApproveCertificateResponse {
  status: boolean;
  message: string;
  data?: any;
}

const approveCertificate = async (data: ApproveCertificateRequest): Promise<ApproveCertificateResponse> => {
  const response = await axiosInstance.post('/api/admin/approve-certificate', data);
  return response.data;
};

export const useApproveCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation<ApproveCertificateResponse, Error, ApproveCertificateRequest>({
    mutationFn: approveCertificate,
    onSuccess: () => {
      // Invalidate and refetch students list
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student'] });
    },
  });
};
