import { useQuery } from '@tanstack/react-query';
import { type Student } from './useStudentList';

interface StudentDetails extends Student {
  enrollmentDate: string;
  dateOfBirth: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  qrCode?: string;
}

// Mock data for student details
const mockStudentDetails: { [key: string]: StudentDetails } = {
  '1': {
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
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    dateOfBirth: '1998-03-15',
    address: '123, Sector 15, Rohini, Delhi - 110085',
    guardianName: 'Rajesh Sharma',
    guardianPhone: '+91 9876543299',
    qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg=='
  },
  '2': {
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
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    dateOfBirth: '1995-06-12',
    address: '456, Andheri West, Mumbai - 400058',
    guardianName: 'Rajesh Verma',
    guardianPhone: '+91 9876543210',
    qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg=='
  },
  '3': {
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
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    dateOfBirth: '1997-11-08',
    address: '789, C-Scheme, Jaipur - 302001',
    guardianName: 'Suresh Kumar',
    guardianPhone: '+91 9876543211',
    qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg=='
  },
  '4': {
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
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    dateOfBirth: '1996-09-22',
    address: '321, Satellite, Ahmedabad - 380015',
    guardianName: 'Manoj Patel',
    guardianPhone: '+91 9876543212',
    qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg=='
  },
  '5': {
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
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    dateOfBirth: '1998-01-30',
    address: '654, Koregaon Park, Pune - 411001',
    guardianName: 'Amar Singh',
    guardianPhone: '+91 9876543213',
    qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg=='
  }
};

const fetchStudentDetails = async (studentId: string): Promise<StudentDetails> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const studentDetails = mockStudentDetails[studentId];
  if (!studentDetails) {
    throw new Error('Student not found');
  }
  
  return studentDetails;
};

export const useStudentDetails = (studentId: string | null) => {
  return useQuery<StudentDetails>({
    queryKey: ['studentDetails', studentId],
    queryFn: () => fetchStudentDetails(studentId!),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
