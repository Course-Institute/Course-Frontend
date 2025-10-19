import { useInfiniteQuery, type UseInfiniteQueryOptions } from '@tanstack/react-query';
import { useMemo } from 'react';

export interface InfiniteDataOptions<TData> {
  queryKey: (string | number | boolean | object)[];
  queryFn: (pageParam: any) => Promise<TData>;
  getNextPageParam: (lastPage: TData, allPages: TData[]) => any;
  initialPageParam: any;
  enabled?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  retry?: number | boolean;
  retryDelay?: number | ((retryCount: number) => number);
}

export interface InfiniteDataResult<TData> {
  data: TData[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
  isRefetching: boolean;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}

/**
 * Global hook for infinite data fetching with React Query
 * Provides a unified interface for infinite scroll data management
 */
export const useInfiniteData = <TData>(
  options: InfiniteDataOptions<TData>
): InfiniteDataResult<TData> => {
  const {
    queryKey,
    queryFn,
    getNextPageParam,
    initialPageParam,
    enabled = true,
    staleTime = 5 * 60 * 1000,
    refetchOnWindowFocus = false,
    retry = 2,
    retryDelay = 1000
  } = options;

  const queryOptions: UseInfiniteQueryOptions<TData, Error> = {
    queryKey,
    queryFn,
    getNextPageParam,
    initialPageParam,
    enabled,
    staleTime,
    refetchOnWindowFocus,
    retry,
    retryDelay
  };

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    isRefetching
  } = useInfiniteQuery(queryOptions);

  // Debug logging
  console.log('useInfiniteQuery result:', {
    data,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  });

  // Type assertion for infinite query data structure
  const infiniteData = data as { pages: TData[] } | undefined;

  // Flatten all pages into a single array
  const flattenedData = useMemo(() => {
    if (!infiniteData?.pages) return [];
    return infiniteData.pages.flatMap((page: any) => {
      // Handle different data structures
      if (Array.isArray(page)) {
        return page;
      }
      if (page && typeof page === 'object' && 'data' in page) {
        return page.data;
      }
      if (page && typeof page === 'object' && 'items' in page) {
        return page.items;
      }
      if (page && typeof page === 'object' && 'results' in page) {
        return page.results;
      }
      return [];
    });
  }, [infiniteData?.pages]);

  // Extract pagination info from the last page
  const paginationInfo = useMemo(() => {
    if (!infiniteData?.pages || infiniteData.pages.length === 0) {
      return { totalCount: 0, currentPage: 1, totalPages: 1 };
    }

    const lastPage = infiniteData.pages[infiniteData.pages.length - 1] as any;
    
    // Try to extract pagination info from different possible structures
    if (lastPage && typeof lastPage === 'object') {
      // Check for pagination object
      if (lastPage.pagination) {
        return {
          totalCount: lastPage.pagination.totalCount || 0,
          currentPage: lastPage.pagination.currentPage || 1,
          totalPages: lastPage.pagination.totalPages || 1
        };
      }
      
      // Check for direct pagination properties
      if (lastPage.totalCount !== undefined) {
        return {
          totalCount: lastPage.totalCount,
          currentPage: lastPage.currentPage || 1,
          totalPages: lastPage.totalPages || 1
        };
      }
    }

    return { totalCount: flattenedData.length, currentPage: 1, totalPages: 1 };
  }, [infiniteData?.pages, flattenedData.length]);

  return {
    data: flattenedData,
    isLoading,
    isError,
    error,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
    totalCount: paginationInfo.totalCount,
    currentPage: paginationInfo.currentPage,
    totalPages: paginationInfo.totalPages
  };
};

/**
 * Specialized hook for paginated API responses
 * Assumes the API returns data in a specific format with pagination metadata
 */
export const useInfinitePaginatedData = <TItem>(
  queryKey: (string | number | boolean | object)[],
  queryFn: (pageParam: number) => Promise<{
    data: TItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>,
  options: Partial<InfiniteDataOptions<any>> = {}
) => {
  return useInfiniteData({
    queryKey,
    queryFn,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage 
        ? lastPage.pagination.currentPage + 1 
        : undefined;
    },
    initialPageParam: 1,
    ...options
  });
};

/**
 * Hook for deduplicated infinite data
 * Automatically removes duplicate items based on a key field
 */
export const useInfiniteDeduplicatedData = <TItem>(
  queryKey: (string | number | boolean | object)[],
  queryFn: (pageParam: any) => Promise<TItem[]>,
  getNextPageParam: (lastPage: TItem[], allPages: TItem[][]) => any,
  initialPageParam: any,
  dedupeKey: keyof TItem = 'id' as keyof TItem,
  options: Partial<InfiniteDataOptions<TItem[]>> = {}
) => {
  const result = useInfiniteData({
    queryKey,
    queryFn,
    getNextPageParam,
    initialPageParam,
    ...options
  });

  const deduplicatedData = useMemo(() => {
    const seen = new Set();
    return result.data.filter((item: any) => {
      const key = item[dedupeKey];
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }, [result.data, dedupeKey]);

  return {
    ...result,
    data: deduplicatedData
  };
};
