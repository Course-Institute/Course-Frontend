import axiosInstance from './axiosInstance';

export interface Student {
  id: string;
  studentId: string;
  name: string;
  course: string;
  semester: string;
  admissionYear: number;
  center: string;
  status: 'Approved' | 'Pending' | 'ID Generated';
  feeStatus: 'Full Payment' | 'Partial' | 'Pending';
  email?: string;
  phone?: string;
  address?: string;
}

export interface StudentsResponse {
  data: Student[];
  total: number;
  page: number;
  limit: number;
}

export interface AddStudentData {
  candidateName: string;
  motherName: string;
  fatherName: string;
  dateOfBirth: string;
  gender: string;
  adharCardNo: string;
  category: string;
  adharCardFront?: File;
  adharCardBack?: File;
  photo?: File;
  signature?: File;
  employerName?: string;
  isEmployed: string;
  designation?: string;
  contactNumber: string;
  alternateNumber: string;
  emailAddress: string;
  permanentAddress: string;
  currentAddress: string;
  state: string;
  city: string;
  country: string;
  nationality: string;
  pincode: string;
  courseType: string;
  course: string;
  faculty: string;
  stream: string;
  year: string;
  session: string;
  monthSession?: string;
  courseFee?: string;
  hostelFacility?: string;
  duration?: string;
}

export interface AddStudentResponse {
  success: boolean;
  message: string;
  studentId?: string;
}

// Real API function to fetch students data
export const getStudentsData = async (page: number = 1, limit: number = 10): Promise<StudentsResponse> => {
  try {
    const response = await axiosInstance.get(`/students?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Failed to fetch students data. Please try again.';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

// Real API function to add a student
export const addStudent = async (formData: FormData): Promise<AddStudentResponse> => {
  try {
    const response = await axiosInstance.post('/api/addStudent', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Failed to add student. Please try again.';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};
