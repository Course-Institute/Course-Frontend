import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import React from 'react';
import axiosInstance from '../api/axiosInstance';
import { useIntersectionObserver } from './useIntersectionObserver';

export interface ReportStudent {
  _id: string;
  registrationNo: string;
  candidateName: string;
  motherName: string;
  fatherName: string;
  gender: string;
  dateOfBirth: string;
  contactNumber: string;
  emailAddress: string;
  faculty: string;
  course: string;
  stream: string;
  year: string;
  session: string;
  courseFee: string;
  paymentStatus: 'pending' | 'partial' | 'completed' | 'overdue';
  resultsStatus: 'pending' | 'uploaded' | 'published' | 'not_available';
  lastPaymentDate?: string;
  totalPaid?: string;
  remainingAmount?: string;
  examDate?: string;
  resultDate?: string;
  grade?: string;
  percentage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportsPage {
  students: ReportStudent[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface UseReportsDataOptions {
  limit?: number;
  paymentStatus?: 'all' | 'pending' | 'partial' | 'completed' | 'overdue';
  resultsStatus?: 'all' | 'pending' | 'uploaded' | 'published' | 'not_available';
  faculty?: string;
  course?: string;
  year?: string;
  session?: string;
  search?: string;
}

const fetchReports = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: (string | UseReportsDataOptions | undefined)[];
}): Promise<ReportsPage> => {
  const [_key, options] = queryKey;
  const { 
    limit = 10, 
    paymentStatus, 
    resultsStatus, 
    faculty, 
    course, 
    year, 
    session, 
    search 
  } = options as UseReportsDataOptions || {};

  const params = new URLSearchParams({
    page: pageParam.toString(),
    limit: limit.toString(),
  });

  if (paymentStatus && paymentStatus !== 'all') params.append('paymentStatus', paymentStatus);
  if (resultsStatus && resultsStatus !== 'all') params.append('resultsStatus', resultsStatus);
  if (faculty) params.append('faculty', faculty);
  if (course) params.append('course', course);
  if (year) params.append('year', year);
  if (session) params.append('session', session);
  if (search) params.append('search', search);

  const { data } = await axiosInstance.get(`/api/reports/students?${params.toString()}`);
  return data?.data;
};

const nextPageParam = (lastPage: ReportsPage): number | undefined => {
  const { pagination } = lastPage;
  return pagination.hasNextPage ? pagination.currentPage + 1 : undefined;
};

export const useReportsData = (options: UseReportsDataOptions = {}) => {
  const { limit = 10 } = options;
  const lastElementRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { data, error, isError, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['reports', { limit, ...options }],
      queryFn: fetchReports,
      getNextPageParam: nextPageParam,
      initialPageParam: 1,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      gcTime: 0,
    });

  const students = useMemo(() => {
    const allStudents = data?.pages.flatMap(page => page?.students ?? []) as ReportStudent[];
    console.log('📊 Reports data updated:', {
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
      console.log('🚀 Reports intersection observer triggered!', {
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