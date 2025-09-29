import { Box, Button, TextField, Typography } from "@mui/material";
import type React from "react";

interface EditableJsonAreaInterface {
  hasChanges: boolean;
  uploadedJsonText: string;
  handleJsonChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFinalize: () => void;
}

export const EditableJsonArea: React.FC<EditableJsonAreaInterface> = ({
  hasChanges,
  uploadedJsonText,
  handleJsonChange,
  handleFinalize,
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 1,
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={600}
          sx={{ color: "text.secondary" }}
        >
          Edit Dataset JSON
        </Typography>
        {hasChanges && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleFinalize}
          >
            Finalize Dataset
          </Button>
        )}
      </Box>
      <TextField
        multiline
        minRows={10}
        fullWidth
        value={uploadedJsonText}
        onChange={handleJsonChange}
        sx={{ fontFamily: "monospace" }}
      />
    </Box>
  );
};
