import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { fontFamilies } from "../../data/fontfamilies";
import type { FactCardsDataset } from "../../models/FactCards";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import AnimationIcon from "@mui/icons-material/Animation";
import {
  cardSubtitleFontSizeIndicator,
  cardTitleFontSizeIndicator,
  durationCalculatorforFactsCard,
} from "../../utils/factcardshelpers";
import NavItem from "../../components/navigations/batchrendering/NavItems";
import { useBackgroundImages } from "../../hooks/datafetching/userimagesandonlineimages";
import { BackgroundImageSelectionBatchRendering } from "../../components/ui/batchrendering/sections/Global/backgroundselectionsection";
import { BatchRenderingFontFamilySelectionSection } from "../../components/ui/batchrendering/sections/Global/fontfamilyselectionsection";
import { BatchRenderingFontColorsSelection } from "../../components/ui/batchrendering/sections/Global/fontcolorsselectionsection";
import { FactCardsOutputsSection } from "../../components/ui/batchrendering/sections/factcards/batchoutputs";
import { FactCardsBatchRenderingInidicator } from "../../components/ui/batchrendering/progressindicators/factcardsprogressindicator";
import { BatchRenderingSideNavFooter } from "../../components/ui/batchrendering/sidenav/footer";
import { SideBarHearder } from "../../components/ui/batchrendering/sidenav/header";
import { FactCardsBatchRenderingDatasetSection } from "../../components/ui/batchrendering/sections/factcards/datasetsection";
import { FactCardsBatchRenderingAnimationSelectionSection } from "../../components/ui/batchrendering/sections/factcards/animtionselectionsection";
import { useDatasetsFetching } from "../../hooks/datafetching/datasetfilesfetching";
import { useDatasetUpload } from "../../hooks/uploads/handledatasetsfileupload";

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
        const res = await fetch("/api/generate/factcardsdataset", {
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
      const response = await fetch("/generatevideo/factstemplaterender", {
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
        const saveResponse = await fetch("/renders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
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
          title="🎬 Fact Cards Template Batch Rendering"
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
            icon={<AnimationIcon />}
            label="Animation Speed"
            collapsed={collapsed}
            active={activeSection === "animation"}
            onClick={() => setActiveSection("animation")}
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
          singleOutputLocation="/template/factcards"
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
              <FactCardsBatchRenderingInidicator
                currentIndex={currentIndex}
                isRendering={isRendering}
                renderQueue={renderQueue}
                setActiveSection={setActiveSection}
                setShowProgressCard={setShowProgressCard}
              />
            )}

          {/* Dataset Section */}
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

          {/* Animation Speeds Section */}
          {activeSection === "animation" && (
            <FactCardsBatchRenderingAnimationSelectionSection
              isRendering={isRendering}
              selectedPacings={selectedPacings}
              setSelectedPacings={setSelectedPacings}
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
              type="literature"
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
            />
          )}

          {/* Batch Outputs Section */}
          {activeSection === "outputs" && (
            <FactCardsOutputsSection
              combinations={combinations}
              isRendering={isRendering}
            />
          )}
        </Container>
      </Box>
    </Box>
  );
};
