import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type React from "react";
import { triviaNiches } from "../../data/FactCardsNiches";

export const NicheSelectionFactCards: React.FC<{
  selectedNiches: string[];
  setSelectedNiches: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ setSelectedNiches, selectedNiches }) => {
  return (
    <Box>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        fontWeight={600}
        sx={{ mb: 1 }}
      >
        Niche(s)
      </Typography>

      <ToggleButtonGroup
        value={selectedNiches}
        onChange={(_, newValues) => setSelectedNiches(newValues)}
        aria-label="niches"
        size="small"
        sx={{
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {triviaNiches.map((niche) => (
          <ToggleButton
            key={niche}
            value={niche}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 0.5,
              textTransform: "none",
              fontSize: "0.85rem",
            }}
          >
            {niche}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};
