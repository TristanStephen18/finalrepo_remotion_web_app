import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { fontsSelections1 } from "../../../../../data/FontColors";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import ClearAllIcon from "@mui/icons-material/ClearAll";

interface BatchRenderingFontColorsSelectionInterface {
  isRendering: boolean;
  selectedFontColors: string[];
  setSelectedFontColors: React.Dispatch<React.SetStateAction<string[]>>;
  title?: string;
}

export const BatchRenderingFontColorsSelection: React.FC<
  BatchRenderingFontColorsSelectionInterface
> = ({ isRendering, selectedFontColors, setSelectedFontColors, title }) => {
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
        <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: 0.5 }}>
         {title ? "Choose font colors for your Title and Subtitle" : "Choose Font Colors"}
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            startIcon={<SelectAllIcon />}
            onClick={() => setSelectedFontColors([...fontsSelections1])}
            disabled={isRendering}
          >
            Select all
          </Button>
          <Button
            size="small"
            startIcon={<ClearAllIcon />}
            onClick={() => setSelectedFontColors([])}
            disabled={isRendering}
          >
            Clear
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 2,
        }}
      >
        {fontsSelections1.map((color) => {
          const selected = selectedFontColors.includes(color);
          return (
            <Box
              key={color}
              onClick={() =>
                setSelectedFontColors((prev) =>
                  prev.includes(color)
                    ? prev.filter((c) => c !== color)
                    : [...prev, color]
                )
              }
              sx={{
                pointerEvents: isRendering ? "none" : "auto", // disables hover/click
                opacity: isRendering ? 0.5 : 1, // faded look
                cursor: "pointer",
                borderRadius: 3,
                boxShadow: selected
                  ? "0 4px 12px rgba(25,118,210,0.5)"
                  : "0 2px 6px rgba(0,0,0,0.15)",
                overflow: "hidden",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
                },
                bgcolor: "#fff",
              }}
            >
              {/* Color Block */}
              <Box
                sx={{
                  height: 80,
                  bgcolor: color,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {selected && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: "#1976d2",
                      color: "#fff",
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✓
                  </Box>
                )}
              </Box>

              {/* Label */}
              <Box
                sx={{
                  py: 1,
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "#333",
                  textTransform: "capitalize",
                }}
              >
                {color}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
