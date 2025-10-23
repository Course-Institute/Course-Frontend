import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { addStudent as addStudentAPI, type AddStudentData, type AddStudentResponse } from '../api/studentsApi';

export type { AddStudentData, AddStudentResponse };

export const useAddStudent = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: addStudentAPI,
    onSuccess: (data) => {
      // Invalidate and refetch students data
      queryClient.invalidateQueries({ queryKey: ['students'] });
      console.log('Student added successfully:', data);
      // Navigate to manage students page on success
      navigate('/admin/students');
    },
    onError: (error: Error) => {
      console.error('Error adding student:', error);
      // Stay on the form on error
    },
  });

  const addStudentData = async (formData: FormData) => {
    try {
      await mutation.mutateAsync(formData);
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  };

  return {
    addStudent: addStudentData,
    isSubmitting: mutation.isPending,
    error: mutation.error?.message,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};
