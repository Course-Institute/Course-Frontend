import { useQuery } from '@tanstack/react-query';

interface ResultStats {
  totalStudents: number;
  pendingResults: number;
  publishedResults: number;
  lockedResults: number;
}

// Mock data for result statistics
const mockResultStats: ResultStats = {
  totalStudents: 12335,
  pendingResults: 415,
  publishedResults: 11900,
  lockedResults: 20,
};

const fetchResultStats = async (): Promise<ResultStats> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockResultStats;
};

export const useResultStats = () => {
  return useQuery<ResultStats>({
    queryKey: ['resultStats'],
    queryFn: fetchResultStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
