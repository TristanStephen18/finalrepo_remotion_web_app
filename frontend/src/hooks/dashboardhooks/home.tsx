import { useState } from "react";
import type { DashboardSection } from "../../components/ui/navigations/DashboardSidenav";

export const useHomeSectionHooks = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>("home");
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const handleOpenPreview = (template: string, description: string) => {
    setSelectedTemplate(template);
    setSelectedDescription(description);
  };

  const handleClosePreview = () => {
    setSelectedTemplate(null);
    setSelectedDescription("");
  };
  return {
    search,
    setSearch,
    selectedTemplate,
    setSelectedTemplate,
    selectedDescription,
    setSelectedDescription,
    handleClosePreview,
    handleOpenPreview,
    activeSection,
    setActiveSection,
  };
};
