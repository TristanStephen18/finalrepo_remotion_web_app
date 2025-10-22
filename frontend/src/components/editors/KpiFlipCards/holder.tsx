import React, { useState, useRef, useEffect } from "react";
import { BackgroundSecTrial } from "../Global/sidenav_sections/Backgrounds";
import { KpiFlipSideNav } from "./Sidenav";
import type { CardData } from "../../remotion_compositions/KpiFlipCards";
import { KpiFlipCardsPreview } from "../../layout/EditorPreviews/KpiFlipCardsPreview";
import { TextSettingsPanel } from "./sidenav_sections/Text";
import { CardsLayoutPanel } from "./sidenav_sections/Layout";
import { CardStylingPanel } from "./sidenav_sections/CardStyling";
import { AnimationSettingsPanel } from "./sidenav_sections/Animation";
import { CardDataPanel } from "./sidenav_sections/Data";
import { defaultpanelwidth } from "../../../data/DefaultValues";
import { ExportModal } from "../../ui/modals/ExportModal";
import { TopNavWithSave } from "../../navigations/single_editors/WithSave";
import { useProjectSave } from "../../../hooks/SaveProject";
import { SaveProjectModal } from "../../ui/modals/SaveModal";
import { LoadingOverlay } from "../../ui/modals/LoadingProjectModal";
import { useParams } from "react-router-dom";
import { useFileUpload } from "../../../hooks/uploads/HandleImageUpload";
import { useBackgroundImages } from "../../../hooks/datafetching/UserImagesAndOnlineImages";
import { backendPrefix } from "../../../config";

export const KpiFlipCardEditor: React.FC = () => {
  const { id } = useParams();
  const { isUploading, uploadedUrl, uploadFile } = useFileUpload({
    type: "image",
  });

  const [templateName, setTemplateName] = useState(
    "🎬 KPI Flip Cards Template"
  );
  const [previewSize, setPreviewSize] = useState(1);

  // Background
  const [backgroundImage, setBackgroundImage] = useState(
    `https://res.cloudinary.com/dnxc1lw18/image/upload/v1760979566/bg11_deliyh.jpg`
  );
  const [backgroundSource, setBackgroundSource] = useState<
    "upload" | "default"
  >("default");

  // Title / Subtitle
  const [title, setTitle] = useState("Performance\nDashboard");
  const [titleFontSize, setTitleFontSize] = useState(96);
  const [titleFontColor, setTitleFontColor] = useState("#FFFFFF");
  const [titleFontFamily, setTitleFontFamily] = useState(
    "Inter, system-ui, sans-serif"
  );

  const [subtitle, setSubtitle] = useState("Real-time Analytics");
  const [subtitleFontSize, setSubtitleFontSize] = useState(36);
  const [subtitleFontColor, setSubtitleFontColor] = useState("#E5E7EB");
  const [subtitleFontFamily, setSubtitleFontFamily] = useState(
    "Inter, system-ui, sans-serif"
  );

  // Card layout / styling
  const [cardWidth, setCardWidth] = useState(360);
  const [cardHeight, setCardHeight] = useState(220);
  const [cardBorderRadius, setCardBorderRadius] = useState(28);
  const [cardGrid, setCardGrid] = useState<{ rows: number; cols: number }>({
    rows: 2,
    cols: 2,
  });
  const [cardBorderColor, setCardBorderColor] = useState("#000000");
  const [cardLabelColor, setCardLabelColor] = useState("#6B7280");
  const [cardLabelFontSize, setCardLabelFontSize] = useState(28);
  const [cardBackColor, setCardBackColor] = useState("#FFFFFF");
  const [cardFrontColor, setCardFrontColor] = useState("#FFFFFF");
  const [valueFontSize, setValueFontSize] = useState(46);
  const [cardContentFontFamily, setCardContentFontFamily] = useState(
    "Inter, system-ui, sans-serif"
  );

  /** 📊 Card Data */
  const [cardsData, setCardsData] = useState<CardData[]>([
    {
      front: { label: "CTR", value: "12.5%", color: "#3B82F6" },
      back: { label: "Clicks", value: "2.4K", color: "#10B981" },
    },
    {
      front: { label: "CPA", value: "$24", color: "#8B5CF6" },
      back: { label: "ROAS", value: "4.2x", color: "#F59E0B" },
    },
    {
      front: { label: "CTR", value: "12.5%", color: "#3B82F6" },
      back: { label: "Clicks", value: "2.4K", color: "#10B981" },
    },
    {
      front: { label: "CPA", value: "$24", color: "#8B5CF6" },
      back: { label: "ROAS", value: "4.2x", color: "#F59E0B" },
    },
  ]);

  // Animation
  const [delayStart, setDelayStart] = useState(0.5);
  const [delayStep, setDelayStep] = useState(1);

  // UI
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    "text" | "layout" | "style" | "data" | "animation" | "background"
  >("text");
  const [collapsed, setCollapsed] = useState(false);

  // Export
  // const [isUploading, setIsUploading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Loading overlay
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "⏳ Preparing your template...",

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

  useEffect(() => {
    if (uploadedUrl) {
      setBackgroundImage(uploadedUrl);
      setBackgroundSource("upload");
      fetchUserUploads();
    }
  }, [uploadedUrl]);

  // Panel resize
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
      fetchOnlineImages("gradient");
    }, []);

  const handleExport = async (format: string) => {
    setIsExporting(true);
    try {
      let finalImageUrl = backgroundImage;
      const origin = window.location.origin;
      if (!finalImageUrl.startsWith(origin))
        finalImageUrl = `${origin}${finalImageUrl}`;

      const response = await fetch(`${backendPrefix}/generatevideo/kpiflipcard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          backgroundImage: finalImageUrl,
          title,
          titleFontSize,
          titleFontColor,
          titleFontFamily,
          subtitle,
          subtitleFontSize,
          subtitleFontColor,
          subtitleFontFamily,
          cardsData,
          cardWidth,
          cardHeight,
          cardBorderRadius,
          cardBorderColor,
          cardLabelColor,
          cardLabelFontSize,
          cardContentFontFamily,
          cardGrid,
          delayStart,
          delayStep,
          cardColorBack: cardBackColor,
          cardColorFront: cardFrontColor,
          valueFontSize,
          format,
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      const result = await response.json();
      const renderUrl = result.url;
      if (renderUrl) {
        const saveResponse = await fetch(`${backendPrefix}/renders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            templateId: 4,
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
      setExportUrl(result.url);
      setShowModal(true);
    } catch (error) {
      console.error("Export failed:", error);
      alert(`Export failed: ${error}`);
    } finally {
      setIsExporting(false);
    }
  };

  // 🟢 Project save hook
  const {
    setProjectId,
    isSaving,
    showSaveModal,
    setShowSaveModal,
    handleSave,
    saveNewProject,
    lastSavedProps,
  } = useProjectSave({
    templateId: 4, // 👈 unique template ID for KPI Flip
    buildProps: () => ({
      backgroundImage,
      title,
      titleFontSize,
      titleFontColor,
      titleFontFamily,
      subtitle,
      subtitleFontSize,
      subtitleFontColor,
      subtitleFontFamily,
      cardsData,
      cardWidth,
      cardHeight,
      cardBorderRadius,
      cardBorderColor,
      cardLabelColor,
      cardLabelFontSize,
      cardContentFontFamily,
      cardGrid,
      delayStart,
      delayStep,
      cardBackColor,
      cardFrontColor,
      valueFontSize,
    }),
    videoEndpoint: `${backendPrefix}/generatevideo/kpiflipcard`,
  });

  // 🟢 Load project if editing existing
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
          setTitle(data.props.title);
          setSubtitle(data.props.subtitle);
          setTitleFontSize(data.props.titleFontSize);
          setSubtitleFontSize(data.props.subtitleFontSize);
          setTitleFontColor(data.props.titleFontColor);
          setSubtitleFontColor(data.props.subtitleFontColor);
          setTitleFontFamily(data.props.titleFontFamily);
          setSubtitleFontFamily(data.props.subtitleFontFamily);
          setCardWidth(data.props.cardWidth);
          setCardHeight(data.props.cardHeight);
          setCardBorderRadius(data.props.cardBorderRadius);
          setCardBorderColor(data.props.cardBorderColor);
          setCardLabelColor(data.props.cardLabelColor);
          setCardLabelFontSize(data.props.cardLabelFontSize);
          setCardContentFontFamily(data.props.cardContentFontFamily);
          setCardGrid(data.props.cardGrid);
          setDelayStart(data.props.delayStart);
          setDelayStep(data.props.delayStep);
          setCardBackColor(data.props.cardBackColor);
          setCardFrontColor(data.props.cardFrontColor);
          setValueFontSize(data.props.valueFontSize);
          setBackgroundImage(data.props.backgroundImage);
          setCardsData(data.props.cardsData);
          lastSavedProps.current = data.props;
        })
        .catch((err) => console.error("❌ Project load failed:", err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);



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

        <KpiFlipSideNav
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

            {activeSection === "text" && (
              <TextSettingsPanel
                title={title}
                setTitle={setTitle}
                titleFontSize={titleFontSize}
                setTitleFontSize={setTitleFontSize}
                titleFontColor={titleFontColor}
                setTitleFontColor={setTitleFontColor}
                titleFontFamily={titleFontFamily}
                setTitleFontFamily={setTitleFontFamily}
                subtitle={subtitle}
                setSubtitle={setSubtitle}
                subtitleFontSize={subtitleFontSize}
                setSubtitleFontSize={setSubtitleFontSize}
                subtitleFontColor={subtitleFontColor}
                setSubtitleFontColor={setSubtitleFontColor}
                subtitleFontFamily={subtitleFontFamily}
                setSubtitleFontFamily={setSubtitleFontFamily}
              />
            )}

            {activeSection === "layout" && (
              <CardsLayoutPanel
                cardWidth={cardWidth}
                setCardWidth={setCardWidth}
                cardHeight={cardHeight}
                setCardHeight={setCardHeight}
                cardBorderRadius={cardBorderRadius}
                setCardBorderRadius={setCardBorderRadius}
                cardGrid={cardGrid}
                setCardGrid={setCardGrid}
              />
            )}

            {activeSection === "style" && (
              <CardStylingPanel
                cardBorderColor={cardBorderColor}
                setCardBorderColor={setCardBorderColor}
                cardLabelColor={cardLabelColor}
                setCardLabelColor={setCardLabelColor}
                cardLabelFontSize={cardLabelFontSize}
                setCardLabelFontSize={setCardLabelFontSize}
                cardContentFontFamily={cardContentFontFamily}
                setCardContentFontFamily={setCardContentFontFamily}
                cardBackColor={cardBackColor}
                cardFrontColor={cardFrontColor}
                setCardBackColor={setCardBackColor}
                setCardFrontColor={setCardFrontColor}
                valueFontSize={valueFontSize}
                setValueFontSize={setValueFontSize}
              />
            )}

            {activeSection === "animation" && (
              <AnimationSettingsPanel
                delayStart={delayStart}
                setDelayStart={setDelayStart}
                delayStep={delayStep}
                setDelayStep={setDelayStep}
              />
            )}

            {activeSection === "data" && (
              <CardDataPanel
                cardsData={cardsData}
                setCardsData={setCardsData}
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
          </div>
        )}

        <KpiFlipCardsPreview
          backgroundImage={backgroundImage}
          cardBorderColor={cardBorderColor}
          cardBorderRadius={cardBorderRadius}
          cardContentFontFamily={cardContentFontFamily}
          cardGrid={cardGrid}
          cardHeight={cardHeight}
          cardLabelColor={cardLabelColor}
          cardLabelFontSize={cardLabelFontSize}
          cardWidth={cardWidth}
          cardsData={cardsData}
          cycleBg={cycleBg}
          delayStart={delayStart}
          delayStep={delayStep}
          fps={30}
          previewBg={previewBg}
          subtitle={subtitle}
          subtitleFontColor={subtitleFontColor}
          subtitleFontFamily={subtitleFontFamily}
          subtitleFontSize={subtitleFontSize}
          title={title}
          titleFontColor={titleFontColor}
          titleFontFamily={titleFontFamily}
          titleFontSize={titleFontSize}
          cardColorBack={cardBackColor}
          cardColorFront={cardFrontColor}
          valueFontSize={valueFontSize}
          previewScale={previewSize}
          showSafeMargins={showSafeMargins}
          onPreviewScaleChange={setPreviewSize}
          onToggleSafeMargins={setShowSafeMargins}
        />
      </div>
    </div>
  );
};
