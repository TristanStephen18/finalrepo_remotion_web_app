import { Box, Button, Typography } from "@mui/material";
import type React from "react";
import type { Phrase } from "../../../../../models/TextTyping";

export const TextTypingDatasetTable: React.FC<{
  handleRemovePhrase: (index: number) => void;
  phrasesData: Phrase[];
  isRendering: boolean;
}> = ({ handleRemovePhrase, phrasesData, isRendering }) => {
  return (
    <>
      <Box
        sx={{
          pointerEvents: isRendering ? "none" : "auto",
          opacity: isRendering ? 0.5 : 1,
          display: "flex",
          px: 2,
          py: 1,
          bgcolor: "#f9fafb",
          fontWeight: 600,
          fontSize: "0.9rem",
          borderBottom: "1px solid #eee",
        }}
      >
        <Box sx={{ flex: 2 }}>Lines</Box>
        <Box sx={{ flex: 1 }}>Category</Box>
        <Box sx={{ flex: 1 }}>Mood</Box>
        <Box sx={{ width: 80, textAlign: "center" }}>Action</Box>
      </Box>

      {phrasesData.map((p, i) => (
        <Box
          key={i}
          sx={{
            pointerEvents: isRendering ? "none" : "auto",
            opacity: isRendering ? 0.5 : 1,
            display: "flex",
            px: 2,
            py: 1.5,
            borderTop: "1px solid #eee",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flex: 2, pr: 2, fontSize: "0.95rem" }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {p.lines}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              fontSize: "0.9rem",
              color: "text.secondary",
            }}
          >
            {p.category}
          </Box>
          <Box
            sx={{
              flex: 1,
              fontSize: "0.9rem",
              color: "text.secondary",
            }}
          >
            {p.mood}
          </Box>

          <Box sx={{ width: 80, textAlign: "center" }}>
            <Button
              disabled={isRendering}
              size="small"
              color="error"
              onClick={() => handleRemovePhrase(i)}
            >
              Remove
            </Button>
          </Box>
        </Box>
      ))}
    </>
  );
};
