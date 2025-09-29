
import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

interface UserVideoUploadsModalProps {
  open: boolean;
  onClose: () => void;
  videos: string[];
  selectedVideo: string | null;
  setSelectedVideo: (url: string | null) => void;
  onSelect: () => void;
}


export const UserVideoUploadsModal: React.FC<UserVideoUploadsModalProps> = ({
  open,
  onClose,
  videos,
  selectedVideo,
  setSelectedVideo,
  onSelect,
}) => {
  const handleCancel = () => {
    setSelectedVideo(null);
    onClose();
  };

  const handleSelect = () => {
    onSelect();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleCancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          minWidth: 400,
          maxWidth: 600,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" fontWeight={700} mb={2}>
          Choose from your uploads
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            maxHeight: 350,
            overflowY: 'auto',
            mb: 2,
          }}
        >
          {videos && videos.length > 0 ? (
            videos.map((url, i) => (
              <Box
                key={url + i}
                sx={{
                  width: '30%',
                  minWidth: 110,
                  border: selectedVideo === url
                    ? "2px solid #1976d2"
                    : "2px solid #eee",
                  borderRadius: 2,
                  p: 1,
                  position: "relative",
                  cursor: "pointer",
                  transition: "border 0.2s",
                  boxSizing: 'border-box',
                }}
                onClick={() => setSelectedVideo(url)}
              >
                <video
                  src={url}
                  muted
                  loop
                  style={{
                    width: "100%",
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                {selectedVideo === url && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      bgcolor: "rgba(25, 118, 210, 0.85)",
                      color: "#fff",
                      borderRadius: "50%",
                      width: 22,
                      height: 22,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </Box>
                )}
              </Box>
            ))
          ) : (
            <Box sx={{ width: '100%' }}>
              <Typography color="text.secondary" align="center">
                No uploaded videos found.
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSelect}
            disabled={!selectedVideo}
          >
            Select
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
