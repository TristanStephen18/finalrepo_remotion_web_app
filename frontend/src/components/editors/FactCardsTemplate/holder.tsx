import React, { useState, useRef, useEffect } from "react";
import { BackgroundSecTrial } from "../Global/sidenav_sections/Backgrounds";
import { FactCardsSidenav } from "./Sidenav";
import { IntroOutroPanel } from "./sidenave_sections/Endpoints";
import type { Slide } from "../../layout/EditorPreviews/FacstCardTemplate";
import { FactPanel } from "./sidenave_sections/Facts";
import { TypographyPanelFactsTemplate } from "./sidenave_sections/Typo";
import { FacstCardPreview } from "../../layout/EditorPreviews/FacstCardTemplate";
import { DurationSection } from "./sidenave_sections/Duration";
import { defaultpanelwidth } from "../../../data/DefaultValues";
import { ExportModal } from "../../ui/modals/ExportModal";
import { TopNavWithSave } from "../../navigations/single_editors/WithSave";
import { SaveProjectModal } from "../../ui/modals/SaveModal";
import { LoadingOverlay } from "../../ui/modals/LoadingProjectModal";
import { useProjectSave } from "../../../hooks/SaveProject";
import { useParams } from "react-router-dom";
import { useFileUpload } from "../../../hooks/uploads/HandleImageUpload";
import { useBackgroundImages } from "../../../hooks/datafetching/UserImagesAndOnlineImages";
import { backendPrefix } from "../../../config";

export const FactCardsEditor: React.FC = () => {
  const { id } = useParams();
  const { isUploading, uploadedUrl, uploadFile } = useFileUpload({
    type: "image",
  });

  const [templateName, setTemplateName] = useState("🎬 Fact Cards Template");
  const [intro, setIntro] = useState<Slide>({
    title: "Your intro title",
    subtitle: "Your intro subtitle",
  });
  const [outro, setOutro] = useState<Slide>({
    title: "Your outro title",
    subtitle: "Your outro subtitle",
  });
  const [factsArray, setFactsArray] = useState<Slide[]>([
    { title: "Your fact no.1", description: "The moon is made up of cheese" },
  ]);

  const [titleFontSize, setTitleFontSize] = useState(80);
  const [subtitleFontSize, setSubtitleFontSize] = useState(50);
  const [titleFontColor, setTitleFontColor] = useState("white");
  const [subtitleFontColor, setSubtitleFontColor] = useState("white");
  const [titleFontFamily, setTitleFontFamily] = useState("Russo");
  const [subtitleFontFamily, setSubtitleFontFamily] = useState("Russo");

  const [backgroundImage, setBackgroundImage] = useState(
    `https://res.cloudinary.com/dnxc1lw18/image/upload/v1760979566/bg11_deliyh.jpg`
  );
  const [backgroundSource, setBackgroundSource] = useState<
    "upload" | "default"
  >("default");

  const [duration, setDuration] = useState(20);
  const [previewSize, setPreviewSize] = useState(1);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");

  const [activeSection, setActiveSection] = useState<
    "background" | "typography" | "endpoints" | "facts" | "duration"
  >("endpoints");
  const [collapsed, setCollapsed] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "⏳ Preparing your template...",

    "🙇 Sorry for the wait, still working on it...",
    "🚀 Almost there, thanks for your patience!",
  ];
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(
      () => setMessageIndex((prev) => (prev + 1) % messages.length),
      10000
    );
    return () => clearInterval(interval);
  }, [isLoading]);

  const [panelWidth, setPanelWidth] = useState(defaultpanelwidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth =
        e.clientX - (panelRef.current?.getBoundingClientRect().left || 0);
      if (newWidth > 200 && newWidth < 600) setPanelWidth(newWidth);
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

  useEffect(() => {
    if (uploadedUrl) {
      setBackgroundImage(uploadedUrl);
      setBackgroundSource("upload");
      fetchUserUploads();
    }
  }, [uploadedUrl]);

  const handleExport = async (format: string) => {
    setIsExporting(true);
    try {
      let finalImageUrl = backgroundImage;
      const response = await fetch(`${backendPrefix}/generatevideo/factstemplaterender`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intro,
          outro,
          facts: factsArray,
          backgroundImage: finalImageUrl,
          fontSizeTitle: titleFontSize,
          fontSizeSubtitle: subtitleFontSize,
          fontFamilyTitle: titleFontFamily,
          fontColorTitle: titleFontColor,
          fontColorSubtitle: subtitleFontColor,
          fontFamilySubtitle: subtitleFontFamily,
          duration,
          format,
        }),
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      const renderUrl = data.url;
      if (renderUrl) {
        const saveResponse = await fetch(`${backendPrefix}/renders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            templateId: 7,
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
      setExportUrl(data.url);
      setShowModal(true);
    } catch (error) {
      console.error("Export failed:", error);
      alert(`Export failed: ${error}`);
    } finally {
      setIsExporting(false);
    }
  };

  const {
    setProjectId,
    isSaving,
    showSaveModal,
    setShowSaveModal,
    handleSave,
    saveNewProject,
    lastSavedProps,
  } = useProjectSave({
    templateId: 7, // 👈 unique ID for Fact Cards
    buildProps: () => ({
      intro,
      outro,
      facts: factsArray,
      backgroundImage: backgroundImage,
      fontSizeTitle: titleFontSize,
      fontSizeSubtitle: subtitleFontSize,
      fontFamilyTitle: titleFontFamily,
      fontColorTitle: titleFontColor,
      fontColorSubtitle: subtitleFontColor,
      fontFamilySubtitle: subtitleFontFamily,
      duration,
    }),
    videoEndpoint: `${backendPrefix}/generatevideo/factstemplaterender`,
  });


  useEffect(() => {
    if (id) {
      setIsLoading(true);
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
          setIntro(data.props.intro);
          setOutro(data.props.outro);
          setFactsArray(data.props.facts);
          setBackgroundImage(data.props.backgroundImage);
          setTitleFontSize(data.props.fontSizeTitle);
          setSubtitleFontSize(data.props.fontSizeSubtitle);
          setTitleFontFamily(data.props.fontFamilyTitle);
          setSubtitleFontFamily(data.props.fontFamilySubtitle);
          setTitleFontColor(data.props.fontColorTitle);
          setSubtitleFontColor(data.props.fontColorSubtitle);
          setDuration(data.props.duration);
          lastSavedProps.current = data.props;
        })
        .catch((err) => console.error("❌ Project load failed:", err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const {
    userUploads,
    loadingUploads,
    fetchUserUploads,
    onlineImages,
    loadingOnline,
    fetchOnlineImages,
    searchQuery,
    setSearchQuery,
  } = useBackgroundImages();

  useEffect(() => {
    fetchUserUploads();
    fetchOnlineImages("information");
  }, []);

  return (
    <div style={{ display: "flex", height: "100%", flex: 1 }}>
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

        <FactCardsSidenav
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
                cursor: "col-resize",
                background: "#ddd",
              }}
            />

            {activeSection === "facts" && (
              <FactPanel
                factsArray={factsArray}
                setFactsArray={setFactsArray}
              />
            )}

            {activeSection === "endpoints" && (
              <IntroOutroPanel
                intro={intro}
                outro={outro}
                setIntro={setIntro}
                setOutro={setOutro}
              />
            )}

            {activeSection === "background" && (
              <BackgroundSecTrial
                backgroundImage={backgroundImage}
                backgroundSource={backgroundSource}
                handleFileUpload={uploadFile}
                isUploading={isUploading}
                setBackgroundImage={setBackgroundImage}
                setBackgroundSource={setBackgroundSource}
                fetchOnlineImages={fetchOnlineImages}
                loadingOnline={loadingOnline}
                loadingUploads={loadingUploads}
                onlineImages={onlineImages}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                userUploads={userUploads}
              />
            )}

            {activeSection === "typography" && (
              <TypographyPanelFactsTemplate
                setSubtitleFontColor={setSubtitleFontColor}
                setSubtitleFontFamily={setSubtitleFontFamily}
                setSubtitleFontSize={setSubtitleFontSize}
                setTitleFontColor={setTitleFontColor}
                setTitleFontFamily={setTitleFontFamily}
                setTitleFontSize={setTitleFontSize}
                subtitleFontColor={subtitleFontColor}
                subtitleFontFamily={subtitleFontFamily}
                subtitleFontSize={subtitleFontSize}
                titleFontColor={titleFontColor}
                titleFontFamily={titleFontFamily}
                titleFontSize={titleFontSize}
              />
            )}

            {activeSection === "duration" && (
              <DurationSection duration={duration} setDuration={setDuration} />
            )}
          </div>
        )}

        <FacstCardPreview
          backgroundImage={backgroundImage}
          cycleBg={cycleBg}
          facts={factsArray}
          fontColorTitle={titleFontColor}
          fontFamilyTitle={titleFontFamily}
          fontColorSubtitle={subtitleFontColor}
          fontFamilySubtitle={subtitleFontFamily}
          fontSizeSubtitle={subtitleFontSize}
          fontSizeTitle={titleFontSize}
          intro={intro}
          outro={outro}
          previewBg={previewBg}
          duration={duration}
          showSafeMargins={showSafeMargins}
          previewScale={previewSize}
          onPreviewScaleChange={setPreviewSize}
          onToggleSafeMargins={setShowSafeMargins}
        />
      </div>
    </div>
  );
};
