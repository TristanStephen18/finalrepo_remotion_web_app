// hooks/useVideoUpload.ts
import { useState, useCallback } from "react";
import { backendPrefix } from "../../config";

interface UseVideoUploadResult {
  isUploading: boolean;
  error: string | null;
  uploadedUrl: string | null;
  duration: number | null;
  uploadVideo: (file: File) => Promise<{ url: string; duration: number } | null>;
}

export function useVideoUpload(): UseVideoUploadResult {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  const uploadVideo = useCallback(async (file: File) => {
    if (!file) return null;

    setIsUploading(true);
    setError(null);

    try {
      // 🔹 Step 1: Upload to server
      const formData = new FormData();
      formData.append("video", file);

      const response = await fetch(`${backendPrefix}/uploadhandler/upload-video`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      const fileUrl = data.url;
      const videoDuration = data.durationSeconds;

      setUploadedUrl(fileUrl);
      setDuration(videoDuration);

      // 🔹 Step 2: Save record in Neon DB
      const saveResponse = await fetch(`${backendPrefix}/useruploads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ type: "video", url: fileUrl }),
      });

      if (!saveResponse.ok) {
        throw new Error(
          `Failed to save upload: ${saveResponse.status} ${await saveResponse.text()}`
        );
      }

      const saveData = await saveResponse.json();
      console.log("✅ Video upload saved to DB:", saveData);

      return { url: fileUrl, duration: videoDuration };
    } catch (err) {
      console.error("❌ Upload failed:", err);
      const msg =
        err instanceof Error ? err.message : "Unknown upload error occurred.";
      setError(msg);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { isUploading, error, uploadedUrl, duration, uploadVideo };
}
