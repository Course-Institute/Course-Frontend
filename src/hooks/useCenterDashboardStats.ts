import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

interface CenterDashboardStats {
  totalStudents: number;
  activeStudents: number;
  pendingApprovals: number;
  completedPayments: number;
}

interface CenterDashboardResponse {
  status: boolean;
  message: string;
  data: CenterDashboardStats;
}

const fetchCenterDashboardStats = async (): Promise<CenterDashboardStats> => {
  const response = await axiosInstance.get<CenterDashboardResponse>('/api/center/dashboard-stats');
  return response.data.data;
};

export const useCenterDashboardStats = () => {
  return useQuery<CenterDashboardStats>({
    queryKey: ['centerDashboardStats'],
    queryFn: fetchCenterDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    placeholderData: {
      totalStudents: 0,
      activeStudents: 0,
      pendingApprovals: 0,
      completedPayments: 0,
    },
  });
};

export const useRefreshCenterDashboardStats = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: fetchCenterDashboardStats,
    onSuccess: (data) => {
      queryClient.setQueryData(['centerDashboardStats'], data);
    },
    onError: (error) => {
      console.error('Failed to refresh center dashboard stats:', error);
    },
  });
};
