import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

interface ApproveAdmitCardRequest {
  registrationNo: string;
}

interface ApproveAdmitCardResponse {
  status: boolean;
  message: string;
  data?: any;
}

const approveAdmitCard = async (data: ApproveAdmitCardRequest): Promise<ApproveAdmitCardResponse> => {
  const response = await axiosInstance.post('/api/admin/approve-admit-card', data);
  return response.data;
};

export const useApproveAdmitCard = () => {
  const queryClient = useQueryClient();

  return useMutation<ApproveAdmitCardResponse, Error, ApproveAdmitCardRequest>({
    mutationFn: approveAdmitCard,
    onSuccess: () => {
      // Invalidate and refetch students list
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student'] });
    },
  });
};
