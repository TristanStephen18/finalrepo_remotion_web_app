import React, { useState, useRef, useEffect } from "react";
import { CurveLineSideNav } from "./Sidenav";
import { SimpleTrendGraphPreview } from "../../layout/EditorPreviews/SimpleTrendMapPreview";
import type { SimpleGraphProps } from "../../remotion_compositions/Curvelinetrend/SimplifiedTemplateHolder";
import { CurveLineTextPanel } from "./sidenav_sections/TitleAndSubtitle";
import {
  CurveLineTrendDataPanel,
  type DataPoint,
} from "./sidenav_sections/Data";
import { PresetPanel, type GraphThemeKey } from "./sidenav_sections/Themes";
import { AnimationPanel } from "./sidenav_sections/Animation";
import { defaultpanelwidth } from "../../../data/DefaultValues";
import { ExportModal } from "../../ui/modals/ExportModal";
import { SaveProjectModal } from "../../ui/modals/SaveModal";
import { TopNavWithSave } from "../../navigations/single_editors/WithSave";
import { useParams } from "react-router-dom";
import isEqual from "lodash/isEqual";
import { LoadingOverlay } from "../../ui/modals/LoadingProjectModal";
import { backendPrefix } from "../../../config";

const initialData = [
  { label: 2015, value: 100 },
  { label: 2016, value: 150 },
  { label: 2017, value: 300 },
  { label: 2018, value: 200 },
  { label: 2019, value: 250 },
  { label: 2020, value: 400 },
  { label: 2021, value: 550 },
  { label: 2022, value: 450 },
  { label: 2023, value: 600 },
  { label: 2024, value: 750 },
];

export const CurveLineTrendEditor: React.FC = () => {
  const { id } = useParams();
  const templateId = 5;
  const [projectId, setProjectId] = useState<number | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [templateName, setTemplateName] = useState(
    "🎬 Curve Line Trend Template"
  );
  const [fontFamily, setFontfamily] = useState("Arial, sans-serif");
  const [title, setTitle] = useState("Revenue Growth");
  const [subtitle, setSubtitle] = useState("2015–2024 • Journey");
  const [data, setData] = useState<DataPoint[]>(initialData);
  const [dataType, setDataType] = useState<"$" | "%" | "#" | "number">("$");
  const [preset, setPreset] = useState<GraphThemeKey>("corporate");
  const [animationSpeed, setAnimationSpeed] = useState<
    "slow" | "normal" | "fast"
  >("normal");
  const [minimalMode, setMinimalMode] = useState(false);

  const [titleFontSize, setTitleFontSize] = useState(50);
  const [subtitleFontSize, setSubtitleFontSize] = useState(30);
  const [previewSize, setPreviewSize] = useState(1);
  const backgroundImage = "";

  const lastSavedProps = useRef<any | null>(null);

  const graphProps: SimpleGraphProps = {
    title,
    subtitle,
    titleFontSize,
    subtitleFontSize,
    fontFamily,
    data,
    dataType,
    preset,
    backgroundImage,
    animationSpeed,
    minimalMode,
  };

  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    "text" | "data" | "background" | "animation"
  >("text");
  const [collapsed, setCollapsed] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [duration, setDuration] = useState(13);
  const [isLoading, setIsLoading] = useState(false);

  const [panelWidth, setPanelWidth] = useState(defaultpanelwidth); 
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth =
        e.clientX - (panelRef.current?.getBoundingClientRect().left || 0);
      if (newWidth > 200 && newWidth < 600) {
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
  }, [isResizing]);

  const cycleBg = () => {
    if (previewBg === "dark") setPreviewBg("light");
    else if (previewBg === "light") setPreviewBg("grey");
    else setPreviewBg("dark");
  };

  const buildPropsObject = () => ({
    title,
    subtitle,
    titleFontSize,
    subtitleFontSize,
    fontFamily,
    data,
    dataType,
    preset,
    backgroundImage,
    animationSpeed,
    minimalMode,
    duration,
  });

  const handleSave = async () => {
    const currentProps = buildPropsObject();

    if (projectId) {
      if (
        lastSavedProps.current &&
        isEqual(lastSavedProps.current, currentProps)
      ) {
        alert("This design has already been saved");
        return;
      }

      setIsSaving(true);
      try {
        const exportRes = await fetch(`${backendPrefix}/generatevideo/curvelinetrend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: currentProps,
            format: "mp4",
          }),
        });

        if (!exportRes.ok) {
          const t = await exportRes.text();
          throw new Error(t || "Export failed");
        }
        const exportResult = await exportRes.json();
        const projectVidUrl = exportResult.url;

        const response = await fetch(`/projects/update/${projectId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            props: currentProps,
            projectVidUrl,
          }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          const msg = payload?.error ?? (await response.text());
          throw new Error(msg || "Failed to update project");
        }

        const result = await response.json();

        lastSavedProps.current = currentProps;

        setProjectId(result.project.id);
        localStorage.setItem("projectId", result.project.id.toString());

        alert("Design exported and saved successfully!");
      } catch (err: any) {
        console.error(err);
        alert(`❌ Save failed: ${err?.message ?? err}`);
      } finally {
        setIsSaving(false);
      }
    } else {
      setShowSaveModal(true);
    }
  };

  const saveNewProject = async (
    titleFromModal: string,
    setStatus: (s: string) => void
  ) => {
    try {
      setStatus("Saving design...");
      const currentProps = buildPropsObject();

      const exportRes = await fetch(`${backendPrefix}/generatevideo/curvelinetrend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: currentProps,
          format: "mp4",
        }),
      });

      if (!exportRes.ok) {
        const t = await exportRes.text();
        throw new Error(t || "Export failed");
      }

      const exportResult = await exportRes.json();
      const projectVidUrl = exportResult.url;

      const response = await fetch(`${backendPrefix}/projects/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: titleFromModal,
          templateId: 5,
          props: currentProps,
          projectVidUrl,
        }),
      });

      if (!response.ok) {
        const json = await response.json().catch(() => null);
        const msg =
          json?.error ?? (await response.text().catch(() => "Failed to save"));
        throw new Error(msg);
      }

      const result = await response.json();
      setProjectId(result.project.id);

      lastSavedProps.current = currentProps;

      localStorage.setItem("projectId", result.project.id.toString());

      setStatus("Saved!");
    } catch (err: any) {
      console.error("saveNewProject error", err);
      throw err; 
    }
  };

  const handleExport = async (format: string) => {
    setIsExporting(true);
    try {
      const response = await fetch(`${backendPrefix}/generatevideo/curvelinetrend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            title,
            subtitle,
            titleFontSize,
            subtitleFontSize,
            fontFamily,
            data,
            dataType,
            preset,
            backgroundImage,
            animationSpeed,
            minimalMode,
            duration,
          },
          format,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }
      const result = await response.json();
      setExportUrl(result.url);
      const renderUrl = result.url;
      if (renderUrl) {
        const saveResponse = await fetch(`${backendPrefix}/renders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            templateId,
            outputUrl: renderUrl,
            type: format,
          }),
        });

        if (!saveResponse.ok) {
          throw new Error(
            `Failed to save upload: ${
              saveResponse.status
            } ${await saveResponse.text()}`
          );
        }

        const saveData = await saveResponse.json();
        console.log("✅ Render saved to DB:", saveData);
      }
      setShowModal(true);
    } catch (error) {
      console.error("Export failed:", error);
      alert(`Export failed: ${error || "Please try again."}`);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const currentProps = buildPropsObject();
    localStorage.setItem("curveLineEditorState", JSON.stringify(currentProps));
    if (projectId) {
      localStorage.setItem("projectId", projectId.toString());
    }
  }, [
    title,
    subtitle,
    titleFontSize,
    subtitleFontSize,
    fontFamily,
    data,
    dataType,
    preset,
    animationSpeed,
    minimalMode,
    duration,
    projectId,
  ]);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      // 🟢 User opened from "My Projects"
      fetch(`${backendPrefix}/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load project");
          return res.json();
        })
        .then((data) => {
          setTemplateName(data.title);

          setProjectId(data.id);
          setTitle(data.props.title);
          setSubtitle(data.props.subtitle);
          setTitleFontSize(data.props.titleFontSize);
          setSubtitleFontSize(data.props.subtitleFontSize);
          setFontfamily(data.props.fontFamily);
          setData(data.props.data);
          setDataType(data.props.dataType);
          setPreset(data.props.preset);
          setAnimationSpeed(data.props.animationSpeed);
          setMinimalMode(data.props.minimalMode);
          setDuration(data.props.duration);

          lastSavedProps.current = data.props;
        })
        .catch((err) => {
          console.error("❌ Project load failed:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      const saved = localStorage.getItem("curveLineEditorState");
      if (saved) {
        hydrateFromParsed(JSON.parse(saved));
      }
    }
  }, [id]);

  const hydrateFromParsed = (parsed: any) => {
    setTitle(parsed.title);
    setSubtitle(parsed.subtitle);
    setTitleFontSize(parsed.titleFontSize);
    setSubtitleFontSize(parsed.subtitleFontSize);
    setFontfamily(parsed.fontFamily);
    setData(parsed.data);
    setDataType(parsed.dataType);
    setPreset(parsed.preset);
    setAnimationSpeed(parsed.animationSpeed);
    setMinimalMode(parsed.minimalMode);
    setDuration(parsed.duration);
    lastSavedProps.current = parsed;
  };

  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "⏳ Preparing your design...",

    "🙇 Sorry for the wait, still working on it...",
    "🚀 Almost there, thanks for your patience!",
  ];

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 10000); 

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#fafafa" }}>
      {isLoading && <LoadingOverlay message={messages[messageIndex]} />}
      <TopNavWithSave
        templateName={templateName}
        onSave={handleSave}
        onExport={handleExport}
        setTemplateName={setTemplateName}
        onOpenExport={() => setShowModal(true)}
        template={templateName}
        isSaving={isSaving}
      />

      <SaveProjectModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={saveNewProject}
      />

      <div style={{ display: "flex", flex: 1, marginTop: "60px" }}>
        {showModal && (
          <ExportModal
            showExport={showModal}
            setShowExport={setShowModal}
            isExporting={isExporting}
            exportUrl={exportUrl}
            onExport={handleExport}
          />
        )}
        <CurveLineSideNav
          activeSection={activeSection}
          collapsed={collapsed}
          setActiveSection={setActiveSection}
          setCollapsed={setCollapsed}
        />

        {!collapsed && (
          <div
            ref={panelRef}
            style={{
              width: `${panelWidth}px`,
              padding: "1rem",
              overflowY: "auto",
              background: "#fff",
              borderRight: "1px solid #eee",
              position: "relative",
              transition: isResizing ? "none" : "width 0.2s",
            }}
          >
            <div
              onMouseDown={() => setIsResizing(true)}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "6px",
                height: "100vh",
                cursor: "col-resize",
                background: "#ddd",
              }}
            />

            {activeSection == "text" && (
              <CurveLineTextPanel
                setSubtitle={setSubtitle}
                setSubtitleFontSize={setSubtitleFontSize}
                setTitle={setTitle}
                setTitleFontSize={setTitleFontSize}
                subtitle={subtitle}
                subtitleFontSize={subtitleFontSize}
                title={title}
                titleFontSize={titleFontSize}
                fontFamily={fontFamily}
                setFontFamily={setFontfamily}
              />
            )}

            {activeSection === "data" && (
              <CurveLineTrendDataPanel
                data={data}
                dataType={dataType}
                setData={setData}
                setDataType={setDataType}
              />
            )}

            {activeSection === "background" && (
              <PresetPanel preset={preset} setPreset={setPreset} />
            )}

            {activeSection === "animation" && (
              <AnimationPanel
                animationSpeed={animationSpeed}
                duration={duration}
                minimalMode={minimalMode}
                setAnimationSpeed={setAnimationSpeed}
                setDuration={setDuration}
                setMinimalMode={setMinimalMode}
              />
            )}
          </div>
        )}

        <SimpleTrendGraphPreview
          {...graphProps}
          duration={duration}
          previewBg={previewBg}
          cycleBg={cycleBg}
          previewScale={previewSize}
          showSafeMargins={showSafeMargins}
          onPreviewScaleChange={setPreviewSize}
          onToggleSafeMargins={setShowSafeMargins}
        />
      </div>
    </div>
  );
};
