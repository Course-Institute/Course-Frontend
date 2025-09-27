import { useQuery } from '@tanstack/react-query';
import { getStudentsData, type Student } from '../api/studentsApi';

// Re-export Student type for use in other components
export type { Student };

export interface StudentListFilters {
  search?: string;
  course?: string;
  faculty?: string;
  stream?: string;
  year?: string;
}

export interface StudentListResponse {
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

const fetchStudentList = async (filters: StudentListFilters = {}): Promise<StudentListResponse> => {
  try {
    // Call the real API
    const response = await getStudentsData(1, 10);
    
    // Apply client-side filters to the API response
    let filteredStudents = [...response.data.students];
    
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
    
    return {
      students: filteredStudents,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error('Error fetching student list:', error);
    // Return empty data on error
    return {
      students: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
  }
};

export const useStudentList = (filters: StudentListFilters = {}) => {
  return useQuery<StudentListResponse>({
    queryKey: ['studentList', filters],
    queryFn: () => fetchStudentList(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};
