import React from "react";
import {
  FiLayers,
  FiUploadCloud,
  FiDatabase,
  FiFilm,
} from "react-icons/fi";
import { TemplatesSection } from "./TemplatesSection";
import { useHomeSectionHooks } from "../../../../hooks/dashboardhooks/Home";
import { useTemplateSectionHooks } from "../../../../hooks/dashboardhooks/TemplatesSectionHooks";
import { TemplatePreviewDialog } from "../TemplatePreviewDialog";
// import { EmblaCarousel } from "../../Carousel";
import { ShowcaseCarousel } from "../../ShowcaseCarousel";


interface Project {
  id: string;
  title: string;
  projectVidUrl: string;
}

interface Render {
  id: string;
  type: string;
  outputUrl: string;
  renderedAt?: string;
}

interface HomeSectionProps {
  search: string;
  setSearch: (value: string) => void;
  projects?: Project[];
  renders?: Render[];
  uploads?: any[];
  datasets?: any[];
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  projects = [],
  renders = [],
  uploads = [],
  datasets = [],
}) => {
  const { tab, setTab } = useTemplateSectionHooks();
  const {
    handleOpenPreview,
    search,
    setSearch,
    selectedTemplate,
    handleClosePreview,
    selectedDescription,
  } = useHomeSectionHooks();

  return (
    <div className="w-full px-2 sm:px-6 lg:px-4 py-2 space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4">
        {[
          {
            title: "Your Designs",
            icon: <FiLayers className="text-blue-500 text-2xl sm:text-3xl" />,
            count: projects.length,
            accent: "text-blue-600",
          },
          {
            title: "Your Uploads",
            icon: (
              <FiUploadCloud className="text-green-500 text-2xl sm:text-3xl" />
            ),
            count: uploads.length,
            accent: "text-green-600",
          },
          {
            title: "Your Datasets",
            icon: (
              <FiDatabase className="text-purple-500 text-2xl sm:text-3xl" />
            ),
            count: datasets.length,
            accent: "text-purple-600",
          },
          {
            title: "Your Renders",
            icon: <FiFilm className="text-orange-500 text-2xl sm:text-3xl" />,
            count: renders.length,
            accent: "text-orange-600",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`relative bg-gradient-to-br border border-white/40 
            backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-xl 
            hover:-translate-y-1 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <h2
                  className={`text-2xl sm:text-3xl font-bold text-gray-900 mt-1 ${card.accent}`}
                >
                  {card.count}
                </h2>
              </div>
              <div className="p-2 sm:p-3 bg-white/70 backdrop-blur-lg rounded-xl shadow-inner">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* === Templates Section === */}
      <TemplatesSection
        onTry={handleOpenPreview}
        search={search}
        setSearch={setSearch}
        setTab={setTab}
        tab={tab}
      />
      <TemplatePreviewDialog
        open={!!selectedTemplate}
        onClose={handleClosePreview}
        selectedTemplate={selectedTemplate}
        selectedDescription={selectedDescription}
      />
      {projects.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Recently Created Templates
            </h2>
          </div>
          <p className="text-gray-500 text-sm">
            Your most recent template projects, ready to edit or share.
          </p>

          <ShowcaseCarousel items={projects.slice(0, 5)} type="project" />
        </div>
      )}

      {renders.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Recently Rendered Videos
            </h2>
          </div>
          <p className="text-gray-500 text-sm">
            Your latest video renders, ready to watch or download.
          </p>

          <ShowcaseCarousel items={renders.slice(0, 5)} type="render" />
        </div>
      )}
    </div>
  );
};
