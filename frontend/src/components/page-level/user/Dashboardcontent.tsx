import React, { useEffect, useState } from "react";
import { Box, Fab } from "@mui/material";
import {
  DashboardSidebarNav,
  type DashboardSection,
} from "../../ui/navigations/dsahboardsidenav";
import { MiniMessagingModal } from "../../ui/modals/messagingmodal_version1";
import { TemplatesSection } from "../../ui/dsahboard/sections/templatessection";
import { ProjectsSection } from "../../ui/dsahboard/sections/savedtemplatessection";
import { TemplatePreviewDialog } from "../../ui/dsahboard/templatepreviewdialog";
import { ChooseTemplateModal } from "../../ui/modals/choosetemplatemodal";
import { HomeSection } from "../../ui/dsahboard/sections/homesection";
import { MyRendersSection } from "../../ui/dsahboard/sections/myrenderssection";
import { useDatasetsFetching } from "../../../hooks/datafetching/datasetfilesfetching";

export const DashboardContent: React.FC = () => {

   const { fetchUserDatasets, userDatasets, setUserDatasets, loadingDatasets } = useDatasetsFetching();
     const [selectedDatasets, setSelectedDatasets] = useState<number[]>([]);
  const [chatOpen, setChatOpen] = useState(false);

  // navigation
  const [activeSection, setActiveSection] = useState<DashboardSection>("home");

  // templates
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string>("");

  // projects
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);

  // new project modal
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectTab, setNewProjectTab] = useState(0);
  const [newProjectSearch, setNewProjectSearch] = useState("");

  // 🔹 Uploads state
  const [uploads, setUploads] = useState<any[]>([]);
  const [selectedUploads, setSelectedUploads] = useState<number[]>([]);
  const [loadingUploads, setLoadingUploads] = useState(false);
  const [uploadFilter, setUploadFilter] = useState<"all" | "image" | "video">(
    "all"
  );

  // 🔹 Renders state
  const [renders, setRenders] = useState<any[]>([]);
  const [selectedRenders, setSelectedRenders] = useState<string[]>([]);
  const [loadingRenders, setLoadingRenders] = useState(false);

  const fetchUploads = () => {
    setLoadingUploads(true);
    fetch("/useruploads", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch uploads");
        return res.json();
      })
      .then((data) => {
        setUploads(data);
      })
      .catch((err) => console.error("❌ Failed to fetch uploads:", err))
      .finally(() => setLoadingUploads(false));
  };

  const fetchRenders = () => {
    setLoadingRenders(true);
    fetch("/renders", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch renders");
        return res.json();
      })
      .then((data) => {
        if (data.length > 0) {
          const sortedRenders = data.slice().sort((a: any, b: any) => {
            const aDate = a.renderedAt ? new Date(a.renderedAt).getTime() : 0;
            const bDate = b.renderedAt ? new Date(b.renderedAt).getTime() : 0;
            return bDate - aDate;
          });
          setRenders(sortedRenders);
        }
      })
      .catch((err) => console.error("❌ Failed to fetch renders:", err))
      .finally(() => setLoadingRenders(false));
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/projects", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();

      if (data.length > 0) {
        const sortedProjects = data.slice().sort((a: any, b: any) => {
          const aDate = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
          const bDate = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
          return bDate - aDate;
        });
        setProjects(sortedProjects);
        // setRenders(sortedRenders);
      }
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const toggleProjectSelection = (id: number) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleOpenPreview = (template: string, description: string) => {
    setSelectedTemplate(template);
    setSelectedDescription(description);
  };

  const handleClosePreview = () => {
    setSelectedTemplate(null);
    setSelectedDescription("");
  };

  const handleDeleteProjects = async () => {
    try {
      await Promise.all(
        selectedProjects.map((id) =>
          fetch(`/projects/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        )
      );
      setProjects((prev) =>
        prev.filter((p) => !selectedProjects.includes(p.id))
      );
      setSelectedProjects([]);
    } catch (err) {
      console.error("Error deleting projects:", err);
    }
  };

  const handleDeleteUploads = async () => {
    try {
      await Promise.all(
        selectedUploads.map((id) =>
          fetch(`/useruploads/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        )
      );
      setUploads((prev) => prev.filter((p) => !selectedUploads.includes(p.id)));
      setSelectedUploads([]);
    } catch (err) {
      console.error("Error deleting projects:", err);
    }
  };

  const handleDeleteRenders = async () => {
    try {
      await Promise.all(
        selectedRenders.map((id) =>
          fetch(`/renders/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        )
      );
      setRenders((prev) => prev.filter((p) => !selectedRenders.includes(p.id)));
      setSelectedRenders([]);
    } catch (err) {
      console.error("Error deleting projects:", err);
    }
  };

  const handleDeleteDatasets = async () => {
    try {
      await Promise.all(
        selectedUploads.map((id) =>
          fetch(`/datasets/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        )
      );
      setUserDatasets((prev) => prev.filter((p) => !selectedDatasets.includes(p.id)));
      setSelectedDatasets([]);
    } catch (err) {
      console.error("Error deleting datasets:", err);
    }
  };

  useEffect(() => {
    fetchUploads();
    fetchRenders();
    fetchProjects();
    fetchUserDatasets();
  }, []);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <DashboardSidebarNav
        active={activeSection}
        onChange={setActiveSection}
        userInitials="S"
        onCreate={() => setNewProjectOpen(true)}
      />
      <Box
        sx={{
          flexGrow: 1,
          ml: "80px", 
          p: 3,
          backgroundColor: "background.default",
          position: "relative",
        }}
      >
        <Fab
          title="Chat with us"
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1200,
            boxShadow: "0 4px 12px rgba(139,92,246,.45)",
            backgroundColor: "#fff",
            color: "#222",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
          onClick={() => setChatOpen(true)}
        >
          <span
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              display: "block",
              background:
                "conic-gradient(from 120deg, var(--primary-1), var(--primary-2), var(--primary-3))",
              boxShadow: "0 4px 12px rgba(139,92,246,.45)",
            }}
          />
        </Fab>

        {/* Mini Messaging Modal */}
        <MiniMessagingModal
          open={chatOpen}
          onClose={() => setChatOpen(false)}
        />

        {activeSection === "home" && (
          <HomeSection
            search={search}
            setSearch={setSearch}
            onTry={handleOpenPreview}
            projects={projects}
            renders={renders}
          />
        )}

        {activeSection === "templates" && (
          <TemplatesSection
            search={search}
            setSearch={setSearch}
            tab={tab}
            setTab={setTab}
            onTry={handleOpenPreview}
          />
        )}

        {activeSection === "projects" && (
          <ProjectsSection
            projects={projects}
            loadingProjects={loadingProjects}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            selectedProjects={selectedProjects}
            toggleProjectSelection={toggleProjectSelection}
            clearSelection={() => setSelectedProjects([])} // new
            onDeleteSelected={handleDeleteProjects}
            fetchUploads={fetchUploads}
            loadingUploads={loadingUploads}
            setUploadFilter={setUploadFilter}
            uploadFilter={uploadFilter}
            uploads={uploads}
            handleDeleteUploads={handleDeleteUploads}
            selectedUploads={selectedUploads}
            setSelectedUploads={setSelectedUploads}
            loadingDatasets={loadingDatasets}
            selectedDatasets={selectedDatasets}
            setSelectedDatasets={setSelectedDatasets}
            userDatasets={userDatasets}
            handleDeleteDataset={handleDeleteDatasets}
          />
        )}

        {activeSection === "renders" && (
          <MyRendersSection
            renders={renders}
            loading={loadingRenders}
            handleDeleteRenders={handleDeleteRenders}
            selectedRenders={selectedRenders}
            setSelectedRenders={setSelectedRenders}
          />
        )}

        {/* Template Preview Dialog */}
        <TemplatePreviewDialog
          open={!!selectedTemplate}
          onClose={handleClosePreview}
          selectedTemplate={selectedTemplate}
          selectedDescription={selectedDescription}
        />

        {/* Choose Template Modal */}
        <ChooseTemplateModal
          open={newProjectOpen}
          onClose={() => setNewProjectOpen(false)}
          newProjectTab={newProjectTab}
          setNewProjectTab={setNewProjectTab}
          newProjectSearch={newProjectSearch}
          setNewProjectSearch={setNewProjectSearch}
        />
      </Box>
    </Box>
  );
};

export default DashboardContent;
