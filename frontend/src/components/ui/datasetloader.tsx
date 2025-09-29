import { Box, CircularProgress, Typography } from "@mui/material";

export const datasetLoader = (loaderLabel: string) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        gap: 2,
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body2" color="text.secondary">
        {loaderLabel}
      </Typography>
    </Box>
  );
};
