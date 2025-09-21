import axios from 'axios';

export interface LoginRequest {
  loginId: string;
  password: string;
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

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post('/api/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    // Handle error and re-throw with proper typing
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Login failed. Please try again.');
  }
};

// For now, we'll create a mock API response for development
export const mockLoginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock validation
  if (credentials.loginId === 'demo@example.com' && credentials.password === 'password123') {
    return {
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: '1',
        email: credentials.loginId,
        role: credentials.role,
        name: 'Demo User',
      },
      message: 'Login successful',
    };
  }
  
  throw new Error('Invalid credentials. Try demo@example.com / password123');
};
