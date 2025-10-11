import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

interface UpdateStudentStatusPayload {
  registrationNo: string;
  fullPayment: boolean;
}

interface UpdateStudentStatusResponse {
  status: boolean;
  message: string;
}

const updateStudentStatus = async ({
  registrationNo,
  fullPayment,
}: UpdateStudentStatusPayload): Promise<UpdateStudentStatusResponse> => {
  const { data } = await axiosInstance.post('/api/student/update-status', {
    registrationNo,
    fullPayment,
  });
  return data;
};

export const useStudentStatusUpdate = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: updateStudentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return {
    updateStudentStatus: mutate,
    isUpdating: isPending,
    isSuccess,
    isError,
    error,
  };
};
