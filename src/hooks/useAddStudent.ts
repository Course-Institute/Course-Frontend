import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addStudent as addStudentAPI, type AddStudentData, type AddStudentResponse } from '../api/studentsApi';

export type { AddStudentData, AddStudentResponse };


export const useAddStudent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addStudentAPI,
    onMutate: () => {
      setIsSubmitting(true);
      setError(null);
    },
    onSuccess: (data) => {
      setIsSubmitting(false);
      // Invalidate and refetch students data
      queryClient.invalidateQueries({ queryKey: ['students'] });
      console.log('Student added successfully:', data);
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      setError(error.message);
    },
  });

  const addStudentData = async (data: AddStudentData) => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value.toString());
        }
      });

      await mutation.mutateAsync(data);
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  };

  return {
    addStudent: addStudentData,
    isSubmitting: mutation.isPending || isSubmitting,
    error: mutation.error?.message || error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};
