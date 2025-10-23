import { useInfiniteQuery } from '@tanstack/react-query';
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
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CenterFilters {
  query?: string;
  status?: string;
  centerType?: string;
  city?: string;
  state?: string;
}

export interface CenterListResponse {
  status: boolean;
  message: string;
  data: {
    centers: Center[];
    totalCount: number;
    hasMore: boolean;
    totalPages: number;
  };
}

const fetchCenterList = async ({ pageParam = 1, filters = {} }: { pageParam?: number; filters?: CenterFilters }): Promise<CenterListResponse> => {
  const response = await axiosInstance.post('/api/admin/getAllCentersList', {
    query: filters.query || '',
    page: pageParam,
    limit: 10,
    ...filters
  });
  
  return response.data;
};

export const useCenterList = (filters: CenterFilters = {}) => {
  return useInfiniteQuery<CenterListResponse>({
    queryKey: ['centerList', filters],
    queryFn: ({ pageParam }) => fetchCenterList({ pageParam: pageParam as number, filters }),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.hasMore) {
        return Math.ceil(lastPage.data.centers.length / 10) + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};
