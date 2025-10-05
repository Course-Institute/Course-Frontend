import { useState } from 'react';

interface UseIdCardGenerationReturn {
  isModalOpen: boolean;
  selectedStudentId: string | null;
  openModal: (studentId: string) => void;
  closeModal: () => void;
}

export const useIdCardGeneration = (): UseIdCardGenerationReturn => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const openModal = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudentId(null);
  };

  return {
    isModalOpen,
    selectedStudentId,
    openModal,
    closeModal,
  };
};
