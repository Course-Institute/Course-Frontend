import axiosInstance from './axiosInstance';

export interface LoginRequest {
  email?: string;
  password?: string;
  registrationNumber?: string;
  registrationNo?: string;
  dateOfBirth?: string;
  role: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      registrationNo?: string;
      dob?: string;
      centerId?: string;
      centerName?: string;
    };
    token: string;
  };
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
      status: true,
      message: 'Student login successful',
      data: {
        user: {
          id: '1',
          name: 'Demo Student',
          email: 'student@demo.com',
          role: 'student',
          registrationNo: '170926',
          dob: '2002-09-17',
        },
        token: 'student-jwt-token-' + Date.now(),
      },
    };
  }
  
  // Real credentials - make API call to backend with correct field names
  try {
    const backendCredentials = {
      registrationNo: credentials.registrationNumber,
      dateOfBirth: credentials.dateOfBirth,
    };
    const response = await axiosInstance.post('/api/user/student-login', backendCredentials);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Student login failed. Please try again.');
  }
};

// Center login API
export const centerLogin = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
  // Demo credentials - no API call needed
  if (credentials.email === 'center@demo.com' && credentials.password === 'center123') {
    return {
      status: true,
      message: 'Center login successful',
      data: {
        user: {
          id: '2',
          name: 'Demo Center',
          email: 'center@demo.com',
          role: 'center',
          centerId: 'CENTER001',
          centerName: 'Demo Center Name',
        },
        token: 'center-jwt-token-' + Date.now(),
      },
    };
  }
  
  // Real credentials - make API call to backend
  try {
    const response = await axiosInstance.post('/api/user/center-login', credentials);
    
    // Transform the backend response to match the expected format
    const backendData = response.data;
    if (backendData.status && backendData.data) {
      return {
        status: backendData.status,
        message: backendData.message,
        data: {
          user: {
            id: backendData.data.centerId || '',
            name: backendData.data.centerName || '',
            email: credentials.email,
            role: 'center',
            centerId: backendData.data.centerId,
            centerName: backendData.data.centerName,
          },
          token: backendData.data.token,
        },
      };
    }
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Center login failed. Please try again.');
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
    case 'admin':
      if (!email || !password) {
        throw new Error('Email and password are required for admin login');
      }
      return adminLogin({ email, password });
    case 'center':
      if (!email || !password) {
        throw new Error('Email and password are required for center login');
      }
      return centerLogin({ email, password });
    case 'student':
      if (!registrationNumber || !dateOfBirth) {
        throw new Error('Registration number and date of birth are required for student login');
      }
      return studentLogin({ registrationNumber, dateOfBirth });
    default:
      throw new Error('Invalid role specified');
  }
};
