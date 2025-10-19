import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  TextField,
  Tabs,
  Tab,
  Chip,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { templateCategories } from "../../../data/DashboardCardsData"; 
import { TemplateNavigator } from "../../../utils/TemplateNavigator";
import { ModalTemplateCard } from "../dsahboard/TemplateCardModal";

interface ChooseTemplateModalProps {
  open: boolean;
  onClose: () => void;
  newProjectTab: number;
  setNewProjectTab: (tab: number) => void;
  newProjectSearch: string;
  setNewProjectSearch: (search: string) => void;
}

export const ChooseTemplateModal: React.FC<ChooseTemplateModalProps> = ({
  open,
  onClose,
  newProjectTab,
  setNewProjectTab,
  newProjectSearch,
  setNewProjectSearch,
}) => {
  const categories = ["All", ...Object.keys(templateCategories)];
  const allTemplates = Object.values(templateCategories).flat();

  const displayedTemplates =
    newProjectTab === 0
      ? allTemplates
      : templateCategories[categories[newProjectTab] as keyof typeof templateCategories];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{ sx: { borderRadius: 2, overflow: "hidden" } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Choose your template
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Search Bar */}
        <TextField
          variant="outlined"
          placeholder="Search templates..."
          fullWidth
          size="small"
          sx={{ mb: 3 }}
          value={newProjectSearch}
          onChange={(e) => setNewProjectSearch(e.target.value)}
        />

        {/* Tabs */}
        <Tabs
          value={newProjectTab}
          onChange={(_, newValue) => setNewProjectTab(newValue)}
          sx={{
            mb: 3,
            "& .MuiTab-root": {
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "700",
              minHeight: "44px",
              px: 3,
              mx: 0.5,
              boxShadow: "0px 2px 6px rgba(0,0,0,0.06)",
              bgcolor: "background.paper",
              color: "text.primary",
              "&:hover": { bgcolor: "rgba(216, 27, 96, 0.06)" },
            },
            "& .Mui-selected": {
              background: "linear-gradient(90deg, #d81b60 0%, #42a5f5 100%)",
              color: "white !important",
              boxShadow: "0px 6px 18px rgba(12,18,40,0.12)",
            },
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          {categories.map((category, index) => {
            const count =
              category === "All"
                ? allTemplates.length
                : (templateCategories as any)[category].length;
            return (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>{category}</span>
                    <Chip
                      label={count}
                      size="small"
                      sx={{ bgcolor: "rgba(0,0,0,0.06)", fontWeight: 700 }}
                    />
                  </Box>
                }
              />
            );
          })}
        </Tabs>

        {/* Template Cards Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 1,
            maxHeight: "70vh",
            overflowY: "auto",
            pr: 1,
          }}
        >
          {displayedTemplates
            .filter(
              (t) =>
                t.name.toLowerCase().includes(newProjectSearch.toLowerCase()) ||
                t.description
                  .toLowerCase()
                  .includes(newProjectSearch.toLowerCase())
            )
            .map((template) => (
              <ModalTemplateCard
                key={template.name}
                label={template.name}
                description={template.description}
                url={template.url}
                onSelect={(label) => {
                  const location = TemplateNavigator(label);
                  window.open(location, "_blank");
                  onClose();
                }}
              />
            ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
