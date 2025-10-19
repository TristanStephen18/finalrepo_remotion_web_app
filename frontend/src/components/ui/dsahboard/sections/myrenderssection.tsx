import React, { useState } from "react";
import { templatesWithTheirIds } from "../../../../data/TemplateIds";
import { FiDownload, FiGrid, FiList } from "react-icons/fi";

interface RenderItem {
  id: string;
  type: "mp4" | "gif" | "webm";
  outputUrl: string;
  templateId?: number;
  renderedAt?: string;
  [key: string]: any;
}

interface MyRendersSectionProps {
  renders: RenderItem[];
  loading: boolean;
  selectedRenders: string[];
  setSelectedRenders: React.Dispatch<React.SetStateAction<string[]>>;
  handleDeleteRenders: () => Promise<void>;
}

export const MyRendersSection: React.FC<MyRendersSectionProps> = ({
  renders,
  loading,
  selectedRenders,
  setSelectedRenders,
  handleDeleteRenders,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | "all">("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  if (loading)
    return <div className="p-6 text-center text-gray-500 animate-pulse">Loading renders...</div>;

  if (!renders || renders.length === 0)
    return <div className="p-6 text-center text-gray-500">No renders found.</div>;

  let filteredRenders =
    selectedTemplateId === "all"
      ? renders
      : renders.filter((r) => r.templateId === selectedTemplateId);

  filteredRenders = filteredRenders.slice().sort((a, b) => {
    const aDate = a.renderedAt ? new Date(a.renderedAt).getTime() : 0;
    const bDate = b.renderedAt ? new Date(b.renderedAt).getTime() : 0;
    return sortOrder === "latest" ? bDate - aDate : aDate - bDate;
  });

  const handleSelectAll = () => {
    if (selectedRenders.length === filteredRenders.length) {
      setSelectedRenders([]);
    } else {
      setSelectedRenders(filteredRenders.map((r) => r.id));
    }
  };

  const handleCancel = () => setSelectedRenders([]);

  return (
    <div className="flex flex-col relative w-full h-full">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 tracking-tight">My Renders</h2>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedTemplateId}
            onChange={(e) =>
              setSelectedTemplateId(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className="rounded-lg border border-gray-200 bg-white text-sm px-3 py-1.5 focus:ring-2 focus:ring-indigo-400 transition"
          >
            <option value="all">All Templates</option>
            {Object.entries(templatesWithTheirIds).map(([id, name]) => (
              <option key={id} value={id}>
                {name as string}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "latest" | "oldest")}
            className="rounded-lg border border-gray-200 bg-white text-sm px-3 py-1.5 focus:ring-2 focus:ring-indigo-400 transition"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setLayout("grid")}
              className={`p-2 rounded-md ${
                layout === "grid"
                  ? "bg-indigo-100 text-indigo-700 shadow-sm"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <FiGrid size={17} />
            </button>
            <button
              onClick={() => setLayout("list")}
              className={`p-2 rounded-md ${
                layout === "list"
                  ? "bg-indigo-100 text-indigo-700 shadow-sm"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <FiList size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 bg-[#f9fafc]">
        {layout === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRenders.map((render) => {
              const isSelected = selectedRenders.includes(render.id);
              const formattedDate = render.renderedAt
                ? new Date(render.renderedAt).toLocaleString()
                : "";

              return (
                <div
                  key={render.id}
                  onClick={() =>
                    setSelectedRenders((prev) =>
                      prev.includes(render.id)
                        ? prev.filter((id) => id !== render.id)
                        : [...prev, render.id]
                    )
                  }
                  className={`relative group cursor-pointer rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 ${
                    isSelected ? "ring-2 ring-indigo-400" : ""
                  }`}
                >
                  {/* Media */}
                  <div className="w-full h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {render.type === "mp4" || render.type === "webm" ? (
                      <video
                        src={render.outputUrl}
                        controls
                        preload="metadata"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <img
                        src={render.outputUrl}
                        alt="Render preview"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>

                  {/* Footer */}
                  <div className="bg-white px-4 py-3 border-t border-gray-100">
                    <p className="font-semibold text-gray-800 truncate text-sm">
                      {typeof render.templateId === "number" &&
                      templatesWithTheirIds[String(render.templateId)]
                        ? templatesWithTheirIds[String(render.templateId)]
                        : "Unknown Template"}
                    </p>
                    <p className="text-gray-500 text-xs mt-1 truncate">{formattedDate}</p>
                  </div>

                  {/* Download */}
                  <a
                    href={render.outputUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-indigo-500 hover:text-white transition"
                    title="Download"
                  >
                    <FiDownload size={17} />
                  </a>

                  {/* Checkbox */}
                  {selectedRenders.length > 0 && (
                    <div className="absolute top-3 left-3 bg-white p-1 rounded-md shadow-sm">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="accent-indigo-500 w-4 h-4"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // List view
          <div className="flex flex-col gap-4">
            {filteredRenders.map((render) => {
              const isSelected = selectedRenders.includes(render.id);
              const formattedDate = render.renderedAt
                ? new Date(render.renderedAt).toLocaleString()
                : "";

              return (
                <div
                  key={render.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition ${
                    isSelected ? "ring-2 ring-indigo-400" : ""
                  }`}
                >
                  <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100">
                    {render.type === "mp4" || render.type === "webm" ? (
                      <video
                        src={render.outputUrl}
                        controls
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={render.outputUrl}
                        alt="Render preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate text-sm">
                      {typeof render.templateId === "number" &&
                      templatesWithTheirIds[String(render.templateId)]
                        ? templatesWithTheirIds[String(render.templateId)]
                        : "Unknown Template"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{formattedDate}</p>
                  </div>

                  <a
                    href={render.outputUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-2 rounded-full shadow hover:bg-indigo-500 hover:text-white transition"
                    title="Download"
                  >
                    <FiDownload size={17} />
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating actions */}
      {selectedRenders.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-full shadow-lg px-5 py-2 flex items-center gap-3 z-50">
          <span className="text-sm font-medium text-gray-700">{selectedRenders.length} selected</span>
          <button
            onClick={handleSelectAll}
            className="text-sm px-3 py-1 rounded-full border border-gray-300 hover:bg-indigo-500 hover:text-white transition"
          >
            {selectedRenders.length === filteredRenders.length ? "Unselect All" : "Select All"}
          </button>
          <button
            onClick={handleCancel}
            className="text-sm px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteRenders}
            className="text-sm px-4 py-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
