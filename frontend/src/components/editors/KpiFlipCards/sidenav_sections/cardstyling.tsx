import React, { useState } from "react";
import { fontOptions } from "../../../../data/Fonts";
import { Tabs, Tab, Box } from "@mui/material";

export const CardStylingPanel: React.FC<{
  cardBorderColor: string;
  setCardBorderColor: (v: string) => void;
  cardFrontColor: string;
  setCardFrontColor: (v: string) => void;
  cardBackColor: string;
  setCardBackColor: (v: string) => void;
  cardLabelColor: string;
  setCardLabelColor: (v: string) => void;
  cardLabelFontSize: number;
  setCardLabelFontSize: (v: number) => void;
  cardContentFontFamily: string;
  setCardContentFontFamily: (v: string) => void;
  valueFontSize: number;
  setValueFontSize: (v: number) => void;
}> = ({
  cardBorderColor,
  setCardBorderColor,
  cardFrontColor,
  setCardFrontColor,
  cardBackColor,
  setCardBackColor,
  cardLabelColor,
  setCardLabelColor,
  cardLabelFontSize,
  setCardLabelFontSize,
  cardContentFontFamily,
  setCardContentFontFamily,
  valueFontSize,
  setValueFontSize,
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
    textAlign: "center",
    transition: "all 0.2s ease",
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
        <h3 style={{ margin: '1rem 0 0.5rem 0', color: "#0077ff" }}>🎨 Card Styling</h3>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Border & Sides" />
          <Tab label="Label" />
          <Tab label="Value" />
          <Tab label="Content Font" />
        </Tabs>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pt: 2 }}>
        {/* Border & Sides Tab */}
        {tab === 0 && (
          <Box>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ color: "#ff4fa3", fontWeight: 600 }}>Border Color</label>
              <input
                type="color"
                value={cardBorderColor}
                onChange={(e) => setCardBorderColor(e.target.value)}
                style={{ width: "100%", height: "40px", borderRadius: "6px" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ color: "#ff4fa3", fontWeight: 600 }}>Front Color</label>
              <input
                type="color"
                value={cardFrontColor}
                onChange={(e) => setCardFrontColor(e.target.value)}
                style={{ width: "100%", height: "40px", borderRadius: "6px" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ color: "#ff4fa3", fontWeight: 600 }}>Back Color</label>
              <input
                type="color"
                value={cardBackColor}
                onChange={(e) => setCardBackColor(e.target.value)}
                style={{ width: "100%", height: "40px", borderRadius: "6px" }}
              />
            </div>
          </Box>
        )}
        {/* Label Tab */}
        {tab === 1 && (
          <Box>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ color: "#ff4fa3", fontWeight: 600 }}>Label Color</label>
              <input
                type="color"
                value={cardLabelColor}
                onChange={(e) => setCardLabelColor(e.target.value)}
                style={{ width: "100%", height: "40px", borderRadius: "6px" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ color: "#ff4fa3", fontWeight: 600 }}>
                Label Size ({cardLabelFontSize}px)
              </label>
              <input
                type="range"
                min={10}
                max={48}
                value={cardLabelFontSize}
                onChange={(e) => setCardLabelFontSize(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
          </Box>
        )}
        {/* Value Tab */}
        {tab === 2 && (
          <Box>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ color: "#ff4fa3", fontWeight: 600 }}>
                Value Size ({valueFontSize}px)
              </label>
              <input
                type="range"
                min={16}
                max={96}
                value={valueFontSize}
                onChange={(e) => setValueFontSize(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
          </Box>
        )}
        {/* Content Font Tab */}
        {tab === 3 && (
          <Box>
            <label style={{ color: "#ff4fa3", fontWeight: 600 }}>
              Content Font
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
                  onClick={() => setCardContentFontFamily(font.value)}
                  style={cardStyle(cardContentFontFamily === font.value)}
                >
                  <p style={{ margin: 0, fontFamily: font.value }}>{font.label}</p>
                </div>
              ))}
            </div>
          </Box>
        )}
      </Box>
    </Box>
  );
};
