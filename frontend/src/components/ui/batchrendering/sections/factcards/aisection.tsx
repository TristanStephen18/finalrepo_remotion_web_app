
import type React from "react";
import { NicheSelectionFactCards } from "../../../FactCardsNichesSelection";
import Dataset from "@mui/icons-material/Dataset";
import SmartToyIcon from '@mui/icons-material/SmartToy';


interface FactCardsAiSectionInterface {
  selectedNiches: string[];
  setSelectedNiches: React.Dispatch<React.SetStateAction<string[]>>;
  generateDataset: () => void;
  isRendering: boolean;
  datasetQuantity: number;
  setDatasetQuantity: React.Dispatch<React.SetStateAction<number>>;
}

export const FactCardsAiSection: React.FC<FactCardsAiSectionInterface> = ({
  selectedNiches,
  setSelectedNiches,
  setDatasetQuantity,
  generateDataset,
  isRendering,
  datasetQuantity,
}) => {
   return (
    <div className="bg-white shadow-md rounded-2xl p-6 md:p-8 mb-6 flex flex-col gap-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center gap-6">

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">
            Source
          </label>
          <div className="flex items-center space-x-2">
            <button
              disabled={isRendering}
              className="flex items-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium rounded-lg text-sm transition-all duration-200 disabled:opacity-60"
            >
              <SmartToyIcon className="mr-2 text-indigo-500" fontSize="small" />
              AI Generated
            </button>
          </div>
        </div>

        {/* Dataset Quantity Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600">
            Number of Datasets Per Niche
          </label>
          <input
            type="number"
            disabled={isRendering}
            min={1}
            value={datasetQuantity}
            onChange={(e) => setDatasetQuantity(Number(e.target.value))}
            className="w-32 text-center border border-gray-300 rounded-md py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          />
        </div>

        {/* Generate Button */}
        <div className="md:ml-auto">
          <button
            onClick={generateDataset}
            disabled={isRendering}
            className="flex items-center justify-center px-5 py-2.5 rounded-lg text-white font-semibold text-sm shadow-sm transition-all duration-300 disabled:opacity-50 bg-gradient-to-r from-blue-600 to-sky-400 hover:from-blue-700 hover:to-sky-500"
          >
            <Dataset className="mr-2 text-white" fontSize="small" />
            Generate Dataset
          </button>
        </div>
      </div>

      {/* === Niche Selection Section === */}
      <NicheSelectionFactCards
        selectedNiches={selectedNiches}
        setSelectedNiches={setSelectedNiches}
      />
    </div>
  );
};
