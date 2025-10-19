import type React from "react";

import { FiCpu } from "react-icons/fi";

interface AIGeneratedDatasetSectionWithoutAPIInterface {
  generateDataset: () => void;
  isRendering: boolean;
  datasetQuantity: number;
  setDatasetQuantity: React.Dispatch<React.SetStateAction<number>>;
}

export const AIGeneratedDatasetSectionWithoutAPI: React.FC<
  AIGeneratedDatasetSectionWithoutAPIInterface
> = ({ generateDataset, isRendering, datasetQuantity, setDatasetQuantity }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 mb-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Quantity Input */}
        <div className="flex flex-col flex-1 sm:flex-initial">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            value={datasetQuantity}
            disabled={isRendering}
            onChange={(e) => setDatasetQuantity(Number(e.target.value))}
            className={`w-full sm:w-32 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm ${
              isRendering ? "bg-gray-100 cursor-not-allowed" : "bg-white"
            }`}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generateDataset}
          disabled={isRendering}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition
            ${
              isRendering
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }
          `}
        >
          <FiCpu className="text-lg" />
          <span>Generate Dataset</span>
        </button>
      </div>
    </div>
  );
};
