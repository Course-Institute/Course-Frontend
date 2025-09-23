import { useQuery } from '@tanstack/react-query';
import { type DashboardStats } from '../api/dashboardApi';

interface UseDashboardDataReturn {
  data: DashboardStats;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

// Mock data for dashboard
const mockDashboardData: DashboardStats = {
  studentCount: 1247,
  totalPayments: 2450000,
  pendingApprovals: 23,
  activeCenters: 8,
};

const fetchDashboardData = async (): Promise<{ data: DashboardStats }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    data: mockDashboardData
  };
};

export const useDashboardData = (): UseDashboardDataReturn => {
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  // Default values when API fails or is loading
  const defaultData: DashboardStats = {
    studentCount: 0,
    totalPayments: 0,
    pendingApprovals: 0,
    activeCenters: 0,
  };

  return {
    data: apiResponse?.data || defaultData,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
};
