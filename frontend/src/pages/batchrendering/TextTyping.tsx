import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import type { Phrase } from "../../models/TextTyping";
import {
  CategoryOptions,
  MoodOptions,
} from "../../components/editors/NewTextTypingEditor/Data";
import { SideBarHearder } from "../../components/ui/batchrendering/sidenav/Header";
import { BatchRenderingSideNavFooter } from "../../components/ui/batchrendering/sidenav/Footer";
import { TexttTypingBatchRenderingInidicator } from "../../components/ui/batchrendering/progressindicators/TextTypingProgressIndicator";
import { TextTypingDatasetSection } from "../../components/ui/batchrendering/sections/texttyping/DatasetSection";
import { TextTypingBackgroundsSection } from "../../components/ui/batchrendering/sections/texttyping/ThemesSection";
import { TextTypingFontsSelectionSection } from "../../components/ui/batchrendering/sections/texttyping/FontSelectionSection";
import { TextTypingSoundSelectionSection } from "../../components/ui/batchrendering/sections/texttyping/SoundSection";
import { TextTypingTemplateBatchOutputsSection } from "../../components/ui/batchrendering/sections/texttyping/BatchOutputs";
import { useDatasetsFetching } from "../../hooks/datafetching/DatasetFilesFetching";
import { useDatasetUpload } from "../../hooks/uploads/HandleDatasetsFileUpload";
import { FiDatabase, FiGrid, FiImage, FiMenu, FiMusic, FiType, FiX } from "react-icons/fi";
import { backendPrefix } from "../../config";

export const TextTypingTemplateBatchRendering: React.FC = () => {

    const {fetchUserDatasets, userDatasets} = useDatasetsFetching();
  
  const [backgroundsSelected, setBackgroundSelected] = useState<number[]>([]);
  const [soundsSelected, setSoundSelected] = useState<number[]>([]);
  const [fontsSelected, setFontsSelected] = useState<number[]>([]);
  const [phrasesData, setPhrasesData] = useState<Phrase[]>([]);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "dataset" | "backgrounds" | "fonts" | "sound" | "outputs"
  >("dataset");

  const [datasetSource, setDatasetSource] = useState<"recite" | "ai">("recite");
  const [datasetQuantity, setDatasetQuantity] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [combinations, setCombinations] = useState<any[]>([]);
  const [renderQueue, setRenderQueue] = useState<number[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [showProgressCard, setShowProgressCard] = useState(true);
  const [loaderLabel, setLoaderLabel] = useState("Fetching datasets...");

  useEffect(() => {
    if (loading) {
      const messages = [
        "Fetching datasets...",
        "Still working...",
        "Crunching numbers...",
        "Almost done...",
      ];
      let index = 0;

      const interval = setInterval(() => {
        index = (index + 1) % messages.length;
        setLoaderLabel(messages[index]);
      }, 4000); // change message every 4s

      return () => clearInterval(interval); // cleanup when loading stops
    } else {
      setLoaderLabel("Fetching datasets...");
    }
  }, [loading]);

  const randomPick = <T,>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

  const generateDataset = async () => {
    setLoading(true);
    try {
      if (datasetSource === "recite") {
        // Run multiple requests in parallel
        const promises = Array.from({ length: datasetQuantity }, () =>
          fetch("https://recite.onrender.com/api/v1/random").then((r) => {
            if (!r.ok) throw new Error(`Recite error ${r.status}`);
            return r.json();
          })
        );

        const results = await Promise.all(promises);

        const mapped: Phrase[] = results.map((q: any) => ({
          lines: q.quote
            .split(/[,.:;!?]/)
            .map((s: string) => s.trim())
            .filter(Boolean),
          category: randomPick(CategoryOptions),
          mood: randomPick(MoodOptions),
        }));

        setPhrasesData(mapped);
      } else if (datasetSource === "ai") {
        // ✅ Your provided AI function
        const res = await fetch(`${backendPrefix}/api/generate/texttypingdataset`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: datasetQuantity }),
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();
        setPhrasesData(data.phrase); // assuming { phrase: Phrase[] }
      }
    } catch (err) {
      console.error("Dataset error:", err);
      alert("Failed to generate dataset");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBatch = () => {
    setShowProgressCard(true);

    if (
      phrasesData.length === 0 ||
      backgroundsSelected.length === 0 ||
      fontsSelected.length === 0 ||
      soundsSelected.length === 0
    ) {
      alert(
        "You are missing some selections. Please complete all selections first."
      );
      return;
    }

    const combos: any[] = [];

    phrasesData.forEach((phrase) => {
      backgroundsSelected.forEach((bgIndex) => {
        fontsSelected.forEach((fontIndex) => {
          soundsSelected.forEach((soundIndex) => {
            combos.push({
              phrase,
              backgroundIndex: bgIndex,
              fontIndex: fontIndex,
              soundIndex: soundIndex,
              status: "pending",
              exportUrl: null,
            });
          });
        });
      });
    });

    setCombinations(combos);
    setRenderQueue(combos.map((_, i) => i));
    setActiveSection("outputs");
    setIsRendering(true);
    setCurrentIndex(0);
  };

  const handleExportForCombination = async (combo: any, index: number) => {
    updateCombination(index, { status: "exporting" });

    try {
      const response = await fetch(`${backendPrefix}/generatevideo/newtexttypingrender`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phrase: combo.phrase,
          backgroundIndex: combo.backgroundIndex,
          fontIndex: combo.fontIndex,
          audioIndex: combo.soundIndex,
          format: "mp4",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

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
            templateId: 2,
            outputUrl: renderUrl,
            type: "mp4",
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
      updateCombination(index, { status: "ready", exportUrl: data.url });
    } catch (err) {
      console.error("Export failed:", err);
      updateCombination(index, { status: "error" });
    }
  };

  useEffect(() => {
    if (!isRendering || currentIndex === null) return;

    const combo = combinations[currentIndex];
    if (!combo) return;

    const renderNext = async () => {
      await handleExportForCombination(combo, currentIndex);

      // move to next index
      setCurrentIndex((prev) => {
        if (prev === null) return null;
        if (prev + 1 < renderQueue.length) {
          return prev + 1;
        } else {
          setIsRendering(false); // ✅ finished
          return null;
        }
      });
    };

    renderNext();
  }, [isRendering, currentIndex]);

  const updateCombination = (index: number, updates: Partial<any>) => {
    setCombinations((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...updates } : c))
    );
  };

  const handleRemovePhrase = (index: number) => {
    setPhrasesData((prev) => prev.filter((_, i) => i !== index));
  };

   const { uploadFile} = useDatasetUpload({
    template: "texttyping"
  });

  useEffect(()=>{
    fetchUserDatasets();
  },[])

  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "dataset", label: "Dataset", icon: <FiDatabase /> },
    { id: "backgrounds", label: "Backgrounds", icon: <FiImage /> },
    { id: "fonts", label: "Fonts", icon: <FiType /> },
    { id: "sound", label: "Sound", icon: <FiMusic /> },
    { id: "outputs", label: "Batch Outputs", icon: <FiGrid /> },
  ] as const;


  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* === Mobile Header === */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3 z-40">
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          🎬 Text Typing Template Batch Rendering
        </Typography>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-gray-600 hover:text-gray-900"
        >
          <FiMenu size={22} />
        </button>
      </header>

      {/* === Desktop Sidebar === */}
      <aside
        className={`hidden md:flex fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 flex-col justify-between shadow-sm z-30
          ${collapsed ? "w-[72px]" : "w-[260px]"}`}
      >
        {/* Sidebar Header */}
        <SideBarHearder
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          title="🎬 Text Typing Template Batch Rendering"
        />

        {/* Navigation */}
        <nav className="flex flex-col flex-1 space-y-1 px-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-2">
          <BatchRenderingSideNavFooter
            handleGenerateBatch={handleGenerateBatch}
            isRendering={isRendering}
            singleOutputLocation="/template/newtexttyping"
          />
        </div>
      </aside>

      {/* === Mobile Overlay === */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* === Mobile Drawer === */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg border-r border-gray-200 z-40 transform transition-transform duration-300 md:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} w-64`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🎬 Text Typing Template Batch Rendering
          </Typography>
          <button onClick={() => setMobileOpen(false)} className="text-gray-600">
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileOpen(false);
                }}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 mt-4 p-4">
          <BatchRenderingSideNavFooter
            handleGenerateBatch={handleGenerateBatch}
            isRendering={isRendering}
            singleOutputLocation="/template/newtexttyping"
          />
        </div>
      </div>

      {/* === Main Content === */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 bg-gray-50 md:ml-0 ${
          collapsed ? "md:ml-[72px]" : "md:ml-[260px]"
        } mt-[56px] md:mt-0`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {showProgressCard &&
            (isRendering ||
              (currentIndex === null && combinations.length > 0)) && (
              <TexttTypingBatchRenderingInidicator
                currentIndex={currentIndex}
                isRendering={isRendering}
                renderQueue={renderQueue}
                setActiveSection={setActiveSection}
                setShowProgressCard={setShowProgressCard}
              />
            )}

          {activeSection === "dataset" && (
            <TextTypingDatasetSection
              datasetQuantity={datasetQuantity}
              datasetSource={datasetSource}
              generateDataset={generateDataset}
              handleRemovePhrase={handleRemovePhrase}
              isRendering={isRendering}
              loaderLabel={loaderLabel}
              loading={loading}
              phrasesData={phrasesData}
              setDatasetQuantity={setDatasetQuantity}
              setDatasetSource={setDatasetSource}
              fetchUserDataSets={fetchUserDatasets}
              setPhrasesData={setPhrasesData}
              uploadDataset={uploadFile}
              userDatasets={userDatasets}
            />
          )}

          {activeSection === "backgrounds" && (
            <TextTypingBackgroundsSection
              backgroundsSelected={backgroundsSelected}
              isRendering={isRendering}
              setBackgroundSelected={setBackgroundSelected}
            />
          )}

          {activeSection === "fonts" && (
            <TextTypingFontsSelectionSection
              isRendering={isRendering}
              fontsSelected={fontsSelected}
              setFontsSelected={setFontsSelected}
            />
          )}

          {activeSection === "sound" && (
            <TextTypingSoundSelectionSection
              isRendering={isRendering}
              playingIndex={playingIndex}
              setPlayingIndex={setPlayingIndex}
              setSoundSelected={setSoundSelected}
              soundsSelected={soundsSelected}
            />
          )}

          {activeSection === "outputs" && (
            <TextTypingTemplateBatchOutputsSection
              combinations={combinations}
              isRendering={isRendering}
            />
          )}
        </div>
      </main>
    </div>
  );
};
