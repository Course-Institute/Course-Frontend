import axiosInstance from './axiosInstance';

export interface Student {
  id: string;
  studentId: string;
  name: string;
  course: string;
  semester: string;
  admissionYear: number;
  center: string;
  status: 'Approved' | 'Pending' | 'ID Generated';
  feeStatus: 'Full Payment' | 'Partial' | 'Pending';
  email?: string;
  phone?: string;
  address?: string;
}

export interface StudentsResponse {
  data: Student[];
  total: number;
  page: number;
  limit: number;
}

export interface AddStudentData {
  candidateName: string;
  motherName: string;
  fatherName: string;
  dateOfBirth: string;
  gender: string;
  adharCardNo: string;
  category: string;
  adharCardFront?: File;
  adharCardBack?: File;
  photo?: File;
  signature?: File;
  employerName?: string;
  isEmployed: string;
  designation?: string;
  contactNumber: string;
  alternateNumber: string;
  emailAddress: string;
  permanentAddress: string;
  currentAddress: string;
  state: string;
  city: string;
  country: string;
  nationality: string;
  pincode: string;
  courseType: string;
  course: string;
  faculty: string;
  stream: string;
  year: string;
  session: string;
  monthSession?: string;
  courseFee?: string;
  hostelFacility?: string;
  duration?: string;
}

export interface AddStudentResponse {
  success: boolean;
  message: string;
  studentId?: string;
}

// Mock API function to simulate fetching students data
export const getStudentsData = async (page: number = 1, limit: number = 10): Promise<StudentsResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate API failure 5% of the time
      if (Math.random() < 0.05) {
        reject(new Error('Failed to fetch students data. Please try again.'));
        return;
      }

      // Mock data based on the wireframe
      const mockStudents: Student[] = [
        {
          id: '1',
          studentId: 'STU-2025-001',
          name: 'Rahul Sharma',
          course: 'B.Sc IT',
          semester: 'Sem 2',
          admissionYear: 2025,
          center: 'Delhi Center',
          status: 'Approved',
          feeStatus: 'Full Payment',
          email: 'rahul.sharma@example.com',
          phone: '+91 9876543210',
          address: 'Delhi, India'
        },
        {
          id: '2',
          studentId: 'STU-2025-002',
          name: 'Priya Verma',
          course: 'MBA',
          semester: 'Sem 1',
          admissionYear: 2025,
          center: 'Mumbai Ctr',
          status: 'Pending',
          feeStatus: 'Partial',
          email: 'priya.verma@example.com',
          phone: '+91 9876543211',
          address: 'Mumbai, India'
        },
        {
          id: '3',
          studentId: 'STU-2024-120',
          name: 'Anil Kumar',
          course: 'B.Tech',
          semester: 'Sem 5',
          admissionYear: 2024,
          center: 'Jaipur Ctr',
          status: 'ID Generated',
          feeStatus: 'Full Payment',
          email: 'anil.kumar@example.com',
          phone: '+91 9876543212',
          address: 'Jaipur, India'
        },
        {
          id: '4',
          studentId: 'STU-2025-003',
          name: 'Sneha Patel',
          course: 'MCA',
          semester: 'Sem 1',
          admissionYear: 2025,
          center: 'Ahmedabad Ctr',
          status: 'Approved',
          feeStatus: 'Full Payment',
          email: 'sneha.patel@example.com',
          phone: '+91 9876543213',
          address: 'Ahmedabad, India'
        },
        {
          id: '5',
          studentId: 'STU-2024-121',
          name: 'Rajesh Singh',
          course: 'B.Com',
          semester: 'Sem 6',
          admissionYear: 2024,
          center: 'Pune Ctr',
          status: 'Pending',
          feeStatus: 'Pending',
          email: 'rajesh.singh@example.com',
          phone: '+91 9876543214',
          address: 'Pune, India'
        },
        {
          id: '6',
          studentId: 'STU-2025-004',
          name: 'Meera Joshi',
          course: 'BBA',
          semester: 'Sem 2',
          admissionYear: 2025,
          center: 'Bangalore Ctr',
          status: 'ID Generated',
          feeStatus: 'Full Payment',
          email: 'meera.joshi@example.com',
          phone: '+91 9876543215',
          address: 'Bangalore, India'
        },
        {
          id: '7',
          studentId: 'STU-2024-122',
          name: 'Vikram Reddy',
          course: 'B.Sc Physics',
          semester: 'Sem 4',
          admissionYear: 2024,
          center: 'Hyderabad Ctr',
          status: 'Approved',
          feeStatus: 'Partial',
          email: 'vikram.reddy@example.com',
          phone: '+91 9876543216',
          address: 'Hyderabad, India'
        },
        {
          id: '8',
          studentId: 'STU-2025-005',
          name: 'Kavya Nair',
          course: 'M.Sc Chemistry',
          semester: 'Sem 1',
          admissionYear: 2025,
          center: 'Kochi Ctr',
          status: 'Pending',
          feeStatus: 'Full Payment',
          email: 'kavya.nair@example.com',
          phone: '+91 9876543217',
          address: 'Kochi, India'
        }
      ];

      // Simulate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedStudents = mockStudents.slice(startIndex, endIndex);

      resolve({
        data: paginatedStudents,
        total: mockStudents.length,
        page,
        limit
      });
    }, Math.random() * 1000 + 500); // Random delay between 500ms and 1500ms
  });
};

// Real API function to add a student
export const addStudent = async (formData: FormData): Promise<AddStudentResponse> => {
  try {
    const response = await axiosInstance.post('/addStudent', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Failed to add student. Please try again.';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};
