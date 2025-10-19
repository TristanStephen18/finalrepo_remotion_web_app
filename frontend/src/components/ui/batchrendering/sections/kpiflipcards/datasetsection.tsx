import { Box, Paper, Typography } from "@mui/material";
import type React from "react";

import type { KpiFlipData } from "../../../../../models/KpiFlipData";
import { ChooseUserDatasetsModal } from "../../../modals/ChooseUserDatasetsModal";
import { InvalidJsonFileFormatModal } from "../../../modals/InvalidDatasetFormat";
import { useEffect } from "react";

import { kpiflipdatasetformat } from "../../../../../data/ProperJsonFormats";
import { useDatasetHooks } from "../../../../../hooks/DatasetSection";
import { DatasetTopbar } from "../Global/DatasetSectionTopbar";
import { AIGeneratedDatasetSectionWithoutAPI } from "../Global/AiSectionRemaining";
import { UserDatasetsSection } from "../Global/UserDatasetsSection";
import { datasetLoader } from "../../../DatasetLoader";
import { KpiFlipDatasetTable } from "../tables/KpiFlipDataTemplate";
import { EditableJsonArea } from "../Global/EditableJsonArea";

interface KpiFlipCardsDatasetSectionInterface {
  loading: boolean;
  loaderLabel: string;
  isRendering: boolean;
  datasetQuantity: number;
  setDatasetQuantity: React.Dispatch<React.SetStateAction<number>>;
  generateDataset: () => void;
  setKpiFlipData: React.Dispatch<React.SetStateAction<KpiFlipData[]>>;
  kpiFlipData: KpiFlipData[];
  uploadDataset: (
    file: File
  ) => Promise<{ fileUrl: any; jsonData: any } | null>;
  userDatasets: any[];
  fetchUserDataSets: () => void;
  setUserDatasets: React.Dispatch<React.SetStateAction<any[]>>;
}

export const KpiFlipCardsDatasetSection: React.FC<
  KpiFlipCardsDatasetSectionInterface
> = ({
  isRendering,
  loaderLabel,
  loading,
  datasetQuantity,
  setDatasetQuantity,
  setKpiFlipData,
  generateDataset,
  kpiFlipData,
  uploadDataset,
  userDatasets,
  fetchUserDataSets,
  setUserDatasets,
}) => {
  const properformat = kpiflipdatasetformat;
  const {
    activeSource,
    displayLayout,
    jsonEdited,
    originalJsonText,
    searchQuery,
    selectedDataset,
    selectedFile,
    setActiveSource,
    setDisplayLayout,
    setJsonEdited,
    setOriginalJsonText,
    setSearchQuery,
    setSelectedDataset,
    setShowFileChooser,
    setShowFormatModal,
    setUploadError,
    setUploadedJsonText,
    setUploadedUrl,
    setUploading,
    showFileChooser,
    showFormatModal,
    uploadError,
    uploadedJsonText,
    uploadedUrl,
    uploading,
    handleFileChange,
    handleJsonChange
  } = useDatasetHooks();

  const handleRemoveDataset = (i: number) => {
    setKpiFlipData((prev) => prev.filter((_, idx) => idx !== i));
  };

  useEffect(() => {
    if (!jsonEdited) {
      const text = JSON.stringify(kpiFlipData, null, 2);
      setUploadedJsonText(text);
      setOriginalJsonText(text);
    }
  }, [kpiFlipData, jsonEdited]);

  const validateDataset = (data: unknown): data is KpiFlipData[] => {
    if (!Array.isArray(data)) return false;
    return data.every(
      (d) =>
        typeof d.title === "string" &&
        typeof d.subtitle === "string" &&
        Array.isArray(d.cardsData) &&
        typeof d.cardLabelFontSize === "number" &&
        typeof d.valueFontSize === "number" &&
        typeof d.cardLabelColor === "string" &&
        typeof d.cardColorBack === "string" &&
        typeof d.cardColorFront === "string" &&
        typeof d.cardBorderColor === "string" &&
        d.cardsData.every(
          (card: any) =>
            card.front &&
            typeof card.front.label === "string" &&
            typeof card.front.value === "string" &&
            typeof card.front.color === "string" &&
            card.back &&
            typeof card.back.label === "string" &&
            typeof card.back.value === "string" &&
            typeof card.back.color === "string"
        )
    );
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadDataset(selectedFile);
      setUploadedUrl(url?.fileUrl);
      const rawJson = url?.jsonData;
      fetchUserDataSets();

      if (rawJson && validateDataset(rawJson)) {
        setKpiFlipData(rawJson);
        const text = JSON.stringify(rawJson, null, 2);
        setUploadedJsonText(text);
        setOriginalJsonText(text);
      } else {
        setShowFormatModal(true);
      }
    } catch (err) {
      setUploadError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const hasChanges = uploadedJsonText !== originalJsonText;

  const handleFinalize = () => {
    try {
      const parsed = JSON.parse(uploadedJsonText);
      if (validateDataset(parsed)) {
        setKpiFlipData(parsed);
        setOriginalJsonText(JSON.stringify(parsed, null, 2));
        setJsonEdited(false);
      } else {
        setShowFormatModal(true);
      }
    } catch {
      setShowFormatModal(true);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Dataset Configuration
      </Typography>

      <DatasetTopbar
        activeSource={activeSource}
        displayLayout={displayLayout}
        setActiveSource={setActiveSource}
        setDisplayLayout={setDisplayLayout}
      />
      {activeSource === "ai" && (
        <AIGeneratedDatasetSectionWithoutAPI
          datasetQuantity={datasetQuantity}
          generateDataset={generateDataset}
          isRendering={isRendering}
          setDatasetQuantity={setDatasetQuantity}
        />
      )}

      {activeSource === "user" && (
        <UserDatasetsSection
          handleFileChange={handleFileChange}
          handleFileUpload={handleFileUpload}
          selectedFile={selectedFile}
          setShowFileChooser={setShowFileChooser}
          uploadError={uploadError}
          uploadedUrl={uploadedUrl}
          uploading={uploading}
        />
      )}

      <Paper elevation={2} sx={{ p: 2, borderRadius: 2, minHeight: 220 }}>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{ mb: 2, color: "#1976d2" }}
        >
          Current Dataset
        </Typography>
        {loading ? (
          datasetLoader(loaderLabel)
        ) : displayLayout === "table" ? (
          kpiFlipData.length > 0 ? (
            <KpiFlipDatasetTable
              handleRemoveDataset={handleRemoveDataset}
              isRendering={isRendering}
              kpiFlipData={kpiFlipData}
            />
          ) : (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
                p: 4,
              }}
            >
              No bar graph dataset yet
            </Box>
          )
        ) : (
          <EditableJsonArea
          handleFinalize={handleFinalize}
          handleJsonChange={handleJsonChange}
          hasChanges={hasChanges}
          uploadedJsonText={uploadedJsonText}
          />
        )}
      </Paper>

      <InvalidJsonFileFormatModal
        properFormat={properformat}
        setShowFormatModal={setShowFormatModal}
        showFormatModal={showFormatModal}
      />

      <ChooseUserDatasetsModal
        searchQuery={searchQuery}
        selectedDataset={selectedDataset}
        setSearchQuery={setSearchQuery}
        setSelectedDataset={setSelectedDataset}
        setShowFileChooser={setShowFileChooser}
        showFileChooser={showFileChooser}
        userDatasets={userDatasets}
        template="kpiflipcards"
        setUserDatasets={setUserDatasets}
      />
    </Box>
  );
};
