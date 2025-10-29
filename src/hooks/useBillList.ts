import { useInfiniteQuery } from '@tanstack/react-query';
import { getBillsListPaginated, type Bill, type BillListResponse, type BillFilters } from '../api/billApi';

const fetchBillList = async ({ pageParam = 1, filters = {} }: { pageParam?: number; filters?: BillFilters }): Promise<BillListResponse> => {
  return await getBillsListPaginated(pageParam, filters);
};

export const useBillList = (filters: BillFilters = {}) => {
  return useInfiniteQuery<BillListResponse>({
    queryKey: ['billList', filters],
    queryFn: ({ pageParam }) => fetchBillList({ pageParam: pageParam as number, filters }),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.hasMore) {
        return Math.ceil(lastPage.data.bills.length / 10) + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Re-export types for convenience
export type { Bill, BillListResponse, BillFilters };