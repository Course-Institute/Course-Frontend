import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

interface GenerateIdCardPayload {
  studentId: string;
  registrationNo: string;
}

interface GenerateIdCardResponse {
  status: boolean;
  message: string;
  data: {
    idCardUrl: string;
    generatedAt: string;
  };
}

const generateIdCard = async ({
  studentId,
  registrationNo,
}: GenerateIdCardPayload): Promise<GenerateIdCardResponse> => {
  const { data } = await axiosInstance.post('/api/id-card/generate', {
    studentId,
    registrationNo,
  });
  return data;
};

export const useIdCardGeneration = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: generateIdCard,
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['idCardStudents'] });
      queryClient.invalidateQueries({ queryKey: ['idCardStats'] });
      queryClient.invalidateQueries({ queryKey: ['idCardPreview'] });
    },
  });

  return {
    generateIdCard: mutate,
    isGenerating: isPending,
    isSuccess,
    isError,
    error,
  };
};
