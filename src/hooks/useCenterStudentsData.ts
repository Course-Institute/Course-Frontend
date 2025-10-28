import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import React from 'react';
import { getCenterStudentsData, type Student } from '../api/studentsApi';
import { useIntersectionObserver } from './useIntersectionObserver';

interface UseCenterStudentsDataOptions {
  centerId: string;
  limit?: number;
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

const fetchCenterStudents = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: (string | number | undefined)[];
}): Promise<StudentsPage> => {
  const [_key, centerId, limit] = queryKey;
  const pageSize = typeof limit === 'number' ? limit : 10;

  try {
    const response = await getCenterStudentsData(centerId as string, pageParam, pageSize);
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

export const useCenterStudentsData = (options: UseCenterStudentsDataOptions) => {
  const { centerId, limit = 10 } = options;
  const lastElementRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { data, error, isError, isFetchingNextPage, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['centerStudents', centerId, limit],
      queryFn: fetchCenterStudents,
      getNextPageParam: nextPageParam,
      initialPageParam: 1,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      gcTime: 0,
      enabled: !!centerId, // Only run query when centerId is available
    });

  const students = useMemo(() => {
    if (!data?.pages) return [];
    const allStudents = data.pages.flatMap(page => page?.students ?? []) as Student[];
    return allStudents;
  }, [data, hasNextPage]);

  const pagination = useMemo(() => {
    if (!data?.pages || data.pages.length === 0) return null;
    return data.pages[data.pages.length - 1]?.pagination ?? null;
  }, [data]);

  useIntersectionObserver(
    tableContainerRef as React.RefObject<HTMLElement>,
    lastElementRef as React.RefObject<HTMLElement>,
    () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    hasNextPage ?? false,
    isFetchingNextPage
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
    isLoading,
  };
};
