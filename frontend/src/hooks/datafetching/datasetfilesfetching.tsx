import { useState } from "react";

export const useDatasetsFetching = () => {
  const [loadingDatasets, setLoadingDatasets] = useState(false);
  const [userDatasets, setUserDatasets] = useState<any[]>([]);

  const fetchUserDatasets = () => {
    setLoadingDatasets(true);
    fetch("/datasets", {
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
        setUserDatasets(data); // Store full dataset objects
      })
      .catch((err) => console.error("❌ Failed to fetch user uploads:", err))
      .finally(() => setLoadingDatasets(false));
  };

  return {
    fetchUserDatasets,
    setLoadingDatasets,
    loadingDatasets,
    userDatasets,
    setUserDatasets
  }
};
