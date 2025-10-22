import React, { useState, useRef, useEffect } from "react";
import { BackgroundVideoSelectorPanel } from "../Global/sidenav_sections/BackgroundVideoSelector";
import { MusicSelector } from "../Global/BackgroundMusic";
import { AiVoiceSelector } from "../Global/sidenav_sections/AiVoices";
import { RedditTypoGraphy } from "../Global/sidenav_sections/Typography";
import { StoryTellingPreview } from "../../layout/EditorPreviews/StoryTellingPreview";
import { samplestory } from "./DefaultValues";
import { StoryTellingSidePanel } from "./Sidenav";
import { StorySidePanel } from "./sidenav_sections/Story";
import { defaultpanelwidth } from "../../../data/DefaultValues";
import { ExportModal } from "../../ui/modals/ExportModal";
import { TopNavWithSave } from "../../navigations/single_editors/WithSave";
import { SaveProjectModal } from "../../ui/modals/SaveModal";
import { LoadingOverlay } from "../../ui/modals/LoadingProjectModal";
import { useProjectSave } from "../../../hooks/SaveProject";
import { useParams } from "react-router-dom";
import { useVideoUpload } from "../../../hooks/uploads/HandleVideoUploads";
import { userVideos } from "../../../hooks/datafetching/UserVideos";
import { backendPrefix } from "../../../config";

export const StoryTellingVideoEditor: React.FC = () => {
  const { id } = useParams();

  const [templateName, setTemplateName] = useState("🎬 AI Story Narration");
  const [storyData, setStoryData] = useState(samplestory);
  const [serverAudio, setServerAudio] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [story, setStory] = useState("sample");
  const [genres, setGenres] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");

  const defaulvalues = {
    backgroundOverlay: "rgba(0,0,0,0.6)",
    musicVolume: 0.2,
    voiceoverPath: "story.mp3",
  };

  const [previewSize, setPreviewSize] = useState(1);
  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [fontSize, setFontSize] = useState(42);
  const [fontColor, setFontColor] = useState("#ffffff");
  const [sentenceBgColor, setSentenceBgColor] = useState("#ff8c00");

  const [isUpdating, setIsUpdating] = useState(false);
  const [aiVoice, setAiVoice] = useState("21m00Tcm4TlvDq8ikWAM");

  const [voiceoverPath, setVoiceoverPath] = useState(
    `https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/other_audios/voice.mp3`
  );
  const [backgroundVideo, setBackgroundVideo] = useState(
    `https://res.cloudinary.com/dnxc1lw18/video/upload/v1760964482/m1_c7h3ki.mp4`
  );
  const [backgroundMusicPath, setBackgroundMusicPath] = useState(
    `https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/bgmusics/bg11.mp3`
  );

  const [duration, setDuration] = useState(2);

  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    "story" | "voice" | "text" | "background" | "music"
  >("story");
  const [collapsed, setCollapsed] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [panelWidth, setPanelWidth] = useState(defaultpanelwidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

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
      () => setMessageIndex((p) => (p + 1) % messages.length),
      10000
    );
    return () => clearInterval(interval);
  }, [isLoading]);

  // 🔹 Panel Resize Handlers
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

  async function fetchAiStory() {
    setIsGenerating(true);
    try {
      const res = await fetch(`${backendPrefix}/api/generate-story`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, genres }),
      });
      const data = await res.json();
      setStory(data.story);
    } catch (error) {
      console.error("❌ Error Fetching AI generated story");
    } finally {
      setIsGenerating(false);
    }
  }

  const createVoiceOverandScript = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`${backendPrefix}/sound/story`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: story, voiceid: aiVoice }),
      });
      const data = await res.json();
      setStoryData(data.script);
      setVoiceoverPath(data.audioUrl);
      setServerAudio(data.audioUrl);
      setDuration(Math.ceil(data.duration));
    } catch (err) {
      console.error("Failed to update template ❗", err);
      alert("Template update failed, please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExport = async (format: string) => {
    setIsExporting(true);
    try {
      const response = await fetch(`${backendPrefix}/generatevideo/storytelling`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voiceoverPath,
          duration,
          fontSize,
          fontFamily,
          fontColor,
          sentenceBgColor,
          backgroundVideo,
          backgroundMusicPath,
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
            templateId: 11,
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
    templateId: 11, // unique ID for StoryTelling

    buildProps: () => ({
      storyData,
      templateName,
      story,
      genres,
      prompt,
      aiVoice,
      serverAudio,
      voiceoverPath,
      duration,
      fontSize,
      fontFamily,
      fontColor,
      sentenceBgColor,
      backgroundVideo,
      backgroundMusicPath,
    }),

    videoEndpoint: `${backendPrefix}/generatevideo/storytelling`,

    // 👇 Filter before hitting the render API
    filterRenderProps: (props) => {
      const {
        templateName,
        story,
        genres,
        prompt,
        aiVoice,
        serverAudio,
        storyData,
        ...renderProps
      } = props;
      return renderProps; 
    },
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
          setStoryData(data.props.storyData || samplestory);
          setTemplateName(data.title);

          setProjectId(data.id);
          setStory(data.props.story || "");
          setGenres(data.props.genres || []);
          setPrompt(data.props.prompt || "");
          setBackgroundVideo(data.props.backgroundVideo);
          setAiVoice(data.props.aiVoice || "21m00Tcm4TlvDq8ikWAM");
          setVoiceoverPath(
            data.props.serverAudio || `${backendPrefix}/soundeffects/story/voice.mp3`
          );
          setBackgroundMusicPath(data.props.backgroundMusicPath);
          setFontFamily(data.props.fontFamily);
          setFontSize(data.props.fontSize);
          setFontColor(data.props.fontColor);
          setSentenceBgColor(data.props.sentenceBgColor);
          setDuration(data.props.duration || 10);
          lastSavedProps.current = data.props;
        })
        .catch((err) => console.error("❌ Project load failed:", err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const {
    fetchUserVideos,
    recentVideos,
    loadingVideos,
    defaultVideos,
    getAllDefaultVideos,
    defaultvidsloading
  } = userVideos();

  useEffect(() => {
    fetchUserVideos();
    getAllDefaultVideos();
  }, []);

  const { uploadVideo } = useVideoUpload();
  const handleVideoUpload = async (file: File) => {
    const result = await uploadVideo(file);
    if(result){
      setBackgroundVideo(result.url);
      fetchUserVideos();
    }
  }

  return (
    <div style={{ display: "flex", height: "100%", flex: 1 }}>
      {isLoading && <LoadingOverlay message={messages[messageIndex]} />}

      {/* 🔹 Top Navigation with Save */}
      <TopNavWithSave
        templateName={templateName}
        onSave={handleSave}
        onExport={handleExport}
        setTemplateName={setTemplateName}
        onOpenExport={() => setShowModal(true)}
        template={templateName}
        isSaving={isSaving}
      />

      {/* 🔹 Save Modal */}
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

        {/* Side Navigation */}
        <StoryTellingSidePanel
          activeSection={activeSection}
          collapsed={collapsed}
          setActiveSection={setActiveSection}
          setCollapsed={setCollapsed}
        />

        {/* Control Panel */}
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

            {activeSection === "story" && (
              <StorySidePanel
                fetchAiStory={fetchAiStory}
                genres={genres}
                isGenerating={isGenerating}
                prompt={prompt}
                setGenres={setGenres}
                setPrompt={setPrompt}
                setStory={setStory}
                story={story}
              />
            )}

            {activeSection === "voice" && (
              <AiVoiceSelector
                isUpdatingTemplate={isUpdating}
                onUpdateTemplate={createVoiceOverandScript}
                aiVoice={aiVoice}
                setAiVoice={setAiVoice}
              />
            )}

            {activeSection === "text" && (
              <RedditTypoGraphy
                fontColor={fontColor}
                fontFamily={fontFamily}
                fontSize={fontSize}
                sentenceBgColor={sentenceBgColor}
                setFontColor={setFontColor}
                setFontFamily={setFontFamily}
                setFontSize={setFontSize}
                setSentenceBgColor={setSentenceBgColor}
              />
            )}

            {activeSection === "background" && (
              <BackgroundVideoSelectorPanel
                bgVideo={backgroundVideo}
                setBgVideo={setBackgroundVideo}
                defaultVideos={defaultVideos}
                loadingVideos={loadingVideos}
                recentVideos={recentVideos}
                handleVideoUpload={handleVideoUpload}
                gettingDefaultVids={defaultvidsloading}
              />
            )}

            {activeSection === "music" && (
              <MusicSelector
                musicAudio={backgroundMusicPath}
                setMusicAudio={setBackgroundMusicPath}
              />
            )}
          </div>
        )}

        {/* Preview */}
        <StoryTellingPreview
          script={storyData}
          voiceoverPath={voiceoverPath}
          duration={duration}
          previewBg={previewBg}
          cycleBg={cycleBg}
          previewScale={previewSize}
          backgroundVideo={backgroundVideo}
          backgroundMusicPath={backgroundMusicPath}
          fontSize={fontSize}
          fontFamily={fontFamily}
          fontColor={fontColor}
          sentenceBgColor={sentenceBgColor}
          backgroundOverlayColor={defaulvalues.backgroundOverlay}
          showSafeMargins={showSafeMargins}
          onPreviewScaleChange={setPreviewSize}
          onToggleSafeMargins={setShowSafeMargins}
        />
      </div>
    </div>
  );
};
