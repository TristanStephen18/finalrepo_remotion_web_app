import { useState } from "react";
import { backendPrefix } from "../../config";

export const useProjectHooks = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
    const [newProjectOpen, setNewProjectOpen] = useState(false);
    const [newProjectTab, setNewProjectTab] = useState(0);
    const [newProjectSearch, setNewProjectSearch] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${backendPrefix}/projects`, {
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

  const handleDeleteProjects = async () => {
    try {
      await Promise.all(
        selectedProjects.map((id) =>
          fetch(`${backendPrefix}/projects/${id}`, {
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

  return {
    projects,
    setProjects,
    loadingProjects,
    hoveredId,
    setHoveredId,
    fetchProjects,
    handleDeleteProjects,
    toggleProjectSelection,
    selectedProjects,
    setSelectedProjects,
    newProjectOpen,
    setNewProjectOpen,
    newProjectTab,
    setNewProjectTab,
    newProjectSearch,
    setNewProjectSearch
  };
};
