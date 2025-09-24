import { useQuery } from '@tanstack/react-query';

export interface ReportStudent {
  id: string;
  studentId: string;
  name: string;
  course: string;
  semester: string;
  year: number;
  center: string;
  paymentStatus: string;
  resultStatus: string;
}

export interface ReportFilters {
  fromDate?: string;
  toDate?: string;
  semester?: string;
  center?: string;
  search?: string;
}

export interface ReportsDataResponse {
  students: ReportStudent[];
  total: number;
  page: number;
  limit: number;
}

// Mock data for reports
const mockReportStudents: ReportStudent[] = [
  {
    id: '1',
    studentId: 'STU-1001',
    name: 'Ramesh Kumar',
    course: 'BCA',
    semester: 'Sem 2',
    year: 2025,
    center: 'Delhi Center',
    paymentStatus: '₹33,000',
    resultStatus: 'Result Ready',
  },
  {
    id: '2',
    studentId: 'STU-1002',
    name: 'Priya Sharma',
    course: 'MCA',
    semester: 'Sem 1',
    year: 2025,
    center: 'Mumbai Center',
    paymentStatus: '₹25,000',
    resultStatus: 'Pending',
  },
  {
    id: '3',
    studentId: 'STU-1003',
    name: 'Ankit Verma',
    course: 'MBA',
    semester: 'Sem 3',
    year: 2024,
    center: 'Jaipur Center',
    paymentStatus: '₹0',
    resultStatus: 'Not Available',
  },
  {
    id: '4',
    studentId: 'STU-1004',
    name: 'Neha Singh',
    course: 'BBA',
    semester: 'Sem 4',
    year: 2025,
    center: 'Kolkata Center',
    paymentStatus: '₹15,000',
    resultStatus: 'Result Ready',
  },
  {
    id: '5',
    studentId: 'STU-1005',
    name: 'Vikram Singh',
    course: 'B.Tech',
    semester: 'Sem 6',
    year: 2024,
    center: 'Bangalore Center',
    paymentStatus: '₹45,000',
    resultStatus: 'Result Ready',
  },
  {
    id: '6',
    studentId: 'STU-1006',
    name: 'Sneha Patel',
    course: 'B.Sc IT',
    semester: 'Sem 3',
    year: 2025,
    center: 'Chennai Center',
    paymentStatus: '₹20,000',
    resultStatus: 'Pending',
  },
  {
    id: '7',
    studentId: 'STU-1007',
    name: 'Rajesh Gupta',
    course: 'MBA',
    semester: 'Sem 2',
    year: 2025,
    center: 'Pune Center',
    paymentStatus: '₹30,000',
    resultStatus: 'Result Ready',
  },
  {
    id: '8',
    studentId: 'STU-1008',
    name: 'Kavita Reddy',
    course: 'MCA',
    semester: 'Sem 4',
    year: 2025,
    center: 'Hyderabad Center',
    paymentStatus: '₹35,000',
    resultStatus: 'Result Ready',
  }
];

const fetchReportsData = async (filters: ReportFilters = {}): Promise<ReportsDataResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Apply filters to mock data
  let filteredStudents = [...mockReportStudents];
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredStudents = filteredStudents.filter(student => 
      student.name.toLowerCase().includes(searchTerm) ||
      student.studentId.toLowerCase().includes(searchTerm) ||
      student.course.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters.semester) {
    filteredStudents = filteredStudents.filter(student => 
      student.semester === filters.semester
    );
  }
  
  if (filters.center) {
    filteredStudents = filteredStudents.filter(student => 
      student.center === filters.center
    );
  }
  
  if (filters.fromDate && filters.toDate) {
    // Filter by year range
    const fromYear = parseInt(filters.fromDate);
    const toYear = parseInt(filters.toDate);
    filteredStudents = filteredStudents.filter(student => 
      student.year >= fromYear && student.year <= toYear
    );
  }
  
  return {
    students: filteredStudents,
    total: filteredStudents.length,
    page: 1,
    limit: 10
  };
};

export const useReportsData = (filters: ReportFilters = {}) => {
  return useQuery<ReportsDataResponse>({
    queryKey: ['reportsData', filters],
    queryFn: () => fetchReportsData(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};
