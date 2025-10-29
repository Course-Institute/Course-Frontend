import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import React from 'react';
import { getStudentsData, type Student, type StudentsFilters } from '../api/studentsApi';
import { useIntersectionObserver } from './useIntersectionObserver';

interface UseStudentsDataOptions {
  limit?: number;
  filters?: StudentsFilters;
}

interface StudentsPage {
  students: Student[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const fetchStudents = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: (string | number | StudentsFilters | undefined)[];
}): Promise<StudentsPage> => {
  const [_key, limit, filters] = queryKey;
  const pageSize = typeof limit === 'number' ? limit : 10;
  const filterParams = filters as StudentsFilters | undefined;

  try {
    const response = await getStudentsData(pageParam, pageSize, filterParams);
    return {
      students: response.data.students,
      pagination: {
        ...response.data.pagination,
        currentPage: pageParam,
      },
    };
  } catch (err) {
    throw err;
  }
};

const nextPageParam = (lastPage: StudentsPage): number | undefined => {
  const { currentPage = 1, totalPages } = lastPage.pagination;
  return currentPage < totalPages ? currentPage + 1 : undefined;
};

export const useStudentsData = (options: UseStudentsDataOptions = {}) => {
  const { limit = 10, filters } = options;
  const lastElementRef = useRef<HTMLTableRowElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { data, error, isError, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['students', limit, filters],
      queryFn: fetchStudents,
      getNextPageParam: nextPageParam,
      initialPageParam: 1,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      gcTime: 0,
    });

  const students = useMemo(() => {
    const allStudents = data?.pages.flatMap(page => page?.students ?? []) as Student[];
    return allStudents;
  }, [data, hasNextPage]);

  const pagination = useMemo(() => {
    return data?.pages[data.pages.length - 1]?.pagination ?? null;
  }, [data]);

  // Reset scroll position when filters change (important for infinite scroll)
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);
  
  // Reset container scroll when filters change
  React.useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }
  }, [filtersKey]);

  // Only set up intersection observer if we have students and container is ready
  useIntersectionObserver(
    tableContainerRef as React.RefObject<HTMLElement>,
    lastElementRef as React.RefObject<HTMLElement>,
    () => {
      // Only fetch if we have next page and not already fetching
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    hasNextPage ?? false,
    isFetchingNextPage,
    'entering',
    '50px', // Trigger when 50px away from bottom (closer trigger point)
    0.1,
    filtersKey // Pass filtersKey as resetKey to reset observer when filters change
  );

  return {
    students,
    pagination,
    lastElementRef,
    tableContainerRef,
    error,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  };
};
