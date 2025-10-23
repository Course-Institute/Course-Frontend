import { useQuery } from '@tanstack/react-query';
import { type DashboardStats } from '../api/dashboardApi';
import axiosInstance from '../api/axiosInstance';

interface UseDashboardDataReturn {
  data: DashboardStats;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

const fetchDashboardData = async (): Promise<DashboardStats> => {
  const response = await axiosInstance.get('/api/admin/dashboardStats');
  return response.data;
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
    studentIncrease: 0,
    centerIncrease: 0,
  };

  return {
    data: apiResponse || defaultData,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
};
