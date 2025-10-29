import axiosInstance from './axiosInstance';

export interface StudentProfile {
  _id: string;
  registrationNo: string;
  candidateName: string;
  motherName: string;
  fatherName: string;
  gender: string;
  dateOfBirth: string;
  adharCardNo: string;
  category: string;
  contactNumber: string;
  emailAddress: string;
  currentAddress: string;
  permanentAddress: string;
  city: string;
  state: string;
  nationality: string;
  country: string;
  pincode: string;
  courseType: string;
  faculty: string;
  course: string;
  stream: string;
  year: string;
  monthSession: string;
  hostelFacility: string;
  session: string;
  duration: string;
  courseFee: string;
  aadharFront: string;
  aadharBack: string;
  photo: string;
  signature: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isMarksheetAndCertificateApproved?: boolean;
  isApprovedByAdmin?: boolean;
}

export interface StudentProfileResponse {
  status: boolean;
  message: string;
  data: StudentProfile;
}

// API function to fetch student profile
export const getStudentProfile = async (registrationNumber?: string): Promise<StudentProfileResponse> => {
  try {
    const regNumber = registrationNumber || localStorage.getItem('studentRegistrationNumber');
    const url = regNumber ? `api/student/profile?registrationNo=${regNumber}` : 'api/student/profile';
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
