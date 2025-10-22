import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { SearchIcon } from "lucide-react";
import type React from "react";
import { useDatasetFromUploads } from "../../../hooks/uploads/ExtractingDataFromUploads";
import { useState } from "react";

interface ChooseUserDatasetsModalInterface {
  showFileChooser: boolean;
  setShowFileChooser: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  userDatasets: any[];
  setSelectedDataset: (value: any) => void;
  selectedDataset: any;
  template: string;
  setUserDatasets: React.Dispatch<React.SetStateAction<any[]>>;
}

export const ChooseUserDatasetsModal: React.FC<
  ChooseUserDatasetsModalInterface
> = ({
  setShowFileChooser,
  showFileChooser,
  searchQuery,
  setSearchQuery,
  userDatasets,
  setSelectedDataset,
  selectedDataset,
  template,
  setUserDatasets,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={showFileChooser} onClose={() => setShowFileChooser(false)}>
      <DialogTitle>Choose from your uploaded files</DialogTitle>
      <DialogContent>
        <TextField
          placeholder="Search datasets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            maxHeight: 350,
            overflowY: "auto",
            mb: 2,
            minWidth: 400,
          }}
        >
          {userDatasets && userDatasets.length > 0 ? (
            userDatasets
              .filter((dataset: any) => {
                const name = dataset.url
                  .replaceAll("/datasets/", "")
                  .toLowerCase();
                return name.includes(searchQuery.toLowerCase());
              })
              .map((dataset: any, idx: number) => {
                const isSelected = selectedDataset === (dataset.id || idx);
                let iconSrc = "";
                if (dataset.type === "json") {
                  iconSrc = "https://res.cloudinary.com/dnxc1lw18/image/upload/v1761045051/json_n749ko.png";
                } else if (dataset.type === "xlsx") {
                  iconSrc = "https://res.cloudinary.com/dnxc1lw18/image/upload/v1761045053/xlsx_uvojck.png";
                }
                return (
                  <Box
                    key={dataset.id || idx}
                    sx={{
                      width: "30%",
                      minWidth: 160,
                      maxWidth: 220,
                      border: isSelected
                        ? "2px solid #1976d2"
                        : "2px solid #eee",
                      borderRadius: 3,
                      p: 2,
                      position: "relative",
                      cursor: "pointer",
                      transition: "border 0.2s",
                      boxSizing: "border-box",
                      bgcolor: isSelected ? "#e3f2fd" : "#fff",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      textAlign: "center",
                      boxShadow: isSelected ? "0 2px 12px 0 #1976d233" : "none",
                    }}
                    onClick={() => setSelectedDataset(dataset.id || idx)}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {iconSrc && (
                        <img
                          src={iconSrc}
                          alt={dataset.type}
                          style={{
                            width: 55,
                            height: 55,
                            objectFit: "contain",
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      fontWeight={600}
                      sx={{ mb: 0.5, wordBreak: "break-all", fontSize: 10 }}
                    >
                      {dataset.url.replaceAll("https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/datasets/", "") ||
                        `Dataset ${idx + 1}`}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: 9 }}
                    >
                      Uploaded:{" "}
                      {dataset.uploadedAt
                        ? new Date(dataset.uploadedAt).toLocaleString()
                        : "N/A"}
                    </Typography>
                    {isSelected && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "rgba(25, 118, 210, 0.85)",
                          color: "#fff",
                          borderRadius: "50%",
                          width: 22,
                          height: 22,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          fontWeight: 700,
                        }}
                      >
                        ✓
                      </Box>
                    )}
                  </Box>
                );
              })
          ) : (
            <Box sx={{ width: "100%" }}>
              <Typography color="text.secondary" align="center">
                No uploaded datasets found.
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowFileChooser(false)}>Cancel</Button>
        <Button
          variant="contained"
          disabled={selectedDataset === null || loading}
          onClick={async () =>  {
            setLoading(true);
            const selectedDatasetObj = userDatasets.find(
              (dataset: any, idx: number) =>
                (dataset.id || idx) === selectedDataset
            );
            const data = await useDatasetFromUploads(
              selectedDatasetObj.url,
              template,
              selectedDatasetObj.type
            );
            setUserDatasets(data as any);
            setLoading(false);
            setShowFileChooser(false);
          }}
        >
          {loading ? 'Extracting data...' : 'Select'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
