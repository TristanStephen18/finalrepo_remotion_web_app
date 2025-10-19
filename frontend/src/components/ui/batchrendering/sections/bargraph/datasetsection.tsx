import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import type { BarGraphDataset } from "../../../../../models/BarGraph";
import { InvalidJsonFileFormatModal } from "../../../modals/InvalidDatasetFormat";
import { bargraphdatasetformat } from "../../../../../data/ProperJsonFormats";
import { ChooseUserDatasetsModal } from "../../../modals/ChooseUserDatasetsModal";
import { useDatasetHooks } from "../../../../../hooks/DatasetSection";
import { DatasetTopbar } from "../Global/DatasetSectionTopbar";
import { AIGeneratedDatasetSectionWithoutAPI } from "../Global/AiSectionRemaining";
import { UserDatasetsSection } from "../Global/UserDatasetsSection";
import { datasetLoader } from "../../../DatasetLoader";
import { EditableJsonArea } from "../Global/EditableJsonArea";
import { BarGraphDatasetTable } from "../tables/BarGraphTemplate";

interface BarGraphDatasetSectionInterface {
  datasetQuantity: number;
  setDatasetQuantity: React.Dispatch<React.SetStateAction<number>>;
  generateDataset: () => void;
  loaderLabel: string;
  barGraphData: BarGraphDataset[];
  setBarGraphData: React.Dispatch<React.SetStateAction<BarGraphDataset[]>>;
  isRendering: boolean;
  loading: boolean;
  uploadDataset: (
    file: File
  ) => Promise<{ fileUrl: any; jsonData: any } | null>;
  userDatasets: any[];
  fetchUserDataSets: () => void;
  setUserDatasets: React.Dispatch<React.SetStateAction<any[]>>;
}

export const BarGraphDatasetSection: React.FC<
  BarGraphDatasetSectionInterface
> = ({
  datasetQuantity,
  setDatasetQuantity,
  generateDataset,
  barGraphData,
  isRendering,
  loaderLabel,
  loading,
  setBarGraphData,
  uploadDataset,
  userDatasets,
  fetchUserDataSets,
  setUserDatasets,
}) => {
  const properformat = bargraphdatasetformat;
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
    handleJsonChange,
  } = useDatasetHooks();

  const handleRemoveDataset = (index: number) => {
    setBarGraphData((prev) => prev.filter((_, idx) => idx !== index));
  };

  useEffect(() => {
    if (!jsonEdited) {
      const text = JSON.stringify(barGraphData, null, 2);
      setUploadedJsonText(text);
      setOriginalJsonText(text);
    }
  }, [barGraphData, jsonEdited]);

  const validateDataset = (data: unknown): data is BarGraphDataset[] => {
    if (!Array.isArray(data)) return false;
    return data.every(
      (d) =>
        typeof d.title === "string" &&
        typeof d.subtitle === "string" &&
        Array.isArray(d.data) &&
        d.data.every(
          (item: any) =>
            typeof item.name === "string" && typeof item.value === "number"
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
        setBarGraphData(rawJson);
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
        setBarGraphData(parsed);
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
          barGraphData.length > 0 ? (
            <BarGraphDatasetTable
              barGraphData={barGraphData}
              handleRemoveDataset={handleRemoveDataset}
              isRendering={isRendering}
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
              No dataset yet
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
        template="bargraph"
        setUserDatasets={setUserDatasets}
      />
    </Box>
  );
};
