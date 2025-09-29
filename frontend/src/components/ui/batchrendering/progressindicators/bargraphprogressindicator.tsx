import { Box, Button, LinearProgress, Paper, Typography } from "@mui/material";
import type React from "react";

interface BarGraphBatchRenderingInidicatorInterface {
  isRendering: boolean;
  renderQueue: number[];
  currentIndex: number | null;
  setShowProgressCard: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveSection: React.Dispatch<
    React.SetStateAction< "dataset" | "backgrounds" | "fonts" | "outputs">
  >;
}

export const BarGraphBatchRenderingInidicator: React.FC<
  BarGraphBatchRenderingInidicatorInterface
> = ({
  isRendering,
  renderQueue,
  currentIndex,
  setShowProgressCard,
  setActiveSection,
}) => {
  return (
    <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 1300 }}>
      <Paper
        elevation={4}
        sx={{
          px: 2,
          py: 1.5,
          minWidth: 240,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {isRendering ? (
          <>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                Rendering...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentIndex !== null ? currentIndex + 1 : 0}/
                {renderQueue.length}
              </Typography>
            </Box>

            {/* Progress Bar */}
            <LinearProgress
              variant="determinate"
              value={((currentIndex ?? 0) / renderQueue.length) * 100}
              sx={{ height: 8, borderRadius: 5 }}
            />

            {/* Percentage */}
            <Typography
              variant="caption"
              align="right"
              sx={{ mt: 0.5, color: "text.secondary" }}
            >
              {Math.round(((currentIndex ?? 0) / renderQueue.length) * 100)}%
            </Typography>
          </>
        ) : (
          <>
            {/* Finished UI */}
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              🎉 Rendering Finished
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <Button
                size="small"
                variant="outlined"
                onClick={() => setActiveSection("outputs")}
              >
                View
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => setShowProgressCard(false)} // ✅ only hides card
              >
                Dismiss
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};
