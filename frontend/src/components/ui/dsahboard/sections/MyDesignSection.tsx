import React, { useMemo, useState } from "react";
import { FiSearch, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { getTemplateRoute } from "../../../../utils/TemlplateNavigator";
import { ChooseTemplateModal } from "../../modals/ChooseTemplateModal";
import { useProjectHooks } from "../../../../hooks/dashboardhooks/ProjectHooks";

interface MyDesignProps {
  projects: any[];
  loadingProjects: boolean;
  hoveredId: number | null;
  setHoveredId: (id: number | null) => void;
  selectedProjects: number[];
  toggleProjectSelection: (id: number) => void;
  clearSelection: () => void;
  onDeleteSelected: (ids: number[]) => Promise<void>;
}

export const MyTemplatesSection: React.FC<MyDesignProps> = ({
  projects,
  loadingProjects,
  hoveredId,
  selectedProjects,
  setHoveredId,
  onDeleteSelected,
  clearSelection,
  toggleProjectSelection,
}) => {
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const {
    newProjectOpen,
    setNewProjectOpen,
    newProjectTab,
    newProjectSearch,
    setNewProjectSearch,
    setNewProjectTab,
  } = useProjectHooks();

  const sortedProjects = useMemo(
    () =>
      [...projects].sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      ),
    [projects]
  );

  const filteredProjects = useMemo(
    () =>
      sortedProjects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      ),
    [sortedProjects, search]
  );

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onDeleteSelected(selectedProjects);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* === Header === */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          My Templates
        </h2>

        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your templates..."
            className="w-full bg-white/60 backdrop-blur-md rounded-xl pl-10 pr-3 py-2.5 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>
      </div>

      {/* === Loading State === */}
      {loadingProjects ? (
        <div className="flex items-center gap-3 py-6 text-indigo-600 font-medium">
          <svg
            className="animate-spin h-6 w-6 text-indigo-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p>Fetching your templates...</p>
        </div>
      ) : (
        <>
          {filteredProjects.length === 0 && (
            <p className="text-gray-500 text-sm">
              {search
                ? "No templates found for your search."
                : "No templates yet. Start by creating one!"}
            </p>
          )}

          {/* === Grid always shown === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
            {/* Create a Design Card */}
            <div
              onClick={() => setNewProjectOpen(true)}
              className="group relative border-2 border-dashed border-gray-300 hover:border-indigo-400 bg-white/60 backdrop-blur-lg rounded-2xl flex flex-col items-center justify-center h-60 cursor-pointer transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition">
                <FiPlus size={28} />
              </div>
              <p className="mt-3 font-medium text-gray-700 group-hover:text-indigo-600 transition">
                Create a Design
              </p>
            </div>

            {/* Project Cards */}
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="relative bg-white/70 backdrop-blur-md border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition transform hover:-translate-y-1 group cursor-pointer"
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Checkbox */}
                {(hoveredId === project.id || selectedProjects.length > 0) && (
                  <div className="absolute top-3 left-3 z-10 bg-white rounded-md shadow-md p-1.5">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => toggleProjectSelection(project.id)}
                      className="h-4 w-4 accent-indigo-500 cursor-pointer"
                    />
                  </div>
                )}

                {/* Video Thumbnail */}
                <div className="relative h-44 overflow-hidden">
                  <video
                    src={project.projectVidUrl}
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                    onMouseOver={(e) => {
                      e.currentTarget.play();
                      e.currentTarget.playbackRate = 2.5;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                  {hoveredId === project.id && (
                    <div className="absolute bottom-0 w-full bg-black/60 text-white px-3 py-2 backdrop-blur-sm">
                      <p className="font-semibold text-sm truncate">
                        {project.title}
                      </p>
                      <p className="text-xs opacity-80">
                        Updated:{" "}
                        {new Date(project.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Button */}
                <div className="p-3">
                  <button
                    onClick={() => {
                      const url = getTemplateRoute(
                        project.templateId,
                        project.id
                      );
                      window.open(url, "_blank");
                    }}
                    className="w-full py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition"
                  >
                    🚀 Open Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* === Bottom Floating Action Bar === */}
      {selectedProjects.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md shadow-lg rounded-full px-5 py-2 flex items-center gap-4 z-50 border border-gray-200">
          <span className="font-medium text-sm text-gray-800">
            {selectedProjects.length} selected
          </span>
          <button
            onClick={clearSelection}
            disabled={deleting}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition"
          >
            <FiX /> Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-sm transition disabled:opacity-50"
          >
            {deleting ? (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              <>
                <FiTrash2 /> Delete
              </>
            )}
          </button>
        </div>
      )}

      <ChooseTemplateModal
        open={newProjectOpen}
        onClose={() => setNewProjectOpen(false)}
        newProjectTab={newProjectTab}
        setNewProjectTab={setNewProjectTab}
        newProjectSearch={newProjectSearch}
        setNewProjectSearch={setNewProjectSearch}
      />
    </div>
  );
};
