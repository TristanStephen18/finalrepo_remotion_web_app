import React, { useEffect } from "react";
import { DashboardSidebarNav } from "../../ui/navigations/DashboardSidenav";
import { ProjectsSection } from "../../ui/dsahboard/sections/SavedTemplatesSection";
// import { ChooseTemplateModal } from "../../ui/modals/ChooseTemplateModal";
import { HomeSection } from "../../ui/dsahboard/sections/HomeSection";
import { MyRendersSection } from "../../ui/dsahboard/sections/MyRendersSection";
import { useDatasetsFetching } from "../../../hooks/datafetching/DatasetFilesFetching";
import { useHomeSectionHooks } from "../../../hooks/dashboardhooks/Home";
import { useProjectHooks } from "../../../hooks/dashboardhooks/ProjectHooks";
import { useUploadHooks } from "../../../hooks/dashboardhooks/UploadHooks";
import { useRendersHooks } from "../../../hooks/dashboardhooks/RendersHooks";
import { useProfileHooks } from "../../../hooks/datafetching/ProfileData";
import { ProfilePage } from "../../../pages/user/Profile";
import { MyTemplatesSection } from "../../ui/dsahboard/sections/MyDesignSection";

export const DashboardContent: React.FC = () => {
  const {
    fetchUserDatasets,
    userDatasets,
    loadingDatasets,
    selectedDatasets,
    setSelectedDatasets,
    handleDeleteDatasets,
  } = useDatasetsFetching();

  const { search, setSearch, activeSection, setActiveSection } =
    useHomeSectionHooks();

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
    <div className="min-h-screen bg-gray-50 relative">
      {/* === Sidebar === */}
      <DashboardSidebarNav
        active={activeSection}
        onChange={setActiveSection}
        userInitials={username?.[0] ?? "U"}
        userPfp={userPfp}
      />

      <main
        className="
    md:ml-60
    px-3
    sm:px-4
    md:px-8
    py-4
    pt-16 md:pt-4
    min-h-screen
    transition-all
    duration-300
  "
      >
        {activeSection === "home" && (
          <HomeSection
            search={search}
            setSearch={setSearch}
            projects={projects}
            renders={renders}
            datasets={userDatasets}
            uploads={uploads}
          />
        )}

        {activeSection === "templates" && (
          <MyTemplatesSection
            clearSelection={() => setSelectedProjects([])}
            hoveredId={hoveredId}
            loadingProjects={loadingProjects}
            onDeleteSelected={handleDeleteProjects}
            projects={projects}
            selectedProjects={selectedProjects}
            setHoveredId={setHoveredId}
            toggleProjectSelection={toggleProjectSelection}
          />
        )}

        {activeSection === "files" && (
          <ProjectsSection
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
      </main>
    </div>
  );
};

export default DashboardContent;
