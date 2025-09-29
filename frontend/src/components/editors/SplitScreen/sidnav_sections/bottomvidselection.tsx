
import type React from "react";
import { useState } from "react";

export interface BgProps {
  bottomVideoUrl: string;
  setBottomVideoUrl: React.Dispatch<React.SetStateAction<string>>;
  recentVideos: string[];
  loadingVideos: boolean;
  handleBottomVideoUpload: (file: File) => Promise<void>;
  defaultVideos: string[];
}

const TABS = ["Default", "Your Videos"];

export const BottomVideoSelectorPanel: React.FC<BgProps> = ({
  bottomVideoUrl,
  setBottomVideoUrl,
  recentVideos,
  loadingVideos,
  handleBottomVideoUpload,
  defaultVideos
}) => {
  const [activeTab, setActiveTab] = useState<string>("Default");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      await handleBottomVideoUpload(file);
      setUploading(false);
    }
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
      <div style={{ position: 'sticky', top: 0, zIndex: 2, background: '#fff', paddingBottom: '0.5rem' }}>
        <h3 style={{ 
          marginBottom: "0.75rem", 
          color: "#0077ff",
          fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)"
        }}>
          Select your other video
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "1rem",
            borderBottom: "1px solid #eee",
            paddingBottom: "0.5rem",
            background: '#fff',
            position: 'sticky',
            top: 48,
            zIndex: 2,
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.4rem 0.8rem",
                border: "none",
                background: activeTab === tab ? "#0077ff" : "transparent",
                color: activeTab === tab ? "#fff" : "#555",
                fontWeight: 600,
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "clamp(0.7rem, 2vw, 0.85rem)",
                whiteSpace: "nowrap",
                flex: "1 0 auto",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ maxHeight: '420px', overflowY: 'auto', paddingBottom: '1rem' }}>
        {activeTab === "Default" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100px, 100%), 1fr))",
              gap: "0.75rem",
            }}
          >
            {defaultVideos.map((videoUrl, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: bottomVideoUrl === videoUrl ? "3px solid #0077ff" : "1px solid #ddd",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  aspectRatio: "16/9",
                }}
                onClick={() => setBottomVideoUrl(videoUrl)}
              >
                <video
                  src={videoUrl}
                  muted
                  loop
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onMouseOver={e => {
                    e.currentTarget.play();
                    e.currentTarget.playbackRate = 2.5;
                  }}
                  onMouseOut={e => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                    color: "white",
                    fontSize: "clamp(8px, 1.5vw, 10px)",
                    padding: "2%",
                    textAlign: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {videoUrl.split('/').pop()}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Your Videos" && (
          <div>
            <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <label style={{ display: "inline-block" }}>
                <input
                  type="file"
                  accept="video/mp4"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <button
                  type="button"
                  style={{
                    padding: "0.5rem 1.2rem",
                    background: uploading ? "#aaa" : "#0077ff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 600,
                    cursor: uploading ? "not-allowed" : "pointer",
                    fontSize: "clamp(0.8rem, 2vw, 1rem)",
                    marginRight: "0.5rem"
                  }}
                  disabled={uploading}
                  onClick={e => {
                    if (!uploading) {
                      (e.currentTarget.previousSibling as HTMLInputElement)?.click();
                    }
                  }}
                >
                  {uploading ? "Uploading..." : "Upload Video"}
                </button>
              </label>
              {loadingVideos && <span style={{ color: '#0077ff', fontWeight: 500 }}>Loading...</span>}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(150px, 100%), 1fr))",
                gap: "0.75rem",
              }}
            >
              {recentVideos.length > 0 ? (
                recentVideos.map((videoUrl, i) => (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: bottomVideoUrl === videoUrl ? "3px solid #0077ff" : "1px solid #ddd",
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                      aspectRatio: "16/9",
                    }}
                    onClick={() => setBottomVideoUrl(videoUrl)}
                  >
                    <video
                      src={videoUrl}
                      muted
                      loop
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onMouseOver={e => {
                        e.currentTarget.play();
                        e.currentTarget.playbackRate = 2.5;
                      }}
                      onMouseOut={e => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                  </div>
                ))
              ) : !loadingVideos ? (
                <div style={{ color: '#888', fontSize: '1rem', padding: '1rem' }}>No uploaded videos found.</div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};