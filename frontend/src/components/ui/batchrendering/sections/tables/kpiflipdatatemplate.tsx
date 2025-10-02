import { Box, Button, Typography } from "@mui/material";
import type React from "react";
import type { KpiFlipData } from "../../../../../models/KpiFlipData";

export const KpiFlipDatasetTable: React.FC<{
  handleRemoveDataset: (index: number) => void;
  kpiFlipData: KpiFlipData[];
  isRendering: boolean;
}> = ({ handleRemoveDataset, kpiFlipData, isRendering }) => {
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
        <Box sx={{ flex: 1 }}>Title</Box>
        <Box sx={{ flex: 1 }}>Subtitle</Box>
        <Box sx={{ flex: 2 }}>Cards</Box>
        <Box sx={{ width: 80, textAlign: "center" }}>Action</Box>
      </Box>

      {/* Rows */}
      {kpiFlipData.map((dataset, i) => (
        <Box
          key={i}
          sx={{
            pointerEvents: isRendering ? "none" : "auto", // disables hover/click
            opacity: isRendering ? 0.5 : 1, // faded look
            display: "flex",
            px: 2,
            py: 1.5,
            borderTop: "1px solid #eee",
            alignItems: "flex-start",
          }}
        >
          {/* Title */}
          <Box sx={{ flex: 1, pr: 2, fontSize: "0.9rem" }}>
            <Typography fontWeight={600}>{dataset.title}</Typography>
          </Box>

          {/* Subtitle */}
          <Box sx={{ flex: 1, pr: 2, fontSize: "0.9rem" }}>
            <Typography variant="body2" color="text.secondary">
              {dataset.subtitle}
            </Typography>
          </Box>

          {/* Cards */}
          <Box
            sx={{
              flex: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {dataset.cardsData.map((card, idx) => (
              <Box
                key={idx}
                sx={{
                  bgcolor: "#f1f5ff",
                  px: 1.2,
                  py: 0.8,
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.3 }}>
                  {card.front.label}: {card.front.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Back → {card.back.label}: {card.back.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ width: 80, textAlign: "center" }}>
            <Button
              disabled={isRendering}
              size="small"
              color="error"
              onClick={() => handleRemoveDataset(i)}
            >
              Remove
            </Button>
          </Box>
        </Box>
      ))}
    </>
  );
};
