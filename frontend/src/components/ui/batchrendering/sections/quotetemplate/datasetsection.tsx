import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import type React from "react";
import { ChooseUserDatasetsModal } from "../../../modals/ChooseUserDatasetsModal";
import { InvalidJsonFileFormatModal } from "../../../modals/InvalidDatasetFormat";
import { useEffect } from "react";
import { DatasetTopbar } from "../Global/DatasetSectionTopbar";
import { useDatasetHooks } from "../../../../../hooks/DatasetSection";
import { AiGenerateSectionDatasetQnT } from "../Global/AiDatasetSectionQuoteAndTextTyping";
import { UserDatasetsSection } from "../Global/UserDatasetsSection";
import { EditableJsonArea } from "../Global/EditableJsonArea";
import { datasetLoader } from "../../../DatasetLoader";
import { QuoteDatasetTableDisplay } from "../tables/QuoteTemplateTable";

interface QuoteTemplateDatasetSectionInterface {
  setDatasetSource: React.Dispatch<React.SetStateAction<"recite" | "ai">>;
  datasetSource: "recite" | "ai";
  datasetQuantity: number;
  setDatasetQuantity: React.Dispatch<React.SetStateAction<number>>;
  generateDataset: () => void;
  loaderLabel: string;
  setQuotes: React.Dispatch<
    React.SetStateAction<{ text: string; author: string }[]>
  >;
  quotes: { text: string; author: string }[];
  isRendering: boolean;
  handleRemoveQuote: (index: number) => void;
  loading: boolean;
  uploadDataset: (
    file: File
  ) => Promise<{ fileUrl: any; jsonData: any } | null>;
  userDatasets: any[];
  fetchUserDataSets: () => void;
}

export const QuoteTemplateDatasetSection: React.FC<
  QuoteTemplateDatasetSectionInterface
> = ({
  setDatasetQuantity,
  setDatasetSource,
  datasetSource,
  datasetQuantity,
  loaderLabel,
  loading,
  isRendering,
  generateDataset,
  quotes,
  handleRemoveQuote,
  setQuotes,
  uploadDataset,
  userDatasets,
  fetchUserDataSets,
}) => {
  const properformat = `
  [
      {
        "text": "Sample Quote",
        "author": "Sample Author"
      } 
  ]
   `;

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

  useEffect(() => {
    if (!jsonEdited) {
      const text = JSON.stringify(quotes, null, 2);
      setUploadedJsonText(text);
      setOriginalJsonText(text);
    }
  }, [quotes, jsonEdited]);

  const validateDataset = (
    data: unknown
  ): data is { text: string; author: string }[] => {
    if (!Array.isArray(data)) return false;
    return data.every(
      (d) => typeof d.text === "string" && typeof d.author === "string"
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
        setQuotes(rawJson);
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
        setQuotes(parsed);
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
          quotes.length > 0 ? (
            <QuoteDatasetTableDisplay
              handleRemoveQuote={handleRemoveQuote}
              isRendering={isRendering}
              quotes={quotes}
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
              No quote dataset yet
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
        template="quote"
        setUserDatasets={setQuotes}
      />
    </Box>
  );
};
