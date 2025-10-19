import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import type React from "react";
import type { Phrase } from "../../../../../models/TextTyping";
import { ChooseUserDatasetsModal } from "../../../modals/ChooseUserDatasetsModal";
import { InvalidJsonFileFormatModal } from "../../../modals/InvalidDatasetFormat";
import { useEffect } from "react";
import { texttypingdatasetformat } from "../../../../../data/ProperJsonFormats";
import { useDatasetHooks } from "../../../../../hooks/DatasetSection";
import { DatasetTopbar } from "../Global/DatasetSectionTopbar";
import { AiGenerateSectionDatasetQnT } from "../Global/AiDatasetSectionQuoteAndTextTyping";
import { UserDatasetsSection } from "../Global/UserDatasetsSection";
import { datasetLoader } from "../../../DatasetLoader";
import { TextTypingDatasetTable } from "../tables/TextTypingTemplate";
import { EditableJsonArea } from "../Global/EditableJsonArea";

interface TextTypingDatasetSectionInterface {
  setDatasetSource: React.Dispatch<React.SetStateAction<"recite" | "ai">>;
  datasetSource: "recite" | "ai";
  datasetQuantity: number;
  setDatasetQuantity: React.Dispatch<React.SetStateAction<number>>;
  generateDataset: () => void;
  loaderLabel: string;
  isRendering: boolean;
  handleRemovePhrase: (index: number) => void;
  loading: boolean;
  phrasesData: Phrase[];
  setPhrasesData: React.Dispatch<React.SetStateAction<Phrase[]>>;
  uploadDataset: (
    file: File
  ) => Promise<{ fileUrl: any; jsonData: any } | null>;
  userDatasets: any[];
  fetchUserDataSets: () => void;
}

export const TextTypingDatasetSection: React.FC<
  TextTypingDatasetSectionInterface
> = ({
  isRendering,
  setDatasetQuantity,
  generateDataset,
  loaderLabel,
  loading,
  phrasesData,
  handleRemovePhrase,
  datasetQuantity,
  datasetSource,
  setDatasetSource,
  uploadDataset,
  userDatasets,
  fetchUserDataSets,
  setPhrasesData,
}) => {
  const properformat = texttypingdatasetformat;
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
      const text = JSON.stringify(phrasesData, null, 2);
      setUploadedJsonText(text);
      setOriginalJsonText(text);
    }
  }, [phrasesData, jsonEdited]);

  const validateDataset = (data: unknown): data is Phrase[] => {
    if (!Array.isArray(data)) return false;
    return data.every((d) => {
      if (typeof d !== 'object' || d === null) return false;
      const keys = Object.keys(d);
      if (keys.length !== 3 || !keys.includes('lines') || !keys.includes('category') || !keys.includes('mood')) return false;
      if (!Array.isArray(d.lines) || !d.lines.every((line: any) => typeof line === 'string')) return false;
      if (typeof d.category !== 'string') return false;
      if (typeof d.mood !== 'string') return false;
      return true;
    });
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
        setPhrasesData(rawJson);
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
        setPhrasesData(parsed);
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
        <AiGenerateSectionDatasetQnT
          datasetQuantity={datasetQuantity}
          datasetSource={datasetSource}
          generateDataset={generateDataset}
          isRendering={isRendering}
          setDatasetQuantity={setDatasetQuantity}
          setDatasetSource={setDatasetSource}
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
          phrasesData.length > 0 ? (
            <TextTypingDatasetTable
              handleRemovePhrase={handleRemovePhrase}
              isRendering={isRendering}
              phrasesData={phrasesData}
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
        template="texttyping"
        setUserDatasets={setPhrasesData}
      />
    </Box>
  );
};
