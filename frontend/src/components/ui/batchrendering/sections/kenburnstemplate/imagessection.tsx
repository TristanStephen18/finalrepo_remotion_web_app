import React, { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { ImageSlot } from "../../../../batchrendering/imageslotkenburns";
import { ChooseUploadModalBatchRenderingKenburns } from "../../../modals/chooseuploadmodal_batchrendering_kenburns";

interface ImagesSectionInterface {
  userImages: string[];
  setUserImages: React.Dispatch<React.SetStateAction<string[]>>;
  isRendering: boolean;
  setShowUploadsModal: React.Dispatch<React.SetStateAction<boolean>>;
  showUploadsModal?: boolean;
  userUploads?: any[];
}

export const ImagesSection: React.FC<ImagesSectionInterface> = ({
  userImages,
  setUserImages,
  isRendering,
  setShowUploadsModal,
  showUploadsModal = false,
  userUploads = [],
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  return (
    <Box>
      {/* Modal for choosing uploads */}
      <ChooseUploadModalBatchRenderingKenburns
        open={showUploadsModal}
        onClose={() => setShowUploadsModal(false)}
        userUploads={userUploads}
        onSelect={(selectedImages: string[]) => {
          setUserImages((prev: string[]) => [
            ...prev,
            ...selectedImages.filter((img) => !prev.includes(img)),
          ]);
        }}
      />
      {/* Sticky Top Bar */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "background.paper",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
          px: 2,
          borderBottom: "1px solid #eee",
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Images Upload
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Upload Multiple Images */}
          <Box>
            <input
              disabled={isRendering}
              type="file"
              accept="image/*"
              id="add-image-upload"
              style={{ display: "none" }}
              onChange={async (e) => {
                const files = e.target.files;
                if (!files || files.length === 0) return;

                setIsUploading(true);
                setUploadError(null);

                const formData = new FormData();
                Array.from(files).forEach((file) => {
                  formData.append("images", file); // must match backend field name
                });

                try {
                  const res = await fetch(
                    "/uploadhandler/upload-multiple-kenburns-images",
                    {
                      method: "POST",
                      body: formData,
                    }
                  );
                  const data = await res.json();

                  if (res.ok) {
                    setUserImages((prev: any) => [
                      ...prev,
                      ...data.images.map((img: any) => img.url),
                    ]);
                    for (const imgObj of data.images) {
                      try {
                        const saveResponse = await fetch("/useruploads", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${
                              localStorage.getItem("token") || ""
                            }`,
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
                        console.error(
                          "Failed to save uploaded image to DB:",
                          err
                        );
                      }
                    }
                  } else {
                    setUploadError(
                      data.error || "Upload failed. Please try again."
                    );
                  }
                } catch (err) {
                  console.error("Upload failed:", err);
                  setUploadError("Unexpected error during upload.");
                } finally {
                  setIsUploading(false);
                  (e.target as HTMLInputElement).value = "";
                  console.log(userImages);
                }
              }}
              multiple
            />
            <Box
              onClick={() =>
                !isUploading &&
                document.getElementById("add-image-upload")?.click()
              }
              sx={{
                px: 2,
                py: 1,
                border: "2px dashed #1976d2",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isUploading ? "not-allowed" : "pointer",
                fontSize: 16,
                fontWeight: 700,
                color: "#1976d2",
                bgcolor: isUploading ? "#e0e0e0" : "#f9fbff",
                "&:hover": {
                  bgcolor: isUploading ? "#e0e0e0" : "#eef5ff",
                },
                position: "relative",
                minWidth: 120,
              }}
            >
              {isUploading ? (
                <CircularProgress size={24} color="primary" />
              ) : (
                "Upload Images"
              )}
            </Box>
          </Box>
          {/* Upload Folder */}
          <Box>
            <input
              disabled={isRendering}
              type="file"
              id="add-folder-upload"
              style={{ display: "none" }}
              // @ts-ignore directory upload attributes
              webkitdirectory="true"
              directory="true"
              multiple
              onChange={async (e) => {
                const files = e.target.files;
                if (!files || files.length === 0) return;
                setIsUploading(true);
                setUploadError(null);

                const formData = new FormData();
                Array.from(files).forEach((file) => {
                  formData.append("images", file);
                });

                try {
                  const res = await fetch(
                    "/uploadhandler/upload-kenburns-folder",
                    {
                      method: "POST",
                      body: formData,
                    }
                  );
                  const data = await res.json();
                  if (res.ok) {
                    setUserImages((prev: any) => [
                      ...prev,
                      ...data.images.map((img: any) => img.url),
                    ]);
                    for (const imgObj of data.images) {
                      try {
                        const saveResponse = await fetch("/useruploads", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${
                              localStorage.getItem("token") || ""
                            }`,
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
                        console.error(
                          "Failed to save uploaded image to DB:",
                          err
                        );
                      }
                    }
                  } else {
                    setUploadError(data.error || "Folder upload failed.");
                  }
                } catch (err) {
                  console.error("Folder upload failed:", err);
                  setUploadError("Unexpected error during folder upload.");
                } finally {
                  setIsUploading(false);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
            <Box
              onClick={() =>
                !isUploading &&
                document.getElementById("add-folder-upload")?.click()
              }
              sx={{
                px: 2,
                py: 1,
                border: "2px dashed #388e3c",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isUploading ? "not-allowed" : "pointer",
                fontSize: 16,
                fontWeight: 700,
                color: "#388e3c",
                bgcolor: isUploading ? "#e0e0e0" : "#f1fff4",
                "&:hover": {
                  bgcolor: isUploading ? "#e0e0e0" : "#e6ffea",
                },
                position: "relative",
                minWidth: 120,
              }}
            >
              {isUploading ? (
                <CircularProgress size={24} color="success" />
              ) : (
                "Upload Folder"
              )}
            </Box>
          </Box>
          {/* Choose from your uploads */}
          <Box>
            <Box
              onClick={() => {
                if (isRendering) {
                  alert("Cannot open uploads when rendering");
                } else {
                  setShowUploadsModal(true);
                }
              }}
              sx={{
                px: 2,
                py: 1,
                border: isRendering ? "2px solid #b3b2b2ff" : "2px solid #888",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 700,
                color: "#444",
                bgcolor: isRendering ? "#9e9999ff" : "#f7f7f7",
                minWidth: 120,
                transition: "background 0.2s",
                "&:hover": { bgcolor: "#eaeaea" },
              }}
            >
              Choose from your uploads
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Error message for uploads */}
      {uploadError && (
        <Typography color="error" variant="caption" sx={{ mt: 1, mb: 2 }}>
          {uploadError}
        </Typography>
      )}

      {userImages.length === 0 && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" color="text.secondary" align="center">
            This is where your images will appear
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 2,
          mt: 2,
        }}
      >
        {userImages.map((img: string, i: number) => (
          <ImageSlot
            key={i}
            index={i}
            img={img}
            isRendering={isRendering}
            onUpload={async (file: any) => {
              const formData = new FormData();
              formData.append("image", file);
              const res = await fetch("/uploadhandler/upload-kenburns-image", {
                method: "POST",
                body: formData,
              });
              const data = await res.json();
              if (res.ok) {
                setUserImages((prev: any) => {
                  const arr = [...prev];
                  arr[i] = data.url;
                  return arr;
                });

                const saveResponse = await fetch("/useruploads", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${
                      localStorage.getItem("token") || ""
                    }`,
                  },
                  body: JSON.stringify({ type: "image", url: data.url }),
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
              }
            }}
            onRemove={() =>
              setUserImages((prev: any) =>
                prev.filter((_: any, idx: number) => idx !== i)
              )
            }
          />
        ))}
      </Box>
    </Box>
  );
};
