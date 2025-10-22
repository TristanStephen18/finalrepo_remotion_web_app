import { useState } from "react";
import { backendPrefix } from "../../config";

export const useDatasetsFetching = () => {
  const [loadingDatasets, setLoadingDatasets] = useState(false);
  const [userDatasets, setUserDatasets] = useState<any[]>([]);
  const [selectedDatasets, setSelectedDatasets] = useState<number[]>([]);

  const fetchUserDatasets = () => {
    setLoadingDatasets(true);
    fetch(`${backendPrefix}/datasets`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or failed fetch");
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setUserDatasets(data);
      })
      .catch((err) => console.error("❌ Failed to fetch user uploads:", err))
      .finally(() => setLoadingDatasets(false));
  };

  const handleDeleteDatasets = async () => {
    try {
      await Promise.all(
        selectedDatasets.map((id) =>
          fetch(`${backendPrefix}/datasets/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        )
      );
      setUserDatasets((prev) =>
        prev.filter((p) => !selectedDatasets.includes(p.id))
      );
      setSelectedDatasets([]);
    } catch (err) {
      console.error("Error deleting datasets:", err);
    }
  };

  return {
    fetchUserDatasets,
    setLoadingDatasets,
    loadingDatasets,
    userDatasets,
    setUserDatasets,
    selectedDatasets,
    setSelectedDatasets,
    handleDeleteDatasets,
  };
};
