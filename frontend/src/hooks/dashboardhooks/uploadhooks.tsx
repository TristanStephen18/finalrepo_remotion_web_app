import { useState } from "react";
import { backendPrefix } from "../../config";

export const useUploadHooks = () => {
  const [uploads, setUploads] = useState<any[]>([]);
  const [selectedUploads, setSelectedUploads] = useState<number[]>([]);
  const [loadingUploads, setLoadingUploads] = useState(false);
  const [uploadFilter, setUploadFilter] = useState<"all" | "image" | "video">(
    "all"
  );

  const fetchUploads = () => {
    setLoadingUploads(true);
    fetch(`${backendPrefix}/useruploads`, {
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

  const handleDeleteUploads = async () => {
    try {
      await Promise.all(
        selectedUploads.map((id) =>
          fetch(`${backendPrefix}/useruploads/${id}`, {
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

  return {
    uploads,
    setLoadingUploads,
    fetchUploads,
    handleDeleteUploads,
    selectedUploads,
    setSelectedUploads,
    loadingUploads,
    uploadFilter,
    setUploadFilter,
  };
};
