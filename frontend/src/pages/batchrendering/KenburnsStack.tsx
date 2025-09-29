import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import BurstModeIcon from "@mui/icons-material/BurstMode";
import Filter9PlusIcon from "@mui/icons-material/Filter9Plus";

import ViewModuleIcon from "@mui/icons-material/ViewModule";

import PhotoSizeSelectLargeIcon from "@mui/icons-material/PhotoSizeSelectLarge";
import {
  kenBurnsDurationCalculator,
  kenBurnsProportionHelper,
} from "../../utils/kenburnshelper";
import NavItem from "../../components/navigations/batchrendering/NavItems";
import { SideBarHearder } from "../../components/ui/batchrendering/sidenav/header";
import { ImagesSection } from "../../components/ui/batchrendering/sections/kenburnstemplate/imagessection";
import { ImageQuantitySection } from "../../components/ui/batchrendering/sections/kenburnstemplate/imagequantitysection";
import { ImageProportionsSecion } from "../../components/ui/batchrendering/sections/kenburnstemplate/proportionssection";
import { KenBurnsBatchOutputs } from "../../components/ui/batchrendering/sections/kenburnstemplate/batchoutputs";
import { BatchRenderingSideNavFooter } from "../../components/ui/batchrendering/sidenav/footer";
import { KenburnsBatchRenderingInidicator } from "../../components/ui/batchrendering/progressindicators/kenburnsprogressindicator";

export const KenBurnsSwipeBatchRendering: React.FC = () => {
  const [userImages, setUserImages] = useState<string[]>([]);
  const [imageQuantities, setImageQuantities] = useState<number[]>([]);
  const [selectedProportions, setSelectedProportions] = useState<string[]>([]);
  const [renderQueue, setRenderQueue] = useState<number[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [showUploadsModal, setShowUploadsModal] = useState<boolean>(false);
  const [userUploads, setUserUploads] = useState<any[]>();

  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "images" | "quantity" | "proportions" | "outputs"
  >("images");
  const [showProgressCard, setShowProgressCard] = useState(true);

  const [combinations, setCombinations] = useState<any[]>([]);

  const fetchUploads = () => {
    fetch("/useruploads/images", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch uploads");
        return res.json();
      })
      .then((data) => {
        console.log("fetched user uploads successfully");
        setUserUploads(data);
      })
      .catch((err) => console.error("❌ Failed to fetch uploads:", err));
  };

  const handleExportForCombination = async (combo: any, index: number) => {
    updateCombination(index, { status: "exporting" });
    try {
      const response = await fetch("/generatevideo/kenburnsswipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: combo.images,
          cardHeightRatio: kenBurnsProportionHelper(combo.proportion).height,
          cardWidthRatio: kenBurnsProportionHelper(combo.proportion).width,
          duration: kenBurnsDurationCalculator(combo.images.length),
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
            templateId: 8,
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

  const handleGenerateBatch = () => {
    setShowProgressCard(true);
    if (
      !userImages.length ||
      !imageQuantities?.length ||
      !selectedProportions?.length
    ) {
      alert(
        "Please upload images, select quantities, and proportions before generating."
      );
      return;
    }

    const combos: any[] = [];

    imageQuantities.forEach((qty) => {
      // loop through sliding windows of size qty
      for (let i = 0; i <= userImages.length - qty; i++) {
        const imgSet = userImages
          .slice(i, i + qty)
          .map((url) =>
            url.startsWith("/") ? `${window.location.origin}${url}` : url
          );

        selectedProportions.forEach((prop) => {
          combos.push({
            images: imgSet, // array of image urls
            proportion: prop, // selected proportion
            status: "pending", // initial render state
            exportUrl: null, // placeholder for rendered result
          });
        });
      }
    });

    console.log("Generated combos:", combos);

    setCombinations(combos);
    setRenderQueue(combos.map((_, i) => i));
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

  useEffect(() => {
    fetchUploads();
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
          title="🎬 Ken Burns Carousel Batch Rendering"
        />

        <Box sx={{ flexGrow: 1 }}>
          <NavItem
            icon={<BurstModeIcon />}
            label="Images"
            collapsed={collapsed}
            active={activeSection === "images"}
            onClick={() => setActiveSection("images")}
          />
          <NavItem
            icon={<Filter9PlusIcon />}
            label="Image Counts"
            collapsed={collapsed}
            active={activeSection === "quantity"}
            onClick={() => setActiveSection("quantity")}
          />
          <NavItem
            icon={<PhotoSizeSelectLargeIcon />}
            label="Proportions"
            collapsed={collapsed}
            active={activeSection === "proportions"}
            onClick={() => setActiveSection("proportions")}
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
          singleOutputLocation="/template/kenburnscarousel"
        />
      </Box>

      <Box component="main" sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Container maxWidth="xl" sx={{ py: 2 }}>
          {showProgressCard &&
            (isRendering ||
              (currentIndex === null && combinations.length > 0)) && (
              <KenburnsBatchRenderingInidicator
                currentIndex={currentIndex}
                isRendering={isRendering}
                renderQueue={renderQueue}
                setActiveSection={setActiveSection}
                setShowProgressCard={setShowProgressCard}
              />
            )}
          {/* images Section */}
          {activeSection === "images" && (
            <ImagesSection
              isRendering={isRendering}
              setUserImages={setUserImages}
              userImages={userImages}
              setShowUploadsModal={setShowUploadsModal}
              showUploadsModal={showUploadsModal}
              userUploads={userUploads}
            />
          )}
          {/* Image Quantity Section*/}
          {activeSection === "quantity" && (
            <ImageQuantitySection
              imageQuantities={imageQuantities}
              isRendering={isRendering}
              setImageQuantities={setImageQuantities}
              userImages={userImages}
            />
          )}
          {/* Proportions */}
          {activeSection === "proportions" && (
            <ImageProportionsSecion
              isRendering={isRendering}
              selectedProportions={selectedProportions}
              setSelectedProportions={setSelectedProportions}
            />
          )}
          {/* Batch Outputs Section */}
          {activeSection === "outputs" && (
            <KenBurnsBatchOutputs
              combinations={combinations}
              isRendering={isRendering}
            />
          )}
        </Container>
      </Box>
    </Box>
  );
};
