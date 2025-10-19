import { Box, Button, Typography } from "@mui/material";
import type React from "react";
import { graphThemes } from "../../../../../data/CurveLineThemes";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import SelectAllIcon from "@mui/icons-material/SelectAll";

interface CurveLineTrendBatchRenderingPresetsSelectionSectionInterface {
  isRendering: boolean;
  selectedPresets: string[];
  toggleBackground: (bg: string) => void;
  clearAllPresets: () => void;
  setSelectedPresets: React.Dispatch<React.SetStateAction<string[]>>;
}

export const CurveLineTrendBatchRenderingPresetsSelectionSection: React.FC<
  CurveLineTrendBatchRenderingPresetsSelectionSectionInterface
> = ({
  isRendering,
  selectedPresets,
  toggleBackground,
  clearAllPresets,
  setSelectedPresets,
}) => {
  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Theme Selection
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            startIcon={<SelectAllIcon />}
            onClick={() => setSelectedPresets(Object.keys(graphThemes))}
            disabled={isRendering}
          >
            Select all
          </Button>
          <Button
            size="small"
            startIcon={<ClearAllIcon />}
            onClick={clearAllPresets}
            disabled={isRendering}
          >
            Clear
          </Button>
        </Box>
      </Box>

      {/* Theme Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        {Object.entries(graphThemes).map(([themeName, theme]) => {
          const selected = selectedPresets.includes(themeName);
          return (
            <Box
              key={themeName}
              onClick={() => toggleBackground(themeName)}
              sx={{
                cursor: "pointer",
                borderRadius: 3,
                overflow: "hidden",
                position: "relative",
                height: 140,
                boxShadow: selected
                  ? "0 6px 18px rgba(25,118,210,0.5)"
                  : "0 2px 8px rgba(0,0,0,0.1)",
                border: selected ? "2px solid #1976d2" : "1px solid #e5e7eb",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                },
                pointerEvents: isRendering ? "none" : "auto",
                opacity: isRendering ? 0.6 : 1,
                background: theme.bgGradient,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 2,
                color: theme.labelText,
              }}
            >
              {/* Checkmark Overlay */}
              {selected && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    bgcolor: "#1976d2",
                    color: "#fff",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.9rem",
                  }}
                >
                  ✓
                </Box>
              )}

              {/* Theme Name */}
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ textTransform: "capitalize" }}
              >
                {themeName}
              </Typography>

              {/* Color Preview Row */}
              <Box sx={{ display: "flex", gap: 1 }}>
                {["dot", "axisText", "accent"].map((key) => (
                  <Box
                    key={key}
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      bgcolor: (theme as any)[key],
                      border: "1px solid rgba(0,0,0,0.2)",
                    }}
                  />
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
