import React from "react";
import { Box, Typography, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface MiniMessagingModalProps {
  open: boolean;
  onClose: () => void;
}

export const MiniMessagingModal: React.FC<MiniMessagingModalProps> = ({
  open,
  onClose,
}) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 90,
        right: 40,
        width: 340,
        bgcolor: "background.paper",
        boxShadow: 4,
        borderRadius: 3,
        p: 2,
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography fontWeight="bold">Chat with Us</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ height: 180, overflowY: "auto", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          How can we help you today?
        </Typography>
        {/* Future: chat messages list */}
      </Box>

      <TextField
        variant="outlined"
        placeholder="Type your message..."
        fullWidth
        size="small"
        sx={{ mt: 1 }}
      />
    </Box>
  );
};
