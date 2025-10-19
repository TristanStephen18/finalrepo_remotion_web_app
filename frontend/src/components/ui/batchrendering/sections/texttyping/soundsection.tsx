import { Box, Button, IconButton, Typography } from "@mui/material";
import { PauseIcon } from "lucide-react";
import React from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { AUDIO_FILES } from "../../../../../data/TextTypingAudios";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import SelectAllIcon from "@mui/icons-material/SelectAll";

interface TextTypingSoundSelectionSectionInterface {
  setPlayingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  playingIndex: number | null;
  isRendering: boolean;
  soundsSelected: number[];
  setSoundSelected: React.Dispatch<React.SetStateAction<number[]>>;
}

export const TextTypingSoundSelectionSection: React.FC<
  TextTypingSoundSelectionSectionInterface
> = ({
  isRendering,
  playingIndex,
  setPlayingIndex,
  setSoundSelected,
  soundsSelected,
}) => {
  const audioRefs = React.useRef<HTMLAudioElement[]>([]);
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
          Audio Selection
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            startIcon={<SelectAllIcon />}
            onClick={() => setSoundSelected(AUDIO_FILES.map((_, i) => i))}
            disabled={isRendering}
          >
            Select all
          </Button>
          <Button
            size="small"
            startIcon={<ClearAllIcon />}
            onClick={() => setSoundSelected([])}
            disabled={isRendering}
          >
            Clear
          </Button>
        </Box>
      </Box>

      {/* Audio Cards */}
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
        {AUDIO_FILES.map((sound, index) => {
          const selected = soundsSelected.includes(index);
          const isPlaying = playingIndex === index;

          const togglePlay = () => {
            const current = audioRefs.current[index];
            if (!current) return;

            if (isPlaying) {
              current.pause();
              setPlayingIndex(null);
            } else {
              // Pause any other playing audio
              audioRefs.current.forEach((audio, i) => {
                if (audio && i !== index) audio.pause();
              });
              current.play();
              setPlayingIndex(index);
            }
          };

          return (
            <Box
              key={sound.id}
              onClick={() =>
                setSoundSelected((prev) =>
                  selected ? prev.filter((i) => i !== index) : [...prev, index]
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
                minHeight: 140,
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

              {/* Audio Label */}
              <Typography variant="h6" fontWeight={600} mb={1}>
                {sound.name}
              </Typography>

              {/* Tags */}
              <Typography variant="body2" color="text.secondary" mb={1}>
                Mood: {sound.mood}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Best with: {sound.bestWith.join(", ")}
              </Typography>

              {/* Play / Pause Button */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                sx={{ mt: 1 }}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>

              {/* Hidden audio element */}
              <audio
                ref={(el) => {
                  if (el) audioRefs.current[index] = el;
                }}
                src={sound.filename}
                onEnded={() => setPlayingIndex(null)}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
