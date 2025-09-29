import { useState, type ChangeEvent } from "react";

export function useDatasetHooks () {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
      const [selectedDataset, setSelectedDataset] = useState<any>(null);
      const [searchQuery, setSearchQuery] = useState("");
      const [uploading, setUploading] = useState(false);
      const [uploadError, setUploadError] = useState<string | null>(null);
      const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
      const [uploadedJsonText, setUploadedJsonText] = useState<string>("");
    
      const [activeSource, setActiveSource] = useState<"ai" | "user">("ai");
    
      const [displayLayout, setDisplayLayout] = useState<"table" | "json">("table");
    
      const [showFormatModal, setShowFormatModal] = useState(false);
      const [showFileChooser, setShowFileChooser] = useState(false);
    
      const [jsonEdited, setJsonEdited] = useState(false);
    
      const [originalJsonText, setOriginalJsonText] = useState<string>("");

      const handleJsonChange = (e: ChangeEvent<HTMLInputElement>) => {
          setUploadedJsonText(e.target.value);
          setJsonEdited(true);
        };
      
        const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
            setUploadError(null);
          }
        };

      return {
        selectedFile,
        setSelectedFile,
        selectedDataset,
        setSelectedDataset,
        searchQuery,
        setSearchQuery,
        uploading,
        setUploading,
        uploadError,
        setUploadError,
        uploadedUrl,
        setUploadedUrl,
        uploadedJsonText,
        setUploadedJsonText,
        activeSource,
        setActiveSource,
        displayLayout,
        setDisplayLayout,
        showFormatModal,
        setShowFormatModal,
        showFileChooser,
        setShowFileChooser,
        jsonEdited,
        setJsonEdited,
        originalJsonText,
        setOriginalJsonText,
        handleJsonChange,
        handleFileChange
      }
}