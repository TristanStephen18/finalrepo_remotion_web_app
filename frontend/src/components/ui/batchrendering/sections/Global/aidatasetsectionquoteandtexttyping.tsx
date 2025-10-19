import React from "react";
import { FiCloud, FiCpu, FiDatabase } from "react-icons/fi";

interface AiGenerateSectionDatasetQnTInterface {
  generateDataset: () => void;
  isRendering: boolean;
  setDatasetSource: React.Dispatch<React.SetStateAction<"recite" | "ai">>;
  datasetSource: "recite" | "ai";
  datasetQuantity: number;
  setDatasetQuantity: React.Dispatch<React.SetStateAction<number>>;
}

export const AiGenerateSectionDatasetQnT: React.FC<
  AiGenerateSectionDatasetQnTInterface
> = ({
  generateDataset,
  isRendering,
  setDatasetQuantity,
  setDatasetSource,
  datasetQuantity,
  datasetSource,
}) => {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 mb-4 flex flex-col md:flex-row items-center gap-4 md:gap-6">
      {/* === Dataset Source === */}
      <div className="flex flex-col w-full md:w-auto gap-1">
        <label className="text-sm font-semibold text-gray-600">Source</label>
        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setDatasetSource("recite")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all w-1/2 sm:w-auto
              ${
                datasetSource === "recite"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            disabled={isRendering}
          >
            <FiCloud className="text-lg" /> Recite API
          </button>

          <button
            type="button"
            onClick={() => setDatasetSource("ai")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all w-1/2 sm:w-auto
              ${
                datasetSource === "ai"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            disabled={isRendering}
          >
            <FiCpu className="text-lg" /> AI Generated
          </button>
        </div>
      </div>

      {/* === Quantity Input === */}
      <div className="flex flex-col w-full md:w-auto gap-1">
        <label className="text-sm font-semibold text-gray-600">Quantity</label>
        <input
          type="number"
          value={datasetQuantity}
          onChange={(e) => setDatasetQuantity(Number(e.target.value))}
          min={1}
          disabled={isRendering}
          className="border border-gray-300 rounded-lg px-3 py-2 text-center text-sm w-full sm:w-32 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
      </div>

      {/* === Generate Button === */}
      <div className="w-full md:w-auto md:ml-auto">
        <button
          onClick={generateDataset}
          disabled={isRendering}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white text-sm shadow-sm transition-all w-full sm:w-auto ${
            isRendering
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:opacity-90"
          }`}
        >
          <FiDatabase className="text-lg" /> Generate Dataset
        </button>
      </div>
    </div>
  );
};
