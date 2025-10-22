import { useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export interface CenterAutoCompleteItem {
  id: string;
  centerId: string;
  centerName: string;
  location: string;
  contactPerson: string;
  status: string;
  email?: string;
  phone?: string;
}

export interface CenterAutoCompleteResponse {
  centers: CenterAutoCompleteItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface CenterAutoCompleteFilters {
  query?: string;
  status?: string;
  region?: string;
  limit?: number;
}

const fetchCenterAutoComplete = async (
  pageParam: number = 1,
  filters: CenterAutoCompleteFilters = {}
): Promise<CenterAutoCompleteResponse> => {
  const params = new URLSearchParams({
    page: pageParam.toString(),
    limit: (filters.limit || 20).toString(),
  });

  if (filters.query) {
    params.append('query', filters.query);
  }
  if (filters.status) {
    params.append('status', filters.status);
  }
  if (filters.region) {
    params.append('region', filters.region);
  }

  const response = await axiosInstance.get(`/api/center/getCenterAutoCompleteList?${params.toString()}`);
  
  return {
    centers: response.data.centers || [],
    total: response.data.total || 0,
    page: response.data.page || pageParam,
    limit: response.data.limit || 20,
    hasMore: response.data.hasMore || false,
  };
};

export const useCenterAutoComplete = (filters: CenterAutoCompleteFilters = {}) => {
  return useInfiniteQuery<CenterAutoCompleteResponse>({
    queryKey: ['centerAutoComplete', filters],
    queryFn: ({ pageParam = 1 }) => fetchCenterAutoComplete(pageParam as number, filters),
    getNextPageParam: (lastPage, allPages) => {
      // If there are more pages available, return the next page number
      if (lastPage.hasMore && lastPage.centers.length > 0) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook for getting all centers in a flattened array
export const useCenterAutoCompleteList = (filters: CenterAutoCompleteFilters = {}) => {
  const query = useCenterAutoComplete(filters);
  
  const allCenters = query.data?.pages.flatMap(page => page.centers) || [];
  const totalCount = query.data?.pages[0]?.total || 0;
  const hasNextPage = query.hasNextPage;
  const isFetchingNextPage = query.isFetchingNextPage;
  
  return {
    ...query,
    allCenters,
    totalCount,
    hasNextPage,
    isFetchingNextPage,
  };
};
