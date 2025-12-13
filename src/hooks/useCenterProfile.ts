import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export interface Center {
  _id: string;
  centerDetails: {
    centerName: string;
    centerCode: string;
    centerType: string;
    yearOfEstablishment: number;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    officialEmail: string;
    primaryContactNo: string;
    photo?: string;
  };
  authorizedPersonDetails: {
    authName: string;
    designation: string;
    contactNo: string;
    email: string;
    idProofNo: string;
    photo: string;
  };
  infrastructureDetails: {
    numClassrooms: number;
    numComputers: number;
    internetFacility: boolean;
    seatingCapacity: number;
    infraPhotos: string[];
  };
  bankDetails: {
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    ifsc: string;
    branchName: string;
    cancelledCheque: string;
  };
  documentUploads: {
    gstCertificate?: string;
    panCard?: string;
    addressProof?: string;
    directorIdProof?: string;
  };
  declaration: {
    declaration: boolean;
    signatureUrl?: string;
  };
  loginCredentials?: {
    username: string;
    password: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface CenterProfileResponse {
  status: boolean;
  message: string;
  data: Center;
}

const fetchCenterProfile = async (centerId: string): Promise<CenterProfileResponse> => {
  // Try the center-specific endpoint first, fallback to admin endpoint
  try {
    const response = await axiosInstance.get(`/api/center/getCenterProfile?centerId=${centerId}`);
    return response.data;
  } catch (error: any) {
    // Fallback to admin endpoint if center endpoint doesn't exist
    try {
      const response = await axiosInstance.get(`/api/admin/getCenterById?centerId=${centerId}`);
      return response.data;
    } catch (fallbackError: any) {
      // If both endpoints fail, throw the original error
      throw error;
    }
  }
};

export const useCenterProfile = (centerId: string | null) => {
  return useQuery<CenterProfileResponse>({
    queryKey: ['centerProfile', centerId],
    queryFn: () => fetchCenterProfile(centerId!),
    enabled: !!centerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

