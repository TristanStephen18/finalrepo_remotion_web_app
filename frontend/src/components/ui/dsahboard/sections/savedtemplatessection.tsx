import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  TextField,
  Slide,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FolderIcon from "@mui/icons-material/Folder";
import { getTemplateRoute } from "../../../../utils/temlplatenavigator";

interface ProjectsSectionProps {
  projects: any[];
  loadingProjects: boolean;
  hoveredId: number | null;
  setHoveredId: (id: number | null) => void;
  selectedProjects: number[];
  toggleProjectSelection: (id: number) => void;
  clearSelection: () => void;
  onDeleteSelected: (ids: number[]) => void;
  fetchUploads: () => void;
  uploads: any[];
  uploadFilter: "all" | "image" | "video";
  setUploadFilter: React.Dispatch<
    React.SetStateAction<"all" | "image" | "video">
  >;
  loadingUploads: boolean;
  selectedUploads: number[];
  setSelectedUploads: React.Dispatch<React.SetStateAction<number[]>>;
  handleDeleteUploads: () => Promise<void>;
  handleDeleteDataset: () => Promise<void>;
  userDatasets: any[];
  selectedDatasets: number[];
  setSelectedDatasets: React.Dispatch<React.SetStateAction<number[]>>;
  loadingDatasets: boolean;
}

type FolderType = "root" | "templates" | "media" | "datasets";

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  loadingProjects,
  hoveredId,
  setHoveredId,
  selectedProjects,
  toggleProjectSelection,
  clearSelection,
  onDeleteSelected,
  uploadFilter,
  setUploadFilter,
  uploads,
  loadingUploads,
  selectedUploads,
  setSelectedUploads,
  handleDeleteUploads,
  userDatasets,
  selectedDatasets,
  setSelectedDatasets,
  loadingDatasets,
  handleDeleteDataset,
}) => {
  const [currentFolder, setCurrentFolder] = useState<FolderType>("root");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [selectAllUploads, setSelectAllUploads] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onDeleteSelected(selectedProjects);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteUploadsLoading = () => {
    setDeleting(true);
    handleDeleteUploads().then(() => setDeleting(false));
  };

  const handleDeleteDatasetsLoading = () => {
    setDeleting(true);
    handleDeleteDataset().then(() => setDeleting(false));
  };

  const sortedProjects = useMemo(
    () =>
      [...projects].sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      ),
    [projects]
  );

  const filteredProjects = useMemo(
    () =>
      sortedProjects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      ),
    [sortedProjects, search]
  );

  const filteredUploads = useMemo(() => {
    if (uploadFilter === "all") return uploads;
    return uploads.filter((u) => u.type === uploadFilter);
  }, [uploads, uploadFilter]);

  const handleSelectAllUploads = () => {
    if (selectedUploads.length === filteredUploads.length) {
      setSelectedUploads([]);
    } else {
      setSelectedUploads(filteredUploads.map((u) => u.id));
    }
    setSelectAllUploads(!selectAllUploads);
  };

  const handleCancelUploads = () => {
    setSelectedUploads([]);
    setSelectAllUploads(false);
  };

  const sectionTitle =
    currentFolder === "root"
      ? "MY SPACE"
      : currentFolder === "templates"
      ? "My Templates"
      : currentFolder === "media"
      ? "My Media"
      : "My Datasets";

  const mediaLabel = useMemo(() => {
    switch (uploadFilter) {
      case "image":
        return "Images";
      case "video":
        return "Videos";
      default:
        return "All media";
    }
  }, [uploadFilter]);

  const renderRootFolders = () => (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        textAlign="left"
        gutterBottom
      >
        Choose a folder
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: 7,
          mt: 1,
          textAlign: "center",
        }}
      >
        {[
          { key: "templates", label: "My Templates" },
          { key: "media", label: "My Media" },
          { key: "datasets", label: "My Datasets" },
        ].map((f) => (
          <Box
            key={f.key}
            onClick={() => setCurrentFolder(f.key as FolderType)}
            sx={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
              borderRadius: 2,
              transition: "0.2s",
              "&:hover": {
                bgcolor: "rgba(25,118,210,0.08)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <FolderIcon sx={{ fontSize: 150, color: "#1976d2" }} />
            <Typography variant="body2" fontWeight="bold" mt={1}>
              {f.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

  const renderTemplates = () => (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          mt: 1,
          width: "100%",
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ mr: 2 }}>
          My Templates
        </Typography>
        <Box sx={{ flex: 1 }} />
        <TextField
          variant="outlined"
          placeholder="Search your templates"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            bgcolor: "white",
            borderRadius: "8px",
            width: 260,
            "& fieldset": { border: "none" },
          }}
        />
      </Box>

      {loadingProjects ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
          <CircularProgress size={32} />
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#1976d2" }}
          >
            Fetching your templates...
          </Typography>
        </Box>
      ) : filteredProjects.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {search
            ? "No templates found for your search."
            : "No templates yet. Start by creating one!"}
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 2,
            pb: 6,
          }}
        >
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
                border: "2px solid transparent",
                backgroundClip: "padding-box",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": {
                  cursor: "pointer",
                  transform: "translateY(-6px)",
                  boxShadow: "0px 10px 28px rgba(0,0,0,0.12)",
                },
              }}
            >
              {(hoveredId === project.id || selectedProjects.length > 0) && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    zIndex: 3,
                    bgcolor: "white",
                    p: 0.5,
                    borderRadius: "6px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes(project.id)}
                    onChange={() => toggleProjectSelection(project.id)}
                    style={{
                      height: "18px",
                      width: "18px",
                      cursor: "pointer",
                    }}
                  />
                </Box>
              )}

              <Box sx={{ position: "relative", height: 180 }}>
                <video
                  src={project.projectVidUrl}
                  muted
                  playsInline
                  preload="metadata"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.play();
                    e.currentTarget.playbackRate = 2.5;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                {hoveredId === project.id && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      width: "100%",
                      p: 2,
                      bgcolor: "rgba(0,0,0,0.55)",
                      color: "white",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" noWrap>
                      {project.title}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.85 }}>
                      Last updated:{" "}
                      {new Date(project.lastUpdated).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </Box>
              <CardContent sx={{ textAlign: "center" }}>
                <Button
                  size="small"
                  fullWidth
                  sx={{
                    borderRadius: "30px",
                    textTransform: "none",
                    fontWeight: 600,
                    background: "linear-gradient(90deg,#d81b60,#42a5f5)",
                    color: "white",
                    "&:hover": { opacity: 0.9 },
                  }}
                  onClick={() => {
                    const url = getTemplateRoute(
                      project.templateId,
                      project.id
                    );
                    window.open(url, "_blank");
                  }}
                >
                  🚀 Open Project
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </>
  );

  const renderMedia = () => (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {mediaLabel}
        </Typography>

        <TextField
          select
          size="small"
          value={uploadFilter}
          onChange={(e) =>
            setUploadFilter(e.target.value as "all" | "image" | "video")
          }
          SelectProps={{
            native: true,
          }}
          sx={{ minWidth: 140 }}
        >
          <option value="all">All</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </TextField>
      </Box>

      {loadingUploads ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2">Fetching uploads...</Typography>
        </Box>
      ) : filteredUploads.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No uploads yet.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 2,
          }}
        >
          {filteredUploads.map((u) => (
            <Card
              key={u.id}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: selectedUploads.includes(u.id)
                  ? "2px solid #1976d2"
                  : "1px solid #ddd",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedUploads((prev) =>
                  prev.includes(u.id)
                    ? prev.filter((id) => id !== u.id)
                    : [...prev, u.id]
                );
              }}
            >
              {selectedUploads.length > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    zIndex: 3,
                    bgcolor: "white",
                    p: 0.5,
                    borderRadius: "6px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedUploads.includes(u.id)}
                    readOnly
                    style={{
                      height: "18px",
                      width: "18px",
                      cursor: "pointer",
                    }}
                  />
                </Box>
              )}
              {u.type === "image" ? (
                <Box
                  component="img"
                  src={u.url}
                  alt="upload"
                  sx={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box sx={{ position: "relative", height: 160 }}>
                  <video
                    src={u.url}
                    muted
                    loop
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.play();
                      e.currentTarget.playbackRate = 2.5;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                </Box>
              )}
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );

  const filteredDatasets = useMemo(() => {
    return userDatasets.filter((dataset: any) => {
      const name = dataset.url.replaceAll("/datasets/", "").toLowerCase();
      return name.includes(searchQuery.toLowerCase());
    });
  }, [userDatasets, searchQuery]);

  const renderDatasets = () => (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          My Datasets
        </Typography>

        <TextField
          placeholder="Search datasets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ minWidth: 260 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loadingDatasets ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2">Fetching datasets...</Typography>
        </Box>
      ) : filteredDatasets.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No datasets found.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 1,
          }}
        >
          {filteredDatasets.map((dataset, idx) => {
            const isSelected = selectedDatasets.includes(dataset.id || idx);
            let iconSrc = "";
            if (dataset.type === "json") iconSrc = "/images/json.png";
            if (dataset.type === "xlsx") iconSrc = "/images/xlsx.png";

            return (
              <Box
                key={dataset.id || idx}
                sx={{
                  p: 2,
                  cursor: "pointer",
                  transition: "0.2s",
                  position: "relative",
                  bgcolor: isSelected ? "#ecdfdfff" : "transparent",
                  border: isSelected ? "1px solid black" : "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: 2,
                }}
                onClick={() =>
                  setSelectedDatasets((prev) =>
                    prev.includes(dataset.id || idx)
                      ? prev.filter((id) => id !== (dataset.id || idx))
                      : [...prev, dataset.id || idx]
                  )
                }
              >
                {iconSrc && (
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={iconSrc}
                      alt={dataset.type}
                      style={{ width: 55, height: 55, objectFit: "contain" }}
                    />
                  </Box>
                )}

                <Typography
                  fontWeight={600}
                  sx={{ mb: 0.5, wordBreak: "break-all", fontSize: 12 }}
                >
                  {dataset.url.replaceAll("/datasets/", "") ||
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
          })}
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderRadius: 2,
          overflow: "hidden",
          mb: 1,
        }}
      >
        <Box
          component="img"
          src="/projectsbackdrop.jpg"
          alt="Projects Backdrop"
          sx={{ width: "100%", height: 90, objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            px: 3,
            bgcolor: "rgba(0,0,0,0.3)",
          }}
        >
          {currentFolder !== "root" && (
            <IconButton
              onClick={() => setCurrentFolder("root")}
              sx={{ color: "white", mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography
            variant="h5"
            fontWeight="bold"
            color="white"
            sx={{ mb: 0 }}
          >
            {sectionTitle}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", pr: 2, pb: 8 }}>
        {currentFolder === "root" && renderRootFolders()}
        {currentFolder === "templates" && renderTemplates()}
        {currentFolder === "media" && renderMedia()}
        {currentFolder === "datasets" && renderDatasets()}
      </Box>

      <Slide
        direction="up"
        in={selectedProjects.length > 0}
        mountOnEnter
        unmountOnExit
      >
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            left: "40%",
            transform: "translateX(-50%)",
            bgcolor: "white",
            boxShadow: "0px 4px 16px rgba(0,0,0,0.2)",
            borderRadius: "30px",
            px: 3,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 2,
            zIndex: 2000,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {selectedProjects.length} selected
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={clearSelection}
            sx={{ borderRadius: "20px", textTransform: "none" }}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleDelete}
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              minWidth: 80,
            }}
            disabled={deleting}
          >
            {deleting ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Delete"
            )}
          </Button>
        </Box>
      </Slide>

      <Slide
        direction="up"
        in={selectedUploads.length > 0}
        mountOnEnter
        unmountOnExit
      >
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            left: "40%",
            transform: "translateX(-50%)",
            bgcolor: "white",
            boxShadow: "0px 4px 16px rgba(0,0,0,0.2)",
            borderRadius: "30px",
            px: 3,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 2,
            zIndex: 2000,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {selectedUploads.length} selected
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleSelectAllUploads}
            sx={{ borderRadius: "20px", textTransform: "none" }}
            disabled={deleting}
          >
            {selectedUploads.length === filteredUploads.length
              ? "Unselect All"
              : "Select All"}
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCancelUploads}
            sx={{ borderRadius: "20px", textTransform: "none" }}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleDeleteUploadsLoading}
            sx={{ borderRadius: "20px", textTransform: "none", minWidth: 80 }}
            disabled={deleting}
          >
            {deleting ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Delete"
            )}
          </Button>
        </Box>
      </Slide>

      <Slide
        direction="up"
        in={selectedDatasets.length > 0}
        mountOnEnter
        unmountOnExit
      >
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            left: "40%",
            transform: "translateX(-50%)",
            bgcolor: "white",
            boxShadow: "0px 4px 16px rgba(0,0,0,0.2)",
            borderRadius: "30px",
            px: 3,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 2,
            zIndex: 2000,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {selectedDatasets.length} selected
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              if (selectedDatasets.length === filteredDatasets.length) {
                setSelectedDatasets([]);
              } else {
                setSelectedDatasets(filteredDatasets.map((d) => d.id));
              }
            }}
            sx={{ borderRadius: "20px", textTransform: "none" }}
            disabled={deleting}
          >
            {selectedDatasets.length === filteredDatasets.length
              ? "Unselect All"
              : "Select All"}
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={() => setSelectedDatasets([])}
            sx={{ borderRadius: "20px", textTransform: "none" }}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleDeleteDatasetsLoading}
            sx={{ borderRadius: "20px", textTransform: "none", minWidth: 80 }}
            disabled={deleting}
          >
            {deleting ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              "Delete"
            )}
          </Button>
        </Box>
      </Slide>
    </Box>
  );
};
