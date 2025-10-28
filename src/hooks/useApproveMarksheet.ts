import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

interface ApproveMarksheetRequest {
  registrationNo: string;
}

interface ApproveMarksheetResponse {
  status: boolean;
  message: string;
  data?: any;
}

const approveMarksheet = async (data: ApproveMarksheetRequest): Promise<ApproveMarksheetResponse> => {
  const response = await axiosInstance.post('/api/admin/approve-marksheet', data);
  return response.data;
};

export const useApproveMarksheet = () => {
  const queryClient = useQueryClient();

  return useMutation<ApproveMarksheetResponse, Error, ApproveMarksheetRequest>({
    mutationFn: approveMarksheet,
    onSuccess: () => {
      // Invalidate and refetch students list
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};
