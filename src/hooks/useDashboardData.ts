import { useQuery } from '@tanstack/react-query';
import { getAdminDashboardData, type DashboardStats } from '../api/dashboardApi';

interface UseDashboardDataReturn {
  data: DashboardStats;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: getAdminDashboardData,
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
