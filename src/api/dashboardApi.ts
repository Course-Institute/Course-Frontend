export interface DashboardStats {
  studentCount: number;
  totalPayments: number;
  pendingApprovals: number;
  activeCenters: number;
}

export interface DashboardApiResponse {
  success: boolean;
  data: DashboardStats;
  message?: string;
}

// Mock API function - replace with real API endpoint
export const getAdminDashboardData = async (): Promise<DashboardApiResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate API call with some random data
      const mockData: DashboardStats = {
        studentCount: Math.floor(Math.random() * 5000) + 8000, // 8000-13000
        totalPayments: Math.floor(Math.random() * 200000) + 400000, // 400000-600000
        pendingApprovals: Math.floor(Math.random() * 50) + 20, // 20-70
        activeCenters: Math.floor(Math.random() * 10) + 10, // 10-20
      };

      // Simulate 10% chance of API failure for testing error handling
      if (Math.random() < 0.1) {
        reject(new Error('API Error: Failed to fetch dashboard data'));
        return;
      }

      resolve({
        success: true,
        data: mockData,
        message: 'Dashboard data fetched successfully',
      });
    }, 800); // Simulate network delay
  });
};

// Real API function (commented out - uncomment when backend is ready)
/*
export const getAdminDashboardData = async (): Promise<DashboardApiResponse> => {
  try {
    const response = await fetch('/api/admin/dashboard', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch dashboard data: ${error}`);
  }
};
*/
