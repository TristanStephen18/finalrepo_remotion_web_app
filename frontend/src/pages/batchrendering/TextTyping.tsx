import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import type { Phrase } from "../../models/TextTyping";
import {
  CategoryOptions,
  MoodOptions,
} from "../../components/editors/NewTextTypingEditor/data";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import NavItem from "../../components/navigations/batchrendering/NavItems";
import { SideBarHearder } from "../../components/ui/batchrendering/sidenav/header";
import { BatchRenderingSideNavFooter } from "../../components/ui/batchrendering/sidenav/footer";
import { TexttTypingBatchRenderingInidicator } from "../../components/ui/batchrendering/progressindicators/texttypingprogressindicator";
import { TextTypingDatasetSection } from "../../components/ui/batchrendering/sections/texttyping/datasetsection";
import { TextTypingBackgroundsSection } from "../../components/ui/batchrendering/sections/texttyping/themessection";
import { TextTypingFontsSelectionSection } from "../../components/ui/batchrendering/sections/texttyping/fontselectionsection";
import { TextTypingSoundSelectionSection } from "../../components/ui/batchrendering/sections/texttyping/soundsection";
import { TextTypingTemplateBatchOutputsSection } from "../../components/ui/batchrendering/sections/texttyping/batchoutputs";
import { useDatasetsFetching } from "../../hooks/datafetching/datasetfilesfetching";
import { useDatasetUpload } from "../../hooks/uploads/handledatasetsfileupload";

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

  /** Pick random item from array */
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
        const res = await fetch("/api/generate/texttypingdataset", {
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
      const response = await fetch("/generatevideo/newtexttypingrender", {
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
        const saveResponse = await fetch("/renders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
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
          title="🎬 Text Typing Template Batch Rendering"
        />

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
            icon={<MusicNoteIcon />}
            label="Sound"
            collapsed={collapsed}
            active={activeSection === "sound"}
            onClick={() => setActiveSection("sound")}
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
          singleOutputLocation="/template/newtexttyping"
        />
      </Box>

      <Box component="main" sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
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
        </Container>
      </Box>
    </Box>
  );
};
