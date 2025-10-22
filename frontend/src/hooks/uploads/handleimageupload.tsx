// hooks/useFileUpload.ts
import { useState, useCallback } from "react";
import { backendPrefix } from "../../config";

interface UseFileUploadOptions {
  uploadUrl?: string;  // file upload endpoint
  fieldName?: string;  // form field name
  saveRecord?: boolean; // whether to save in DB
  recordUrl?: string;   // DB insert endpoint
  type: "image" | "video"; // must be image or video
}

interface UseFileUploadResult {
  isUploading: boolean;
  error: string | null;
  uploadedUrl: string | null;
  uploadFile: (file: File) => Promise<string | null>;
}

export function useFileUpload(
  options: UseFileUploadOptions
): UseFileUploadResult {
  const {
    uploadUrl = `${backendPrefix}/uploadhandler/upload-image`,
    fieldName = "image",
    saveRecord = true,
    recordUrl = `${backendPrefix}/useruploads`,
    type,
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file) return null;

      setIsUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append(fieldName, file);

        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status}`);
        }

        const data = await response.json();
        const fileUrl = data.url;
        setUploadedUrl(fileUrl);

        if (saveRecord && fileUrl) {
          const saveResponse = await fetch(recordUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
            body: JSON.stringify({ type, url: fileUrl }),
          });

          if (!saveResponse.ok) {
            throw new Error(
              `Failed to save upload: ${saveResponse.status} ${await saveResponse.text()}`
            );
          }

          const saveData = await saveResponse.json();
          console.log("✅ Upload saved to DB:", saveData);
        }

        return fileUrl;
      } catch (err) {
        console.error("Upload failed:", err);
        const msg =
          err instanceof Error ? err.message : "Unknown upload error occurred.";
        setError(msg);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [uploadUrl, fieldName, saveRecord, recordUrl, type]
  );

  return { isUploading, error, uploadedUrl, uploadFile };
}
