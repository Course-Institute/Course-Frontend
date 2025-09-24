import { useQuery } from '@tanstack/react-query';

interface PaymentStats {
  totalPayments: number;
  pendingPayments: number;
  partialPayments: number;
  refundsFailed: number;
}

// Mock data for payment statistics
const mockPaymentStats: PaymentStats = {
  totalPayments: 768890,
  pendingPayments: 120500,
  partialPayments: 132,
  refundsFailed: 11800,
};

const fetchPaymentStats = async (): Promise<PaymentStats> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockPaymentStats;
};

export const usePaymentStats = () => {
  return useQuery<PaymentStats>({
    queryKey: ['paymentStats'],
    queryFn: fetchPaymentStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
