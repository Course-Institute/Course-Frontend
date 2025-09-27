import { useQuery } from '@tanstack/react-query';
import { getStudentsData, type StudentsResponse } from '../api/studentsApi';

interface UseStudentsDataOptions {
  page?: number;
  limit?: number;
}

export const useStudentsData = (options: UseStudentsDataOptions = {}) => {
  const { page = 1, limit = 10 } = options;

  return useQuery<StudentsResponse, Error>({
    queryKey: ['students', page, limit],
    queryFn: () => getStudentsData(page, limit),
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    refetchOnWindowFocus: false, // Do not refetch on window focus
    retry: 2, // Retry failed requests 2 times
  });
};
