import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { fontFamilies } from "../../data/FontFamilies";
import { fontSizeIndicatorQuote } from "../../utils/QuoteSpotlightHelpers";
import { SideBarHearder } from "../../components/ui/batchrendering/sidenav/Header";
import { BatchRenderingSideNavFooter } from "../../components/ui/batchrendering/sidenav/Footer";
import { QouteTemplateBatchRenderingInidicator } from "../../components/ui/batchrendering/progressindicators/QuoteTemplateProgressIndicator";
import { QuoteTemplateDatasetSection } from "../../components/ui/batchrendering/sections/quotetemplate/DatasetSection";
import { BackgroundImageSelectionBatchRendering } from "../../components/ui/batchrendering/sections/Global/BackgroundSelectionSection";
import { BatchRenderingFontFamilySelectionSection } from "../../components/ui/batchrendering/sections/Global/FontFamilySelectionSection";
import { BatchRenderingFontColorsSelection } from "../../components/ui/batchrendering/sections/Global/FontColorsSelectionSection";
import { QuoteTemplateBatchOutputsSection } from "../../components/ui/batchrendering/sections/quotetemplate/BatchOutputs";
import { useBackgroundImages } from "../../hooks/datafetching/UserImagesAndOnlineImages";
import { useDatasetsFetching } from "../../hooks/datafetching/DatasetFilesFetching";
import { useDatasetUpload } from "../../hooks/uploads/HandleDatasetsFileUpload";
import {
  FiDatabase,
  FiDroplet,
  FiGrid,
  FiImage,
  FiMenu,
  FiType,
  FiX,
} from "react-icons/fi";
import { backendPrefix } from "../../config";
// import { useFileUpload } from "../../hooks/uploads/handleimageupload";

export const QuoteSpotlightBatchRendering: React.FC = () => {
  // const { isUploading, uploadedUrl, uploadFile } = useFileUpload({
  //     type: "image",
  //   });

  const { fetchUserDatasets, userDatasets } = useDatasetsFetching();

  const [renderQueue, setRenderQueue] = useState<number[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [selectedFontColors, setSelectedFontColors] = useState<string[]>([]);

  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "dataset" | "backgrounds" | "fonts" | "outputs" | "fontcolors"
  >("dataset");

  const [datasetSource, setDatasetSource] = useState<"recite" | "ai">("recite");
  const [datasetQuantity, setDatasetQuantity] = useState<number>(5);
  const [quotes, setQuotes] = useState<{ text: string; author: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProgressCard, setShowProgressCard] = useState(true);

  const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>([]);
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

  // dataset fetch
  const fetchRecite = async (count: number = 1) => {
    try {
      setLoading(true);
      const promises = Array.from({ length: count }, () =>
        fetch("https://recite.onrender.com/api/v1/random").then((r) => {
          if (!r.ok) throw new Error(`Recite error ${r.status}`);
          return r.json();
        })
      );
      const results = await Promise.all(promises);
      const formatted = results.map((q: any) => ({
        text: q.quote,
        author: q.author,
      }));
      setQuotes(formatted);
    } catch (err) {
      console.error("fetchRecite error:", err);
      alert("Failed to fetch from Recite");
    } finally {
      setLoading(false);
    }
  };

  const fetchAIDataset = async (quantity: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${backendPrefix}/api/batch-quotejson-trial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log(data.phrase);
      setQuotes(data.phrase);
    } catch (err: any) {
      alert("There was an error while getting the AI generated datasets...");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportForCombination = async (combo: any, index: number) => {
    updateCombination(index, { status: "exporting" });

    try {
      let finalImageUrl = combo.background;
      const origin = window.location.origin;
      if (finalImageUrl.startsWith("/")) {
        finalImageUrl = `${origin}${finalImageUrl}`;
      }

      const response = await fetch(
        `${backendPrefix}/generatevideo/quotetemplatewchoices`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quote: combo.quote.text,
            author: combo.quote.author,
            imageurl: finalImageUrl,
            fontsize: fontSizeIndicatorQuote(combo.quote.text.length),
            fontcolor: combo.color,
            fontfamily: combo.font,
            format: "mp4",
          }),
        }
      );

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
            templateId: 1,
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
    setQuotes([]);
    if (datasetSource === "recite") {
      await fetchRecite(datasetQuantity);
    } else {
      await fetchAIDataset(datasetQuantity);
    }
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

  const handleRemoveQuote = (index: number) => {
    setQuotes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateBatch = () => {
    setShowProgressCard(true);
    if (
      quotes.length === 0 ||
      selectedBackgrounds.length === 0 ||
      selectedFonts.length === 0 ||
      selectedFontColors.length === 0
    ) {
      alert(
        "You are missing some selections. Please complete all of the selections first."
      );
      return;
    }

    const combos: any[] = [];
    quotes.forEach((quote) => {
      selectedBackgrounds.forEach((bg) => {
        selectedFonts.forEach((font) => {
          selectedFontColors.forEach((color) => {
            combos.push({
              quote,
              background: bg,
              font,
              color,
              status: "pending",
              exportUrl: null,
            });
          });
        });
      });
    });

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
    template: "quote",
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
    fetchOnlineImages("gradient");
    fetchUserDatasets();
  }, []);

  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "dataset", label: "Dataset", icon: <FiDatabase /> },
    { id: "backgrounds", label: "Backgrounds", icon: <FiImage /> },
    { id: "fonts", label: "Fonts", icon: <FiType /> },
    { id: "fontcolors", label: "Font Colors", icon: <FiDroplet /> },
    { id: "outputs", label: "Batch Outputs", icon: <FiGrid /> },
  ] as const;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3 z-40">
        <div className="flex items-center gap-2">
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🎬 Quote Template Batch Rendering
          </Typography>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-gray-600 hover:text-gray-900"
        >
          <FiMenu size={22} />
        </button>
      </header>

      {/* ===== Sidebar (Desktop) ===== */}
      <aside
        className={`hidden md:flex fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 flex-col justify-between z-30 shadow-sm
        ${collapsed ? "w-[72px]" : "w-[260px]"}`}
      >
        {/* Header / Logo */}
        <SideBarHearder
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          title="🎬 Quote Template Batch Rendering"
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
            singleOutputLocation="/template/quotetemplate"
          />
        </div>
      </aside>

      {/* ===== Mobile Overlay ===== */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ===== Mobile Drawer ===== */}
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
            🎬 Quote Template Batch Rendering
          </Typography>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-gray-600"
          >
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
            singleOutputLocation="/template/quotetemplate"
          />
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 bg-gray-50 md:ml-0 ${
          collapsed ? "md:ml-[72px]" : "md:ml-[260px]"
        } mt-[56px] md:mt-0`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Rendering Progress */}
          {showProgressCard &&
            (isRendering ||
              (currentIndex === null && combinations.length > 0)) && (
              <QouteTemplateBatchRenderingInidicator
                currentIndex={currentIndex}
                isRendering={isRendering}
                renderQueue={renderQueue} // add your renderQueue prop
                setActiveSection={setActiveSection}
                setShowProgressCard={setShowProgressCard}
              />
            )}

          {/* Dataset Section */}
          {activeSection === "dataset" && (
            <QuoteTemplateDatasetSection
              datasetQuantity={datasetQuantity}
              datasetSource={datasetSource}
              generateDataset={generateDataset}
              handleRemoveQuote={handleRemoveQuote}
              isRendering={isRendering}
              loaderLabel={loaderLabel}
              loading={loading}
              quotes={quotes}
              setDatasetQuantity={setDatasetQuantity}
              setDatasetSource={setDatasetSource}
              fetchUserDataSets={fetchUserDatasets}
              setQuotes={setQuotes}
              uploadDataset={uploadFile}
              userDatasets={userDatasets}
            />
          )}

          {/* Backgrounds Section */}
          {activeSection === "backgrounds" && (
            <BackgroundImageSelectionBatchRendering
              isRendering={isRendering}
              selectedBackgrounds={selectedBackgrounds}
              toggleBackground={toggleBackground}
              type="literature"
              fetchOnlineImages={fetchOnlineImages}
              loadingOnline={loadingOnline}
              onlineImages={onlineImages}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              userUploads={userUploads}
              loadingUploads={loadingUploads}
              fetchUserUploads={fetchUserUploads}
            />
          )}

          {/* Fonts Section */}
          {activeSection === "fonts" && (
            <BatchRenderingFontFamilySelectionSection
              clearAllFonts={clearAllFonts}
              isRendering={isRendering}
              selectAllFonts={selectAllFonts}
              selectedFonts={selectedFonts}
              toggleFont={toggleFont}
            />
          )}

          {/* Font Colors Section */}
          {activeSection === "fontcolors" && (
            <BatchRenderingFontColorsSelection
              isRendering={isRendering}
              selectedFontColors={selectedFontColors}
              setSelectedFontColors={setSelectedFontColors}
            />
          )}

          {/* Batch Outputs Section */}
          {activeSection === "outputs" && (
            <QuoteTemplateBatchOutputsSection
              isRendering={isRendering}
              combinations={combinations}
            />
          )}
        </div>
      </main>
    </div>
  );
};
