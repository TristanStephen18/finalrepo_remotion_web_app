import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { fontFamilies } from "../../data/fontfamilies";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import NavItem from "../../components/navigations/batchrendering/NavItems";
import type { KpiFlipData } from "../../models/KpiFlipData";
import { kpiFlipDefaultValues } from "../../data/defaultvalues";
import { kpiFlipTitleFontSizeIndicator } from "../../utils/KpiFlipCardhelpers";
import { useBackgroundImages } from "../../hooks/datafetching/userimagesandonlineimages";
import { SideBarHearder } from "../../components/ui/batchrendering/sidenav/header";
import { BatchRenderingSideNavFooter } from "../../components/ui/batchrendering/sidenav/footer";
import { KpiFlipCardsBatchRenderingInidicator } from "../../components/ui/batchrendering/progressindicators/kpiflipcardsprogressindicator";
import { BackgroundImageSelectionBatchRendering } from "../../components/ui/batchrendering/sections/Global/backgroundselectionsection";
import { BatchRenderingFontFamilySelectionSection } from "../../components/ui/batchrendering/sections/Global/fontfamilyselectionsection";
import { BatchRenderingFontColorsSelection } from "../../components/ui/batchrendering/sections/Global/fontcolorsselectionsection";
import { KpiFlipCardsDatasetSection } from "../../components/ui/batchrendering/sections/kpiflipcards/datasetsection";
import { KpiFlipCardsBatchOutputs } from "../../components/ui/batchrendering/sections/kpiflipcards/batchoutputs";
import { useDatasetsFetching } from "../../hooks/datafetching/datasetfilesfetching";
import { useDatasetUpload } from "../../hooks/uploads/handledatasetsfileupload";

export const KpiFlipBatchRendering: React.FC = () => {
  const { fetchUserDatasets, userDatasets } = useDatasetsFetching();

  const [kpiFlipData, setKpiFlipData] = useState<KpiFlipData[]>([]);
  const [renderQueue, setRenderQueue] = useState<number[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [selectedFontColors, setSelectedFontColors] = useState<string[]>([]);

  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "dataset" | "backgrounds" | "fonts" | "colors" | "outputs"
  >("dataset");

  const [datasetQuantity, setDatasetQuantity] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [showProgressCard, setShowProgressCard] = useState(true);

  const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>([]);
  const [selectedFonts, setSelectedFonts] = useState<string[]>([]);

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

  //   const [selectedPacings, setSelectedPacings] = useState<string[]>([]);

  const [combinations, setCombinations] = useState<any[]>([]);

  const fetchAIDataset = async (quantity: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate/kpiflipcardsdataset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity,
        }),
      });
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const data = await res.json();
      console.log(data.data);
      setKpiFlipData(data.data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportForCombination = async (combo: any, index: number) => {
    updateCombination(index, { status: "exporting" });
    // const fontsizeindicator = titleAndSubtitleFontSizeIndicator(combo.bar.title);
    try {
      let finalImageUrl = combo.bg;
      const origin = window.location.origin;
      if (finalImageUrl.startsWith("/")) {
        finalImageUrl = `${origin}${finalImageUrl}`;
      }

      const response = await fetch("/generatevideo/kpiflipcard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          backgroundImage: finalImageUrl,
          title: combo.dataset.title,
          titleFontSize: kpiFlipTitleFontSizeIndicator(
            combo.dataset.title.length
          ),
          titleFontColor: combo.fontColor,
          titleFontFamily: combo.font,
          subtitle: combo.dataset.subtitle,
          subtitleFontSize: kpiFlipDefaultValues.subtitleFontSize,
          subtitleFontColor: combo.fontColor,
          subtitleFontFamily: combo.font,
          cardsData: combo.dataset.cardsData,
          cardWidth: kpiFlipDefaultValues.cardWidth,
          cardHeight: kpiFlipDefaultValues.cardHeight,
          cardBorderRadius: kpiFlipDefaultValues.cardBorderRadius,
          cardBorderColor: combo.dataset.cardBorderColor,
          cardLabelColor: combo.dataset.cardLabelColor,
          cardLabelFontSize: combo.dataset.cardLabelFontSize,
          cardContentFontFamily: combo.font,
          cardGrid: kpiFlipDefaultValues.cardGrid,
          delayStart: kpiFlipDefaultValues.delayStart,
          delayStep: kpiFlipDefaultValues.delayStep,
          cardColorBack: combo.dataset.cardColorBack,
          cardColorFront: combo.dataset.cardColorFront,
          valueFontSize: combo.dataset.valueFontSize,
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
        const saveResponse = await fetch("/renders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({
            templateId: 4,
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

  const handleGenerateBatch = () => {
    setShowProgressCard(true);
    // Validation: ensure at least one selection per category
    if (
      kpiFlipData.length === 0 ||
      selectedBackgrounds.length === 0 ||
      selectedFonts.length === 0 ||
      selectedFontColors.length === 0
    ) {
      alert(
        "You are missing some selections. Please complete all selections first."
      );
      return;
    }
    const combos: {
      dataset: KpiFlipData;
      bg: string;
      font: string;
      fontColor: string;
      status: "pending" | "done";
      exportUrl: string | null;
    }[] = [];
    // Cartesian product generation
    kpiFlipData.forEach((dataset) => {
      selectedBackgrounds.forEach((bg) => {
        selectedFonts.forEach((font) => {
          selectedFontColors.forEach((fontColor) => {
            combos.push({
              dataset,
              bg,
              font,
              fontColor,
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
    template: "kpiflipcards",
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
    fetchOnlineImages("metrics");
    fetchUserDatasets();
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#fafafa" }}>
      <Box
        sx={{
          width: collapsed ? 72 : 260,
          flexShrink: 0,
          bgcolor: "#fff",
          borderRight: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SideBarHearder
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          title="🎬 Kpi Flip Cards Template Batch Rendering"
        />

        {/* nav items */}
        <Box sx={{ flexGrow: 1 }}>
          <NavItem
            icon={<CloudIcon />}
            label="Dataset"
            collapsed={collapsed}
            active={activeSection === "dataset"}
            onClick={() => setActiveSection("dataset")}
          />
          <NavItem
            icon={<WallpaperIcon />}
            label="Backgrounds"
            collapsed={collapsed}
            active={activeSection === "backgrounds"}
            onClick={() => setActiveSection("backgrounds")}
          />
          <NavItem
            icon={<TextFieldsIcon />}
            label="Fonts"
            collapsed={collapsed}
            active={activeSection === "fonts"}
            onClick={() => setActiveSection("fonts")}
          />
          <NavItem
            icon={<ColorLensIcon />}
            label="Font Colors"
            collapsed={collapsed}
            active={activeSection === "colors"}
            onClick={() => setActiveSection("colors")}
          />
          <NavItem
            icon={<ViewModuleIcon />}
            label="Batch Outputs"
            collapsed={collapsed}
            active={activeSection === "outputs"}
            onClick={() => setActiveSection("outputs")}
          />
        </Box>

        <BatchRenderingSideNavFooter
          handleGenerateBatch={handleGenerateBatch}
          isRendering={isRendering}
          singleOutputLocation="/template/kpiflipcards"
        />
      </Box>

      {/* -------------------
          Main Content
          ------------------- */}
      <Box component="main" sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {showProgressCard &&
            (isRendering ||
              (currentIndex === null && combinations.length > 0)) && (
              <KpiFlipCardsBatchRenderingInidicator
                currentIndex={currentIndex}
                isRendering={isRendering}
                renderQueue={renderQueue}
                setActiveSection={setActiveSection}
                setShowProgressCard={setShowProgressCard}
              />
            )}

          {/* Dataset Section */}
          {activeSection === "dataset" && (
            <KpiFlipCardsDatasetSection
              datasetQuantity={datasetQuantity}
              generateDataset={generateDataset}
              isRendering={isRendering}
              kpiFlipData={kpiFlipData}
              loaderLabel={loaderLabel}
              loading={loading}
              setDatasetQuantity={setDatasetQuantity}
              setKpiFlipData={setKpiFlipData}
              fetchUserDataSets={fetchUserDatasets}
              setUserDatasets={setKpiFlipData}
              uploadDataset={uploadFile}
              userDatasets={userDatasets}
            />
          )}

          {/* Backgrounds Section */}
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
              type="analytics"
              userUploads={userUploads}
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
          {activeSection === "colors" && (
            <BatchRenderingFontColorsSelection
              isRendering={isRendering}
              selectedFontColors={selectedFontColors}
              setSelectedFontColors={setSelectedFontColors}
              title="Has"
            />
          )}

          {/* Batch Outputs Section */}
          {activeSection === "outputs" && (
            <KpiFlipCardsBatchOutputs
              combinations={combinations}
              isRendering={isRendering}
            />
          )}
        </Container>
      </Box>
    </Box>
  );
};
