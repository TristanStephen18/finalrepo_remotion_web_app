import type React from "react";
import { fontOptions } from "../../../../data/Fonts";
import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";

export interface TypoSectionProps {
  fontFamily: string;
  setFontFamily: React.Dispatch<React.SetStateAction<string>>;
  fontColor: string;
  setFontColor: React.Dispatch<React.SetStateAction<string>>;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
}

export const TypographySectionQuote: React.FC<TypoSectionProps> = ({
  fontFamily,
  fontColor,
  fontSize,
  setFontFamily,
  setFontColor,
  setFontSize,
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
        padding: "0",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        border: "1px solid #eee",
        height: 560,
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
        <h3 style={{ margin: '1rem 0 0.5rem 0', color: "#0077ff" }}>✍ Typography</h3>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Font Family" />
          <Tab label="Font Color & Size" />
        </Tabs>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pt: 2 }}>
        {/* Font Family Tab */}
        {tab === 0 && (
          <Box>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              {fontOptions.map((font) => (
                <div
                  key={font.value}
                  onClick={() => setFontFamily(font.value)}
                  style={cardStyle(fontFamily === font.value)}
                >
                  <p
                    style={{
                      margin: 0,
                      fontFamily: font.value,
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {font.label}
                  </p>
                </div>
              ))}
            </div>
          </Box>
        )}
        {/* Font Color & Size Tab */}
        {tab === 1 && (
          <Box>
            <div style={{ marginBottom: "0.5rem", color: "#ff4fa3", fontWeight: 600 }}>
              Font Color
            </div>
            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              style={{
                width: "100%",
                height: "40px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                cursor: "pointer",
                marginBottom: "1.5rem",
              }}
            />
            <div style={{ marginBottom: "0.5rem", color: "#ff4fa3", fontWeight: 600 }}>
              Font Size ({fontSize}px)
            </div>
            <input
              type="range"
              min={0.9}
              max={1.5}
              step={0.1}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
