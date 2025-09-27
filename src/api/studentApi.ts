import axiosInstance from './axiosInstance';

export interface StudentProfile {
  id: string;
  studentRefNo: string;
  studentName: string;
  fathersName: string;
  mothersName: string;
  dateOfBirth: string;
  enrollmentNo: string;
  rollNo?: string;
  session: string;
  mobileNo: string;
  email?: string;
  course: string;
  courseCode?: string;
  faculty?: string;
  stream?: string;
  year?: string;
  semester?: string;
  center?: string;
  photo?: string;
  address?: string;
  status?: string;
  admissionDate?: string;
}

export interface StudentProfileResponse {
  success: boolean;
  data: StudentProfile;
  message?: string;
}

// API function to fetch student profile
export const getStudentProfile = async (registrationNumber?: string): Promise<StudentProfileResponse> => {
  try {
    const regNumber = registrationNumber || localStorage.getItem('studentRegistrationNumber');
    const url = regNumber ? `/student/profile?registrationNo=${regNumber}` : '/student/profile';
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Failed to fetch student profile. Please try again.';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

// API function to download student ID card
export const downloadStudentIdCard = async (registrationNumber?: string): Promise<Blob> => {
  try {
    const regNumber = registrationNumber || localStorage.getItem('studentRegistrationNumber');
    const url = regNumber ? `/student/id-card?registrationNo=${regNumber}` : '/student/id-card';
    const response = await axiosInstance.get(url, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Failed to download ID card. Please try again.';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};
