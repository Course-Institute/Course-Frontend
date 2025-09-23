import { useQuery } from '@tanstack/react-query';

export interface Student {
  id: string;
  studentId: string;
  name: string;
  course: string;
  semester: string;
  center: string;
  feeStatus: 'Pending' | 'Approved' | 'Not Available';
  profileImage?: string;
  email?: string;
  phone?: string;
  enrollmentDate?: string;
}

export interface StudentListFilters {
  search?: string;
  course?: string;
  center?: string;
  year?: string;
}

export interface StudentListResponse {
  students: Student[];
  total: number;
  page: number;
  limit: number;
}

// Mock data for student list
const mockStudentListData: StudentListResponse = {
  students: [
    {
      id: '1',
      studentId: 'STU-2025-001',
      name: 'Rahul Sharma',
      course: 'B.Sc IT',
      semester: 'Sem 2',
      center: 'Delhi Center',
      feeStatus: 'Pending',
      email: 'rahul.sharma@email.com',
      phone: '+91 9876543210',
      enrollmentDate: '2024-01-15',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '2',
      studentId: 'STU-2025-002',
      name: 'Priya Verma',
      course: 'MBA',
      semester: 'Sem 1',
      center: 'Mumbai Center',
      feeStatus: 'Approved',
      email: 'priya.verma@email.com',
      phone: '+91 9876543211',
      enrollmentDate: '2024-01-20',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '3',
      studentId: 'STU-2025-003',
      name: 'Anil Kumar',
      course: 'B.Tech',
      semester: 'Sem 5',
      center: 'Jaipur Center',
      feeStatus: 'Pending',
      email: 'anil.kumar@email.com',
      phone: '+91 9876543212',
      enrollmentDate: '2023-08-10',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '4',
      studentId: 'STU-2025-004',
      name: 'Sneha Patel',
      course: 'MCA',
      semester: 'Sem 3',
      center: 'Ahmedabad Center',
      feeStatus: 'Approved',
      email: 'sneha.patel@email.com',
      phone: '+91 9876543213',
      enrollmentDate: '2023-12-05',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '5',
      studentId: 'STU-2025-005',
      name: 'Vikram Singh',
      course: 'BBA',
      semester: 'Sem 4',
      center: 'Pune Center',
      feeStatus: 'Not Available',
      email: 'vikram.singh@email.com',
      phone: '+91 9876543214',
      enrollmentDate: '2023-10-15',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '6',
      studentId: 'STU-2025-006',
      name: 'Meera Joshi',
      course: 'B.Sc IT',
      semester: 'Sem 1',
      center: 'Delhi Center',
      feeStatus: 'Approved',
      email: 'meera.joshi@email.com',
      phone: '+91 9876543215',
      enrollmentDate: '2024-02-01',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '7',
      studentId: 'STU-2025-007',
      name: 'Rajesh Gupta',
      course: 'MBA',
      semester: 'Sem 2',
      center: 'Mumbai Center',
      feeStatus: 'Pending',
      email: 'rajesh.gupta@email.com',
      phone: '+91 9876543216',
      enrollmentDate: '2023-11-20',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '8',
      studentId: 'STU-2025-008',
      name: 'Kavita Reddy',
      course: 'B.Tech',
      semester: 'Sem 6',
      center: 'Bangalore Center',
      feeStatus: 'Approved',
      email: 'kavita.reddy@email.com',
      phone: '+91 9876543217',
      enrollmentDate: '2023-07-15',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
    }
  ],
  total: 8,
  page: 1,
  limit: 10
};

const fetchStudentList = async (filters: StudentListFilters = {}): Promise<StudentListResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Apply filters to mock data
  let filteredStudents = [...mockStudentListData.students];
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredStudents = filteredStudents.filter(student => 
      student.name.toLowerCase().includes(searchTerm) ||
      student.studentId.toLowerCase().includes(searchTerm) ||
      student.course.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters.course) {
    filteredStudents = filteredStudents.filter(student => 
      student.course === filters.course
    );
  }
  
  if (filters.center) {
    filteredStudents = filteredStudents.filter(student => 
      student.center === filters.center
    );
  }
  
  return {
    ...mockStudentListData,
    students: filteredStudents,
    total: filteredStudents.length
  };
};

export const useStudentList = (filters: StudentListFilters = {}) => {
  return useQuery<StudentListResponse>({
    queryKey: ['studentList', filters],
    queryFn: () => fetchStudentList(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};
