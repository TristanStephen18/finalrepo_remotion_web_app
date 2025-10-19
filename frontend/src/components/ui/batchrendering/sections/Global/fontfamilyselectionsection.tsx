import { Box, Button, Typography } from "@mui/material";
import type React from "react";
import { fontFamilies } from "../../../../../data/FontFamilies";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import SelectAllIcon from "@mui/icons-material/SelectAll";

interface BatchRenderingFontFamilySelectionSectionInterface {
  selectAllFonts: () => void;
  isRendering: boolean;
  clearAllFonts: () => void;
  selectedFonts: string[];
  toggleFont: (font: string) => void;
}

export const BatchRenderingFontFamilySelectionSection: React.FC<
  BatchRenderingFontFamilySelectionSectionInterface
> = ({
  selectAllFonts,
  isRendering,
  clearAllFonts,
  selectedFonts,
  toggleFont,
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
          Font Selection
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            startIcon={<SelectAllIcon />}
            onClick={selectAllFonts}
            disabled={isRendering}
          >
            Select all
          </Button>
          <Button
            size="small"
            startIcon={<ClearAllIcon />}
            onClick={clearAllFonts}
            disabled={isRendering}
          >
            Clear
          </Button>
        </Box>
      </Box>

      {/* Font Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {fontFamilies.map((font) => {
          const selected = selectedFonts.includes(font);
          const cleanLabel = font.replace(/['",]/g, "");
          return (
            <Box
              key={font}
              onClick={() => toggleFont(font)}
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
                minHeight: 120,
                position: "relative",
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Checkmark overlay */}
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

              {/* Font Name Styled */}
              <Typography
                sx={{
                  fontFamily: font,
                  fontWeight: 600,
                  fontSize: "1.3rem",
                  mb: 1,
                }}
              >
                {cleanLabel}
              </Typography>

              {/* Caption */}
              <Typography variant="caption" color="text.secondary">
                {font}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
