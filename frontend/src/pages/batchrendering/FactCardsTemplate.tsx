import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { fontFamilies } from "../../data/FontFamilies";
import type { FactCardsDataset } from "../../models/FactCards";
import {
  cardSubtitleFontSizeIndicator,
  cardTitleFontSizeIndicator,
  durationCalculatorforFactsCard,
} from "../../utils/FactCardsHelpers";
import { useBackgroundImages } from "../../hooks/datafetching/UserImagesAndOnlineImages";
import { BackgroundImageSelectionBatchRendering } from "../../components/ui/batchrendering/sections/Global/BackgroundSelectionSection";
import { BatchRenderingFontFamilySelectionSection } from "../../components/ui/batchrendering/sections/Global/FontFamilySelectionSection";
import { BatchRenderingFontColorsSelection } from "../../components/ui/batchrendering/sections/Global/FontColorsSelectionSection";
import { FactCardsOutputsSection } from "../../components/ui/batchrendering/sections/factcards/BatchOutputs";
import { FactCardsBatchRenderingInidicator } from "../../components/ui/batchrendering/progressindicators/FactCardsProgressIndicator";
import { BatchRenderingSideNavFooter } from "../../components/ui/batchrendering/sidenav/Footer";
import { SideBarHearder } from "../../components/ui/batchrendering/sidenav/Header";
import { FactCardsBatchRenderingDatasetSection } from "../../components/ui/batchrendering/sections/factcards/DatasetSection";
import { FactCardsBatchRenderingAnimationSelectionSection } from "../../components/ui/batchrendering/sections/factcards/AnimtionSelectionSection";
import { useDatasetsFetching } from "../../hooks/datafetching/DatasetFilesFetching";
import { useDatasetUpload } from "../../hooks/uploads/HandleDatasetsFileUpload";
import { FiActivity, FiDatabase, FiDroplet, FiGrid, FiImage, FiMenu, FiType, FiX } from "react-icons/fi";
import { backendPrefix } from "../../config";

export const FactCardsBatchRendering: React.FC = () => {
  const { fetchUserDatasets, userDatasets } = useDatasetsFetching();

  const [factCardsData, setFactCardsData] = useState<FactCardsDataset[]>([]);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [renderQueue, setRenderQueue] = useState<number[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [selectedFontColors, setSelectedFontColors] = useState<string[]>([]);

  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "dataset" | "animation" | "backgrounds" | "fonts" | "colors" | "outputs"
  >("dataset");

  const [datasetQuantity, setDatasetQuantity] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [showProgressCard, setShowProgressCard] = useState(true);

  const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>([]);
  const [selectedFonts, setSelectedFonts] = useState<string[]>([]);
  const [selectedPacings, setSelectedPacings] = useState<string[]>([]);

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
    if (selectedNiches.length === 0) {
      alert("You must choose a niche or niches first");
      return;
    } else {
      setLoading(true);
      try {
        const res = await fetch(`${backendPrefix}/api/generate/factcardsdataset`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            niches: selectedNiches,
            quantity,
          }),
        });
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        const data = await res.json();
        console.log(data.data);
        setFactCardsData(data.data);
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExportForCombination = async (combo: any, index: number) => {
    updateCombination(index, { status: "exporting" });
    // const fontsizeindicator = titleAndSubtitleFontSizeIndicator(combo.bar.title);
    try {
      let finalImageUrl = combo.bg;
      if (finalImageUrl.startsWith("/")) {
        finalImageUrl = `${window.location.origin}${finalImageUrl}`;
      }
      const response = await fetch(`${backendPrefix}/generatevideo/factstemplaterender`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intro: combo.dataset.intro,
          outro: combo.dataset.intro,
          facts: combo.dataset.facts,
          backgroundImage: finalImageUrl,
          fontSizeTitle: cardTitleFontSizeIndicator(combo.dataset.intro.title),
          fontSizeSubtitle: cardSubtitleFontSizeIndicator(
            combo.dataset.intro.subtitle
          ),
          fontFamilyTitle: combo.font,
          fontColorTitle: combo.fontColor,
          fontColorSubtitle: combo.fontColor,
          fontFamilySubtitle: combo.font,
          duration: durationCalculatorforFactsCard(
            combo.dataset.facts.length,
            combo.pacing
          ),
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
            templateId: 7,
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
    setSelectedBackgrounds((prev) =>
      prev.includes(bg) ? prev.filter((b) => b !== bg) : [...prev, bg]
    );
  const toggleFont = (font: string) =>
    setSelectedFonts((prev) =>
      prev.includes(font) ? prev.filter((f) => f !== font) : [...prev, font]
    );
  const selectAllFonts = () => setSelectedFonts([...fontFamilies]);
  const clearAllFonts = () => setSelectedFonts([]);

  // inside QuoteSpotlightBatchRendering component
  const handleRemoveDataset = (index: number) => {
    setFactCardsData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateBatch = () => {
    setShowProgressCard(true);
    // Validation: ensure at least one selection per category
    if (
      factCardsData.length === 0 ||
      selectedBackgrounds.length === 0 ||
      selectedFonts.length === 0 ||
      selectedPacings.length === 0 ||
      selectedFontColors.length === 0
    ) {
      alert(
        "You are missing some selections. Please complete all selections first."
      );
      return;
    }

    const combos: {
      dataset: FactCardsDataset;
      bg: string;
      font: string;
      pacing: string;
      fontColor: string;
      status: "pending" | "done";
      exportUrl: string | null;
    }[] = [];

    // Cartesian product generation
    factCardsData.forEach((dataset) => {
      selectedBackgrounds.forEach((bg) => {
        selectedFonts.forEach((font) => {
          selectedPacings.forEach((pacing) => {
            selectedFontColors.forEach((fontColor) => {
              combos.push({
                dataset,
                bg,
                font,
                pacing,
                fontColor,
                status: "pending",
                exportUrl: null,
              });
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
    setCurrentIndex(0);
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
          setIsRendering(false);
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
    template: "factcards",
  });

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
    fetchOnlineImages("random");
    fetchUserDatasets();
  }, []);

 const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "dataset", label: "Dataset", icon: <FiDatabase /> },
    { id: "animation", label: "Animation Speed", icon: <FiActivity /> },
    { id: "backgrounds", label: "Backgrounds", icon: <FiImage /> },
    { id: "fonts", label: "Fonts", icon: <FiType /> },
    { id: "colors", label: "Font Colors", icon: <FiDroplet /> },
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
          🎬 Fact Cards Template Batch Rendering
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
          title="🎬 Fact Cards Template Batch Rendering"
        />

        {/* Navigation Items */}
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
            singleOutputLocation="/template/factcards"
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
            🎬 Fact Cards Template Batch Rendering
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
            singleOutputLocation="/template/factcards"
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
              <FactCardsBatchRenderingInidicator
                currentIndex={currentIndex}
                isRendering={isRendering}
                renderQueue={renderQueue}
                setActiveSection={setActiveSection}
                setShowProgressCard={setShowProgressCard}
              />
            )}

          {/* === Dataset Section === */}
          {activeSection === "dataset" && (
            <FactCardsBatchRenderingDatasetSection
              datasetQuantity={datasetQuantity}
              factCardsData={factCardsData}
              generateDataset={generateDataset}
              handleRemoveDataset={handleRemoveDataset}
              isRendering={isRendering}
              loaderLabel={loaderLabel}
              loading={loading}
              selectedNiches={selectedNiches}
              setDatasetQuantity={setDatasetQuantity}
              setSelectedNiches={setSelectedNiches}
              fetchUserDataSets={fetchUserDatasets}
              setFactCardsData={setFactCardsData}
              setUserDatasets={setFactCardsData}
              uploadDataset={uploadFile}
              userDatasets={userDatasets}
            />
          )}

          {/* === Animation Speed Section === */}
          {activeSection === "animation" && (
            <FactCardsBatchRenderingAnimationSelectionSection
              isRendering={isRendering}
              selectedPacings={selectedPacings}
              setSelectedPacings={setSelectedPacings}
            />
          )}

          {/* === Backgrounds Section === */}
          {activeSection === "backgrounds" && (
            <BackgroundImageSelectionBatchRendering
              fetchOnlineImages={fetchOnlineImages}
              fetchUserUploads={fetchUserUploads}
              isRendering={isRendering}
              loadingOnline={loadingOnline}
              loadingUploads={loadingUploads}
              onlineImages={onlineImages}
              searchQuery={searchQuery}
              selectedBackgrounds={selectedBackgrounds}
              setSearchQuery={setSearchQuery}
              toggleBackground={toggleBackground}
              type="literature"
              userUploads={userUploads}
            />
          )}

          {/* === Fonts Section === */}
          {activeSection === "fonts" && (
            <BatchRenderingFontFamilySelectionSection
              clearAllFonts={clearAllFonts}
              isRendering={isRendering}
              selectAllFonts={selectAllFonts}
              selectedFonts={selectedFonts}
              toggleFont={toggleFont}
            />
          )}

          {/* === Font Colors Section === */}
          {activeSection === "colors" && (
            <BatchRenderingFontColorsSelection
              isRendering={isRendering}
              selectedFontColors={selectedFontColors}
              setSelectedFontColors={setSelectedFontColors}
            />
          )}

          {/* === Batch Outputs Section === */}
          {activeSection === "outputs" && (
            <FactCardsOutputsSection
              combinations={combinations}
              isRendering={isRendering}
            />
          )}
        </div>
      </main>
    </div>
  );
};
