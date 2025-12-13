import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export interface CourseSubject {
  _id: string;
  name: string;
}

export interface CourseSubjectsResponse {
  status: boolean;
  message: string;
  data: CourseSubject[];
}

const fetchCourseSubjects = async (courseId: string, semester: string, year: string): Promise<string[]> => {
  if (!courseId || (!semester && !year)) {
    return [];
  }

  // Extract courseId if it's an object (handle case where courseId might be populated)
  let actualCourseId: string;
  if (typeof courseId === 'string') {
    actualCourseId = courseId;
  } else if (courseId && typeof courseId === 'object' && '_id' in courseId) {
    actualCourseId = (courseId as any)._id;
  } else {
    return [];
  }

  const response = await axiosInstance.get<CourseSubjectsResponse>(
    `/api/course/getSubjectsByCourseAndSemester`,
    {
      params: {
        courseId: actualCourseId, // Ensure we send only the ID string
        semester,
        year,
      },
    }
  );
  
  // Return array of subject names
  return response.data.data?.map((subject) => subject.name) || [];
};

export const useCourseSubjects = (
  courseId: string | undefined,
  semester?: string | undefined,
  year?: string | undefined
) => {
  // Normalize courseId to always be a string (extract _id if it's an object)
  const normalizedCourseId = courseId 
    ? (typeof courseId === 'string' 
        ? courseId 
        : (courseId as any)?._id || String(courseId))
    : undefined;

  const {
    data: subjects = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['courseSubjects', normalizedCourseId, semester, year],
    queryFn: () => fetchCourseSubjects(normalizedCourseId || '', semester || '', year || ''),
    enabled: !!normalizedCourseId && (!!semester || !!year), // Only fetch when course and one term is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    subjects,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
};

