import { useState, useCallback } from "react";
import { detectFileType } from "../../utils/FileTypeDetector";
import { backendPrefix } from "../../config";

interface useDatasetUploadOptions {
  uploadUrl?: string;
  fieldName?: string;
  saveRecord?: boolean;
  recordUrl?: string;
  template: string;
}

interface useDatasetUploadResult {
  isUploading: boolean;
  error: string | null;
  uploadedUrl: string | null;
  uploadFile: (file: File) => Promise<{ fileUrl: any; jsonData: any } | null>;
}

export function useDatasetUpload(
  options: useDatasetUploadOptions
): useDatasetUploadResult {
  const {
    uploadUrl = `${backendPrefix}/uploadhandler/upload-datasets`,
    fieldName = "file",
    saveRecord = true,
    recordUrl = `${backendPrefix}/datasets`,
    template,
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      let saveData;
      if (!file) return null;

      setIsUploading(true);
      setError(null);

      const type = detectFileType(file);

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
            body: JSON.stringify({ url: fileUrl, type, template }),
          });

          if (!saveResponse.ok) {
            throw new Error(
              `Failed to save upload: ${
                saveResponse.status
              } ${await saveResponse.text()}`
            );
          }

          saveData = await saveResponse.json();
          console.log("✅ Upload saved to DB:", saveData);
        }

        return { fileUrl, jsonData: saveData.extractedData };
      } catch (err) {
        console.error("Upload failed:", err);
        const msg =
          err instanceof Error ? err.message : "Unknown upload error occurred.";
        setError(msg);
        alert(
          "There was an error encountered while extracting the data from your file. Please try again"
        );
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [uploadUrl, fieldName, saveRecord, recordUrl]
  );

  return { isUploading, error, uploadedUrl, uploadFile };
}
