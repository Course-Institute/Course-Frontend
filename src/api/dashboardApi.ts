export interface DashboardStats {
  studentCount: number;
  totalPayments: number;
  pendingApprovals: number;
  activeCenters: number;
  studentIncrease: number; // Monthly increase percentage
  centerIncrease: number; // Monthly increase percentage
}

export interface DashboardApiResponse {
  success: boolean;
  data: DashboardStats;
  message?: string;
}

// Real API function for dashboard stats
export const getAdminDashboardData = async (): Promise<DashboardApiResponse> => {
  try {
    const response = await fetch('/api/admin/dashboardStats', {
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

