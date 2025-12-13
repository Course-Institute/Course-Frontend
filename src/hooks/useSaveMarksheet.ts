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
  semester?: string;
  year?: string;
  courseId?: string; // Course ID for the marksheet
  role?: string;
  marksheetId?: string; // For updates
  serialNo?: string; // 6-digit random serial number
}

export const useSaveMarksheet = () => {
  return useMutation({
    mutationFn: async (data: MarksheetFormData) => {
      // If marksheetId is provided, update existing marksheet using POST
      if (data.marksheetId) {
        const response = await axiosInstance.post(
          '/api/marksheet/update-marksheet',
          {
            marksheetId: data.marksheetId,
            studentId: data.studentId,
            subjects: data.subjects,
            semester: data.semester,
            year: data.year,
            courseId: data.courseId,
            role: data.role,
            serialNo: data.serialNo,
          }
        );
        return response.data;
      } else {
        // Otherwise, create new marksheet
        const response = await axiosInstance.post('/api/marksheet/upload-marksheet', data);
        return response.data;
      }
    },
    onError: (error: any) => {
      console.error('Error saving marksheet:', error);
      throw error;
    },
  });
};
