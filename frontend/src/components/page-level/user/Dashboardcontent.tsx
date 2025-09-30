import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { DashboardSidebarNav } from "../../ui/navigations/dsahboardsidenav";
import { TemplatesSection } from "../../ui/dsahboard/sections/templatessection";
import { ProjectsSection } from "../../ui/dsahboard/sections/savedtemplatessection";
import { TemplatePreviewDialog } from "../../ui/dsahboard/templatepreviewdialog";
import { ChooseTemplateModal } from "../../ui/modals/choosetemplatemodal";
import { HomeSection } from "../../ui/dsahboard/sections/homesection";
import { MyRendersSection } from "../../ui/dsahboard/sections/myrenderssection";
import { useDatasetsFetching } from "../../../hooks/datafetching/datasetfilesfetching";
import { useHomeSectionHooks } from "../../../hooks/dashboardhooks/home";
import { useTemplateSectionHooks } from "../../../hooks/dashboardhooks/templatessectionhooks";
import { useProjectHooks } from "../../../hooks/dashboardhooks/projecthooks";
import { useUploadHooks } from "../../../hooks/dashboardhooks/uploadhooks";
import { useRendersHooks } from "../../../hooks/dashboardhooks/rendershooks";
import { useProfileHooks } from "../../../hooks/datafetching/profiledata";
import { ProfilePage } from "../../../pages/user/profile";

export const DashboardContent: React.FC = () => {
  const {
    fetchUserDatasets,
    userDatasets,
    loadingDatasets,
    selectedDatasets,
    setSelectedDatasets,
    handleDeleteDatasets,
  } = useDatasetsFetching();
  const {
    search,
    setSearch,
    selectedTemplate,
    selectedDescription,
    handleClosePreview,
    handleOpenPreview,
    activeSection,
    setActiveSection,
  } = useHomeSectionHooks();

  const { tab, setTab } = useTemplateSectionHooks();
  const {
    loadingProjects,
    fetchProjects,
    handleDeleteProjects,
    hoveredId,
    projects,
    selectedProjects,
    setHoveredId,
    setSelectedProjects,
    toggleProjectSelection,
    newProjectOpen,
    setNewProjectOpen,
    newProjectTab,
    setNewProjectTab,
    newProjectSearch,
    setNewProjectSearch,
  } = useProjectHooks();

  const {
    fetchUploads,
    handleDeleteUploads,
    loadingUploads,
    selectedUploads,
    setSelectedUploads,
    setUploadFilter,
    uploadFilter,
    uploads,
  } = useUploadHooks();

  const {
    fetchRenders,
    renders,
    handleDeleteRenders,
    loadingRenders,
    selectedRenders,
    setSelectedRenders,
  } = useRendersHooks();

  const { fetchProfileDetails, userData, userPfp, username } =
    useProfileHooks();

  useEffect(() => {
    fetchUploads();
    fetchRenders();
    fetchProjects();
    fetchUserDatasets();
    fetchProfileDetails();
  }, []);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <DashboardSidebarNav
        active={activeSection}
        onChange={setActiveSection}
        userInitials={username[0]}
        onCreate={() => setNewProjectOpen(true)}
        userPfp={userPfp}
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
            clearSelection={() => setSelectedProjects([])}
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

        {activeSection === "profile" && (
          <ProfilePage
            userData={userData}
            projects={projects}
            userDatasets={userDatasets}
            userUploads={uploads}
            renders={renders}
            fetchProfileDetails={fetchProfileDetails}
          />
        )}

        <TemplatePreviewDialog
          open={!!selectedTemplate}
          onClose={handleClosePreview}
          selectedTemplate={selectedTemplate}
          selectedDescription={selectedDescription}
        />

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
