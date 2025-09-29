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
import { NicheSelectionFactCards } from "../../../factcardsnichesselection";
import DatasetIcon from "@mui/icons-material/Dataset";
import SmartToyIcon from "@mui/icons-material/SmartToy";

interface FactCardsAiSectionInterface {
  selectedNiches: string[];
  setSelectedNiches: React.Dispatch<React.SetStateAction<string[]>>;
  generateDataset: () => void;
  isRendering: boolean;
  datasetQuantity: number;
  setDatasetQuantity: React.Dispatch<React.SetStateAction<number>>;
}

export const FactCardsAiSection: React.FC<FactCardsAiSectionInterface> = ({
  selectedNiches,
  setSelectedNiches,
  setDatasetQuantity,
  generateDataset,
  isRendering,
  datasetQuantity,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        mb: 3,
        bgcolor: "#fdfdfd",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          gap: 3,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            fontWeight={600}
          >
            Source
          </Typography>
          <ToggleButtonGroup exclusive size="medium">
            <ToggleButton value="ai">
              <SmartToyIcon sx={{ mr: 1 }} /> AI Generated
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            fontWeight={600}
          >
            Number of Datasets Per Niche
          </Typography>
          <TextField
            disabled={isRendering}
            type="number"
            value={datasetQuantity}
            onChange={(e) => setDatasetQuantity(Number(e.target.value))}
            inputProps={{ min: 1, style: { textAlign: "center" } }}
            sx={{ width: 120 }}
            size="small"
          />
        </Box>
        <Box sx={{ ml: { xs: 0, md: "auto" } }}>
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
      </Box>

      <NicheSelectionFactCards
        selectedNiches={selectedNiches}
        setSelectedNiches={setSelectedNiches}
      />
    </Paper>
  );
};
