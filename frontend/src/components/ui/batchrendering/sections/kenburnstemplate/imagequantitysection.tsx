import { Box, Button, Typography } from "@mui/material";

interface ImageQuantityInterface {
  setImageQuantities: React.Dispatch<React.SetStateAction<number[]>>;
  isRendering: boolean;
  userImages: string[];
  imageQuantities: number[];
}

export const ImageQuantitySection: React.FC<ImageQuantityInterface> = ({
  setImageQuantities,
  isRendering,
  userImages,
  imageQuantities,
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Number of Images per Video
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            disabled={isRendering}
            onClick={() => {
              if (userImages.length > 1) {
                const allOptions = Array.from(
                  { length: userImages.length - 1 },
                  (_, i) => i + 2
                );
                setImageQuantities(allOptions);
              }
            }}
          >
            Select All
          </Button>
          <Button
            disabled={isRendering}
            size="small"
            variant="outlined"
            color="error"
            onClick={() => setImageQuantities([])}
          >
            Clear All
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        {userImages.length > 1 ? (
          Array.from({ length: userImages.length - 1 }, (_, i) => {
            const qty = i + 2; // start at 2
            const isSelected = imageQuantities?.includes(qty);

            return (
              <Box
                key={qty}
                onClick={() => {
                  setImageQuantities((prev) => {
                    if (!prev) return [qty];
                    return prev.includes(qty)
                      ? prev.filter((x) => x !== qty)
                      : [...prev, qty];
                  });
                }}
                sx={{
                  pointerEvents: isRendering ? "none" : "auto",
                  opacity: isRendering ? 0.5 : 1,
                  border: isSelected
                    ? "2px solid #1976d2"
                    : "2px dashed #c6c9d6",
                  borderRadius: 2,
                  p: 2,
                  cursor: "pointer",
                  bgcolor: isSelected ? "#e3f2fd" : "#fafafa",
                  transition: "0.2s",
                  "&:hover": {
                    border: "2px solid #1976d2",
                    bgcolor: "#f0f7ff",
                  },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                {/* Stacked container visualization */}
                <Box
                  sx={{
                    position: "relative",
                    width: 60,
                    height: 80,
                    display: "flex",
                    alignItems: "flex-end", // so label sits at bottom
                    justifyContent: "center",
                  }}
                >
                  {Array.from({ length: qty }, (_, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        position: "absolute",
                        top: idx * 3,
                        left: idx * 3,
                        width: "100%",
                        height: "90%",
                        borderRadius: 1,
                        border: "1px solid #aaa",
                        bgcolor: "white",
                        zIndex: qty - idx,
                        boxShadow: 1,
                      }}
                    />
                  ))}

                  {/* Number label overlay */}
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    sx={{
                      position: "absolute",
                      bottom: 4, // or "top: 4" if you prefer it above
                      left: "50%",
                      transform: "translateX(-50%)",
                      bgcolor: "rgba(25,118,210,0.9)",
                      color: "white",
                      px: 1,
                      py: 0.2,
                      borderRadius: 1,
                      fontSize: "0.75rem",
                      zIndex: qty + 5, // 👈 make sure it's above all stacked boxes
                    }}
                  >
                    {qty}
                  </Typography>
                </Box>
              </Box>
            );
          })
        ) : (
          <Typography color="text.secondary">
            Upload at least 2 images to enable this section.
          </Typography>
        )}
      </Box>
    </Box>
  );
};
