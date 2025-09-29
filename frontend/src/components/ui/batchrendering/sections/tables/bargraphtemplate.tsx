import { Box, IconButton, Tooltip } from "@mui/material";
import type React from "react";
import type { BarGraphDataset } from "../../../../../models/BarGraph";
import { DeleteIcon } from "lucide-react";

export const BarGraphDatasetTable: React.FC<{
  handleRemoveDataset: (index: number) => void;
  barGraphData: BarGraphDataset[];
  isRendering: boolean;
}> = ({ handleRemoveDataset, barGraphData, isRendering }) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          bgcolor: "#f5f6fa",
          py: 1,
          px: 2,
          fontWeight: 600,
          borderBottom: "1px solid #ddd",
        }}
      >
        <Box sx={{ flex: 1 }}>Title</Box>
        <Box sx={{ flex: 1 }}>Subtitle</Box>
        <Box sx={{ flex: 2 }}>Data</Box>
        <Box sx={{ width: 80, textAlign: "center" }}>Action</Box>
      </Box>

      {barGraphData.map((dataset, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            px: 2,
            py: 1,
            borderBottom: "1px solid #f0f0f0",
            bgcolor: i % 2 === 0 ? "white" : "#fafafa",
            alignItems: "center",
          }}
        >
          <Box sx={{ flex: 1, fontWeight: 500 }}>{dataset.title}</Box>
          <Box sx={{ flex: 1, color: "text.secondary" }}>
            {dataset.subtitle}
          </Box>
          <Box sx={{ flex: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {dataset.data.map((d, idx) => (
              <Box
                key={idx}
                sx={{
                  bgcolor: "#eaf2ff",
                  px: 1.2,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "0.8rem",
                }}
              >
                {d.name}: {d.value}
              </Box>
            ))}
          </Box>
          <Box sx={{ width: 80, textAlign: "center" }}>
            <Tooltip title="Remove dataset">
              <IconButton
                size="small"
                color="error"
                disabled={isRendering}
                onClick={() => handleRemoveDataset(i)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
