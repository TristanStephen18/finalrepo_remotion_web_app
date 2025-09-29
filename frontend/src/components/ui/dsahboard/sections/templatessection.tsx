import React from "react";
import {
  Box,
  Typography,
  TextField,
  Chip,
} from "@mui/material";
import { templateCategories } from "../../../../data/dashboardcardsdata";
import { TemplateCard } from "../templatecard";

interface TemplatesSectionProps {
  search: string;
  setSearch: (value: string) => void;
  tab: number;
  setTab: (tab: number) => void;
  onTry: (template: string, description: string) => void;
}

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  search,
  setSearch,
  tab,
  setTab,
  onTry,
}) => {
  const categories = ["For you", ...Object.keys(templateCategories)];
  const allTemplates = Object.values(templateCategories).flat();

  const displayedTemplates =
    tab === 0
      ? allTemplates
      : templateCategories[categories[tab] as keyof typeof templateCategories];

  return (
    <Box>
      {/* 🔹 Header with Search */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Templates
        </Typography>

        <TextField
          variant="outlined"
          placeholder="Search our templates"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: "100%",
            maxWidth: 400,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
          }}
        />
      </Box>

      {/* 🔹 Category Chips */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 4,
        }}
      >
        {categories.map((category, index) => {
        //   const count =
        //     category === "For you"
        //       ? allTemplates.length
        //       : (templateCategories as any)[category].length;

          const isActive = tab === index;

          return (
            <Chip
              key={index}
              label={`${category}`}
              onClick={() => setTab(index)}
              variant={isActive ? "filled" : "outlined"}
              sx={{
                px: 2,
                py: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                borderRadius: "8px",
                cursor: "pointer",
                bgcolor: isActive ? "primary.light" : "background.paper",
                color: isActive ? "primary.main" : "text.primary",
                borderColor: isActive ? "primary.main" : "rgba(0,0,0,0.1)",
                "&:hover": {
                  bgcolor: isActive ? "primary.light" : "rgba(0,0,0,0.04)",
                },
              }}
            />
          );
        })}
      </Box>

      {/* 🔹 Template Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 4,
        }}
      >
        {displayedTemplates
          .filter(
            (t) =>
              t.name.toLowerCase().includes(search.toLowerCase()) ||
              t.description.toLowerCase().includes(search.toLowerCase())
          )
          .map((template) => (
            <TemplateCard
              key={template.name}
              label={template.name}
              description={template.description}
              onTry={onTry}
            />
          ))}
      </Box>
    </Box>
  );
};
