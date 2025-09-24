import { useQuery } from '@tanstack/react-query';

interface CenterStats {
  totalCenters: number;
  pendingApprovals: number;
  activeCenters: number;
  deactivatedCenters: number;
}

// Mock data for center statistics
const mockCenterStats: CenterStats = {
  totalCenters: 120,
  pendingApprovals: 15,
  activeCenters: 98,
  deactivatedCenters: 7,
};

const fetchCenterStats = async (): Promise<CenterStats> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockCenterStats;
};

export const useCenterStats = () => {
  return useQuery<CenterStats>({
    queryKey: ['centerStats'],
    queryFn: fetchCenterStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
