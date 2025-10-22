import React, { useEffect, useState } from "react";
import {Typography } from "@mui/material";
// import ColorLensIcon from "@mui/icons-material/ColorLens";
import { fontFamilies } from "../../data/FontFamilies";
import type { CurveLineTrendDataset } from "../../models/CurveLineTrend";
import { durationCalculatorForCurveLineAnimationSpeeds } from "../../utils/CurveLineTrendHelpers";
import { curvelineDefaultdata } from "../../data/DefaultValues";
import { SideBarHearder } from "../../components/ui/batchrendering/sidenav/Header";
import { BatchRenderingSideNavFooter } from "../../components/ui/batchrendering/sidenav/Footer";
import { CurveLineTrendBatchRenderingInidicator } from "../../components/ui/batchrendering/progressindicators/CurveLineTrendProgressIndicator";
import { CurveLineTrendBatchRenderingDatasetSection } from "../../components/ui/batchrendering/sections/curvelinetrend/DatasetSection";
import { CurveLineTrendBatchRenderingPresetsSelectionSection } from "../../components/ui/batchrendering/sections/curvelinetrend/PresetSelectionSection";
import { BatchRenderingFontFamilySelectionSection } from "../../components/ui/batchrendering/sections/Global/FontFamilySelectionSection";
import { CurveLineTrendAnimationSelectionSection } from "../../components/ui/batchrendering/sections/curvelinetrend/AnimationSelectionSection";
import { CurveLineTrendOutputsSection } from "../../components/ui/batchrendering/sections/curvelinetrend/BatchOutputs";
import { useDatasetUpload } from "../../hooks/uploads/HandleDatasetsFileUpload";
import { useDatasetsFetching } from "../../hooks/datafetching/DatasetFilesFetching";
import { FiActivity, FiDatabase, FiGrid, FiImage, FiMenu, FiType, FiX } from "react-icons/fi";
import { backendPrefix } from "../../config";

export const CurveLineTrendBatchRendering: React.FC = () => {
  const { fetchUserDatasets, userDatasets } = useDatasetsFetching();

  //   const [curveLineData, setcurveLineData] = useState<curveLineDataset[]>([]);
  const [curveLineData, setCurveLineData] = useState<CurveLineTrendDataset[]>(
    []
  );
  const [animationSpeeds, setAnimationSpeed] = useState<string[]>([]);
  const [renderQueue, setRenderQueue] = useState<number[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  //   const [selectedFontColors, setSelectedFontColors] = useState<string[]>([]);

  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "dataset" | "presets" | "fonts" | "animation" | "outputs"
  >("dataset");

  const [datasetQuantity, setDatasetQuantity] = useState<number>(5);
  //   const [quotes, setQuotes] = useState<{ text: string; author: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProgressCard, setShowProgressCard] = useState(true);

  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
  const [selectedFonts, setSelectedFonts] = useState<string[]>([]);

  const [combinations, setCombinations] = useState<any[]>([]);
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

  const fetchAIDataset = async (quantity: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${backendPrefix}/api/generate/curvelinedataset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const data = await res.json();
      console.log(data.data);
      setCurveLineData(data.data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportForCombination = async (combo: any, index: number) => {
    updateCombination(index, { status: "exporting" });
    const dynamicduration = durationCalculatorForCurveLineAnimationSpeeds(
      combo.speed
    );
    // const fontsizeindicator = titleAndSubtitleFontSizeIndicator(combo.bar.title);
    try {
      const response = await fetch(`${backendPrefix}/generatevideo/curvelinetrend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            title: combo.cldata.title,
            subtitle: combo.cldata.subtitle,
            titleFontSize: curvelineDefaultdata.titleFontSize,
            subtitleFontSize: curvelineDefaultdata.subtitleFontSize,
            fontFamily: combo.font,
            data: combo.cldata.data,
            dataType: combo.cldata.dataType,
            preset: combo.theme,
            backgroundImage: "",
            animationSpeed: combo.speed,
            minimalMode: curvelineDefaultdata.minimalmode,
            duration: dynamicduration,
          },
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
            templateId: 5,
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

  const generateDataset = async () => {
    await fetchAIDataset(datasetQuantity);
  };

  // background/font selection helpers
  const toggleBackground = (bg: string) =>
    setSelectedPresets((prev) =>
      prev.includes(bg) ? prev.filter((b) => b !== bg) : [...prev, bg]
    );
  const toggleFont = (font: string) =>
    setSelectedFonts((prev) =>
      prev.includes(font) ? prev.filter((f) => f !== font) : [...prev, font]
    );
  // const selectAllPresets = () => setSelectedPresets([...serverImages]);
  const clearAllPresets = () => setSelectedPresets([]);
  const selectAllFonts = () => setSelectedFonts([...fontFamilies]);
  const clearAllFonts = () => setSelectedFonts([]);

  const handleGenerateBatch = () => {
    setShowProgressCard(true);
    if (
      curveLineData.length === 0 ||
      selectedPresets.length === 0 ||
      selectedFonts.length === 0 ||
      animationSpeeds.length === 0
    ) {
      alert(
        "You are missing some selections. Please complete all of the selections first."
      );
      return;
    }

    const combos: any[] = [];

    curveLineData.forEach((dataset) => {
      selectedPresets.forEach((themeName) => {
        selectedFonts.forEach((font) => {
          animationSpeeds.forEach((speed) => {
            combos.push({
              cldata: dataset, // your dataset
              theme: themeName, // picked theme
              font, // picked font
              speed, // animation speed
              status: "pending",
              exportUrl: null,
            });
          });
        });
      });
    });

    console.log("Generated combos:", combos);
    setCombinations(combos);
    setRenderQueue(combos.map((_, i) => i)); // indices in order
    setActiveSection("outputs");
    setIsRendering(true);
    setCurrentIndex(0); // start from the first combo
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

  const { uploadFile } = useDatasetUpload({
    template: "curvelinetrend",
  });

  useEffect(() => {
    fetchUserDatasets();
  }, []);

   const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "dataset", label: "Dataset", icon: <FiDatabase /> },
    { id: "presets", label: "Presets/Themes", icon: <FiImage /> },
    { id: "fonts", label: "Fonts", icon: <FiType /> },
    { id: "animation", label: "Animation Speeds", icon: <FiActivity /> },
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
          🎬 Curve Line Trend Batch Rendering
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
        <SideBarHearder
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          title="🎬 Curve Line Trend Batch Rendering"
        />

        {/* Nav Items */}
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
            singleOutputLocation="/template/curvelinetrend"
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
            🎬 Curve Line Trend Batch Rendering
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
            singleOutputLocation="/template/curvelinetrend"
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
              <CurveLineTrendBatchRenderingInidicator
                currentIndex={currentIndex}
                isRendering={isRendering}
                renderQueue={renderQueue}
                setActiveSection={setActiveSection}
                setShowProgressCard={setShowProgressCard}
              />
            )}

          {/* Dataset */}
          {activeSection === "dataset" && (
            <CurveLineTrendBatchRenderingDatasetSection
              curveLineData={curveLineData}
              datasetQuantity={datasetQuantity}
              generateDataset={generateDataset}
              isRendering={isRendering}
              loaderLabel={loaderLabel}
              loading={loading}
              setCurveLineData={setCurveLineData}
              setDatasetQuantity={setDatasetQuantity}
              fetchUserDataSets={fetchUserDatasets}
              setUserDatasets={setCurveLineData}
              uploadDataset={uploadFile}
              userDatasets={userDatasets}
            />
          )}

          {/* Presets/Themes */}
          {activeSection === "presets" && (
            <CurveLineTrendBatchRenderingPresetsSelectionSection
              clearAllPresets={clearAllPresets}
              isRendering={isRendering}
              selectedPresets={selectedPresets}
              setSelectedPresets={setSelectedPresets}
              toggleBackground={toggleBackground}
            />
          )}

          {/* Fonts */}
          {activeSection === "fonts" && (
            <BatchRenderingFontFamilySelectionSection
              clearAllFonts={clearAllFonts}
              isRendering={isRendering}
              selectAllFonts={selectAllFonts}
              selectedFonts={selectedFonts}
              toggleFont={toggleFont}
            />
          )}

          {/* Animation Speeds */}
          {activeSection === "animation" && (
            <CurveLineTrendAnimationSelectionSection
              animationSpeeds={animationSpeeds}
              isRendering={isRendering}
              setAnimationSpeed={setAnimationSpeed}
            />
          )}

          {/* Outputs */}
          {activeSection === "outputs" && (
            <CurveLineTrendOutputsSection
              combinations={combinations}
              isRendering={isRendering}
            />
          )}
        </div>
      </main>
    </div>
  );
};
