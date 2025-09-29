import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
} from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { fontFamilies } from "../../data/fontfamilies";
import type { BarGraphDataset } from "../../models/BarGraph";
import { barGraphConfig } from "../../data/defaultvalues";
import {
  calculateDurationBarGraph,
  titleAndSubtitleFontSizeIndicator,
} from "../../utils/bargraphhelpers";
import NavItem from "../../components/navigations/batchrendering/NavItems";
import { SideBarHearder } from "../../components/ui/batchrendering/sidenav/header";
import { BatchRenderingSideNavFooter } from "../../components/ui/batchrendering/sidenav/footer";
import { BarGraphBatchRenderingInidicator } from "../../components/ui/batchrendering/progressindicators/bargraphprogressindicator";
import { useBackgroundImages } from "../../hooks/datafetching/userimagesandonlineimages";
import { BackgroundImageSelectionBatchRendering } from "../../components/ui/batchrendering/sections/Global/backgroundselectionsection";
import { BarGraphDatasetSection } from "../../components/ui/batchrendering/sections/bargraph/datasetsection";
import { BatchRenderingFontFamilySelectionSection } from "../../components/ui/batchrendering/sections/Global/fontfamilyselectionsection";
import { BarGraphBatchOutputsSection } from "../../components/ui/batchrendering/sections/bargraph/batchoutputs";
import { useDatasetsFetching } from "../../hooks/datafetching/datasetfilesfetching";
// import { fontSizeIndicatorQuote } from "../../utils/quotespotlighthelpers";
import { useDatasetUpload } from '../../hooks/uploads/handledatasetsfileupload';

export const BarGraphBatchRendering: React.FC = () => {

  const {fetchUserDatasets, userDatasets} = useDatasetsFetching();
  const [barGraphData, setBarGraphData] = useState<BarGraphDataset[]>([]);
  const [renderQueue, setRenderQueue] = useState<number[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  //   const [selectedFontColors, setSelectedFontColors] = useState<string[]>([]);

  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "dataset" | "backgrounds" | "fonts" | "outputs"
  >("dataset");

  const [datasetQuantity, setDatasetQuantity] = useState<number>(5);
  //   const [quotes, setQuotes] = useState<{ text: string; author: string }[]>([]);
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

  const [combinations, setCombinations] = useState<any[]>([]);

  const fetchAIDataset = async (quantity: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate/bargraphdataset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const data = await res.json();
      console.log(data.data);
      setBarGraphData(data.data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportForCombination = async (combo: any, index: number) => {
    updateCombination(index, { status: "exporting" });
    const fontsizeindicator = titleAndSubtitleFontSizeIndicator(
      combo.bar.title
    );
    try {
      let finalImageUrl = combo.bg;
      const origin = window.location.origin;
      if (finalImageUrl.startsWith("/")) {
        finalImageUrl = `${origin}${finalImageUrl}`;
      }

      const response = await fetch("/generatevideo/bargraph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: combo.bar.data,
          title: combo.bar.title,
          titleFontColor: barGraphConfig.titleFontColor,
          backgroundImage: finalImageUrl,
          accent: barGraphConfig.accent,
          subtitle: combo.bar.subtitle,
          currency: "",
          titleFontSize: fontsizeindicator.titlefontsize,
          subtitleFontSize: fontsizeindicator.subtitlefontsize,
          subtitleColor: barGraphConfig.subtitleColor,
          barHeight: barGraphConfig.barHeight,
          barGap: barGraphConfig.barGap,
          barLabelFontSize: barGraphConfig.barLabelFontSize,
          barValueFontSize: barGraphConfig.barValueFontSize,
          fontFamily: combo.font,
          duration: calculateDurationBarGraph(combo.bar.data.length),
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
            templateId: 3,
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
    if (
      barGraphData.length === 0 ||
      selectedBackgrounds.length === 0 ||
      selectedFonts.length === 0
    ) {
      alert(
        "You are missing some selections. Please complete all of the selections first."
      );
      return;
    }
    const combos: any[] = [];
    barGraphData.forEach((bar) => {
      selectedBackgrounds.forEach((bg) => {
        selectedFonts.forEach((font) => {
          combos.push({
            bar,
            bg,
            font,
            status: "pending",
            exportUrl: null,
          });
        });
      });
    });

    console.log(combos);
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

  // const {fetchUserDatasets} =useDatasetsFetching();

  const { uploadFile} = useDatasetUpload({
    template: "bargraph"
  });
  
  useEffect(() => {
    fetchUserUploads();
    fetchOnlineImages("gradient");
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
          title="🎬 Bar Graph Template Batch Rendering"
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
          singleOutputLocation="/template/bargraph"
        />
      </Box>

      <Box component="main" sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {showProgressCard &&
            (isRendering ||
              (currentIndex === null && combinations.length > 0)) && (
              <BarGraphBatchRenderingInidicator
                currentIndex={currentIndex}
                isRendering={isRendering}
                renderQueue={renderQueue}
                setActiveSection={setActiveSection}
                setShowProgressCard={setShowProgressCard}
              />
            )}

          {/* Dataset Section */}
          {activeSection === "dataset" && (
            <BarGraphDatasetSection
              barGraphData={barGraphData}
              datasetQuantity={datasetQuantity}
              generateDataset={generateDataset}
              isRendering={isRendering}
              loaderLabel={loaderLabel}
              loading={loading}
              setBarGraphData={setBarGraphData}
              setDatasetQuantity={setDatasetQuantity}
              uploadDataset={uploadFile}
              userDatasets={userDatasets}
              fetchUserDataSets={fetchUserDatasets}
              setUserDatasets={setBarGraphData}
            />
          )}

          {/* Backgrounds Section */}
          {activeSection === "backgrounds" && (
            <BackgroundImageSelectionBatchRendering
              isRendering={isRendering}
              selectedBackgrounds={selectedBackgrounds}
              toggleBackground={toggleBackground}
              type="analytics"
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
          {/* Batch Outputs Section */}
          {activeSection === "outputs" && (
            <BarGraphBatchOutputsSection
              combinations={combinations}
              isRendering={isRendering}
            />
          )}
        </Container>
      </Box>
    </Box>
  );
};
