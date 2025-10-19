import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import type React from "react";
import type { CurveLineTrendDataset } from "../../../../../models/CurveLineTrend";
import { ChooseUserDatasetsModal } from "../../../modals/ChooseUserDatasetsModal";
import { InvalidJsonFileFormatModal } from "../../../modals/InvalidDatasetFormat";
import { useEffect } from "react";
import { curverlinetrenddatasetformat } from "../../../../../data/ProperJsonFormats";
import { EditableJsonArea } from "../Global/EditableJsonArea";
import { CurveLineTrendDatasetTable } from "../tables/CurveLineTrendTemplate";
import { useDatasetHooks } from "../../../../../hooks/DatasetSection";
import { UserDatasetsSection } from "../Global/UserDatasetsSection";
import { AIGeneratedDatasetSectionWithoutAPI } from "../Global/AiSectionRemaining";
import { DatasetTopbar } from "../Global/DatasetSectionTopbar";
import { datasetLoader } from "../../../DatasetLoader";

interface CurveLineTrendBatchRenderingDatasetSectionInterface {
  curveLineData: CurveLineTrendDataset[];
  datasetQuantity: number;
  setDatasetQuantity: React.Dispatch<React.SetStateAction<number>>;
  isRendering: boolean;
  generateDataset: () => void;
  loading: boolean;
  loaderLabel: string;
  setCurveLineData: React.Dispatch<
    React.SetStateAction<CurveLineTrendDataset[]>
  >;
  uploadDataset: (
    file: File
  ) => Promise<{ fileUrl: any; jsonData: any } | null>;
  userDatasets: any[];
  fetchUserDataSets: () => void;
  setUserDatasets: React.Dispatch<React.SetStateAction<any[]>>;
}

export const CurveLineTrendBatchRenderingDatasetSection: React.FC<
  CurveLineTrendBatchRenderingDatasetSectionInterface
> = ({
  curveLineData,
  datasetQuantity,
  setDatasetQuantity,
  isRendering,
  loading,
  generateDataset,
  loaderLabel,
  setCurveLineData,
  uploadDataset,
  userDatasets,
  fetchUserDataSets,
  setUserDatasets,
}) => {
  const properformat = curverlinetrenddatasetformat;
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

  useEffect(() => {
    if (!jsonEdited) {
      const text = JSON.stringify(curveLineData, null, 2);
      setUploadedJsonText(text);
      setOriginalJsonText(text);
    }
  }, [curveLineData, jsonEdited]);

  const handleRemoveDataset = (index: number) => {
    setCurveLineData((prev) => prev.filter((_, idx) => idx !== index));
  };

  const validateDataset = (data: unknown): data is CurveLineTrendDataset[] => {
    if (!Array.isArray(data)) return false;
    return data.every(
      (d) =>
        typeof d.title === "string" &&
        typeof d.subtitle === "string" &&
        Array.isArray(d.data) &&
        d.data.every(
          (item: any) =>
            typeof item.label === "number" && typeof item.value === "number"
        ) &&
        typeof d.dataType === "string"
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
        setCurveLineData(rawJson);
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
        setCurveLineData(parsed);
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
          curveLineData.length > 0 ? (
            <CurveLineTrendDatasetTable
              curveLineData={curveLineData}
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
        template="curvelinetrend"
        setUserDatasets={setUserDatasets}
      />
    </Box>
  );
};
