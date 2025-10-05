import { useQuery } from '@tanstack/react-query';
import { getStudentProfile, type StudentProfile } from '../api/studentApi';

interface StudentDetails extends StudentProfile {
  qrCode?: string;
}

const fetchStudentDetails = async (_studentId: string): Promise<StudentDetails> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    // Try to get student profile from API
    const response = await getStudentProfile();
    const studentProfile = response.data;
    
    // Add QR code if not present
    const studentDetails: StudentDetails = {
      ...studentProfile,
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg=='
    };
    
    return studentDetails;
  } catch (error) {
    console.error('Error fetching student details:', error);
    throw new Error('Student not found');
  }
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
