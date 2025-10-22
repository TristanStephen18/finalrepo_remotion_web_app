import React, { useState, useRef, useEffect } from "react";
import { FakeTextVideoSideNavigation } from "./Sidenav";
import { ChatVideoPreview } from "../../layout/EditorPreviews/FakeTextConversationPreview";
import { defaultchats } from "./DefaultData";
import { VoiceSelector } from "./sidenav_sections/Voice";
import { MessagesPanel } from "./sidenav_sections/Chats";
import { AvatarSelector } from "./sidenav_sections/Avatars";
import { ChatStylePanel } from "./sidenav_sections/ThemesAndFonts";
import { BackgroundVideoSelectorPanel } from "../Global/sidenav_sections/BackgroundVideoSelector";
import { MusicSelector } from "../Global/BackgroundMusic";
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

type ChatLine = { speaker: "person_1" | "person_2"; text: string };

export const FakeTextConversationEditor: React.FC = () => {
  const { id } = useParams();

  const [templateName, setTemplateName] = useState(
    "🎬 Fake Text Conversation Template"
  );
  const [chatdata, setChatData] = useState(defaultchats);
  const [voice1, setVoice1] = useState("21m00Tcm4TlvDq8ikWAM");
  const [voice2, setVoice2] = useState("2EiwWnXFnvU5JabPnv8n");
  const [chats, setChats] = useState<ChatLine[]>([
    { speaker: "person_1", text: "Hey, have you tried The Green Fork yet?" },
    { speaker: "person_2", text: "Not yet. Is it any good?" },
  ]);
  const [previewSize, setPreviewSize] = useState(1);
  const [duration, setDuration] = useState(10);

  const [chatTheme, setChatTheme] = useState<
    "default" | "discord" | "messenger" | "whatsapp"
  >("discord");
  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [fontSize, setFontSize] = useState(28);
  const [fontColor, setFontColor] = useState("");

  const [bgVideo, setBgVideo] = useState(`https://res.cloudinary.com/dnxc1lw18/video/upload/v1760964769/ss4_yvpblt.mp4`);
  const [chatAudio, setChatAudio] = useState(`https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/other_audios/fakeconvo.mp3`);
  const [serverAudio, setServerAudio] = useState("");
  const [musicAudio, setMusicAudio] = useState(
    `https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/bgmusics/bg10.mp3`
  );
  const [avatars, setAvatars] = useState({
    left: `https://res.cloudinary.com/dnxc1lw18/image/upload/v1760977048/v7_njhvnm.avif`,
    right: `https://res.cloudinary.com/dnxc1lw18/image/upload/v1760977048/v10_lzbfv0.jpg`,
  });

  const [isUpdatingTemplate, setIsUpdatingTemplate] = useState(false);
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [previewBg, setPreviewBg] = useState<"dark" | "light" | "grey">("dark");
  const [activeSection, setActiveSection] = useState<
    "messages" | "voice" | "avatar" | "display" | "background" | "music"
  >("messages");
  const [collapsed, setCollapsed] = useState(false);

  const defaultvalues = {
    musicBase: 0.12,
    musicWhileTalking: 0.06,
    duckAttackMs: 120,
    duckReleaseMs: 240,
    timeShiftSec: 0,
  };

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
      () => setMessageIndex((p) => (p + 1) % messages.length),
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

  const createJsonFileandAudio = async () => {
    setIsUpdatingTemplate(true);
    try {
      const payload = { voices: [voice1, voice2], chats };
      const res = await fetch(`${backendPrefix}/sound/test-generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setChatData(data);
      setChatAudio(data.audioUrl);
      setServerAudio(data.audioUrl);
      setDuration(Math.ceil(data.duration));
    } catch (err) {
      console.error("Failed to update template ❗", err);
      alert("Template update failed, please try again.");
    } finally {
      setIsUpdatingTemplate(false);
    }
  };

  const handleExport = async (format: string) => {
    setIsExporting(true);
    try {
      const response = await fetch(`${backendPrefix}/generatevideo/faketextconvo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatPath: "chats.json",
          bgVideo,
          chatAudio,
          musicAudio,
          musicBase: defaultvalues.musicBase,
          musicWhileTalking: defaultvalues.musicWhileTalking,
          duckAttackMs: defaultvalues.duckAttackMs,
          duckReleaseMs: defaultvalues.duckReleaseMs,
          timeShiftSec: defaultvalues.timeShiftSec,
          fontFamily,
          fontSize,
          fontColor,
          chatTheme,
          avatars,
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
            templateId: 9,
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
    templateId: 9, 
    buildProps: () => {
      return {
        chats,
        voice1,
        voice2,
        chatdata,
        duration,
        serverAudio,
        chatPath: "chats.json",
        bgVideo,
        chatAudio,
        musicAudio,
        musicBase: defaultvalues.musicBase,
        musicWhileTalking: defaultvalues.musicWhileTalking,
        duckAttackMs: defaultvalues.duckAttackMs,
        duckReleaseMs: defaultvalues.duckReleaseMs,
        timeShiftSec: defaultvalues.timeShiftSec,
        fontFamily,
        fontSize,
        fontColor,
        chatTheme,
        avatars,
      };
    },
    videoEndpoint:`${backendPrefix}/generatevideo/faketextconvo`,

    filterRenderProps: (props) => {
      const {
        chats,
        voice1,
        voice2,
        chatdata,
        duration,
        serverAudio,
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
          setTemplateName(data.title);

          setProjectId(data.id);
          setBgVideo(data.props.bgVideo);
          setMusicAudio(data.props.musicAudio);
          setFontFamily(data.props.fontFamily);
          setFontSize(data.props.fontSize);
          setFontColor(data.props.fontColor);
          setChatTheme(data.props.chatTheme);
          setAvatars(data.props.avatars);
          // ✅ Restore persisted states
          if (data.props.chats) setChats(data.props.chats);
          if (data.props.voice1) setVoice1(data.props.voice1);
          if (data.props.voice2) setVoice2(data.props.voice2);
          if (data.props.chatdata) setChatData(data.props.chatdata);
          if (data.props.duration) setDuration(data.props.duration);
          if (data.props.serverAudio) setChatAudio(data.props.serverAudio);

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
    if (result) {
      setBgVideo(result.url);
      fetchUserVideos();
    }
  };

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

        <FakeTextVideoSideNavigation
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

            {activeSection === "messages" && (
              <MessagesPanel chats={chats} setChats={setChats} />
            )}
            {activeSection === "voice" && (
              <VoiceSelector
                setVoice1={setVoice1}
                setVoice2={setVoice2}
                voice1={voice1}
                voice2={voice2}
                onUpdateTemplate={createJsonFileandAudio}
                isUpdatingTemplate={isUpdatingTemplate}
              />
            )}
            {activeSection === "avatar" && (
              <AvatarSelector avatars={avatars} setAvatars={setAvatars} />
            )}
            {activeSection === "display" && (
              <ChatStylePanel
                chatTheme={chatTheme}
                fontColor={fontColor}
                fontFamily={fontFamily}
                fontSize={fontSize}
                setChatTheme={setChatTheme}
                setFontColor={setFontColor}
                setFontFamily={setFontFamily}
                setFontSize={setFontSize}
              />
            )}
            {activeSection === "background" && (
              <BackgroundVideoSelectorPanel
                bgVideo={bgVideo}
                setBgVideo={setBgVideo}
                defaultVideos={defaultVideos}
                loadingVideos={loadingVideos}
                recentVideos={recentVideos}
                handleVideoUpload={handleVideoUpload}
                gettingDefaultVids={defaultvidsloading}
              />
            )}
            {activeSection === "music" && (
              <MusicSelector
                musicAudio={musicAudio}
                setMusicAudio={setMusicAudio}
              />
            )}
          </div>
        )}

        <ChatVideoPreview
          chatdata={chatdata}
          cycleBg={cycleBg}
          duration={duration}
          previewBg={previewBg}
          previewScale={previewSize}
          avatars={avatars}
          bgVideo={bgVideo}
          chatAudio={chatAudio}
          chatTheme={chatTheme}
          fontColor={fontColor}
          fontFamily={fontFamily}
          fontSize={fontSize}
          musicAudio={musicAudio}
          showSafeMargins={showSafeMargins}
          onPreviewScaleChange={setPreviewSize}
          onToggleSafeMargins={setShowSafeMargins}
        />
      </div>
    </div>
  );
};
