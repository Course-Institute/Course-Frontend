import axiosInstance from './axiosInstance';

export interface Bill {
  _id: string;
  studentName: string;
  registrationNo: string;
  course: string;
  amount: number;
  paymentMethod: string;
  billDate: string;
  dueDate: string;
  description: string;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

export interface BillListResponse {
  status: boolean;
  message: string;
  data: {
    bills: Bill[];
    totalCount: number;
    hasMore: boolean;
    totalPages: number;
  };
}

export interface BillFilters {
  query?: string;
  status?: string;
  paymentMethod?: string;
  course?: string;
  year?: string;
  centerId?: string;
}

// Get bills list based on user role
export const getBillsList = async (filters: BillFilters = {}): Promise<BillListResponse> => {
  try {
    const userRole = localStorage.getItem('userRole');
    const centerId = localStorage.getItem('centerId');
    
    // Determine the correct API endpoint based on user role
    let endpoint = '/api/admin/getBillsList';
    if (userRole?.toLowerCase() === 'center') {
      endpoint = '/api/center/getBillsList';
    }
    
    const response = await axiosInstance.post(endpoint, {
      query: filters.query || '',
      page: 1,
      limit: 10,
      ...filters,
      // For center users, always include centerId
      ...(userRole?.toLowerCase() === 'center' && centerId && { centerId }),
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Failed to fetch bills data. Please try again.';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

// Get bills list with pagination for infinite scroll
export const getBillsListPaginated = async (page: number = 1, filters: BillFilters = {}): Promise<BillListResponse> => {
  try {
    const userRole = localStorage.getItem('userRole');
    const centerId = localStorage.getItem('centerId');
    
    // Determine the correct API endpoint based on user role
    let endpoint = '/api/admin/getBillsList';
    if (userRole?.toLowerCase() === 'center') {
      endpoint = '/api/center/getBillsList';
    }
    
    const response = await axiosInstance.post(endpoint, {
      query: filters.query || '',
      page: page,
      limit: 10,
      ...filters,
      // For center users, always include centerId
      ...(userRole?.toLowerCase() === 'center' && centerId && { centerId }),
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Failed to fetch bills data. Please try again.';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};
