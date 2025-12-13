import axiosInstance from './axiosInstance';

export interface Student {
  _id: string;
  registrationNo: string;
  candidateName: string;
  dateOfBirth?: string;
  contactNumber: string;
  emailAddress: string;
  faculty: string;
  course: string;
  stream: string;
  year: string;
  session: string;
  createdAt: string;
  isApprovedByAdmin?: boolean;
  isMarksheetGenerated?: boolean;
  isMarksheetAndCertificateApproved?: boolean;
  whichSemesterMarksheetIsGenerated?: string[]; // Array of semester numbers
  approvedSemesters?: string[]; // Array of approved semester numbers
  studentId?: string;
}

export interface StudentsResponse {
  status: boolean;
  message: string;
  data: {
    students: Student[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
  limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface StudentsFilters {
  search?: string;
  course?: string;
  faculty?: string;
  stream?: string;
  year?: string;
  session?: string;
  isApprovedByAdmin?: boolean;
  isMarksheetGenerated?: boolean;
  isMarksheetAndCertificateApproved?: boolean;
  programCategory?: string;
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
  grade: string;
  stream: string;
  year: string;
  session: string;
  monthSession?: string;
  courseFee?: string;
  hostelFacility?: string;
  duration?: string;
  centerId: string;
  center?: any;
}

export interface AddStudentResponse {
  success: boolean;
  message: string;
  studentId?: string;
}

// Real API function to fetch students data
export const getStudentsData = async (page: number = 1, limit: number = 10, filters?: StudentsFilters): Promise<StudentsResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add filter parameters if provided
    if (filters) {
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.course) queryParams.append('course', filters.course);
      if (filters.faculty) queryParams.append('faculty', filters.faculty);
      if (filters.stream) queryParams.append('stream', filters.stream);
      if (filters.year) queryParams.append('year', filters.year);
      if (filters.session) queryParams.append('session', filters.session);
      if (filters.isApprovedByAdmin !== undefined) queryParams.append('isApprovedByAdmin', filters.isApprovedByAdmin.toString());
      if (filters.isMarksheetGenerated !== undefined) queryParams.append('isMarksheetGenerated', filters.isMarksheetGenerated.toString());
      if (filters.isMarksheetAndCertificateApproved !== undefined) queryParams.append('isMarksheetAndCertificateApproved', filters.isMarksheetAndCertificateApproved.toString());
      if (filters.programCategory) queryParams.append('programCategory', filters.programCategory);
    }

    const response = await axiosInstance.get(`/api/student/students?${queryParams.toString()}`);
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

// Real API function to fetch students data for a specific center
export const getCenterStudentsData = async (centerId: string, page: number = 1, limit: number = 10, filters?: StudentsFilters): Promise<StudentsResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      centerId,
    });

    if (filters) {
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.course) queryParams.append('course', filters.course);
      if (filters.faculty) queryParams.append('faculty', filters.faculty);
      if (filters.stream) queryParams.append('stream', filters.stream);
      if (filters.year) queryParams.append('year', filters.year);
      if (filters.session) queryParams.append('session', filters.session);
      if (filters.isApprovedByAdmin !== undefined) queryParams.append('isApprovedByAdmin', filters.isApprovedByAdmin.toString());
      if (filters.isMarksheetGenerated !== undefined) queryParams.append('isMarksheetGenerated', filters.isMarksheetGenerated.toString());
      if (filters.isMarksheetAndCertificateApproved !== undefined) queryParams.append('isMarksheetAndCertificateApproved', filters.isMarksheetAndCertificateApproved.toString());
      if (filters.programCategory) queryParams.append('programCategory', filters.programCategory);
    }

    const response = await axiosInstance.get(`/api/student/students?${queryParams.toString()}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Failed to fetch center students data. Please try again.';
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
    const response = await axiosInstance.post('/api/student/add-student', formData, {
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

// Delete a student by ID
export const deleteStudent = async (studentId: string) => {
  try {
    const response = await axiosInstance.post('/api/student/delete-student', { studentId });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Failed to delete student. Please try again.';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

// Update a student by ID
export const updateStudent = async (studentId: string, data: Partial<Student>) => {
  try {
    const response = await axiosInstance.post('/api/student/update-student', { studentId, ...data });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Failed to update student. Please try again.';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

export const getStudentDetails = async (studentId: string) => {
  try {
    const response = await axiosInstance.post('/api/student/get-student', { studentId });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Failed to fetch student details. Please try again.';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};