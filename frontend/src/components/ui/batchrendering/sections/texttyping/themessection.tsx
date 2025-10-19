import { Box, Button, Typography } from "@mui/material";
import type React from "react";
import { BACKGROUNDS } from "../../../../../data/TextTypingBg";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import SelectAllIcon from "@mui/icons-material/SelectAll";

interface TextTypingBackgroundsSectionInterface {
  isRendering: boolean;
  setBackgroundSelected: React.Dispatch<React.SetStateAction<number[]>>;
  backgroundsSelected: number[];
}

export const TextTypingBackgroundsSection: React.FC<
  TextTypingBackgroundsSectionInterface
> = ({ isRendering, setBackgroundSelected, backgroundsSelected }) => {
  return (
    <Box>
      {/* Header with title + buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Background Selection
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            startIcon={<SelectAllIcon />}
            onClick={() => setBackgroundSelected(BACKGROUNDS.map((_, i) => i))}
            disabled={isRendering}
          >
            Select all
          </Button>
          <Button
            size="small"
            startIcon={<ClearAllIcon />}
            onClick={() => setBackgroundSelected([])}
            disabled={isRendering}
          >
            Clear
          </Button>
        </Box>
      </Box>

      {/* Grid of background previews */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(5, 1fr)",
          },
          gap: 1.5,
        }}
      >
        {BACKGROUNDS.map((bg, index) => {
          const selected = backgroundsSelected.includes(index);

          return (
            <Box
              key={bg.id}
              onClick={() => {
                setBackgroundSelected((prev) =>
                  selected ? prev.filter((i) => i !== index) : [...prev, index]
                );
              }}
              sx={{
                pointerEvents: isRendering ? "none" : "auto", // disables hover/click
                opacity: isRendering ? 0.5 : 1, // faded look
                position: "relative",
                aspectRatio: "1 / 1",
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                border: selected ? "3px solid #1976d2" : "1px solid #ddd",
                boxShadow: selected
                  ? "0 4px 16px rgba(25,118,210,0.25)"
                  : "none",
                transition: "all .2s",
                "&:hover": { transform: "scale(1.02)" },
                background: bg.backgroundColor,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              {/* Background name overlay */}
              <Typography
                variant="caption"
                sx={{
                  width: "100%",
                  textAlign: "center",
                  py: 0.5,
                  bgcolor: "rgba(0,0,0,0.4)",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                {bg.name}
              </Typography>

              {/* Checkmark indicator */}
              {selected && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(25,118,210,0.8)",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                  }}
                >
                  ✓
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
