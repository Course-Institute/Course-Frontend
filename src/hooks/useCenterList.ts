import { useQuery } from '@tanstack/react-query';

export interface Center {
  id: string;
  centerId: string;
  centerName: string;
  location: string;
  contactPerson: string;
  students: number;
  status: 'Approve' | 'Published' | 'Refenisted' | 'Renning' | 'Pending' | 'Active' | 'Deactivated';
  permissions?: {
    studentManagement: boolean;
    marksUpload: boolean;
    paymentTracking: boolean;
  };
  createdAt: string;
  lastActivity: string;
}

export interface CenterFilters {
  search?: string;
  status?: string;
  region?: string;
  date?: string;
}

export interface CenterListResponse {
  centers: Center[];
  total: number;
  page: number;
  limit: number;
}

// Mock data for centers
const mockCenters: Center[] = [
  {
    id: '1',
    centerId: 'CTR-2025-01',
    centerName: 'Rahul Sharma',
    location: 'Delhi',
    contactPerson: 'Amit Sharma',
    students: 45,
    status: 'Approve',
    permissions: {
      studentManagement: true,
      marksUpload: false,
      paymentTracking: true,
    },
    createdAt: '2025-01-15',
    lastActivity: '2025-01-20',
  },
  {
    id: '2',
    centerId: 'CTR-2025-02',
    centerName: 'Priya Verma',
    location: 'Mumbai',
    contactPerson: 'Priya Mehta',
    students: 132,
    status: 'Published',
    permissions: {
      studentManagement: true,
      marksUpload: true,
      paymentTracking: true,
    },
    createdAt: '2025-01-10',
    lastActivity: '2025-01-22',
  },
  {
    id: '3',
    centerId: 'CTR-2025-03',
    centerName: 'Jaipur Center',
    location: 'Jaipur',
    contactPerson: 'Rakesh Verma',
    students: 6,
    status: 'Refenisted',
    permissions: {
      studentManagement: false,
      marksUpload: false,
      paymentTracking: false,
    },
    createdAt: '2025-01-05',
    lastActivity: '2025-01-18',
  },
  {
    id: '4',
    centerId: 'CTR-2025-04',
    centerName: 'Kolkata Center',
    location: 'Kolkata',
    contactPerson: 'Neha Gupta',
    students: 9,
    status: 'Renning',
    permissions: {
      studentManagement: true,
      marksUpload: false,
      paymentTracking: false,
    },
    createdAt: '2025-01-12',
    lastActivity: '2025-01-21',
  },
  {
    id: '5',
    centerId: 'CTR-2025-05',
    centerName: 'Bangalore Center',
    location: 'Bangalore',
    contactPerson: 'Vikram Singh',
    students: 78,
    status: 'Active',
    permissions: {
      studentManagement: true,
      marksUpload: true,
      paymentTracking: true,
    },
    createdAt: '2025-01-08',
    lastActivity: '2025-01-23',
  },
  {
    id: '6',
    centerId: 'CTR-2025-06',
    centerName: 'Chennai Center',
    location: 'Chennai',
    contactPerson: 'Sneha Patel',
    students: 23,
    status: 'Pending',
    permissions: {
      studentManagement: false,
      marksUpload: false,
      paymentTracking: false,
    },
    createdAt: '2025-01-14',
    lastActivity: '2025-01-19',
  },
  {
    id: '7',
    centerId: 'CTR-2025-07',
    centerName: 'Pune Center',
    location: 'Pune',
    contactPerson: 'Rajesh Gupta',
    students: 56,
    status: 'Deactivated',
    permissions: {
      studentManagement: false,
      marksUpload: false,
      paymentTracking: false,
    },
    createdAt: '2025-01-03',
    lastActivity: '2025-01-15',
  },
  {
    id: '8',
    centerId: 'CTR-2025-08',
    centerName: 'Hyderabad Center',
    location: 'Hyderabad',
    contactPerson: 'Kavita Reddy',
    students: 34,
    status: 'Active',
    permissions: {
      studentManagement: true,
      marksUpload: true,
      paymentTracking: true,
    },
    createdAt: '2025-01-11',
    lastActivity: '2025-01-24',
  }
];

const fetchCenterList = async (filters: CenterFilters = {}): Promise<CenterListResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Apply filters to mock data
  let filteredCenters = [...mockCenters];
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredCenters = filteredCenters.filter(center => 
      center.centerName.toLowerCase().includes(searchTerm) ||
      center.centerId.toLowerCase().includes(searchTerm) ||
      center.location.toLowerCase().includes(searchTerm) ||
      center.contactPerson.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters.status) {
    filteredCenters = filteredCenters.filter(center => 
      center.status === filters.status
    );
  }
  
  if (filters.region) {
    filteredCenters = filteredCenters.filter(center => 
      center.location === filters.region
    );
  }
  
  if (filters.date) {
    // Filter by creation date
    const filterDate = new Date(filters.date);
    filteredCenters = filteredCenters.filter(center => {
      const centerDate = new Date(center.createdAt);
      return centerDate >= filterDate;
    });
  }
  
  return {
    centers: filteredCenters,
    total: filteredCenters.length,
    page: 1,
    limit: 10
  };
};

export const useCenterList = (filters: CenterFilters = {}) => {
  return useQuery<CenterListResponse>({
    queryKey: ['centerList', filters],
    queryFn: () => fetchCenterList(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};
