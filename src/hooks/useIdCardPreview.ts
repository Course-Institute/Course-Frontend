import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

interface IdCardPreviewData {
  _id: string;
  registrationNo: string;
  candidateName: string;
  motherName: string;
  fatherName: string;
  gender: string;
  dateOfBirth: string;
  adharCardNo: string;
  category: string;
  contactNumber: string;
  emailAddress: string;
  currentAddress: string;
  permanentAddress: string;
  city: string;
  state: string;
  nationality: string;
  country: string;
  pincode: string;
  courseType: string;
  faculty: string;
  course: string;
  stream: string;
  year: string;
  monthSession: string;
  hostelFacility: string;
  session: string;
  duration: string;
  courseFee: string;
  aadharFront: string;
  aadharBack: string;
  photo: string;
  signature: string;
  idCardStatus: 'pending' | 'generated' | 'rejected';
  idCardGeneratedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface IdCardPreviewResponse {
  status: boolean;
  message: string;
  data: IdCardPreviewData;
}

const fetchIdCardPreview = async (studentId: string): Promise<IdCardPreviewData> => {
  const { data } = await axiosInstance.get(`/api/id-card/preview/${studentId}`);
  return data?.data;
};

export const useIdCardPreview = (studentId: string) => {
  const {
    data: idCardPreview,
    isLoading: isIdCardPreviewLoading,
    error: idCardPreviewError,
    refetch: refetchIdCardPreview,
  } = useQuery({
    queryKey: ['idCardPreview', studentId],
    queryFn: () => fetchIdCardPreview(studentId),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    idCardPreview,
    isIdCardPreviewLoading,
    idCardPreviewError,
    refetchIdCardPreview,
  };
};
