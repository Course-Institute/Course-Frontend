import { useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export interface Bill {
  _id: string;
  studentName: string;
  registrationNo: string;
  course: string;
  amount: number;
  paymentMethod: string;
  billDate: string;
  dueDate: string;
  description: string;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

export interface BillListResponse {
  status: boolean;
  message: string;
  data: {
    bills: Bill[];
    totalCount: number;
    hasMore: boolean;
    totalPages: number;
  };
}

export interface BillFilters {
  query?: string;
  status?: string;
  paymentMethod?: string;
  course?: string;
  centerId?: string;
}

const fetchBillList = async ({ pageParam = 1, filters = {} }: { pageParam?: number; filters?: BillFilters }): Promise<BillListResponse> => {
  const response = await axiosInstance.post('/api/admin/getBillsList', {
    query: filters.query || '',
    page: pageParam,
    limit: 10,
    ...filters
  });
  
  return response.data;
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
