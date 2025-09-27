import { useQuery } from '@tanstack/react-query';
import { type Student } from './useStudentList';

interface StudentDetails extends Student {
  dateOfBirth: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  qrCode?: string;
}

// Mock data for student details
const mockStudentDetails: { [key: string]: StudentDetails } = {
  '68d798840848f9716a8bf99e': {
    _id: '68d798840848f9716a8bf99e',
    registrationNo: '797649784565',
    candidateName: 'Rahul Sharma',
    contactNumber: '8769564736',
    emailAddress: 'rahul.sharma@email.com',
    faculty: 'Engineering',
    course: 'B.Tech',
    stream: 'Electronics',
    year: '2025',
    session: '2025',
    createdAt: '2025-09-27T07:55:48.233Z',
    dateOfBirth: '1998-03-15',
    address: '123, Sector 15, Rohini, Delhi - 110085',
    guardianName: 'Rajesh Sharma',
    guardianPhone: '+91 9876543299',
    qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg=='
  },
  '68d7981c0848f9716a8bf99a': {
    _id: '68d7981c0848f9716a8bf99a',
    registrationNo: '593583273353',
    candidateName: 'Priya Verma',
    contactNumber: '8769564737',
    emailAddress: 'priya.verma@email.com',
    faculty: 'Management',
    course: 'MBA',
    stream: 'Business Administration',
    year: '2025',
    session: '2025',
    createdAt: '2025-09-27T07:54:04.598Z',
    dateOfBirth: '1995-06-12',
    address: '456, Andheri West, Mumbai - 400058',
    guardianName: 'Rajesh Verma',
    guardianPhone: '+91 9876543210',
    qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg=='
  },
  '68d798190848f9716a8bf996': {
    _id: '68d798190848f9716a8bf996',
    registrationNo: '480632293522',
    candidateName: 'Anil Kumar',
    contactNumber: '8769564738',
    emailAddress: 'anil.kumar@email.com',
    faculty: 'Engineering',
    course: 'B.Tech',
    stream: 'Computer Science',
    year: '2025',
    session: '2025',
    createdAt: '2025-09-27T07:54:01.223Z',
    dateOfBirth: '1997-11-08',
    address: '789, C-Scheme, Jaipur - 302001',
    guardianName: 'Suresh Kumar',
    guardianPhone: '+91 9876543211',
    qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg=='
  },
  '68d798160848f9716a8bf992': {
    _id: '68d798160848f9716a8bf992',
    registrationNo: '367681213691',
    candidateName: 'Sneha Patel',
    contactNumber: '8769564739',
    emailAddress: 'sneha.patel@email.com',
    faculty: 'Science',
    course: 'MCA',
    stream: 'Information Technology',
    year: '2025',
    session: '2025',
    createdAt: '2025-09-27T07:53:58.123Z',
    dateOfBirth: '1996-09-22',
    address: '321, Satellite, Ahmedabad - 380015',
    guardianName: 'Manoj Patel',
    guardianPhone: '+91 9876543212',
    qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg=='
  },
  '68d798130848f9716a8bf98e': {
    _id: '68d798130848f9716a8bf98e',
    registrationNo: '254730133860',
    candidateName: 'Vikram Singh',
    contactNumber: '8769564740',
    emailAddress: 'vikram.singh@email.com',
    faculty: 'Management',
    course: 'BBA',
    stream: 'Business Administration',
    year: '2025',
    session: '2025',
    createdAt: '2025-09-27T07:53:55.456Z',
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
