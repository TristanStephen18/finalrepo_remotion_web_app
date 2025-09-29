import { Box, Button, Typography } from "@mui/material";
import type React from "react";

export const QuoteDatasetTableDisplay: React.FC<{
  quotes: { text: string; author: string }[];
  isRendering: boolean;
  handleRemoveQuote: (index: number) => void;
}> = ({ quotes, isRendering, handleRemoveQuote }) => {
  return (
    <>
      <Box
        sx={{
          pointerEvents: isRendering ? "none" : "auto", // disables hover/click
          opacity: isRendering ? 0.5 : 1, // faded look
          display: "flex",
          px: 2,
          py: 1,
          bgcolor: "#f9fafb",
          fontWeight: 600,
          fontSize: "0.9rem",
          borderBottom: "1px solid #eee",
        }}
      >
        <Box sx={{ flex: 1 }}>Quote</Box>
        <Box sx={{ flex: 1 }}>Author</Box>
        <Box sx={{ width: 80, textAlign: "center" }}>Action</Box>
      </Box>

      {quotes.map((q, i) => (
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
          {/* Quote */}
          <Box sx={{ flex: 1, pr: 2, fontSize: "0.95rem" }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              "{q.text}"
            </Typography>
          </Box>

          {/* Author */}
          <Box
            sx={{
              flex: 1,
              fontSize: "0.9rem",
              color: "text.secondary",
            }}
          >
            {q.author}
          </Box>

          {/* Remove Button */}
          <Box sx={{ width: 80, textAlign: "center" }}>
            <Button
              disabled={isRendering}
              size="small"
              color="error"
              onClick={() => handleRemoveQuote(i)}
            >
              Remove
            </Button>
          </Box>
        </Box>
      ))}
    </>
  );
};
