import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import React from 'react';
import axiosInstance from '../api/axiosInstance';
import { useIntersectionObserver } from './useIntersectionObserver';

export interface IdCardStudent {
  _id: string;
  registrationNo: string;
  candidateName: string;
  dateOfBirth: string;
  contactNumber: string;
  emailAddress: string;
  faculty: string;
  course: string;
  stream: string;
  year: string;
  session: string;
  idCardStatus: 'pending' | 'generated' | 'rejected';
  idCardGeneratedAt?: string;
  createdAt: string;
}

export interface IdCardStudentsPage {
  students: IdCardStudent[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface UseIdCardStudentsDataOptions {
  limit?: number;
  status?: 'pending' | 'generated' | 'rejected' | 'all';
  faculty?: string;
  course?: string;
  search?: string;
}

const fetchIdCardStudents = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: (string | UseIdCardStudentsDataOptions | undefined)[];
}): Promise<IdCardStudentsPage> => {
  const [_key, options] = queryKey;
  const { limit = 10, status, faculty, course, search } = options as UseIdCardStudentsDataOptions || {};

  const params = new URLSearchParams({
    page: pageParam.toString(),
    limit: limit.toString(),
  });

  if (status && status !== 'all') params.append('status', status);
  if (faculty) params.append('faculty', faculty);
  if (course) params.append('course', course);
  if (search) params.append('search', search);

  const { data } = await axiosInstance.get(`/api/id-card/students?${params.toString()}`);
  return data?.data;
};

const nextPageParam = (lastPage: IdCardStudentsPage): number | undefined => {
  const { pagination } = lastPage;
  return pagination.hasNextPage ? pagination.currentPage + 1 : undefined;
};

export const useIdCardStudentsData = (options: UseIdCardStudentsDataOptions = {}) => {
  const { limit = 10 } = options;
  const lastElementRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { data, error, isError, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['idCardStudents', options],
      queryFn: fetchIdCardStudents,
      getNextPageParam: nextPageParam,
      initialPageParam: 1,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      gcTime: 0,
    });

  const students = useMemo(() => {
    const allStudents = data?.pages.flatMap(page => page?.students ?? []) as IdCardStudent[];
    console.log('📊 ID Card Students data updated:', {
      totalPages: data?.pages.length,
      totalStudents: allStudents.length,
      lastPagePagination: data?.pages[data.pages.length - 1]?.pagination,
      hasNextPage
    });
    return allStudents;
  }, [data, hasNextPage]);

  const pagination = useMemo(() => {
    return data?.pages[data.pages.length - 1]?.pagination ?? null;
  }, [data]);

  useIntersectionObserver(
    tableContainerRef as React.RefObject<HTMLElement>,
    lastElementRef as React.RefObject<HTMLElement>,
    () => {
      console.log('🚀 ID Card Students intersection observer triggered!', {
        hasNextPage,
        isFetchingNextPage,
        studentsCount: students.length
      });
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
