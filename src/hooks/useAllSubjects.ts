import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export interface Subject {
  _id: string;
  name: string;
  courseId: string;
  courseName?: string;
  semester?: number;
  year?: number;
  code?: string;
  credits?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AllSubjectsResponse {
  status: boolean;
  message: string;
  data: Subject[];
}

const fetchAllSubjects = async (): Promise<Subject[]> => {
  const response = await axiosInstance.get<AllSubjectsResponse>('/api/course/getAllSubjects');
  return response.data.data || [];
};

export const useAllSubjects = () => {
  const {
    data: subjects = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['subjects'],
    queryFn: fetchAllSubjects,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    subjects,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
};

