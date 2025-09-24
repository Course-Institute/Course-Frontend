import { useQuery } from '@tanstack/react-query';

export interface Payment {
  id: string;
  transactionId: string;
  studentId: string;
  studentName: string;
  course: string;
  center: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: 'Completed' | 'Pending' | 'Partial' | 'Failed' | 'Refunded';
  date: string;
  receiptUrl?: string;
}

export interface PaymentFilters {
  search?: string;
  course?: string;
  center?: string;
  paymentStatus?: string;
  paymentType?: string;
  dateRange?: string;
}

export interface PaymentListResponse {
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
}

// Mock data for payment list
const mockPayments: Payment[] = [
  {
    id: '1',
    transactionId: 'TXN-2025-001',
    studentId: 'STU-2025-001',
    studentName: 'Rahul Sharma',
    course: 'B.Sc IT',
    center: 'Delhi Center',
    amount: 12000,
    paymentMethod: 'UPI',
    paymentStatus: 'Completed',
    date: '2025-09-02',
    receiptUrl: '/receipts/txn-001.pdf'
  },
  {
    id: '2',
    transactionId: 'TXN-2025-002',
    studentId: 'STU-2025-002',
    studentName: 'Priya Verma',
    course: 'MBA',
    center: 'Mumbai Center',
    amount: 8000,
    paymentMethod: 'PhonePe',
    paymentStatus: 'Pending',
    date: '2025-09-05',
  },
  {
    id: '3',
    transactionId: 'TXN-2025-003',
    studentId: 'STU-2025-003',
    studentName: 'Anil Kumar',
    course: 'B.Tech',
    center: 'Jaipur Center',
    amount: 5000,
    paymentMethod: 'UPI',
    paymentStatus: 'Partial',
    date: '2025-09-06',
  },
  {
    id: '4',
    transactionId: 'TXN-2025-004',
    studentId: 'STU-2025-004',
    studentName: 'Neha Singh',
    course: 'BBA',
    center: 'Kolkata Center',
    amount: 15000,
    paymentMethod: 'UPI',
    paymentStatus: 'Completed',
    date: '2025-09-07',
    receiptUrl: '/receipts/txn-004.pdf'
  },
  {
    id: '5',
    transactionId: 'TXN-2025-005',
    studentId: 'STU-2025-005',
    studentName: 'Vikram Singh',
    course: 'MCA',
    center: 'Pune Center',
    amount: 10000,
    paymentMethod: 'Google Pay',
    paymentStatus: 'Completed',
    date: '2025-09-08',
    receiptUrl: '/receipts/txn-005.pdf'
  },
  {
    id: '6',
    transactionId: 'TXN-2025-006',
    studentId: 'STU-2025-006',
    studentName: 'Sneha Patel',
    course: 'B.Sc IT',
    center: 'Ahmedabad Center',
    amount: 7500,
    paymentMethod: 'Net Banking',
    paymentStatus: 'Failed',
    date: '2025-09-09',
  },
  {
    id: '7',
    transactionId: 'TXN-2025-007',
    studentId: 'STU-2025-007',
    studentName: 'Rajesh Gupta',
    course: 'MBA',
    center: 'Delhi Center',
    amount: 9000,
    paymentMethod: 'Card',
    paymentStatus: 'Refunded',
    date: '2025-09-10',
  },
  {
    id: '8',
    transactionId: 'TXN-2025-008',
    studentId: 'STU-2025-008',
    studentName: 'Kavita Reddy',
    course: 'B.Tech',
    center: 'Bangalore Center',
    amount: 11000,
    paymentMethod: 'UPI',
    paymentStatus: 'Completed',
    date: '2025-09-11',
    receiptUrl: '/receipts/txn-008.pdf'
  }
];

const fetchPaymentList = async (filters: PaymentFilters = {}): Promise<PaymentListResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Apply filters to mock data
  let filteredPayments = [...mockPayments];
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredPayments = filteredPayments.filter(payment => 
      payment.studentName.toLowerCase().includes(searchTerm) ||
      payment.studentId.toLowerCase().includes(searchTerm) ||
      payment.transactionId.toLowerCase().includes(searchTerm) ||
      payment.course.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters.course) {
    filteredPayments = filteredPayments.filter(payment => 
      payment.course === filters.course
    );
  }
  
  if (filters.center) {
    filteredPayments = filteredPayments.filter(payment => 
      payment.center === filters.center
    );
  }
  
  if (filters.paymentStatus) {
    filteredPayments = filteredPayments.filter(payment => 
      payment.paymentStatus === filters.paymentStatus
    );
  }
  
  if (filters.paymentType) {
    filteredPayments = filteredPayments.filter(payment => 
      payment.paymentMethod === filters.paymentType
    );
  }
  
  if (filters.dateRange) {
    const now = new Date();
    const filterDate = new Date();
    
    switch (filters.dateRange) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    filteredPayments = filteredPayments.filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate >= filterDate;
    });
  }
  
  return {
    payments: filteredPayments,
    total: filteredPayments.length,
    page: 1,
    limit: 10
  };
};

export const usePaymentList = (filters: PaymentFilters = {}) => {
  return useQuery<PaymentListResponse>({
    queryKey: ['paymentList', filters],
    queryFn: () => fetchPaymentList(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};
