import {
  Box,
  Button,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type React from "react";
import DatasetIcon from "@mui/icons-material/Dataset";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CloudIcon from "@mui/icons-material/Cloud";

interface AiGenerateSectionDatasetQnTInterface {
  generateDataset: () => void;
  isRendering: boolean;
  setDatasetSource: React.Dispatch<React.SetStateAction<"recite" | "ai">>;
  datasetSource: "recite" | "ai";
  datasetQuantity: number;
  setDatasetQuantity: React.Dispatch<React.SetStateAction<number>>;
}

export const AiGenerateSectionDatasetQnT: React.FC<
  AiGenerateSectionDatasetQnTInterface
> = ({
  generateDataset,
  isRendering,
  setDatasetQuantity,
  setDatasetSource,
  datasetQuantity,
  datasetSource,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        gap: 3,
        mb: 3,
        bgcolor: "#fdfdfd",
      }}
    >
      {/* Dataset Source Selection */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
          Source
        </Typography>
        <ToggleButtonGroup
          value={datasetSource}
          exclusive
          onChange={(_, v) => v && setDatasetSource(v)}
          size="medium"
        >
          <ToggleButton value="recite">
            <CloudIcon sx={{ mr: 1 }} /> Recite API
          </ToggleButton>
          <ToggleButton value="ai">
            <SmartToyIcon sx={{ mr: 1 }} /> AI Generated
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Quantity Input */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
          Quantity
        </Typography>
        <TextField
          type="number"
          value={datasetQuantity}
          onChange={(e) => setDatasetQuantity(Number(e.target.value))}
          inputProps={{ min: 1, style: { textAlign: "center" } }}
          sx={{ width: 120 }}
          size="small"
        />
      </Box>

      {/* Action Button */}
      <Box sx={{ ml: "auto" }}>
        <Button
          variant="contained"
          startIcon={<DatasetIcon />}
          onClick={generateDataset}
          disabled={isRendering}
          sx={{
            borderRadius: 2,
            py: 1,
            px: 3,
            fontWeight: 600,
            textTransform: "none",
            background: "linear-gradient(90deg,#1976d2,#42a5f5)",
          }}
        >
          Generate Dataset
        </Button>
      </Box>
    </Paper>
  );
};
