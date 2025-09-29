import React, { useEffect } from "react";
import { BackgroundSecTrial } from "../Global/sidenav_sections/bg";
import { BarGraphNavs } from "./sidenav";
import { BarGraphTemplatePreview } from "../../layout/EditorPreviews/BarGraphPreview";
import { TypographyPanelBarGraphTemplate } from "./sidenav_sections/header";
import { DataPanel } from "./sidenav_sections/dataenrty";
import { BarGraphControlsPanel } from "./sidenav_sections/bargraphconfig";
import { defaultpanelwidth } from "../../../data/defaultvalues";
import { ExportModal } from "../../ui/modals/exportmodal";
import { TopNavWithSave } from "../../navigations/single_editors/withsave";
import { useProjectSave } from "../../../hooks/saveproject";
import { SaveProjectModal } from "../../ui/modals/savemodal";
import { LoadingOverlay } from "../../ui/modals/loadingprojectmodal";
import { useParams } from "react-router-dom";
import { useFileUpload } from "../../../hooks/uploads/handleimageupload";
import { useResizablePanel } from "../../../hooks/resizablepanel";
import { useLoadingMessages } from "../../../hooks/loadingtemplateoverlaymessages";
import { useCollapsed } from "../../../hooks/collapsedsidebar";
import { usePreviewControls } from "../../../hooks/liveeditorconstants";
import { useExportModal } from "../../../hooks/exportmodalstate";
import { barGraphConfigs } from "../../../hooks/singleoutputs/bargraphstates";
import { useBackgroundImages } from "../../../hooks/datafetching/userimagesandonlineimages";

export const BarGraphEditor: React.FC = () => {
  const { id } = useParams();
  const templateId = 3;
  const { isUploading, uploadedUrl, uploadFile } = useFileUpload({
    type: "image",
  });
  const { panelRef, panelWidth, isResizing, setIsResizing } = useResizablePanel(
    {
      defaultWidth: defaultpanelwidth,
      minWidth: 200,
      maxWidth: 600,
    }
  );
  const {
    isExporting,
    setIsExporting,
    exportUrl,
    setExportUrl,
    showModal,
    setShowModal,
  } = useExportModal();
  const {
    showSafeMargins,
    setShowSafeMargins,
    previewBg,
    cycleBg,
    previewSize,
    setPreviewSize,
    backgroundImage,
    setBackgroundImage,
    backgroundSource,
    setBackgroundSource,
  } = usePreviewControls();
  const { isLoading, setIsLoading, messageIndex, setMessageIndex, messages } =
    useLoadingMessages();
  const { collapsed, setCollapsed } = useCollapsed(false);

  const {
    templateName,
    setTemplateName,
    title,
    setTitle,
    subtitle,
    setSubtitle,
    titleFontSize,
    setTitleFontSize,
    subtitleFontSize,
    setSubtitleFontSize,
    titleFontColor,
    setTitleFontColor,
    subtitleFontColor,
    setSubtitleFontColor,
    fontFamily,
    setFontFamily,
    accent,
    setAccent,
    data,
    setData,
    barHeight,
    setBarHeight,
    barGap,
    setBarGap,
    barLabelFontSize,
    setBarLabelFontSize,
    barValueFontSize,
    setBarValueFontSize,
    activeSection,
    setActiveSection,
    duration,
    setDuration,
  } = barGraphConfigs();

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

  const handleExport = async (format: string) => {
    setIsExporting(true);
    try {
      let finalImageUrl = backgroundImage;
      const origin = window.location.origin;
      if (finalImageUrl.startsWith("/"))
        finalImageUrl = `${origin}${finalImageUrl}`;

      const response = await fetch("/generatevideo/bargraph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data,
          title,
          titleFontColor,
          backgroundImage: finalImageUrl,
          accent,
          subtitle,
          currency: "",
          titleFontSize,
          subtitleFontSize,
          subtitleColor: subtitleFontColor,
          barHeight,
          barGap,
          barLabelFontSize,
          barValueFontSize,
          fontFamily,
          duration,
          format,
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      const result = await response.json();
      setExportUrl(result.url);
      const renderUrl = result.url;
      if (renderUrl) {
        const saveResponse = await fetch("/renders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
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

  const {
    setProjectId,
    isSaving,
    showSaveModal,
    setShowSaveModal,
    handleSave,
    saveNewProject,
    lastSavedProps,
  } = useProjectSave({
    templateId: 3, // 👈 assign unique template ID
    buildProps: () => ({
      data,
      title,
      subtitle,
      titleFontSize,
      subtitleFontSize,
      titleFontColor,
      subtitleFontColor,
      fontFamily,
      accent,
      barHeight,
      barGap,
      barLabelFontSize,
      barValueFontSize,
      backgroundImage: backgroundImage.startsWith("/")
        ? `${window.location.origin}${backgroundImage}`
        : backgroundImage,
      duration,
    }),
    videoEndpoint: "/generatevideo/bargraph",
  });

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetch(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load project");
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setTemplateName(data.title);
          setProjectId(data.id);
          setTitle(data.props.title);
          setSubtitle(data.props.subtitle);
          setTitleFontSize(data.props.titleFontSize);
          setSubtitleFontSize(data.props.subtitleFontSize);
          setTitleFontColor(data.props.titleFontColor);
          setSubtitleFontColor(data.props.subtitleFontColor);
          setFontFamily(data.props.fontFamily);
          setAccent(data.props.accent);
          setBarHeight(data.props.barHeight);
          setBarGap(data.props.barGap);
          setBarLabelFontSize(data.props.barLabelFontSize);
          setBarValueFontSize(data.props.barValueFontSize);
          setBackgroundImage(data.props.backgroundImage);
          setData(data.props.data);
          setDuration(data.props.duration);
          lastSavedProps.current = data.props;
        })
        .catch((err) => console.error("❌ Project load failed:", err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  useEffect(() => {
    fetchUserUploads();
    fetchOnlineImages("nature");
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

        {/* sidenav */}
        <BarGraphNavs
          activeSection={activeSection}
          collapsed={collapsed}
          setActiveSection={setActiveSection}
          setCollapsed={setCollapsed}
        />

        {/* Controls Panel */}
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
            {/* Drag Handle */}
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

            {activeSection === "title" && (
              <TypographyPanelBarGraphTemplate
                accent={accent}
                fontFamily={fontFamily}
                setAccent={setAccent}
                setFontFamily={setFontFamily}
                setSubtitleFontColor={setSubtitleFontColor}
                setSubtitleFontSize={setSubtitleFontSize}
                setTitleFontColor={setTitleFontColor}
                setTitleFontSize={setTitleFontSize}
                subtitleFontColor={subtitleFontColor}
                subtitleFontSize={subtitleFontSize}
                titleFontColor={titleFontColor}
                titleFontSize={titleFontSize}
                title={title}
                setSubtitle={setSubtitle}
                setTitle={setTitle}
                subtitle={subtitle}
              />
            )}

            {activeSection === "data" && (
              <DataPanel
                data={data}
                setData={setData}
                duration={duration}
                setDuration={setDuration}
              />
            )}

            {activeSection === "graph" && (
              <BarGraphControlsPanel
                barGap={barGap}
                barHeight={barHeight}
                barLabelFontSize={barLabelFontSize}
                barValueFontSize={barValueFontSize}
                setBarGap={setBarGap}
                setBarHeight={setBarHeight}
                setBarLabelFontSize={setBarLabelFontSize}
                setBarValueFontSize={setBarValueFontSize}
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

        <BarGraphTemplatePreview
          accent={accent}
          backgroundImage={backgroundImage}
          cycleBg={cycleBg}
          data={data}
          previewBg={previewBg}
          title={title}
          titleFontColor={titleFontColor}
          barGap={barGap}
          barHeight={barHeight}
          barLabelFontSize={barLabelFontSize}
          barValueFontSize={barValueFontSize}
          subtitle={subtitle}
          subtitleColor={subtitleFontColor}
          titleFontSize={titleFontSize}
          subtitleFontSize={subtitleFontSize}
          fontFamily={fontFamily}
          previewScale={previewSize}
          duration={duration}
          showSafeMargins={showSafeMargins}
          onPreviewScaleChange={setPreviewSize}
          onToggleSafeMargins={setShowSafeMargins}
        />
      </div>
    </div>
  );
};
