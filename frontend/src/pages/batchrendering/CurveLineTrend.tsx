import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import AnimationIcon from "@mui/icons-material/Animation";

import WallpaperIcon from "@mui/icons-material/Wallpaper";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
// import ColorLensIcon from "@mui/icons-material/ColorLens";
import { fontFamilies } from "../../data/fontfamilies";
import type { CurveLineTrendDataset } from "../../models/CurveLineTrend";
import { durationCalculatorForCurveLineAnimationSpeeds } from "../../utils/curvelinetrendhelpers";
import { curvelineDefaultdata } from "../../data/defaultvalues";
import NavItem from "../../components/navigations/batchrendering/NavItems";
import { SideBarHearder } from "../../components/ui/batchrendering/sidenav/header";
import { BatchRenderingSideNavFooter } from "../../components/ui/batchrendering/sidenav/footer";
import { CurveLineTrendBatchRenderingInidicator } from "../../components/ui/batchrendering/progressindicators/curvelinetrendprogressindicator";
import { CurveLineTrendBatchRenderingDatasetSection } from "../../components/ui/batchrendering/sections/curvelinetrend/datasetsection";
import { CurveLineTrendBatchRenderingPresetsSelectionSection } from "../../components/ui/batchrendering/sections/curvelinetrend/presetselectionsection";
import { BatchRenderingFontFamilySelectionSection } from "../../components/ui/batchrendering/sections/Global/fontfamilyselectionsection";
import { CurveLineTrendAnimationSelectionSection } from "../../components/ui/batchrendering/sections/curvelinetrend/animationselectionsection";
import { CurveLineTrendOutputsSection } from "../../components/ui/batchrendering/sections/curvelinetrend/batchoutputs";
import { useDatasetUpload } from "../../hooks/uploads/handledatasetsfileupload";
import { useDatasetsFetching } from "../../hooks/datafetching/datasetfilesfetching";

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
      const res = await fetch("/api/generate/curvelinedataset", {
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
      const response = await fetch("/generatevideo/curvelinetrend", {
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
        const saveResponse = await fetch("/renders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
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
          title=" 🎬 Curve Line Trend Batch Rendering"
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
            label="Presets/Themes"
            collapsed={collapsed}
            active={activeSection === "presets"}
            onClick={() => setActiveSection("presets")}
          />
          <NavItem
            icon={<TextFieldsIcon />}
            label="Fonts"
            collapsed={collapsed}
            active={activeSection === "fonts"}
            onClick={() => setActiveSection("fonts")}
          />
          <NavItem
            icon={<AnimationIcon />}
            label="Animation Speeds"
            collapsed={collapsed}
            active={activeSection === "animation"}
            onClick={() => setActiveSection("animation")}
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
          singleOutputLocation="/template/curvelinetrend"
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
              <CurveLineTrendBatchRenderingInidicator
                currentIndex={currentIndex}
                isRendering={isRendering}
                renderQueue={renderQueue}
                setActiveSection={setActiveSection}
                setShowProgressCard={setShowProgressCard}
              />
            )}

          {/* Dataset Section */}
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
          {/* Presets Section (refactored to themes) */}
          {activeSection === "presets" && (
            <CurveLineTrendBatchRenderingPresetsSelectionSection
              clearAllPresets={clearAllPresets}
              isRendering={isRendering}
              selectedPresets={selectedPresets}
              setSelectedPresets={setSelectedPresets}
              toggleBackground={toggleBackground}
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

          {/* Animation Speeds Section */}
          {activeSection === "animation" && (
            <CurveLineTrendAnimationSelectionSection
              animationSpeeds={animationSpeeds}
              isRendering={isRendering}
              setAnimationSpeed={setAnimationSpeed}
            />
          )}

          {/* Batch Outputs Section */}
          {activeSection === "outputs" && (
            <CurveLineTrendOutputsSection
              combinations={combinations}
              isRendering={isRendering}
            />
          )}
        </Container>
      </Box>
    </Box>
  );
};
