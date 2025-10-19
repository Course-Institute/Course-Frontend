import React, { useState, useEffect } from 'react';
import DialogBox from './DialogBox';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
// import { Primary } from '../../color-palette/colors';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
// import SaveCancelButtons from '../SaveCancelComponent/SaveCancelButtons';
// import { isImage, isPDF } from '../../../../components/CommunicationPopper/helpers/helper';

interface AttachmentPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  attachment: {
    name?: string;
    link: string;
    filetype?: string;
  } | null;
}

const AttachmentPreviewDialog: React.FC<AttachmentPreviewDialogProps> = ({ open, onClose, attachment }) => {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, [attachment]);

  if (!attachment) return null;
  const { name, link, filetype } = attachment;
  const linkTesting = "https://digitalpannifilemanagement.s3.ap-south-1.amazonaws.com/plantFileManagement/687a22282582d927d6be8d76/Commercial/Billing%20Payments/Receipt_18Jun2025_231215.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQM3AKJFJ3MQDIWBI%2F20250724%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250724T091726Z&X-Amz-Expires=900&X-Amz-Signature=279de65b856b867d7516d776f21b68529ae28235d30a959c0f5484a39fd62197&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"

  const handleLoad = () => setLoading(false);
  const handleError = () => setLoading(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(linkTesting, { mode: 'cors' });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name || 'download';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      throw e;
    }
    setDownloading(false);
  };

  return (
    <DialogBox
      open={open}
      onClose={onClose}
      width="600px"
      height="60vh"
      showCloseIcon
      title={name || 'Attachment Preview'}
      TitlefontSize="20px"
    >
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {filetype && filetype.startsWith('image/') ? (
          <>
            {loading && (
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
                <CircularProgress />
              </Box>
            )}
            <img
              src={link}
              alt={name}
              style={{ maxWidth: '100%', height: '100%', borderRadius: 8, display: loading ? 'none' : 'block' }}
              onLoad={handleLoad}
              onError={handleError}
            />
          </>
        ) : filetype === 'application/pdf' ? (
          <>
            {loading && (
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
                <CircularProgress />
              </Box>
            )}
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(link)}&embedded=true`}
              title={name}
              style={{ width: '100%', height: '100%', border: 'none', display: loading ? 'none' : 'block' }}
              onLoad={handleLoad}
            />
          </>
        ) : (
          <>
            <Typography variant="body1" sx={{ mb: 2 }}>Cannot preview this file type.</Typography>
          </>
        )}
        <Box sx={{ display: 'flex', justifyContent: "end", alignItems: "end", width: '100%' }}>
          {!loading && (
            <Button
              variant="contained"
              onClick={handleDownload}
              disabled={downloading}
              sx={{ mt: 2, backgroundColor: '#1976d2', color: '#fff' }}
            >
              <span>Download</span> <FileDownloadOutlinedIcon sx={{ fontSize: '20px', ml: 1 }} />
            </Button>
          )}
        </Box>
      </Box>
    </DialogBox>
  );
};

export default AttachmentPreviewDialog; 