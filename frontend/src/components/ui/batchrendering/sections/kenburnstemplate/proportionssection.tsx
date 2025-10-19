import { Button, Typography, Box } from "@mui/material";
// import { Box } from "lucide-react";
import { kenBurnsProportions } from "../../../../../data/KenBurnsProportions";
import type React from "react";

interface ProportionsSectionInterface {
  isRendering: boolean;
  setSelectedProportions: React.Dispatch<React.SetStateAction<string[]>>;
  selectedProportions: string[];
}

export const ImageProportionsSecion: React.FC<ProportionsSectionInterface> = ({
  setSelectedProportions,
  isRendering,
  selectedProportions,
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
          Image Proportions
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            disabled={isRendering}
            size="small"
            variant="outlined"
            onClick={() => setSelectedProportions([...kenBurnsProportions])}
          >
            Select All
          </Button>
          <Button
            disabled={isRendering}
            size="small"
            variant="outlined"
            color="error"
            onClick={() => setSelectedProportions([])}
          >
            Clear All
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
          },
          gap: 2,
        }}
      >
        {kenBurnsProportions.map((prop) => {
          const isSelected = selectedProportions?.includes(prop);

          // Hardcoded sizes
          let shapeStyle = { width: 60, height: 80 }; // fallback
          switch (prop) {
            case "large square":
              shapeStyle = { width: 100, height: 100 };
              break;
            case "normal square":
              shapeStyle = { width: 70, height: 70 };
              break;
            case "large rectangle":
              shapeStyle = { width: 70, height: 110 };
              break;
            case "normal rectangle":
              shapeStyle = { width: 60, height: 90 };
              break;
            case "small rectangle":
              shapeStyle = { width: 50, height: 70 };
              break;
          }

          return (
            <Box
              key={prop}
              onClick={() => {
                setSelectedProportions((prev) => {
                  if (!prev) return [prop];
                  return prev.includes(prop)
                    ? prev.filter((p) => p !== prop)
                    : [...prev, prop];
                });
              }}
              sx={{
                pointerEvents: isRendering ? "none" : "auto", // disables hover/click
                opacity: isRendering ? 0.5 : 1, // faded look
                border: isSelected ? "2px solid #1976d2" : "2px dashed #c6c9d6",
                borderRadius: 2,
                p: 2,
                cursor: "pointer",
                bgcolor: isSelected ? "#e3f2fd" : "#fafafa",
                transition: "0.2s",
                "&:hover": {
                  border: "2px solid #1976d2",
                  bgcolor: "#f0f7ff",
                },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              {/* Shape visualization */}
              <Box
                sx={{
                  ...shapeStyle,
                  bgcolor: "#1976d2",
                  borderRadius: 1,
                }}
              />
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{ textAlign: "center" }}
              >
                {prop}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
