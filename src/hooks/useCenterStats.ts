import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

interface CenterStats {
  totalCenters: number;
  pendingApprovals: number;
  activeCenters: number;
  deactivatedCenters: number;
}

interface CenterDynamicsResponse {
  status: boolean;
  message: string;
  data: CenterStats;
}

const fetchCenterStats = async (): Promise<CenterStats> => {
  const response = await axiosInstance.get('/api/admin/centerdynamics');
  return response.data.data;
};

export const useCenterStats = () => {
  return useQuery<CenterStats>({
    queryKey: ['centerStats'],
    queryFn: fetchCenterStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useRefreshCenterStats = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: fetchCenterStats,
    onSuccess: (data) => {
      queryClient.setQueryData(['centerStats'], data);
    },
    onError: (error) => {
      console.error('Failed to refresh center stats:', error);
    },
  });
};
