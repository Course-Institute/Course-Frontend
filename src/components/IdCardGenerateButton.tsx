import React from 'react';
import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CreditCard,
  Download,
  Print,
  Close,
} from '@mui/icons-material';
import { useState } from 'react';
import IdCardPreview from './IdCardPreview';

interface IdCardGenerateButtonProps {
  onGenerate?: (studentId: string) => void;
  onDownload?: (studentId: string) => void;
  onPrint?: (studentId: string) => void;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const IdCardGenerateButton: React.FC<IdCardGenerateButtonProps> = ({
  onGenerate,
  onDownload,
  onPrint,
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleOpen = () => {
    setOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStudent(null);
    setSearchTerm('');
    setSearchResults([]);
    setError(null);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a registration number or student name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock search - replace with actual API call
      const mockResults = [
        {
          _id: '1',
          candidateName: 'John Doe',
          registrationNo: searchTerm,
          course: 'B.Tech',
          faculty: 'Engineering',
          stream: 'Computer Science',
          year: '2025',
          session: '2025',
          contactNumber: '9876543210',
          emailAddress: 'john@example.com',
        },
      ];

      setSearchResults(mockResults);
    } catch (err) {
      setError('Failed to search for student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student);
  };

  const handleGenerate = () => {
    if (selectedStudent && onGenerate) {
      onGenerate(selectedStudent._id);
    }
  };

  const handleDownload = () => {
    if (selectedStudent && onDownload) {
      onDownload(selectedStudent._id);
    }
  };

  const handlePrint = () => {
    if (selectedStudent && onPrint) {
      onPrint(selectedStudent._id);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        startIcon={<CreditCard />}
        onClick={handleOpen}
        sx={{
          textTransform: 'none',
          borderRadius: 2,
        }}
      >
        Generate ID Card
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCard />
          <Typography variant="h6">Generate Student ID Card</Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Search for a student to generate their ID card
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Registration Number or Student Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                size="small"
              />
              <Button
                variant="outlined"
                onClick={handleSearch}
                disabled={loading}
                sx={{ minWidth: 100 }}
              >
                {loading ? <CircularProgress size={20} /> : 'Search'}
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {searchResults.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Search Results:
                </Typography>
                {searchResults.map((student) => (
                  <Box
                    key={student._id}
                    onClick={() => handleStudentSelect(student)}
                    sx={{
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      cursor: 'pointer',
                      mb: 1,
                      backgroundColor: selectedStudent?._id === student._id ? '#e3f2fd' : 'transparent',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {student.candidateName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {student.registrationNo} • {student.course} • {student.faculty}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {selectedStudent && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  ID Card Preview:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <IdCardPreview student={selectedStudent} />
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleClose}
            startIcon={<Close />}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          
          {selectedStudent && (
            <>
              <Button
                onClick={handleGenerate}
                variant="contained"
                startIcon={<CreditCard />}
                sx={{ textTransform: 'none' }}
              >
                Generate
              </Button>
              <Button
                onClick={handleDownload}
                variant="outlined"
                startIcon={<Download />}
                sx={{ textTransform: 'none' }}
              >
                Download
              </Button>
              <Button
                onClick={handlePrint}
                variant="outlined"
                startIcon={<Print />}
                sx={{ textTransform: 'none' }}
              >
                Print
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IdCardGenerateButton;
