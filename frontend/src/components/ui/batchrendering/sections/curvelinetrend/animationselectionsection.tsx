import { Box, Button, Typography } from "@mui/material";
import type React from "react";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import SelectAllIcon from "@mui/icons-material/SelectAll";

type SpeedOption = "slow" | "normal" | "fast";

const speedMap: Record<SpeedOption, number> = {
  slow: 0.5,
  normal: 1,
  fast: 1.5,
};

interface CurveLineTrendAnimationSelectionSectionInterface {
  setAnimationSpeed: React.Dispatch<React.SetStateAction<string[]>>;
  isRendering: boolean;
  animationSpeeds: string[];
}

export const CurveLineTrendAnimationSelectionSection: React.FC<
  CurveLineTrendAnimationSelectionSectionInterface
> = ({ setAnimationSpeed, isRendering, animationSpeeds }) => {
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
          Animation Speed Selection
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            startIcon={<SelectAllIcon />}
            onClick={() => setAnimationSpeed(["slow", "normal", "fast"])}
            disabled={isRendering}
          >
            Select all
          </Button>
          <Button
            size="small"
            startIcon={<ClearAllIcon />}
            onClick={() => setAnimationSpeed([])}
            disabled={isRendering}
          >
            Clear
          </Button>
        </Box>
      </Box>

      {/* Speed Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {(["slow", "normal", "fast"] as SpeedOption[]).map((speed) => {
          const selected = animationSpeeds.includes(speed);
          return (
            <Box
              key={speed}
              onClick={() =>
                setAnimationSpeed((prev) =>
                  prev.includes(speed)
                    ? prev.filter((s) => s !== speed)
                    : [...prev, speed]
                )
              }
              sx={{
                cursor: "pointer",
                borderRadius: 3,
                overflow: "hidden",
                position: "relative",
                height: 200,
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
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                bgcolor: "#000",
              }}
            >
              {/* Checkmark */}
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
                    zIndex: 2,
                  }}
                >
                  ✓
                </Box>
              )}

              {/* Video preview */}
              <video
                src="https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794308/animation_fsvwiv.mp4"
                autoPlay
                loop
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onLoadedMetadata={(e) => {
                  const vid = e.currentTarget;
                  vid.playbackRate = speedMap[speed];
                }}
              />

              {/* Label */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  py: 1,
                  textAlign: "center",
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                {speed.charAt(0).toUpperCase() + speed.slice(1)}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
