import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export interface SubjectData {
  id?: string;
  subjectName: string;
  marks: number;
  internal: number;
  total: number;
  minMarks: number;
  maxMarks: number;
  grade: string;
}

export interface StudentData {
  _id: string;
  registrationNo: string;
  candidateName: string;
  motherName: string;
  fatherName: string;
  gender: string;
  dateOfBirth: string;
  courseType: string;
  faculty: string;
  course: string;
  stream: string;
  year: string;
  monthSession: string;
  session: string;
  duration: string;
  photo?: string;
  signature?: string;
}

export interface MarksheetData {
  _id: string;
  studentId: StudentData;
  subjects: SubjectData[];
  createdAt: string;
  updatedAt: string;
}

export const useGetMarksheet = (studentId: string, enabled: boolean = true) => {
  return useQuery<MarksheetData>({
    queryKey: ['marksheet', studentId],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/marksheet/show-marksheet', {
        params: {
          studentId: studentId
        }
      });
      // Extract data from the wrapped response structure
      return response.data.data;
    },
    enabled: enabled && !!studentId,
    staleTime: 30000, // 30 seconds
  });
};
