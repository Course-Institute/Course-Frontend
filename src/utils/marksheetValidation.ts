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
  } else {
    const marksNum = parseFloat(subject.marks);
    if (isNaN(marksNum) || marksNum < 0) {
      errors.marks = 'Marks must be a valid number (0 or greater)';
    } else if (marksNum > 100) {
      errors.marks = 'Marks cannot exceed 100';
    }
  }

  if (!subject.internal) {
    errors.internal = 'Internal is required';
  } else {
    const internalNum = parseFloat(subject.internal);
    if (isNaN(internalNum) || internalNum < 0) {
      errors.internal = 'Internal must be a valid number (0 or greater)';
    } else if (internalNum > 100) {
      errors.internal = 'Internal cannot exceed 100';
    }
  }

  if (!subject.minMarks) {
    errors.minMarks = 'Min Marks is required';
  } else {
    const minNum = parseFloat(subject.minMarks);
    if (isNaN(minNum) || minNum < 0) {
      errors.minMarks = 'Min Marks must be a valid number (0 or greater)';
    }
  }

  if (!subject.maxMarks) {
    errors.maxMarks = 'Max Marks is required';
  } else {
    const maxNum = parseFloat(subject.maxMarks);
    if (isNaN(maxNum) || maxNum < 0) {
      errors.maxMarks = 'Max Marks must be a valid number (0 or greater)';
    }
  }

  const total = parseFloat(subject.total) || 0;
  const min = parseFloat(subject.minMarks) || 0;
  const max = parseFloat(subject.maxMarks) || 0;
  const marks = parseFloat(subject.marks) || 0;
  const internal = parseFloat(subject.internal) || 0;

  // Center limitation: Total marks cannot exceed 80 (only for center role)
  if (role === 'center' && total > 80) {
    errors.total = 'Total marks cannot exceed 80 for center role';
  }

  // Validate marks + internal equals total
  if (total && (marks + internal !== total)) {
    errors.total = 'Total should equal Marks + Internal';
  }

  // Validate total is within min and max range
  if (total > 0 && min > 0 && total < min) {
    errors.total = `Total must be at least ${min} (Min Marks)`;
  }

  if (total > 0 && max > 0 && total > max) {
    errors.maxMarks = `Max Marks (${max}) must be at least equal to Total (${total})`;
  }

  // Validate min and max relationship
  if (min > 0 && max > 0 && min > max) {
    errors.minMarks = 'Min Marks cannot be greater than Max Marks';
  }

  if (min > 0 && max > 0 && min === max) {
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
