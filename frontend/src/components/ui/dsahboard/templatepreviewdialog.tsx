import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TemplateNavigator } from "../../../utils/TemplateNavigator";
import { templateUrlFinder } from "../../../data/DashboardCardsData";

interface TemplatePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  selectedTemplate: string | null;
  selectedDescription: string;
}

export const TemplatePreviewDialog: React.FC<TemplatePreviewDialogProps> = ({
  open,
  onClose,
  selectedTemplate,
  selectedDescription,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Template Preview
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box
          sx={{
            display: "flex",
            gap: 0,
            flexDirection: { xs: "column", md: "row" },
            height: { xs: "auto", md: 480 },
          }}
        >
          {/* Preview Video */}
          <Box
            sx={{
              flex: { xs: "none", md: 6 },
              width: { xs: "100%", md: "60%" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 2, md: 3 },
              bgcolor: "white",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: { xs: 360, md: "100%" },
                maxWidth: 720,
                borderRadius: 1.5,
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(2,6,23,0.4)",
                bgcolor: "white",
              }}
            >
              <video
                muted
                controls
                autoPlay
                loop
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
                src={`${templateUrlFinder(selectedTemplate as string)}`}
              />
            </Box>
          </Box>

          {/* Details */}
          <Box
            sx={{
              flex: { xs: "none", md: 4 },
              width: { xs: "100%", md: "40%" },
              p: { xs: 2, md: 4 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2.5,
              bgcolor: "background.paper",
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {selectedTemplate ?? "—"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {selectedDescription ?? "No description available."}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip label="1080×1920" size="small" />
              <Chip label="Portrait" size="small" />
            </Stack>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => {
                  const location = TemplateNavigator(selectedTemplate || "user");
                  window.open(location);
                  onClose();
                }}
                fullWidth
                sx={{
                  borderRadius: "12px",
                  textTransform: "uppercase",
                  fontWeight: 800,
                  background: "linear-gradient(90deg, #d81b60 0%, #42a5f5 100%)",
                  boxShadow: "0 8px 20px rgba(68, 91, 173, 0.12)",
                  py: 1.3,
                }}
              >
                Try this template
              </Button>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Tip: Use batch rendering for multiple variations. Single output
              opens the template editor.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ pr: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
