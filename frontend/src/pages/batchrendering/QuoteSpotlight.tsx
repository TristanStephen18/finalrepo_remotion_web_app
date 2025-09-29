import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { fontFamilies } from "../../data/fontfamilies";
import { fontSizeIndicatorQuote } from "../../utils/quotespotlighthelpers";
import NavItem from "../../components/navigations/batchrendering/NavItems";
import { SideBarHearder } from "../../components/ui/batchrendering/sidenav/header";
import { BatchRenderingSideNavFooter } from "../../components/ui/batchrendering/sidenav/footer";
import { QouteTemplateBatchRenderingInidicator } from "../../components/ui/batchrendering/progressindicators/quotetemplateprogressindicator";
import { QuoteTemplateDatasetSection } from "../../components/ui/batchrendering/sections/quotetemplate/datasetsection";
import { BackgroundImageSelectionBatchRendering } from "../../components/ui/batchrendering/sections/Global/backgroundselectionsection";
import { BatchRenderingFontFamilySelectionSection } from "../../components/ui/batchrendering/sections/Global/fontfamilyselectionsection";
import { BatchRenderingFontColorsSelection } from "../../components/ui/batchrendering/sections/Global/fontcolorsselectionsection";
import { QuoteTemplateBatchOutputsSection } from "../../components/ui/batchrendering/sections/quotetemplate/batchoutputs";
import { useBackgroundImages } from "../../hooks/datafetching/userimagesandonlineimages";
import { useDatasetsFetching } from "../../hooks/datafetching/datasetfilesfetching";
import { useDatasetUpload } from "../../hooks/uploads/handledatasetsfileupload";
// import { useFileUpload } from "../../hooks/uploads/handleimageupload";

export const QuoteSpotlightBatchRendering: React.FC = () => {
  // const { isUploading, uploadedUrl, uploadFile } = useFileUpload({
  //     type: "image",
  //   });

    const {fetchUserDatasets, userDatasets} = useDatasetsFetching();

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
      const res = await fetch("/api/batch-quotejson-trial", {
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

      const response = await fetch("/generatevideo/quotetemplatewchoices", {
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

  // inside QuoteSpotlightBatchRendering component
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

   const { uploadFile} = useDatasetUpload({
    template: "quote"
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
        {/* top title */}
        <SideBarHearder
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          title="🎬 Quote Template Batch Rendering"
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
            active={activeSection === "fontcolors"}
            onClick={() => setActiveSection("fontcolors")}
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
          singleOutputLocation="/template/quotetemplate"
        />
      </Box>
      <Box component="main" sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {showProgressCard &&
            (isRendering ||
              (currentIndex === null && combinations.length > 0)) && (
              <QouteTemplateBatchRenderingInidicator
                currentIndex={currentIndex}
                isRendering={isRendering}
                renderQueue={renderQueue}
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
        </Container>
      </Box>
    </Box>
  );
};
