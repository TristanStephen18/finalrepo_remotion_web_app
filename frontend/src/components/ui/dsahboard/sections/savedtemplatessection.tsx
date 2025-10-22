import React, { useMemo, useState } from "react";
import {
  FiSearch,
  FiImage,
  FiCheck,
  FiTrash2,
  FiArrowLeft,
} from "react-icons/fi";

type FolderType = "root" | "media" | "datasets";

interface ProjectsSectionProps {
  uploads: any[];
  uploadFilter: "all" | "image" | "video";
  setUploadFilter: React.Dispatch<
    React.SetStateAction<"all" | "image" | "video">
  >;
  loadingUploads: boolean;
  selectedUploads: number[];
  setSelectedUploads: React.Dispatch<React.SetStateAction<number[]>>;
  handleDeleteUploads: () => Promise<void>;
  userDatasets: any[];
  selectedDatasets: number[];
  setSelectedDatasets: React.Dispatch<React.SetStateAction<number[]>>;
  loadingDatasets: boolean;
  handleDeleteDataset: () => Promise<void>;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  uploads,
  uploadFilter,
  setUploadFilter,
  loadingUploads,
  selectedUploads,
  setSelectedUploads,
  handleDeleteUploads,
  userDatasets,
  selectedDatasets,
  setSelectedDatasets,
  loadingDatasets,
  handleDeleteDataset,
}) => {
  const [currentFolder, setCurrentFolder] = useState<FolderType>("root");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleting, setDeleting] = useState(false);

  const filteredUploads = useMemo(() => {
    if (uploadFilter === "all") return uploads;
    return uploads.filter((u) => u.type === uploadFilter);
  }, [uploads, uploadFilter]);

  const filteredDatasets = useMemo(() => {
    return userDatasets.filter((dataset: any) =>
      dataset.url
        .replaceAll("/datasets/", "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [userDatasets, searchQuery]);

  const startDelete = async (type: "uploads" | "datasets") => {
    setDeleting(true);
    await (type === "uploads" ? handleDeleteUploads() : handleDeleteDataset());
    setDeleting(false);
  };

  const sectionTitle =
    currentFolder === "root"
      ? "My Files"
      : currentFolder === "media"
      ? "My Media"
      : "My Datasets";

  return (
    <div className="flex flex-col h-full text-gray-800 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
      {/* === Header (Simple, Clean) === */}
      <div className="flex items-center mb-6">
        {currentFolder !== "root" && (
          <button
            onClick={() => setCurrentFolder("root")}
            className="p-2 mr-2 rounded-full hover:bg-gray-100 transition"
          >
            <FiArrowLeft size={18} className="text-gray-600" />
          </button>
        )}
        <h1 className="text-2xl font-semibold text-gray-900">{sectionTitle}</h1>
      </div>

      {/* === Main Content === */}
      <div className="flex-1 overflow-y-auto pb-20 space-y-8">
        {/* === ROOT === */}
        {currentFolder === "root" && (
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Choose a category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[
                {
                  key: "media",
                  label: "Media",
                  description: "Images and videos you uploaded",
                  icon: <FiImage size={36} />,
                },
                {
                  key: "datasets",
                  label: "Datasets",
                  description: "Your uploaded data files",
                  icon: (
                    <img
                      src="https://res.cloudinary.com/dnxc1lw18/image/upload/v1761045051/json_n749ko.png"
                      alt="dataset"
                      className="w-9 h-9 opacity-80"
                    />
                  ),
                },
              ].map((f) => (
                <div
                  key={f.key}
                  onClick={() => setCurrentFolder(f.key as FolderType)}
                  className="group bg-white border border-gray-200 hover:border-indigo-400 rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-indigo-50 transition">
                      {f.icon}
                    </div>
                    <p className="font-medium text-gray-800 text-base">
                      {f.label}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === MEDIA === */}
        {currentFolder === "media" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Media Library</h2>
              <select
                value={uploadFilter}
                onChange={(e) =>
                  setUploadFilter(e.target.value as "all" | "image" | "video")
                }
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
              </select>
            </div>

            {loadingUploads ? (
              <p className="text-indigo-500">Loading uploads...</p>
            ) : filteredUploads.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <FiImage className="mx-auto text-4xl mb-2 opacity-50" />
                No uploads yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredUploads.map((u) => {
                  const selected = selectedUploads.includes(u.id);
                  return (
                    <div
                      key={u.id}
                      onClick={() =>
                        setSelectedUploads((prev) =>
                          prev.includes(u.id)
                            ? prev.filter((id) => id !== u.id)
                            : [...prev, u.id]
                        )
                      }
                      className={`relative rounded-xl overflow-hidden border transition-all cursor-pointer ${
                        selected
                          ? "border-indigo-400 ring-2 ring-indigo-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {selected && (
                        <div className="absolute top-2 left-2 bg-white rounded-md p-1 shadow">
                          <FiCheck className="text-indigo-600" />
                        </div>
                      )}

                      {u.type === "image" ? (
                        <img
                          src={u.url}
                          alt="upload"
                          className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <video
                          src={u.url}
                          muted
                          playsInline
                          className="w-full h-44 object-cover"
                          onMouseOver={(e) => {
                            e.currentTarget.play();
                            e.currentTarget.playbackRate = 2.5;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.pause();
                            e.currentTarget.currentTime = 0;
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {currentFolder === "datasets" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Datasets</h2>
              <div className="relative w-full sm:w-72">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search datasets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
            </div>

            {loadingDatasets ? (
              <p className="text-indigo-500">Loading datasets...</p>
            ) : filteredDatasets.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <img
                  src="https://res.cloudinary.com/dnxc1lw18/image/upload/v1761045051/json_n749ko.png"
                  alt="dataset"
                  className="mx-auto w-12 h-12 mb-3 opacity-60"
                />
                No datasets found.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                {filteredDatasets.map((dataset, idx) => {
                  const isSelected = selectedDatasets.includes(dataset.id || idx);
                  const iconSrc =
                    dataset.type === "json"
                      ? "https://res.cloudinary.com/dnxc1lw18/image/upload/v1761045051/json_n749ko.png"
                      : dataset.type === "xlsx"
                      ? "https://res.cloudinary.com/dnxc1lw18/image/upload/v1761045053/xlsx_uvojck.png"
                      : "/images/file.png";

                  return (
                    <div
                      key={dataset.id || idx}
                      onClick={() =>
                        setSelectedDatasets((prev) =>
                          prev.includes(dataset.id || idx)
                            ? prev.filter((id) => id !== (dataset.id || idx))
                            : [...prev, dataset.id || idx]
                        )
                      }
                      className={`relative flex flex-col items-center justify-center rounded-xl p-4 border transition-all cursor-pointer text-center ${
                        isSelected
                          ? "border-indigo-400 bg-indigo-50 shadow-sm"
                          : "border-gray-200 hover:shadow-sm"
                      }`}
                    >
                      <img
                        src={iconSrc}
                        alt={dataset.type}
                        className="w-14 h-14 mb-2 object-contain"
                      />
                      <p className="text-xs font-medium text-gray-700 break-all max-w-[120px] truncate">
                        {dataset.url.replaceAll("https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/datasets/", "")}
                      </p>
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full p-1">
                          <FiCheck size={12} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* === Floating Action Bar === */}
      {(selectedUploads.length > 0 || selectedDatasets.length > 0) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-lg rounded-full px-6 py-2 flex items-center gap-4 z-50">
          <span className="text-sm font-medium text-gray-700">
            {selectedUploads.length > 0
              ? `${selectedUploads.length} selected`
              : `${selectedDatasets.length} selected`}
          </span>
          <button
            onClick={() => {
              setSelectedUploads([]);
              setSelectedDatasets([]);
            }}
            disabled={deleting}
            className="text-sm text-gray-500 hover:text-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              startDelete(selectedUploads.length > 0 ? "uploads" : "datasets")
            }
            disabled={deleting}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-full bg-red-500 hover:bg-red-600 text-white transition"
          >
            <FiTrash2 size={14} />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
};
