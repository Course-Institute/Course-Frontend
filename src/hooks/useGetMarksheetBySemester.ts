import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import type { MarksheetData } from './useGetMarksheet';

export const useGetMarksheetBySemester = (
  studentId: string,
  semester: string,
  enabled: boolean = true
) => {
  return useQuery<MarksheetData | null>({
    queryKey: ['marksheet', studentId, semester],
    queryFn: async () => {
      try {
        const response = await axiosInstance.post('/api/marksheet/show-marksheet', {
          studentId: studentId,
          semester: semester
        });
        // Extract data from the wrapped response structure
        // Handle case where marksheet doesn't exist (returns null)
        if (response.data && response.data.status && response.data.data) {
          return response.data.data;
        }
        // Return null if no marksheet found (not an error)
        return null;
      } catch (error: any) {
        // Handle 404 or "not found" errors gracefully
        if (error.response?.status === 404 || error.response?.status === 400) {
          // No marksheet found - this is not an error, just return null
          return null;
        }
        // For other errors, log and rethrow
        console.error('Error fetching marksheet by semester:', error);
        throw error;
      }
    },
    enabled: enabled && !!studentId && !!semester,
    staleTime: 30000, // 30 seconds
    retry: 1, // Only retry once on failure
  });
};

