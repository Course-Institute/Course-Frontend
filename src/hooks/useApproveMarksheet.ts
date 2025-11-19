import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export interface SubjectData {
  id: string;
  subjectName: string;
  marks: number;
  internal: number;
  total: number;
  minMarks: number;
  maxMarks: number;
}

interface ApproveMarksheetRequest {
  registrationNo: string;
  subjects?: SubjectData[];
  marksheetId?: string;
  semester?: string; // NEW: Semester number to approve
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
      // Invalidate and refetch students list and marksheet data
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['marksheet'] });
      // Also invalidate individual student queries so center view marksheet page updates
      queryClient.invalidateQueries({ queryKey: ['student'] });
    },
  });
};
