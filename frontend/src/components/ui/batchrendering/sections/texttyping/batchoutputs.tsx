import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { DownloadIcon } from "lucide-react";
import type React from "react";
import { BACKGROUNDS } from "../../../../../data/TextTypingBg";
import { FONTS } from "../../../../../data/TextTypingFonts";
import { AUDIO_FILES } from "../../../../../data/TextTypingAudios";
import { handleDownloadAll } from "../../../../../utils/DownloadAll";

interface TextTypingTemplateBatchOutputsSectionInterface {
  isRendering: boolean;
  combinations: any[];
}

export const TextTypingTemplateBatchOutputsSection: React.FC<
  TextTypingTemplateBatchOutputsSectionInterface
> = ({ isRendering, combinations }) => {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight={700} sx={{ flexGrow: 1 }}>
          Batch Outputs ({combinations.length})
        </Typography>

        {/* Show only when rendering is done and at least one video is ready */}
        {!isRendering && combinations.some((c) => c.exportUrl) && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={() => {
              handleDownloadAll(combinations, "texttyping")
            }}
          >
            Download All
          </Button>
        )}
      </Box>

      {combinations.length === 0 ? (
        <Typography color="text.secondary">No batch generated yet.</Typography>
      ) : (
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
          {combinations.map((c, i) => {
            const bg = BACKGROUNDS[c.backgroundIndex];
            const font = FONTS[c.fontIndex];
            const sound = AUDIO_FILES[c.soundIndex];

            return (
              <Box
                key={i}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  p: 1,
                }}
              >
                {/* Video / Placeholder */}
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "9 / 16",
                    maxHeight: 300,
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "#f9f9f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {c.exportUrl ? (
                    <video
                      controls
                      src={c.exportUrl}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : c.status === "exporting" ? (
                    <CircularProgress size={32} />
                  ) : c.status === "error" ? (
                    <Typography color="error" fontSize="0.85rem">
                      ❌ Export failed
                    </Typography>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        textAlign: "center",
                        p: 1,
                        fontSize: "0.85rem",
                      }}
                    >
                      📹 Waiting to render...
                    </Typography>
                  )}
                </Box>

                {/* Meta Info */}
                <Box sx={{ mt: 0.5, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ fontSize: "0.85rem", fontWeight: 600 }}
                    noWrap
                  >
                    {c.phrase.lines.join(" / ")}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", fontSize: "0.75rem" }}
                  >
                    BG: {bg.name} • Font: {font.name} • Sound: {sound.name}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
