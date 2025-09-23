import { useQuery } from '@tanstack/react-query';

interface IdCardStats {
  totalStudents: number;
  pendingIdCards: number;
  generatedIdCards: number;
  rejectedApplications: number;
}

// Mock data for ID card statistics
const mockIdCardStats: IdCardStats = {
  totalStudents: 1247,
  pendingIdCards: 23,
  generatedIdCards: 1200,
  rejectedApplications: 24,
};

const fetchIdCardStats = async (): Promise<IdCardStats> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return mockIdCardStats;
};

export const useIdCardStats = () => {
  return useQuery<IdCardStats>({
    queryKey: ['idCardStats'],
    queryFn: fetchIdCardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
