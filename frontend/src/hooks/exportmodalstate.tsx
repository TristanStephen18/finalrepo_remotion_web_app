// hooks/useExportModal.ts
import { useState } from "react";

export function useExportModal() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  return {
    isExporting,
    setIsExporting,
    exportUrl,
    setExportUrl,
    showModal,
    setShowModal,
  };
}
