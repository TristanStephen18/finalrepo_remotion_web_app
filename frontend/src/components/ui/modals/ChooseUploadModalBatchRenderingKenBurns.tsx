import React, { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

interface ChooseUploadModalProps {
  open: boolean;
  onClose: () => void;
  userUploads: { id: string; url: string; type: string }[];
  onSelect: (selectedImages: string[]) => void;
}

export const ChooseUploadModalBatchRenderingKenburns: React.FC<ChooseUploadModalProps> = ({
  open,
  onClose,
  userUploads,
  onSelect,
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleToggle = (url: string) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(url)) {
        newSet.delete(url);
      } else {
        newSet.add(url);
      }
      return newSet;
    });
  };

  const handleSelect = () => {
    onSelect(Array.from(selected));
    setSelected(new Set());
    onClose();
  };

  const handleCancel = () => {
    setSelected(new Set());
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
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            maxHeight: 350,
            overflowY: "auto",
            mb: 2,
          }}
        >
          {userUploads && userUploads.length > 0 ? (
            userUploads
              .filter((upload) => upload.type === "image")
              .map((upload) => (
                <Box
                  key={upload.id}
                  sx={{
                    width: "30%",
                    minWidth: 110,
                    border: selected.has(upload.url)
                      ? "2px solid #1976d2"
                      : "2px solid #eee",
                    borderRadius: 2,
                    p: 1,
                    position: "relative",
                    cursor: "pointer",
                    transition: "border 0.2s",
                    boxSizing: "border-box",
                  }}
                  onClick={() => handleToggle(upload.url)}
                >
                  <img
                    src={upload.url}
                    alt="uploaded"
                    style={{
                      width: "100%",
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  {selected.has(upload.url) && (
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
            <Box sx={{ width: "100%" }}>
              <Typography color="text.secondary" align="center">
                No uploaded images found.
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
            disabled={selected.size === 0}
          >
            Select
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
