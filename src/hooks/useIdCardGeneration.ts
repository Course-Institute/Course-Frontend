import { useState } from 'react';

interface UseIdCardGenerationReturn {
  isModalOpen: boolean;
  selectedStudentId: string | null;
  openModal: (studentId: string) => void;
  closeModal: () => void;
  generateIdCard: (params: { studentId: string; registrationNo: string }, callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }) => void;
  isGenerating: boolean;
}

export const useIdCardGeneration = (): UseIdCardGenerationReturn => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const openModal = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudentId(null);
  };

  const generateIdCard = (_params: { studentId: string; registrationNo: string }, callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }) => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      if (callbacks?.onSuccess) {
        callbacks.onSuccess();
      }
    }, 2000);
  };

  return {
    isModalOpen,
    selectedStudentId,
    openModal,
    closeModal,
    generateIdCard,
    isGenerating,
  };
};
