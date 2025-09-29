import { Box, Button, Typography } from "@mui/material";
import type React from "react";
import type { FactCardsDataset } from "../../../../../models/FactCards";

export const FactCardsDatasetTable: React.FC<{
  handleRemoveDataset: (index: number) => void;
  factCardsData: FactCardsDataset[];
}> = ({ handleRemoveDataset, factCardsData }) => {
  return (
    <>
      {/* Header Row */}
      <Box
        sx={{
          display: "flex",
          px: 2,
          py: 1,
          bgcolor: "#f9fafb",
          fontWeight: 600,
          fontSize: "0.9rem",
          borderBottom: "1px solid #eee",
        }}
      >
        <Box sx={{ flex: 1 }}>Intro</Box>
        <Box sx={{ flex: 2 }}>Facts</Box>
        <Box sx={{ flex: 1 }}>Outro</Box>
        <Box sx={{ width: 80, textAlign: "center" }}>Action</Box>
      </Box>

      {/* Rows */}
      {factCardsData.map((dataset, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            px: 2,
            py: 1.5,
            borderTop: "1px solid #eee",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flex: 1, pr: 2, fontSize: "0.9rem" }}>
            <Typography fontWeight={600}>{dataset.intro.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {dataset.intro.subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {dataset.facts.map((fact, idx) => (
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
                  {fact.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {fact.description}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ flex: 1, pr: 2, fontSize: "0.9rem" }}>
            <Typography fontWeight={600}>{dataset.outro.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {dataset.outro.subtitle}
            </Typography>
          </Box>
          <Box sx={{ width: 80, textAlign: "center" }}>
            <Button
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
