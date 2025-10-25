import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

interface ApproveStudentRequest {
  registrationNo: string;
}

interface ApproveStudentResponse {
  status: boolean;
  message: string;
  data?: any;
}

const approveStudent = async (data: ApproveStudentRequest): Promise<ApproveStudentResponse> => {
  const response = await axiosInstance.post('/api/admin/approve-student', data);
  return response.data;
};

export const useApproveStudent = () => {
  return useMutation<ApproveStudentResponse, Error, ApproveStudentRequest>({
    mutationFn: approveStudent,
  });
};
