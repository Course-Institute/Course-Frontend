import { useQuery } from '@tanstack/react-query';
import { getStudentProfile, downloadStudentIdCard, type StudentProfile } from '../api/studentApi';

export const useStudentProfile = () => {
  return useQuery<StudentProfile, Error>({
    queryKey: ['studentProfile'],
    queryFn: async () => {
      const response = await getStudentProfile();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useDownloadIdCard = () => {
  const downloadIdCard = async () => {
    try {
      const blob = await downloadStudentIdCard();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'student-id-card.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error downloading ID card:', error);
      throw error;
    }
  };

  return { downloadIdCard };
};
