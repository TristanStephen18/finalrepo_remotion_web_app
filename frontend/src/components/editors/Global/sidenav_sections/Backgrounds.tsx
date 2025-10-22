import type React from "react";
import { useState } from "react";
import { serverImages } from "../../../../data/BackgroundImages";

export interface BgProps {
  backgroundSource: string;
  setBackgroundSource: React.Dispatch<
    React.SetStateAction<"upload" | "default">
  >;
  backgroundImage: string;
  setBackgroundImage: React.Dispatch<React.SetStateAction<string>>;
  isUploading: boolean;
  handleFileUpload: (file: File) => void;
  userUploads: string[];
  onlineImages: string[];
  loadingOnline: boolean;
  loadingUploads: boolean;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  fetchOnlineImages: (query: string) => void;
}

export const BackgroundSecTrial: React.FC<BgProps> = ({
  backgroundImage,
  handleFileUpload,
  isUploading,
  setBackgroundImage,
  userUploads,
  loadingOnline,
  loadingUploads,
  searchQuery,
  setSearchQuery,
  onlineImages,
  fetchOnlineImages,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<
    "upload" | "default" | "online"
  >("upload");

  return (
    <div
      style={{
        marginBottom: "1.5rem",
        padding: "1rem",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        border: "1px solid #eee",
      }}
    >
      <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>Background</h3>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          borderBottom: "1px solid #eee",
        }}
      >
        {["upload", "default", "online"].map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setActiveMainTab(tab as "upload" | "default" | "online")
            }
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              background: "transparent",
              color: "#555",
              fontWeight: 600,
              cursor: "pointer",
              borderBottom:
                activeMainTab === tab
                  ? "3px solid #0077ff"
                  : "3px solid transparent",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeMainTab === "upload" && (
        <div>
          <label
            style={{
              display: "block",
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              cursor: isUploading ? "not-allowed" : "pointer",
              color: "white",
              fontWeight: 600,
              background: isUploading
                ? "#ccc"
                : "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              textAlign: "center",
              opacity: isUploading ? 0.7 : 1,
              marginBottom: "1rem",
            }}
          >
            {isUploading ? "🔄 Uploading..." : "📤 Upload Background Image"}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file);
                }
              }}
            />
          </label>

          <h4 style={{ margin: "0.5rem 0", color: "#333" }}>
            Your Uploaded Images
          </h4>

          {loadingUploads ? (
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Loading your uploads...
            </p>
          ) : (
            <div
              style={{
                maxHeight: "340px",
                overflowY: "auto",
                paddingRight: "0.5rem",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(min(150px, 100%), 1fr))",
                  gap: "0.75rem",
                }}
              >
                {userUploads.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`user-upload-${i}`}
                    style={{
                      width: "100%",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border:
                        backgroundImage === url
                          ? "3px solid #0077ff"
                          : "1px solid #ddd",
                      cursor: "pointer",
                    }}
                    onClick={() => setBackgroundImage(url)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeMainTab === "default" && (
        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            paddingRight: "0.5rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(150px, 100%), 1fr))",
              gap: "0.75rem",
            }}
          >
            {serverImages.map((url, i) => {
              const imgUrl = `${url}`;
              return (
                <img
                  src={imgUrl}
                  alt={`bg-${1 + i}`}
                  style={{
                    width: "100%",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border:
                      backgroundImage === imgUrl
                        ? "3px solid #0077ff"
                        : "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() => setBackgroundImage(imgUrl)}
                />
              );
            })}
          </div>
        </div>
      )}

      {activeMainTab === "online" && (
        <div>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Search Pixabay (e.g. nature)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
            <button
              onClick={() => fetchOnlineImages(searchQuery)}
              style={{
                padding: "0.5rem 1rem",
                background: "#0077ff",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Search
            </button>
          </div>

          {loadingOnline ? (
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Fetching images...
            </p>
          ) : (
            <div
              style={{
                maxHeight: "350px",
                overflowY: "auto",
                paddingRight: "0.5rem",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(min(150px, 100%), 1fr))",
                  gap: "0.75rem",
                }}
              >
                {onlineImages.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`pixabay-${i}`}
                    style={{
                      width: "100%",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border:
                        backgroundImage === url
                          ? "3px solid #0077ff"
                          : "1px solid #ddd",
                      cursor: "pointer",
                    }}
                    onClick={() => setBackgroundImage(url)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
