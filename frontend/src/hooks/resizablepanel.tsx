// hooks/useResizablePanel.ts
import type {RefObject} from "react";
import { useState, useRef, useEffect } from "react";

interface UseResizablePanelOptions {
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

interface UseResizablePanelResult {
  panelRef: RefObject<HTMLDivElement | null>;
  panelWidth: number;
  isResizing: boolean;
  setIsResizing: (val: boolean) => void;
  setPanelWidth: (val: number) => void;
}

export function useResizablePanel({
  defaultWidth = 300,
  minWidth = 200,
  maxWidth = 600,
}: UseResizablePanelOptions = {}): UseResizablePanelResult {
  const [panelWidth, setPanelWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const panelLeft = panelRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - panelLeft;

      if (newWidth > minWidth && newWidth < maxWidth) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth]);

  return {
    panelRef,
    panelWidth,
    isResizing,
    setIsResizing,
    setPanelWidth,
  };
}
