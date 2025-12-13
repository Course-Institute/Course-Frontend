import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export interface CreateCourseData {
  name: string;
  code?: string;
  duration?: number;
  description?: string;
  coursesType?: string;
}

export interface UpdateCourseData extends CreateCourseData {
  _id: string;
}

export interface CreateSubjectData {
  name: string;
  courseId: string;
  semester?: number;
  year?: number;
  code?: string;
  credits?: number;
}

export interface UpdateSubjectData extends CreateSubjectData {
  _id: string;
}

export interface CourseResponse {
  status: boolean;
  message: string;
  data?: any;
}

// Create Course
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCourseData) => {
      const response = await axiosInstance.post<CourseResponse>('/api/course/createCourse', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

// Update Course
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateCourseData) => {
      const { _id, ...updateData } = data;
      const response = await axiosInstance.put<CourseResponse>(`/api/course/updateCourse/${_id}`, updateData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

// Delete Course
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await axiosInstance.delete<CourseResponse>(`/api/course/deleteCourse/${courseId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['courseSubjects'] });
    },
  });
};

// Create Subject
export const useCreateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSubjectData) => {
      const response = await axiosInstance.post<CourseResponse>('/api/course/createSubject', data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate queries for both semester and year
      if (variables.semester) {
        queryClient.invalidateQueries({ queryKey: ['courseSubjects', variables.courseId, variables.semester.toString()] });
      }
      if (variables.year) {
        queryClient.invalidateQueries({ queryKey: ['courseSubjects', variables.courseId, undefined, variables.year.toString()] });
      }
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};

// Update Subject
export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSubjectData) => {
      const { _id, ...updateData } = data;
      const response = await axiosInstance.put<CourseResponse>(`/api/course/updateSubject/${_id}`, updateData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate queries for both semester and year
      if (variables.semester) {
        queryClient.invalidateQueries({ queryKey: ['courseSubjects', variables.courseId, variables.semester.toString()] });
      }
      if (variables.year) {
        queryClient.invalidateQueries({ queryKey: ['courseSubjects', variables.courseId, undefined, variables.year.toString()] });
      }
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};

// Delete Subject
export const useDeleteSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subjectId }: { subjectId: string; courseId: string; semester?: number; year?: number }) => {
      const response = await axiosInstance.delete<CourseResponse>(`/api/course/deleteSubject/${subjectId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate queries for both semester and year
      if (variables.semester) {
        queryClient.invalidateQueries({ queryKey: ['courseSubjects', variables.courseId, variables.semester.toString()] });
      }
      if (variables.year) {
        queryClient.invalidateQueries({ queryKey: ['courseSubjects', variables.courseId, undefined, variables.year.toString()] });
      }
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};

