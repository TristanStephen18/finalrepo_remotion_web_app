import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import type React from "react";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useEffect, useState } from "react";

interface UserDatasetsSectionInterface {
  uploadedUrl: string | null;
  uploadError: string | null;
  setShowFileChooser: React.Dispatch<React.SetStateAction<boolean>>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  selectedFile: File | null;
  handleFileUpload: () => Promise<void>;
}

export const UserDatasetsSection: React.FC<UserDatasetsSectionInterface> = ({
  uploadError,
  uploadedUrl,
  uploading,
  setShowFileChooser,
  handleFileChange,
  selectedFile,
  handleFileUpload,
}) => {
  // Dynamic button label logic
  const [uploadStage, setUploadStage] = useState<'idle' | 'uploading' | 'extracting'>('idle');
  useEffect(() => {
    if (uploading) {
      setUploadStage('uploading');
      const timer = setTimeout(() => {
        setUploadStage('extracting');
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setUploadStage('idle');
    }
  }, [uploading]);

  let buttonLabel = 'Upload and Extract data';
  if (uploading) {
    buttonLabel = uploadStage === 'uploading' ? 'Uploading...' : 'Extracting data...';
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        Upload Dataset
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <input
            type="file"
            accept=".json,application/json,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            onClick={handleFileUpload}
            disabled={!selectedFile || uploading}
          >
            {buttonLabel}
          </Button>
        </Box>
        <Typography sx={{ mx: 1, fontWeight: 500, color: 'text.secondary' }}>or</Typography>
        <Button
          variant="outlined"
          startIcon={<FolderOpenIcon />}
          onClick={() => setShowFileChooser(true)}
          sx={{ ml: "auto" }}
        >
          Choose from your uploaded datasets
        </Button>
      </Stack>
      {uploadError && (
        <Typography color="error" sx={{ mt: 1 }}>
          {uploadError}
        </Typography>
      )}
      {uploadedUrl && (
        <Typography color="success.main" sx={{ mt: 1, fontSize: 10 }}>
          Dataset uploaded: successfully
        </Typography>
      )}
    </Paper>
  );
};
