import JSZip from "jszip";
import { saveAs } from "file-saver";

export const handleDownloadAll = async (
  combinations: any[],
  template: string
) => {
  if (!combinations.length) return;

  const zip = new JSZip();

  for (let i = 0; i < combinations.length; i++) {
    const c = combinations[i];
    if (c.exportUrl) {
      try {
        const response = await fetch(c.exportUrl);
        const blob = await response.blob();
        zip.file(`${template}_batch_output_${i + 1}.mp4`, blob);
      } catch (err) {
        console.error(`Failed to fetch ${c.exportUrl}`, err);
      }
    }
  }

  // Generate the zip and save
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${template}_batch_videos.zip`);
};
