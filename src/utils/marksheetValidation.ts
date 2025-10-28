import { type SubjectData } from '../hooks/useSaveMarksheet';

export interface SubjectInput {
  subjectName: string;
  marks: string;
  internal: string;
  total: string;
  minMarks: string;
  maxMarks: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

// Calculate total when marks or internal changes
export const calculateTotal = (marks: string, internal: string): string => {
  const marksNum = parseFloat(marks) || 0;
  const internalNum = parseFloat(internal) || 0;
  return (marksNum + internalNum).toString();
};

// Validate current subject data
export const validateSubject = (
  subject: SubjectInput,
  existingSubjects: SubjectData[],
  role?: string
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!subject.subjectName.trim()) {
    errors.subjectName = 'Subject Name is required';
  }

  if (!subject.marks) {
    errors.marks = 'Marks is required';
  } else if (parseFloat(subject.marks) < 0) {
    errors.marks = 'Marks cannot be negative';
  }

  if (!subject.internal) {
    errors.internal = 'Internal is required';
  } else if (parseFloat(subject.internal) < 0) {
    errors.internal = 'Internal cannot be negative';
  }

  if (!subject.minMarks) {
    errors.minMarks = 'Min Marks is required';
  } else if (parseFloat(subject.minMarks) < 0) {
    errors.minMarks = 'Min Marks cannot be negative';
  }

  if (!subject.maxMarks) {
    errors.maxMarks = 'Max Marks is required';
  } else if (parseFloat(subject.maxMarks) < 0) {
    errors.maxMarks = 'Max Marks cannot be negative';
  }

  const total = parseFloat(subject.total);
  const min = parseFloat(subject.minMarks);
  const max = parseFloat(subject.maxMarks);

  // Center limitation: Total marks cannot exceed 80 (only for center role)
  if (role === 'center' && total && total > 80) {
    errors.total = 'Total marks cannot exceed 80';
  }

  if (total && max && total > max) {
    errors.maxMarks = 'Max Marks must be greater than or equal to Total';
  }

  if (min && max && min > max) {
    errors.minMarks = 'Min Marks cannot be greater than Max Marks';
  }

  if (min && max && min === max) {
    errors.minMarks = 'Min Marks and Max Marks cannot be equal';
  }

  // Check for duplicate subject names
  const isDuplicate = existingSubjects.some(
    s => s.subjectName.toLowerCase() === subject.subjectName.trim().toLowerCase()
  );
  if (isDuplicate) {
    errors.subjectName = 'Subject name already exists';
  }

  return errors;
};

// Validate maximum subjects limit
export const validateMaxSubjects = (subjectsCount: number): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (subjectsCount >= 7) {
    errors.subjectName = 'Maximum 7 subjects are allowed';
  }
  
  return errors;
};

// Validate form before save
export const validateFormForSave = (
  selectedStudent: any,
  subjects: SubjectData[]
): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!selectedStudent) {
    errors.studentId = 'Please select a student';
  }
  
  if (subjects.length === 0) {
    errors.subjectName = 'Please add at least one subject';
  }
  
  return errors;
};
