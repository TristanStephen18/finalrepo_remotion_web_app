import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useRef } from "react";

export const TemplateCard: React.FC<{
  label: string;
  description: string;
  onTry: (template: string, description: string) => void;
}> = ({ label, description, onTry }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2;
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        transition: "transform 0.18s, box-shadow 0.18s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0px 10px 30px rgba(12, 18, 30, 0.12)",
        },
        bgcolor: "background.paper",
        cursor: "pointer",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Preview */}
      <Box sx={{ position: "relative", height: 160 }}>
        <video
          ref={videoRef}
          muted
          playsInline
          preload="metadata"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          src={`/template_previews/${label.replace(/\s+/g, "")}.mp4`}
        />
      </Box>

      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {label}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, minHeight: 40 }}
        >
          {description}
        </Typography>
        <Button
          fullWidth
          onClick={() => onTry(label, description)}
          sx={{
            borderRadius: "50px",
            textTransform: "none",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #d81b60 0%, #42a5f5 100%)",
            color: "white",
            "&:hover": {
              opacity: 0.92,
            },
          }}
        >
          Try this template
        </Button>
      </CardContent>
    </Card>
  );
};
