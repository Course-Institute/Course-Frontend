import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export interface Course {
  _id: string;
  name: string;
  code?: string;
  duration?: number;
  description?: string;
  coursesType?: string;
}

export interface CoursesResponse {
  status: boolean;
  message: string;
  data: Course[];
}

const fetchCourses = async (): Promise<Course[]> => {
  const response = await axiosInstance.get<CoursesResponse>('/api/course/getAllCourses');
  return response.data.data || [];
};

export const useCourses = () => {
  const {
    data: courses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    staleTime: 10 * 60 * 1000, // 10 minutes - courses don't change often
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    courses,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
};

