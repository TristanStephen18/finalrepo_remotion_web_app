
import type React from "react";
import { useState, useRef } from "react";
import { UserVideoUploadsModal } from "../../../ui/modals/UserVideoUploadsModal";
// import { UserVideoUploadsModal } from "../../ui/modals/uservideouploadsmodal";


export interface UploadProps {
  handleVideoUpload: (file: File) => void;
  topVideoUrl: string;
  setTopVideoUrl: React.Dispatch<React.SetStateAction<string>>;
  fetchUserVideos: ()=> void;
  recentVideos: string[];
  loadingVideos: boolean;
}

export const VideoUploadPanel: React.FC<UploadProps> = ({
  handleVideoUpload,
  topVideoUrl,
  setTopVideoUrl,
  fetchUserVideos,
  recentVideos,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedModalVideo, setSelectedModalVideo] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "video/mp4") {
        try {
          setIsUploading(true);
          await Promise.resolve(handleVideoUpload(file));
          fetchUserVideos(); // ✅ refresh list after upload
        } finally {
          setIsUploading(false);
        }
      } else {
        alert("Please upload an MP4 file");
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "video/mp4") {
        try {
          setIsUploading(true);
          await Promise.resolve(handleVideoUpload(file));
          const objectUrl = URL.createObjectURL(file);
          setTopVideoUrl(objectUrl);
          fetchUserVideos(); // ✅ refresh list after upload
        } finally {
          setIsUploading(false);
        }
      } else {
        alert("Please upload an MP4 file");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      style={{
        marginBottom: "1.5rem",
        padding: "clamp(0.75rem, 2vw, 1rem)",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        border: "1px solid #eee",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <h3
        style={{
          marginBottom: "0.75rem",
          color: "#0077ff",
          fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
        }}
      >
        Upload Your Video
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        {isUploading ? (
          <div
            style={{
              width: "100%",
              maxWidth: "300px",
              height: "150px",
              border: "2px dashed #0077ff",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,119,255,0.05)",
            }}
          >
            <div
              style={{
                border: "4px solid #ddd",
                borderTop: "4px solid #0077ff",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                animation: "spin 1s linear infinite",
              }}
            />
            <p
              style={{
                marginTop: "0.5rem",
                color: "#555",
                fontSize: "0.9rem",
              }}
            >
              Uploading...
            </p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : topVideoUrl ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "300px",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #ddd",
              aspectRatio: "16/9",
            }}
          >
            <video
              src={topVideoUrl}
              muted
              autoPlay
              loop
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <button
              onClick={() => setTopVideoUrl("")}
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                background: "rgba(255,255,255,0.8)",
                border: "none",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: "bold",
                color: "#ff4444",
              }}
            >
              ×
            </button>
          </div>
        ) : (
          <div
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{
              width: "100%",
              maxWidth: "300px",
              height: "150px",
              border: isDragging ? "2px dashed #0077ff" : "2px dashed #ddd",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: isDragging
                ? "rgba(0, 119, 255, 0.05)"
                : "#fafafa",
              transition: "all 0.2s ease",
            }}
          >
            <div
              style={{
                fontSize: "2rem",
                color: "#0077ff",
                marginBottom: "0.5rem",
              }}
            >
              +
            </div>
            <p
              style={{
                color: "#555",
                fontSize: "0.9rem",
                textAlign: "center",
                margin: "0 1rem",
              }}
            >
              Click to upload or drag and drop an MP4 file
            </p>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="video/mp4"
          style={{ display: "none" }}
        />

        {/* Choose from uploads button */}
        <button
          type="button"
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "1px solid #0077ff",
            background: "#fff",
            color: "#0077ff",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
          onClick={() => {
            setSelectedModalVideo(topVideoUrl || null);
            setModalOpen(true);
          }}
        >
          Choose from your uploads
        </button>

        {topVideoUrl && !isUploading && (
          <button
            onClick={() => setTopVideoUrl("")}
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              background: "#ff4444",
              color: "white",
              fontWeight: 600,
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Remove Video
          </button>
        )}
      </div>

      {/* ✅ Requirements box */}
      <div
        style={{
          marginTop: "1rem",
          padding: "0.75rem",
          background: "#f9f9f9",
          borderRadius: "6px",
          fontSize: "0.8rem",
          color: "#666",
        }}
      >
        <p style={{ margin: "0 0 0.5rem 0", fontWeight: "bold" }}>
          Requirements:
        </p>
        <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
          <li>MP4 format only</li>
          <li>Maximum file size: 50MB</li>
          <li>Recommended aspect ratio: 16:9</li>
        </ul>
      </div>

      {/* Modal for user uploaded videos */}
      <UserVideoUploadsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        videos={recentVideos}
        selectedVideo={selectedModalVideo}
        setSelectedVideo={setSelectedModalVideo}
        onSelect={() => {
          if (selectedModalVideo) {
            setTopVideoUrl(selectedModalVideo);
            setModalOpen(false);
          }
        }}
      />
    </div>
  );
};
