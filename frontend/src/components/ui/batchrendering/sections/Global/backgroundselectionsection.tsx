import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  barGraphImages,
  serverImages,
} from "../../../../../data/BackgroundImages";
import { backendPrefix } from "../../../../../config";

interface BackgroundImagesSelectionInterface {
  isRendering: boolean;
  selectedBackgrounds: string[];
  toggleBackground: (bg: string) => void;
  type: string;

  userUploads: string[];
  fetchUserUploads: () => void;
  onlineImages: string[];
  loadingOnline: boolean;
  loadingUploads: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  fetchOnlineImages: (q: string) => void;
}

export const BackgroundImageSelectionBatchRendering: React.FC<
  BackgroundImagesSelectionInterface
> = ({
  isRendering,
  selectedBackgrounds,
  toggleBackground,
  type,
  userUploads,
  onlineImages,
  loadingOnline,
  loadingUploads,
  searchQuery,
  setSearchQuery,
  fetchOnlineImages,
  fetchUserUploads,
}) => {
  const [activeTab, setActiveTab] = useState<"system" | "user" | "online">(
    "system"
  );

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  let systemImages = serverImages;
  if (type === "analytics") {
    systemImages = barGraphImages;
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("images", file); 
    });

    try {
      const res = await fetch(`${backendPrefix}/uploadhandler/upload-multiple-images`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        for (const imgObj of data.images) {
          try {
            const saveResponse = await fetch(`${backendPrefix}/useruploads`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                type: "image",
                url: imgObj.url,
              }),
            });
            if (!saveResponse.ok) {
              throw new Error(
                `Failed to save upload: ${
                  saveResponse.status
                } ${await saveResponse.text()}`
              );
            }
            const saveData = await saveResponse.json();
            console.log("✅ Upload saved to DB:", saveData);
          } catch (err) {
            console.error("Failed to save uploaded image to DB:", err);
          }
        }
        fetchUserUploads();
      } else {
        setUploadError(data.error || "Upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError("Unexpected error during upload.");
    } finally {
      setIsUploading(false);
      (e.target as HTMLInputElement).value = "";
    }
  };

  const renderImageGrid = (images: string[]) => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(3, 1fr)",
          md: "repeat(5, 1fr)",
        },
        gap: 1.5,
      }}
    >
      {images.map((bg) => {
        const selected = selectedBackgrounds.includes(bg);
        return (
          <Box
            key={bg}
            onClick={() => toggleBackground(bg)}
            sx={{
              pointerEvents: isRendering ? "none" : "auto",
              opacity: isRendering ? 0.5 : 1,
              position: "relative",
              aspectRatio: "1 / 1",
              borderRadius: 2,
              overflow: "hidden",
              cursor: "pointer",
              border: selected ? "3px solid #1976d2" : "1px solid #ddd",
              boxShadow: selected ? "0 4px 16px rgba(25,118,210,0.25)" : "none",
              transition: "box-shadow .2s, border .2s",
              "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.2)" },
            }}
          >
            <img
              src={bg}
              alt="bg"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {selected && (
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "rgba(25,118,210,0.8)",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                }}
              >
                ✓
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Sticky Title + Tabs */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          bgcolor: "#fff",
          borderBottom: "1px solid #eee",
          padding: "10px",
        }}
      >
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1, p: 1 }}>
          Background Selection
        </Typography>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab value="system" label="System Images" />
          <Tab value="user" label="Your Images" />
          <Tab value="online" label="Online Images" />
        </Tabs>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
        {activeTab === "system" && renderImageGrid(systemImages)}

        {activeTab === "user" && (
          <Box sx={{ position: "relative" }}>
            {/* Upload More button always on top */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mb: 2,
                gap: 2,
              }}
            >
              <input
                disabled={isRendering || isUploading}
                type="file"
                accept="image/*"
                id="add-image-upload"
                style={{ display: "none" }}
                onChange={handleUpload}
                multiple
              />
              <Button
                variant="contained"
                onClick={() =>
                  document.getElementById("add-image-upload")?.click()
                }
                disabled={isUploading}
              >
                Upload More
              </Button>
            </Box>

            {uploadError && (
              <Typography color="error" sx={{ mb: 2 }}>
                {uploadError}
              </Typography>
            )}

            {/* Uploading overlay */}
            {isUploading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: "rgba(255,255,255,0.7)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 5,
                  borderRadius: 2,
                }}
              >
                <CircularProgress size={48} thickness={4} />
                <Typography
                  sx={{ mt: 2, fontWeight: 500, color: "text.secondary" }}
                >
                  Uploading images...
                </Typography>
              </Box>
            )}

            {/* Grid of uploads */}
            {loadingUploads ? (
              <Typography>Loading your uploads...</Typography>
            ) : userUploads.length > 0 ? (
              renderImageGrid(userUploads)
            ) : (
              <Typography>No uploads found.</Typography>
            )}
          </Box>
        )}

        {activeTab === "online" && (
          <Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search images..."
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={() => fetchOnlineImages(searchQuery)}
                        disabled={loadingOnline || !searchQuery}
                      >
                        <SearchIcon />
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {loadingOnline ? (
              <Typography>Loading...</Typography>
            ) : onlineImages.length > 0 ? (
              renderImageGrid(onlineImages)
            ) : (
              <Typography>No images found. Try searching.</Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
