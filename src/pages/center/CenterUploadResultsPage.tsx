import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Upload } from '@mui/icons-material';

const CenterUploadResultsPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // TODO: Implement file upload logic
      console.log('Uploading file:', selectedFile.name);
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Upload Results
      </Typography>
      
      <Box
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          mb: 2,
        }}
      >
        <Upload sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
        <Typography variant="body1" sx={{ mb: 2 }}>
          {selectedFile ? selectedFile.name : 'No file selected'}
        </Typography>
        <input
          accept=".xlsx,.xls,.csv"
          style={{ display: 'none' }}
          id="upload-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="upload-file">
          <Button variant="contained" component="span">
            Choose File
          </Button>
        </label>
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleUpload}
        disabled={!selectedFile}
        sx={{ mt: 2 }}
      >
        Upload Results
      </Button>
    </Box>
  );
};

export default CenterUploadResultsPage;
