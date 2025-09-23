import { useQuery } from '@tanstack/react-query';
import { type StudentsResponse } from '../api/studentsApi';

interface UseStudentsDataOptions {
  page?: number;
  limit?: number;
}

// Mock data for students
const mockStudentsData: StudentsResponse = {
  data: [
    {
      id: '1',
      studentId: 'STU-2025-001',
      name: 'Rahul Sharma',
      course: 'B.Sc IT',
      semester: 'Sem 2',
      admissionYear: 2025,
      center: 'Delhi Center',
      status: 'Approved',
      feeStatus: 'Full Payment',
      email: 'rahul.sharma@email.com',
      phone: '+91 9876543210',
      address: 'Delhi, India'
    },
    {
      id: '2',
      studentId: 'STU-2025-002',
      name: 'Priya Verma',
      course: 'MBA',
      semester: 'Sem 1',
      admissionYear: 2025,
      center: 'Mumbai Center',
      status: 'Pending',
      feeStatus: 'Partial',
      email: 'priya.verma@email.com',
      phone: '+91 9876543211',
      address: 'Mumbai, India'
    },
    {
      id: '3',
      studentId: 'STU-2025-003',
      name: 'Anil Kumar',
      course: 'B.Tech',
      semester: 'Sem 5',
      admissionYear: 2024,
      center: 'Jaipur Center',
      status: 'ID Generated',
      feeStatus: 'Full Payment',
      email: 'anil.kumar@email.com',
      phone: '+91 9876543212',
      address: 'Jaipur, India'
    },
    {
      id: '4',
      studentId: 'STU-2025-004',
      name: 'Sneha Patel',
      course: 'MCA',
      semester: 'Sem 3',
      admissionYear: 2025,
      center: 'Ahmedabad Center',
      status: 'Approved',
      feeStatus: 'Full Payment',
      email: 'sneha.patel@email.com',
      phone: '+91 9876543213',
      address: 'Ahmedabad, India'
    },
    {
      id: '5',
      studentId: 'STU-2025-005',
      name: 'Vikram Singh',
      course: 'BBA',
      semester: 'Sem 4',
      admissionYear: 2024,
      center: 'Pune Center',
      status: 'Pending',
      feeStatus: 'Pending',
      email: 'vikram.singh@email.com',
      phone: '+91 9876543214',
      address: 'Pune, India'
    }
  ],
  total: 5,
  page: 1,
  limit: 10
};

export const useStudentsData = (options: UseStudentsDataOptions = {}) => {
  const { page = 1, limit = 10 } = options;

  return useQuery<StudentsResponse, Error>({
    queryKey: ['students', page, limit],
    queryFn: () => Promise.resolve(mockStudentsData),
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    refetchOnWindowFocus: false, // Do not refetch on window focus
    retry: 2, // Retry failed requests 2 times
  });
};
