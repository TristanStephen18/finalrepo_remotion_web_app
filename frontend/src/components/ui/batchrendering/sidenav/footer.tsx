import { Box, Button } from "@mui/material";
import type React from "react";
import DatasetIcon from "@mui/icons-material/Dataset";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

interface FooterInterface {
  isRendering: boolean;
  handleGenerateBatch: () => void;
  singleOutputLocation: string;
}

export const BatchRenderingSideNavFooter: React.FC<FooterInterface> = ({
  isRendering,
  handleGenerateBatch,
  singleOutputLocation,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        borderTop: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Button
        fullWidth
        variant="outlined"
        startIcon={<SwapHorizIcon />}
        disabled={isRendering}
        onClick={() => window.location.assign(singleOutputLocation)}
        sx={{
          borderRadius: 2,
          py: 1.2,
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Single Output Mode
      </Button>

      {/* Generate Batch */}
      <Button
        fullWidth
        variant="contained"
        startIcon={<DatasetIcon />}
        onClick={handleGenerateBatch}
        disabled={isRendering}
        sx={{
          borderRadius: 2,
          py: 1.5,
          textTransform: "none",
          fontWeight: 700,
          background: "linear-gradient(90deg,#1976d2,#42a5f5)",
        }}
      >
        🚀 Generate Batch
      </Button>
    </Box>
  );
};
