import React, { useState, useRef, useEffect } from "react";
import { SideNavTrial } from "./Sidenav";
import { QuoteSecTrial } from "./sidenav_sections/Quote";
import { BackgroundSecTrial } from "../Global/sidenav_sections/Backgrounds";
import { QuoteSpotlightPreview } from "../../layout/EditorPreviews/QuoteTemplatePreview";
import { TypographySectionQuote } from "./sidenav_sections/Typo";
import { defaultpanelwidth } from "../../../data/DefaultValues";
import {
  quoteSpotlightDurationCalculator,
} from "../../../utils/QuoteSpotlightHelpers";
import { ExportModal } from "../../ui/modals/ExportModal";
// import { TopNavWithoutBatchrendering } from "../../navigations/single_editors/withoutswitchmodesbutton";
import { useProjectSave } from "../../../hooks/SaveProject";
import { useParams } from "react-router-dom";
import { TopNavWithSave } from "../../navigations/single_editors/WithSave";
import { LoadingOverlay } from "../../ui/modals/LoadingProjectModal";
import { SaveProjectModal } from "../../ui/modals/SaveModal";
import { useFileUpload } from "../../../hooks/uploads/HandleImageUpload";
import { useBackgroundImages } from "../../../hooks/datafetching/UserImagesAndOnlineImages";
import toast from "react-hot-toast";

export const QuoteTemplateEditor: React.FC = () => {
  const { id } = useParams();
  const { isUploading, uploadedUrl, uploadFile } = useFileUpload({
    type: "image",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [previewSize, setPreviewSize] = useState(1);
  const [templateName, setTemplateName] = useState(
    "🎬 Quote Spotlight Template"
  );

  const [quote, setQuote] = useState("Your Quote");
  const [author, setAuthor] = useState("Author");
  const [backgroundImage, setBackgroundImage] = useState(
    `/bgimages/colors/bg1.jpg`
  );
  const [backgroundSource, setBackgroundSource] = useState<
    "upload" | "default"
  >("default");

  const [fontFamily, setFontFamily] = useState("Cormorant Garamond, serif");
  const [fontColor, setFontColor] = useState("white");
  const [fontSize, setFontSize] = useState(1);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    "quote" | "background" | "typography" | "ai"
  >("quote");
  const [collapsed, setCollapsed] = useState(false);

  // const [isUploading, setIsUploading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  // const [autoSave, setAutoSave] = useState(false);

  // 🔹 Resizable panel state
  const [panelWidth, setPanelWidth] = useState(defaultpanelwidth); // default width
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState(9);
  const [isLoading, setIsLoading] = useState(false);

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
  // 🔹 Drag handlers
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
          setProjectId(data.id);
          // restore from backend
          setTemplateName(data.title);

          setQuote(data.props.quote);
          setAuthor(data.props.author);
          setBackgroundImage(data.props.imageurl);
          setFontFamily(data.props.fontfamily ?? "Cormorant Garamond, serif");
          setFontColor(data.props.fontcolor ?? "white");
          setFontSize(data.props.fontsize ?? 1);
          setDuration(data.props.duration);

          lastSavedProps.current = data.props;
        })
        .catch((err) => console.error("❌ Project load failed:", err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const cycleBg = () => {
    if (previewBg === "dark") setPreviewBg("light");
    else if (previewBg === "light") setPreviewBg("grey");
    else setPreviewBg("dark");
  };

  useEffect(() => {
    setDuration(quoteSpotlightDurationCalculator(quote.length));
    console.log(duration);
  }, [quote]);

  const handleAISuggestion = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/generate-quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      setAuthor(data.author);
      setQuote(data.quote);
    } catch (error: any) {
      console.error("error generating ai suggestion");
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
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
      const response = await fetch(`/generatevideo/quotetemplatewchoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote,
          author,
          imageurl: finalImageUrl,
          fontsize: fontSize,
          fontcolor: fontColor,
          fontfamily: fontFamily,
          format: format,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      const renderUrl = data.url;
      if (renderUrl) {
        const saveResponse = await fetch(`/renders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            templateId: 1,
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
      alert(`Export failed: ${error || "Please try again."}`);
    } finally {
      setIsExporting(false);
    }
  };

  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "⏳ Preparing your template...",

    "🙇 Sorry for the wait, still working on it...",
    "🚀 Almost there, thanks for your patience!",
  ];

  // 🟢 Cycle loader messages every 10s
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [isLoading]);

  const {
    setProjectId,
    isSaving,
    showSaveModal,
    setShowSaveModal,
    handleSave,
    saveNewProject,
    lastSavedProps,
  } = useProjectSave({
    templateId: 1,
    buildProps: () => ({
      quote,
      author,
      imageurl: backgroundImage,
      fontsize: fontSize,
      fontcolor: fontColor,
      fontfamily: fontFamily,
      duration,
    }),
    videoEndpoint: `/generatevideo/quotetemplatewchoices`,
  });

  useEffect(() => {
    fetchUserUploads();
    fetchOnlineImages("history");
  },[]);

  return (
    <div style={{ display: "flex", height: "100%", flex: 1 }}>
      {isLoading && <LoadingOverlay message={messages[messageIndex]} />}

      {/* modal */}
      <TopNavWithSave
        templateName={templateName}
        // onSwitchMode={onSwitchMode}
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
        <SideNavTrial
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
              transition: isResizing ? "#add" : "width 0.2s",
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

            {activeSection === "quote" && (
              <QuoteSecTrial
                author={author}
                quote={quote}
                setAuthor={setAuthor}
                setQuote={setQuote}
                handleAISuggestion={handleAISuggestion}
                isGenerating={isGenerating}
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
              <TypographySectionQuote
                fontColor={fontColor}
                fontFamily={fontFamily}
                fontSize={fontSize}
                setFontColor={setFontColor}
                setFontFamily={setFontFamily}
                setFontSize={setFontSize}
              />
            )}
          </div>
        )}

        <QuoteSpotlightPreview
          quote={quote}
          author={author}
          backgroundImage={backgroundImage}
          fontSize={fontSize}
          fontFamily={fontFamily}
          fontColor={fontColor}
          showSafeMargins={showSafeMargins}
          previewBg={previewBg}
          cycleBg={cycleBg}
          previewScale={previewSize}
          onPreviewScaleChange={setPreviewSize}
          onToggleSafeMargins={setShowSafeMargins}
          duration={duration}
        />
      </div>
    </div>
  );
};
