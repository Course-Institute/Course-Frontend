import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

interface IdCardStats {
  totalStudents: number;
  pendingIdCards: number;
  generatedIdCards: number;
  rejectedApplications: number;
}


const fetchIdCardStats = async (): Promise<IdCardStats> => {
  const { data } = await axiosInstance.get('/api/id-card/stats');
  return data?.data;
};

export const useIdCardStats = () => {
  const {
    data: idCardStats,
    isLoading: isIdCardStatsLoading,
    error: idCardStatsError,
    refetch: refetchIdCardStats,
  } = useQuery({
    queryKey: ['idCardStats'],
    queryFn: fetchIdCardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    idCardStats,
    isIdCardStatsLoading,
    idCardStatsError,
    refetchIdCardStats,
  };
};
