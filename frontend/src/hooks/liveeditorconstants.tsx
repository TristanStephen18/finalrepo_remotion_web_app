// hooks/usePreviewControls.ts
import { useState } from "react";

export function usePreviewControls() {
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
     const [previewSize, setPreviewSize] = useState(1);
     
       const [backgroundImage, setBackgroundImage] = useState(
         `https://res.cloudinary.com/dnxc1lw18/image/upload/v1760979566/bg11_deliyh.jpg`
       );
       const [backgroundSource, setBackgroundSource] = useState<
         "upload" | "default"
       >("default");

  const cycleBg = () => {
    setPreviewBg((prev) =>
      prev === "dark" ? "light" : prev === "light" ? "grey" : "dark"
    );
  };

  return {
    showSafeMargins,
    setShowSafeMargins,
    previewBg,
    setPreviewBg,
    cycleBg,
    previewSize,
    setPreviewSize,
    backgroundImage,
    setBackgroundImage,
    backgroundSource,
    setBackgroundSource
  };
}
