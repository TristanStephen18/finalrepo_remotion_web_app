import { Box, Paper, Typography } from "@mui/material";
import type React from "react";
import type { FactCardsDataset } from "../../../../../models/FactCards";
import { ChooseUserDatasetsModal } from "../../../modals/ChooseUserDatasetsModal";
import { InvalidJsonFileFormatModal } from "../../../modals/InvalidDatasetFormat";
import { useEffect, type ChangeEvent } from "react";
import { factcardsDatasetFormat } from "../../../../../data/ProperJsonFormats";
import { useDatasetHooks } from "../../../../../hooks/DatasetSection";
import { DatasetTopbar } from "../Global/DatasetSectionTopbar";
import { UserDatasetsSection } from "../Global/UserDatasetsSection";
import { datasetLoader } from "../../../DatasetLoader";
import { EditableJsonArea } from "../Global/EditableJsonArea";
import { FactCardsAiSection } from "./AiSection";
import { FactCardsDatasetTable } from "../tables/FactCardsTemplate";

interface FactCardsBatchRenderingDatasetSectionInterface {
  isRendering: boolean;
  loading: boolean;
  loaderLabel: string;
  handleRemoveDataset: (index: number) => void;
  factCardsData: FactCardsDataset[];
  setFactCardsData: React.Dispatch<React.SetStateAction<FactCardsDataset[]>>;
  datasetQuantity: number;
  setDatasetQuantity: React.Dispatch<React.SetStateAction<number>>;
  generateDataset: () => void;
  selectedNiches: string[];
  setSelectedNiches: React.Dispatch<React.SetStateAction<string[]>>;
  uploadDataset: (
    file: File
  ) => Promise<{ fileUrl: any; jsonData: any } | null>;
  userDatasets: any[];
  fetchUserDataSets: () => void;
  setUserDatasets: React.Dispatch<React.SetStateAction<any[]>>;
}

export const FactCardsBatchRenderingDatasetSection: React.FC<
  FactCardsBatchRenderingDatasetSectionInterface
> = ({
  isRendering,
  loaderLabel,
  loading,
  setDatasetQuantity,
  selectedNiches,
  datasetQuantity,
  setSelectedNiches,
  factCardsData,
  generateDataset,
  handleRemoveDataset,
  uploadDataset,
  userDatasets,
  fetchUserDataSets,
  setUserDatasets,
  setFactCardsData,
}) => {
  const properformat = factcardsDatasetFormat;
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
    setSelectedFile,
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
  } = useDatasetHooks();

  useEffect(() => {
    if (!jsonEdited) {
      const text = JSON.stringify(factCardsData, null, 2);
      setUploadedJsonText(text);
      setOriginalJsonText(text);
    }
  }, [factCardsData, jsonEdited]);

  const handleJsonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedJsonText(e.target.value);
    setJsonEdited(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadError(null);
    }
  };

  const validateDataset = (data: unknown): data is FactCardsDataset[] => {
    if (!Array.isArray(data)) return false;
    return data.every(
      (d) =>
        d.intro &&
        typeof d.intro.title === "string" &&
        typeof d.intro.subtitle === "string" &&
        d.outro &&
        typeof d.outro.title === "string" &&
        typeof d.outro.subtitle === "string" &&
        Array.isArray(d.facts) &&
        d.facts.every(
          (fact: any) =>
            typeof fact.title === "string" &&
            typeof fact.description === "string"
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
        setFactCardsData(rawJson);
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
        setFactCardsData(parsed);
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
        <FactCardsAiSection
          datasetQuantity={datasetQuantity}
          generateDataset={generateDataset}
          isRendering={isRendering}
          selectedNiches={selectedNiches}
          setDatasetQuantity={setDatasetQuantity}
          setSelectedNiches={setSelectedNiches}
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
          factCardsData.length > 0 ? (
            <FactCardsDatasetTable
              factCardsData={factCardsData}
              handleRemoveDataset={handleRemoveDataset}
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
        template="factcards"
        setUserDatasets={setUserDatasets}
      />
    </Box>
  );
};
