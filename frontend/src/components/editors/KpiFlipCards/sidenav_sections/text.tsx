import React, { useState } from "react";
import { fontOptions } from "../../../../data/Fonts";
import { Tabs, Tab, Box } from "@mui/material";

export const TextSettingsPanel: React.FC<{
  title: string;
  setTitle: (v: string) => void;
  titleFontSize: number;
  setTitleFontSize: (v: number) => void;
  titleFontColor: string;
  setTitleFontColor: (v: string) => void;
  titleFontFamily: string;
  setTitleFontFamily: (v: string) => void;
  subtitle: string;
  setSubtitle: (v: string) => void;
  subtitleFontSize: number;
  setSubtitleFontSize: (v: number) => void;
  subtitleFontColor: string;
  setSubtitleFontColor: (v: string) => void;
  subtitleFontFamily: string;
  setSubtitleFontFamily: (v: string) => void;
}> = ({
  title,
  setTitle,
  titleFontSize,
  setTitleFontSize,
  titleFontColor,
  setTitleFontColor,
  titleFontFamily,
  setTitleFontFamily,
  subtitle,
  setSubtitle,
  subtitleFontSize,
  setSubtitleFontSize,
  subtitleFontColor,
  setSubtitleFontColor,
  subtitleFontFamily,
  setSubtitleFontFamily,
}) => {
  const [tab, setTab] = useState(0);
  const cardStyle = (active: boolean): React.CSSProperties => ({
    flex: "1 1 calc(33% - 1rem)",
    minWidth: "140px",
    padding: "0.8rem",
    borderRadius: "10px",
    border: active ? "2px solid #0077ff" : "1px solid #ddd",
    background: active
      ? "linear-gradient(135deg, #0077ff22, #ffffff)"
      : "#fafafa",
    cursor: "pointer",
    boxShadow: active
      ? "0 4px 10px rgba(0, 119, 255, 0.2)"
      : "0 2px 6px rgba(0,0,0,0.05)",
    transition: "all 0.2s ease",
    textAlign: "center",
  });

  return (
    <Box
      sx={{
        marginBottom: "1.5rem",
        padding: "10px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        border: "1px solid #eee",
        height: 540,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box sx={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        bgcolor: '#fff',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        pb: 1,
      }}>
        <h3 style={{ margin: '1rem 0 0.5rem 0', color: "#0077ff" }}>
          ✍ Text Settings
        </h3>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Title" />
          <Tab label="Subtitle" />
        </Tabs>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pt: 2 }}>
        {/* Title Tab */}
        {tab === 0 && (
          <Box>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ color: "#ff4fa3", fontWeight: 600 }}>Title</label>
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                rows={2}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  resize: "none",
                  marginTop: "0.3rem",
                  fontSize: 16
                }}
              />
            </div>
            <div style={{ marginBottom: "1rem", padding:"10px" }}>
              <label style={{ color: "#ff4fa3", fontWeight: 600 }}>Title Font</label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginTop: "0.5rem",
                }}
              >
                {fontOptions.map((font) => (
                  <div
                    key={font.value}
                    onClick={() => setTitleFontFamily(font.value)}
                    style={cardStyle(titleFontFamily === font.value)}
                  >
                    <p style={{ margin: 0, fontFamily: font.value }}>{font.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ color: "#ff4fa3", fontWeight: 600 }}>
                Title Size ({titleFontSize}px)
              </label>
              <input
                type="range"
                min={32}
                max={120}
                value={titleFontSize}
                onChange={(e) => setTitleFontSize(Number(e.target.value))}
                style={{ width: "100%"}}
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ color: "#ff4fa3", fontWeight: 600 }}>Title Color</label>
              <input
                type="color"
                value={titleFontColor}
                onChange={(e) => setTitleFontColor(e.target.value)}
                style={{
                  width: "100%",
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  marginTop: "0.3rem",
                }}
              />
            </div>
          </Box>
        )}
        {/* Subtitle Tab */}
        {tab === 1 && (
          <Box>
            <div style={{ marginBottom: "2rem" }}>
              <label style={{ color: "#ff4fa3", fontWeight: 600 }}>Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  marginTop: "0.3rem",
                  fontSize: 16,
                }}
              />
            </div>
            <div style={{ marginBottom: "1rem" ,padding:"10px"}}>
              <label style={{ color: "#ff4fa3", fontWeight: 600 }}>
                Subtitle Font
              </label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginTop: "0.5rem",
                }}
              >
                {fontOptions.map((font) => (
                  <div
                    key={font.value}
                    onClick={() => setSubtitleFontFamily(font.value)}
                    style={cardStyle(subtitleFontFamily === font.value)}
                  >
                    <p style={{ margin: 0, fontFamily: font.value }}>{font.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ color: "#ff4fa3", fontWeight: 600 }}>
                Subtitle Size ({subtitleFontSize}px)
              </label>
              <input
                type="range"
                min={16}
                max={60}
                value={subtitleFontSize}
                onChange={(e) => setSubtitleFontSize(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={{ color: "#ff4fa3", fontWeight: 600 }}>
                Subtitle Color
              </label>
              <input
                type="color"
                value={subtitleFontColor}
                onChange={(e) => setSubtitleFontColor(e.target.value)}
                style={{
                  width: "100%",
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  marginTop: "0.3rem",
                  marginBottom: "1rem"
                }}
              />
            </div>
            <br />
          </Box>
        )}
      </Box>
    </Box>
  );
};
