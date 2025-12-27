import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

interface ApproveMigrationRequest {
  registrationNo: string;
}

interface ApproveMigrationResponse {
  status: boolean;
  message: string;
  data?: any;
}

const approveMigration = async (data: ApproveMigrationRequest): Promise<ApproveMigrationResponse> => {
  const response = await axiosInstance.post('/api/admin/approve-migration', data);
  return response.data;
};

export const useApproveMigration = () => {
  const queryClient = useQueryClient();

  return useMutation<ApproveMigrationResponse, Error, ApproveMigrationRequest>({
    mutationFn: approveMigration,
    onSuccess: () => {
      // Invalidate and refetch students list
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student'] });
    },
  });
};
