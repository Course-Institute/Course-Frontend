import { useQuery } from '@tanstack/react-query';

export interface Result {
  id: string;
  studentId: string;
  studentName: string;
  course: string;
  semester: string;
  center: string;
  feeStatus: 'Published' | 'Upload' | 'Partial' | 'Locked';
  subjects?: Subject[];
  totalMarks?: number;
  percentage?: number;
}

export interface Subject {
  name: string;
  marks: number;
  outOf: number;
  percentage: number;
}

export interface ResultFilters {
  search?: string;
  course?: string;
  semester?: string;
  center?: string;
  status?: string;
  feeStatus?: string;
}

export interface ResultListResponse {
  results: Result[];
  total: number;
  page: number;
  limit: number;
}

// Mock data for results
const mockResults: Result[] = [
  {
    id: '1',
    studentId: 'STU-2025-001',
    studentName: 'Rahul Sharma',
    course: 'B.Sc IT',
    semester: 'Sem 2',
    center: 'Delhi Center',
    feeStatus: 'Published',
    subjects: [
      { name: 'English', marks: 80, outOf: 100, percentage: 80.0 },
      { name: 'Mathematics', marks: 72, outOf: 100, percentage: 72.0 },
      { name: 'Physics', marks: 83, outOf: 100, percentage: 83.0 },
    ],
    totalMarks: 235,
    percentage: 78.33,
  },
  {
    id: '2',
    studentId: 'STU-2025-002',
    studentName: 'Priya Verma',
    course: 'MBA',
    semester: 'Sem 1',
    center: 'Mumbai Center',
    feeStatus: 'Upload',
  },
  {
    id: '3',
    studentId: 'STU-2025-003',
    studentName: 'Anil Kumar',
    course: 'B.Tech',
    semester: 'Sem 5',
    center: 'Jaipur Center',
    feeStatus: 'Partial',
  },
  {
    id: '4',
    studentId: 'STU-2025-004',
    studentName: 'Neha Singh',
    course: 'BBA',
    semester: 'Sem 3',
    center: 'Kolkata Center',
    feeStatus: 'Published',
    subjects: [
      { name: 'Business Studies', marks: 85, outOf: 100, percentage: 85.0 },
      { name: 'Economics', marks: 78, outOf: 100, percentage: 78.0 },
      { name: 'Accountancy', marks: 82, outOf: 100, percentage: 82.0 },
    ],
    totalMarks: 245,
    percentage: 81.67,
  },
  {
    id: '5',
    studentId: 'STU-2025-005',
    studentName: 'Vikram Singh',
    course: 'MCA',
    semester: 'Sem 3',
    center: 'Pune Center',
    feeStatus: 'Locked',
  },
  {
    id: '6',
    studentId: 'STU-2025-006',
    studentName: 'Sneha Patel',
    course: 'B.Sc IT',
    semester: 'Sem 4',
    center: 'Ahmedabad Center',
    feeStatus: 'Published',
    subjects: [
      { name: 'Programming', marks: 90, outOf: 100, percentage: 90.0 },
      { name: 'Database', marks: 85, outOf: 100, percentage: 85.0 },
      { name: 'Networking', marks: 88, outOf: 100, percentage: 88.0 },
    ],
    totalMarks: 263,
    percentage: 87.67,
  },
  {
    id: '7',
    studentId: 'STU-2025-007',
    studentName: 'Rajesh Gupta',
    course: 'MBA',
    semester: 'Sem 2',
    center: 'Delhi Center',
    feeStatus: 'Upload',
  },
  {
    id: '8',
    studentId: 'STU-2025-008',
    studentName: 'Kavita Reddy',
    course: 'B.Tech',
    semester: 'Sem 6',
    center: 'Bangalore Center',
    feeStatus: 'Published',
    subjects: [
      { name: 'Engineering Mathematics', marks: 92, outOf: 100, percentage: 92.0 },
      { name: 'Data Structures', marks: 88, outOf: 100, percentage: 88.0 },
      { name: 'Algorithms', marks: 90, outOf: 100, percentage: 90.0 },
    ],
    totalMarks: 270,
    percentage: 90.0,
  }
];

const fetchResultList = async (filters: ResultFilters = {}): Promise<ResultListResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Apply filters to mock data
  let filteredResults = [...mockResults];
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredResults = filteredResults.filter(result => 
      result.studentName.toLowerCase().includes(searchTerm) ||
      result.studentId.toLowerCase().includes(searchTerm) ||
      result.course.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters.course) {
    filteredResults = filteredResults.filter(result => 
      result.course === filters.course
    );
  }
  
  if (filters.semester) {
    filteredResults = filteredResults.filter(result => 
      result.semester === filters.semester
    );
  }
  
  if (filters.center) {
    filteredResults = filteredResults.filter(result => 
      result.center === filters.center
    );
  }
  
  if (filters.status) {
    filteredResults = filteredResults.filter(result => 
      result.feeStatus === filters.status
    );
  }
  
  if (filters.feeStatus) {
    filteredResults = filteredResults.filter(result => 
      result.feeStatus === filters.feeStatus
    );
  }
  
  return {
    results: filteredResults,
    total: filteredResults.length,
    page: 1,
    limit: 10
  };
};

export const useResultList = (filters: ResultFilters = {}) => {
  return useQuery<ResultListResponse>({
    queryKey: ['resultList', filters],
    queryFn: () => fetchResultList(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};
