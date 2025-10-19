import type React from "react";
import { fontOptions } from "../../../../data/Fonts";
import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";

interface TypoSectionProps {
  fontFamily: string;
  setFontFamily: React.Dispatch<React.SetStateAction<string>>;
  titleFontColor: string;
  setTitleFontColor: React.Dispatch<React.SetStateAction<string>>;
  subtitleFontColor: string;
  setSubtitleFontColor: React.Dispatch<React.SetStateAction<string>>;
  titleFontSize: number;
  setTitleFontSize: React.Dispatch<React.SetStateAction<number>>;
  subtitleFontSize: number;
  setSubtitleFontSize: React.Dispatch<React.SetStateAction<number>>;
  accent: string;
  setAccent: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  subtitle: string;
  setSubtitle: React.Dispatch<React.SetStateAction<string>>;
}

export const TypographyPanelBarGraphTemplate: React.FC<TypoSectionProps> = ({
  fontFamily,
  setFontFamily,
  titleFontColor,
  setTitleFontColor,
  subtitleFontColor,
  setSubtitleFontColor,
  titleFontSize,
  setTitleFontSize,
  subtitleFontSize,
  setSubtitleFontSize,
  accent,
  setAccent,
  title,
  setTitle,
  subtitle,
  setSubtitle,
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

  const renderColorControl = (
    label: string,
    color: string,
    setColor: React.Dispatch<React.SetStateAction<string>>
  ) => (
    <div style={{ marginBottom: "1rem" }}>
      <div
        style={{ marginBottom: "0.5rem", color: "#ff4fa3", fontWeight: 600 }}
      >
        {label}
      </div>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        style={{
          width: "100%",
          height: "40px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      />
    </div>
  );

  const renderFontSizeControl = (
    label: string,
    fontSize: number,
    setFontSize: React.Dispatch<React.SetStateAction<number>>
  ) => (
    <div style={{ marginBottom: "1rem" }}>
      <div
        style={{ marginBottom: "0.5rem", color: "#ff4fa3", fontWeight: 600 }}
      >
        {label} ({fontSize}px)
      </div>
      <input
        type="range"
        min={16}
        max={120}
        value={fontSize}
        onChange={(e) => setFontSize(Number(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );

  const renderTextInput = (
    label: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    placeholder: string
  ) => (
    <div style={{ marginBottom: "1rem" }}>
      <div
        style={{ marginBottom: "0.5rem", color: "#ff4fa3", fontWeight: 600 }}
      >
        {label}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "1rem",
        }}
      />
    </div>
  );

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
        <h2 style={{ margin: '1rem 0 0.5rem 0', color: "#0077ff" }}>
          ✍ Headers and Typography
        </h2>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Title" />
          <Tab label="Subtitle" />
          <Tab label="Font Family" />
          <Tab label="Accent Color" />
        </Tabs>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pt: 2 }}>
        {tab === 0 && (
          <Box>
            {renderTextInput("Title Text", title, setTitle, "Enter title...")}
            {renderColorControl("Title Color", titleFontColor, setTitleFontColor)}
            {renderFontSizeControl("Title Size", titleFontSize, setTitleFontSize)}
          </Box>
        )}
        {tab === 1 && (
          <Box>
            {renderTextInput("Subtitle Text", subtitle, setSubtitle, "Enter subtitle...")}
            {renderColorControl("Subtitle Color", subtitleFontColor, setSubtitleFontColor)}
            {renderFontSizeControl("Subtitle Size", subtitleFontSize, setSubtitleFontSize)}
          </Box>
        )}
        {tab === 2 && (
          <Box>
            <h5 style={{ marginBottom: "1rem", color: "#0077ff" }}>Your chosen font will be applied to the whole template</h5>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
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
        {tab === 3 && (
          <Box>
            {renderColorControl("Accent Color", accent, setAccent)}
          </Box>
        )}
      </Box>
    </Box>
  );
};