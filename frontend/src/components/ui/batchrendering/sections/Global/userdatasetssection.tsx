import type React from "react";
import { useEffect, useState } from "react";
import { FiFolder, FiUpload } from "react-icons/fi";

interface UserDatasetsSectionInterface {
  uploadedUrl: string | null;
  uploadError: string | null;
  setShowFileChooser: React.Dispatch<React.SetStateAction<boolean>>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  selectedFile: File | null;
  handleFileUpload: () => Promise<void>;
}

export const UserDatasetsSection: React.FC<UserDatasetsSectionInterface> = ({
  uploadError,
  uploadedUrl,
  uploading,
  setShowFileChooser,
  handleFileChange,
  selectedFile,
  handleFileUpload,
}) => {
  const [uploadStage, setUploadStage] = useState<
    "idle" | "uploading" | "extracting"
  >("idle");
  useEffect(() => {
    if (uploading) {
      setUploadStage("uploading");
      const timer = setTimeout(() => {
        setUploadStage("extracting");
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setUploadStage("idle");
    }
  }, [uploading]);

  let buttonLabel = "Upload and Extract data";
  if (uploading) {
    buttonLabel =
      uploadStage === "uploading" ? "Uploading..." : "Extracting data...";
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 mb-6 border border-gray-100">
      {/* Header */}
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
        Upload Dataset
      </h2>

      {/* Upload Section */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* File Input + Upload Button */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <input
            type="file"
            accept=".json,application/json,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileChange}
            disabled={uploading}
            className={`block w-full sm:w-auto text-sm text-gray-700 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />

          <button
            onClick={handleFileUpload}
            disabled={!selectedFile || uploading}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-white text-sm transition ${
              !selectedFile || uploading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            <FiUpload className="text-lg" />
            <span>{buttonLabel}</span>
          </button>
        </div>

        {/* "OR" Divider */}
        <div className="flex items-center justify-center text-gray-500 font-medium">
          <span>or</span>
        </div>

        {/* Choose from uploaded */}
        <button
          onClick={() => setShowFileChooser(true)}
          className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          <FiFolder className="text-lg" />
          <span>Choose from uploaded</span>
        </button>
      </div>

      {/* Feedback Messages */}
      {uploadError && (
        <p className="text-red-500 text-sm mt-2">{uploadError}</p>
      )}

      {uploadedUrl && (
        <p className="text-green-600 text-xs mt-2">
          Dataset uploaded successfully!
        </p>
      )}
    </div>
  );
};
