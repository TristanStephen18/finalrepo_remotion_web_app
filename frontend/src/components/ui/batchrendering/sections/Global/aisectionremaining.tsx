import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type React from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";

interface AIGeneratedDatasetSectionWithoutAPIInterface {
  generateDataset: () => void;
  isRendering: boolean;
  datasetQuantity: number;
  setDatasetQuantity: React.Dispatch<React.SetStateAction<number>>;
}

export const AIGeneratedDatasetSectionWithoutAPI: React.FC<
  AIGeneratedDatasetSectionWithoutAPIInterface
> = ({ generateDataset, isRendering, datasetQuantity, setDatasetQuantity }) => {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Stack
        direction="row"
        spacing={3}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            Quantity
          </Typography>
          <TextField
            disabled={isRendering}
            type="number"
            value={datasetQuantity}
            onChange={(e) => setDatasetQuantity(Number(e.target.value))}
            inputProps={{ min: 1 }}
            size="small"
            sx={{ width: 120, mt: 1 }}
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<SmartToyIcon />}
          onClick={generateDataset}
          disabled={isRendering}
        >
          Generate Dataset
        </Button>
      </Stack>
    </Paper>
  );
};
