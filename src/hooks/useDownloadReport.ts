import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export interface DownloadReportPayload {
  type: 'payment' | 'results' | 'student_details' | 'combined';
  format: 'pdf' | 'excel' | 'csv';
  filters?: {
    paymentStatus?: string;
    resultsStatus?: string;
    faculty?: string;
    course?: string;
    year?: string;
    session?: string;
    search?: string;
  };
  studentIds?: string[]; // For individual student reports
}

interface DownloadReportResponse {
  status: boolean;
  message: string;
  data: {
    downloadUrl: string;
    fileName: string;
    fileSize: number;
    expiresAt: string;
  };
}

const downloadReport = async (payload: DownloadReportPayload): Promise<DownloadReportResponse> => {
  const { data } = await axiosInstance.post('/api/reports/download', payload, {
    responseType: 'blob', // Important for file downloads
  });
  return data;
};

export const useDownloadReport = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: downloadReport,
    onSuccess: (response) => {
      // Create download link and trigger download
      const { downloadUrl, fileName } = response.data;
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Invalidate reports query to refresh data if needed
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: (err: any) => {
      console.error('Failed to download report:', err);
    },
  });

  const downloadPaymentReport = (filters?: DownloadReportPayload['filters'], studentIds?: string[]) => {
    mutate({
      type: 'payment',
      format: 'pdf',
      filters,
      studentIds,
    });
  };

  const downloadResultsReport = (filters?: DownloadReportPayload['filters'], studentIds?: string[]) => {
    mutate({
      type: 'results',
      format: 'pdf',
      filters,
      studentIds,
    });
  };

  const downloadStudentDetailsReport = (filters?: DownloadReportPayload['filters'], studentIds?: string[]) => {
    mutate({
      type: 'student_details',
      format: 'excel',
      filters,
      studentIds,
    });
  };

  const downloadCombinedReport = (filters?: DownloadReportPayload['filters'], studentIds?: string[]) => {
    mutate({
      type: 'combined',
      format: 'pdf',
      filters,
      studentIds,
    });
  };

  return {
    downloadReport: mutate,
    downloadPaymentReport,
    downloadResultsReport,
    downloadStudentDetailsReport,
    downloadCombinedReport,
    isDownloading: isPending,
    isSuccess,
    isError,
    error,
  };
};



