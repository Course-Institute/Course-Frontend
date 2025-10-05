import { useInfiniteQuery } from '@tanstack/react-query';
import { getStudentsData } from '../api/studentsApi';
import { createInfiniteQueryKey } from '../utils/infiniteScrollUtils';

export interface StudentListFilters {
  search?: string;
  course?: string;
  faculty?: string;
  stream?: string;
  year?: string;
  session?: string;
}

/**
 * Specialized hook for infinite students data
 * Uses the global infinite scroll infrastructure
 */
export const useInfiniteStudents = (
  filters: StudentListFilters = {},
  limit: number = 10
) => {
  const queryKey = createInfiniteQueryKey('students', filters);
  
  const queryFn = async ({ pageParam }: { pageParam: number }) => {
    console.log('Fetching students data for page:', pageParam, 'limit:', limit);
    // For now, we'll use the existing API and apply filters client-side
    // In a real implementation, you'd want to pass filters to the API
    const response = await getStudentsData(pageParam, limit);
    console.log('API response:', response);
    
    // Apply client-side filters
    let filteredStudents = response.data.students;
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredStudents = filteredStudents.filter(student => 
        student.candidateName.toLowerCase().includes(searchTerm) ||
        student.registrationNo.toLowerCase().includes(searchTerm) ||
        student.course.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.course) {
      filteredStudents = filteredStudents.filter(student => 
        student.course === filters.course
      );
    }
    
    if (filters.faculty) {
      filteredStudents = filteredStudents.filter(student => 
        student.faculty === filters.faculty
      );
    }
    
    if (filters.stream) {
      filteredStudents = filteredStudents.filter(student => 
        student.stream === filters.stream
      );
    }
    
    if (filters.year) {
      filteredStudents = filteredStudents.filter(student => 
        student.year === filters.year
      );
    }
    
    if (filters.session) {
      filteredStudents = filteredStudents.filter(student => 
        student.session === filters.session
      );
    }
    
    // Return in the format expected by useInfinitePaginatedData
    console.log('Query function result:', {
      dataLength: filteredStudents.length,
      pagination: response.data.pagination,
      hasNextPage: response.data.pagination.hasNextPage,
      totalPages: response.data.pagination.totalPages,
      currentPage: response.data.pagination.currentPage
    });
    
    return {
      data: filteredStudents,
      pagination: response.data.pagination
    };
  };

  const result = useInfiniteQuery({
    queryKey,
    queryFn,
    getNextPageParam: (lastPage) => {
      console.log('getNextPageParam called with:', {
        lastPage,
        pagination: lastPage.pagination,
        hasNextPage: lastPage.pagination.hasNextPage,
        currentPage: lastPage.pagination.currentPage
      });
      
      const nextPage = lastPage.pagination.hasNextPage 
        ? lastPage.pagination.currentPage + 1 
        : undefined;
        
      console.log('getNextPageParam returning:', nextPage);
      return nextPage;
    },
    initialPageParam: 1,
    enabled: true,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  });

  // Flatten the data manually
  const flattenedData = result.data?.pages?.flatMap(page => page.data) || [];

  console.log('Direct useInfiniteQuery result:', {
    data: result.data,
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
    isLoading: result.isLoading,
    flattenedData: flattenedData
  });

  return {
    data: flattenedData,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
    fetchNextPage: result.fetchNextPage,
    refetch: result.refetch,
    isRefetching: result.isRefetching
  };
};
