import axiosInstance from './axiosInstance';

export interface LoginRequest {
  email?: string;
  password?: string;
  registrationNumber?: string;
  dateOfBirth?: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    role: string;
    name?: string;
  };
  message?: string;
}

// Admin login API
export const adminLogin = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post('/api/user/admin-login', credentials);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Admin login failed. Please try again.');
  }
};

export const studentLogin = async (credentials: { registrationNumber: string; dateOfBirth: string }): Promise<LoginResponse> => {
  // Demo credentials - no API call needed
  if (credentials.registrationNumber === '170926' && credentials.dateOfBirth === '2002-09-17') {
    return {
      success: true,
      token: 'student-jwt-token-' + Date.now(),
      user: {
        id: '1',
        email: 'student@demo.com',
        role: 'student',
        name: 'Demo Student',
      },
      message: 'Student login successful',
    };
  }
  
  // Real credentials - make API call to backend
  try {
    const response = await axiosInstance.post('/api/user/student-login', credentials);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Student login failed. Please try again.');
  }
};

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const { email, password, registrationNumber, dateOfBirth, role } = credentials;
  
  switch (role.toLowerCase()) {
    case 'app':
      if (!email || !password) {
        throw new Error('Email and password are required for admin login');
      }
      return adminLogin({ email, password });
    case 'student':
      if (!registrationNumber || !dateOfBirth) {
        throw new Error('Registration number and date of birth are required for student login');
      }
      return studentLogin({ registrationNumber, dateOfBirth });
    default:
      throw new Error('Invalid role specified');
  }
};
