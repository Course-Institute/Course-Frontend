import { useQuery } from '@tanstack/react-query';
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

export interface MarksheetData {
  id: string;
  studentId: string;
  registrationNo: string;
  subjects: SubjectData[];
  createdAt: string;
  isMarksheetApproved: boolean;
  role: string;
}

export const useGetMarksheet = (registrationNo: string, enabled: boolean = true) => {
  return useQuery<MarksheetData>({
    queryKey: ['marksheet', registrationNo],
    queryFn: async () => {
      const response = await axiosInstance.get(`/marksheet/get-marksheet/${registrationNo}`);
      return response.data;
    },
    enabled: enabled && !!registrationNo,
    staleTime: 30000, // 30 seconds
  });
};
