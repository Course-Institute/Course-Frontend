import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import React from 'react';
import { getStudentsData, type Student } from '../api/studentsApi';
import { useIntersectionObserver } from './useIntersectionObserver';

interface UseStudentsDataOptions {
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

const fetchStudents = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: (string | number | undefined)[];
}): Promise<StudentsPage> => {
  const [_key, limit] = queryKey;
  const pageSize = typeof limit === 'number' ? limit : 10;

  try {
    const response = await getStudentsData(pageParam, pageSize);
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
  const { limit = 10 } = options;
  const lastElementRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { data, error, isError, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['students', limit],
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

  useIntersectionObserver(
    tableContainerRef as React.RefObject<HTMLElement>,
    lastElementRef as React.RefObject<HTMLElement>,
    () => {
      fetchNextPage();
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
  };
};
