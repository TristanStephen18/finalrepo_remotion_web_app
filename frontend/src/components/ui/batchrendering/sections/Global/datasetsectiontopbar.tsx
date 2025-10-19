import type React from "react";
import { FiCode, FiCpu, FiDatabase, FiTable } from "react-icons/fi";

interface DatasetTopbarInterface {
  activeSource: "ai" | "user";
  setActiveSource: React.Dispatch<React.SetStateAction<"ai" | "user">>;
  displayLayout: "table" | "json";
  setDisplayLayout: React.Dispatch<React.SetStateAction<"table" | "json">>;
}

export const DatasetTopbar: React.FC<DatasetTopbarInterface> = ({
  activeSource,
  setActiveSource,
  displayLayout,
  setDisplayLayout,
}) => {
  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-3 mb-4 flex flex-wrap items-center justify-between gap-3">
      {/* Left Toggle Group */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveSource("ai")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
            activeSource === "ai"
              ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
              : "text-gray-600 border border-transparent hover:bg-gray-50 hover:text-gray-800"
          }`}
        >
          <FiCpu className="text-lg" />
          <span>APIs & AI Generated</span>
        </button>

        <button
          onClick={() => setActiveSource("user")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
            activeSource === "user"
              ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
              : "text-gray-600 border border-transparent hover:bg-gray-50 hover:text-gray-800"
          }`}
        >
          <FiDatabase className="text-lg" />
          <span>Your Datasets</span>
        </button>
      </div>

      {/* Right Toggle Group */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setDisplayLayout("table")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
            displayLayout === "table"
              ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
              : "text-gray-600 border border-transparent hover:bg-gray-50 hover:text-gray-800"
          }`}
        >
          <FiTable className="text-lg" />
          <span>Table</span>
        </button>

        <button
          onClick={() => setDisplayLayout("json")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
            displayLayout === "json"
              ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
              : "text-gray-600 border border-transparent hover:bg-gray-50 hover:text-gray-800"
          }`}
        >
          <FiCode className="text-lg" />
          <span>JSON</span>
        </button>
      </div>
    </div>
  );
};
