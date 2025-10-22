import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import {
  kenBurnsDurationCalculator,
  kenBurnsProportionHelper,
} from "../../utils/KenBurnsHelper";
import { SideBarHearder } from "../../components/ui/batchrendering/sidenav/Header";
import { ImagesSection } from "../../components/ui/batchrendering/sections/kenburnstemplate/ImagesSection";
import { ImageQuantitySection } from "../../components/ui/batchrendering/sections/kenburnstemplate/ImageQuantitySection";
import { ImageProportionsSecion } from "../../components/ui/batchrendering/sections/kenburnstemplate/ProportionsSection";
import { KenBurnsBatchOutputs } from "../../components/ui/batchrendering/sections/kenburnstemplate/BatchOutputs";
import { BatchRenderingSideNavFooter } from "../../components/ui/batchrendering/sidenav/Footer";
import { KenburnsBatchRenderingInidicator } from "../../components/ui/batchrendering/progressindicators/KenBurnsProgressIndicator";
import { FiGrid, FiHash, FiImage, FiMaximize, FiMenu, FiX } from "react-icons/fi";
import { backendPrefix } from "../../config";

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
    fetch(`${backendPrefix}/useruploads/images`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      const response = await fetch(`${backendPrefix}/generatevideo/kenburnsswipe`, {
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
        const saveResponse = await fetch(`${backendPrefix}/renders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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

 const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "images", label: "Images", icon: <FiImage /> },
    { id: "quantity", label: "Image Counts", icon: <FiHash /> },
    { id: "proportions", label: "Proportions", icon: <FiMaximize /> },
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
          🎬 Ken Burns Carousel Batch Rendering
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
          title="🎬 Ken Burns Carousel Batch Rendering"
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
            singleOutputLocation="/template/kenburnscarousel"
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
            🎬 Ken Burns Carousel Batch Rendering
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
            singleOutputLocation="/template/kenburnscarousel"
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
              <KenburnsBatchRenderingInidicator
                currentIndex={currentIndex}
                isRendering={isRendering}
                renderQueue={renderQueue}
                setActiveSection={setActiveSection}
                setShowProgressCard={setShowProgressCard}
              />
            )}

          {/* === Images Section === */}
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

          {/* === Image Quantity Section === */}
          {activeSection === "quantity" && (
            <ImageQuantitySection
              imageQuantities={imageQuantities}
              isRendering={isRendering}
              setImageQuantities={setImageQuantities}
              userImages={userImages}
            />
          )}

          {/* === Proportions Section === */}
          {activeSection === "proportions" && (
            <ImageProportionsSecion
              isRendering={isRendering}
              selectedProportions={selectedProportions}
              setSelectedProportions={setSelectedProportions}
            />
          )}

          {/* === Batch Outputs Section === */}
          {activeSection === "outputs" && (
            <KenBurnsBatchOutputs
              combinations={combinations}
              isRendering={isRendering}
            />
          )}
        </div>
      </main>
    </div>
  );
};
