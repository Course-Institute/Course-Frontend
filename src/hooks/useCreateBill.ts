import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export interface BillFormData {
  studentName?: string;
  registrationNo?: string;
  course?: string;
  centerName?: string;
  centerCode?: string;
  centerType?: string;
  recipientName?: string;
  recipientType?: string;
  recipientId?: string;
  category?: string;
  amount: number;
  paymentMethod: string;
  billDate: string;
  dueDate: string;
  description: string;
  status: string;
  billType?: string;
}

export interface CreateBillResponse {
  status: boolean;
  message: string;
  data?: any;
}

const createBill = async (data: BillFormData): Promise<CreateBillResponse> => {
  const response = await axiosInstance.post('/api/admin/create-bill', data);
  return response.data;
};

export const useCreateBill = () => {
  return useMutation<CreateBillResponse, Error, BillFormData>({
    mutationFn: createBill,
  });
};
