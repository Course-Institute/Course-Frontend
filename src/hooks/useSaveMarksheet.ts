import { useMutation } from '@tanstack/react-query';
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

export interface MarksheetFormData {
  studentId: string;
  subjects: SubjectData[];
  role?: string;
}

export const useSaveMarksheet = () => {
  return useMutation({
    mutationFn: async (data: MarksheetFormData) => {
      const response = await axiosInstance.post('/api/marksheet/upload-marksheet', data);
      return response.data;
    },
    onError: (error: any) => {
      console.error('Error saving marksheet:', error);
      throw error;
    },
  });
};
