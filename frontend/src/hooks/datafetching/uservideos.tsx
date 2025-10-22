import { useState } from "react";
import { backendPrefix } from "../../config";
import { bgVideosFromCloudinary } from "../../data/bgvideos";

export const userVideos = () => {
  const [recentVideos, setRecentVideos] = useState<string[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [defaultVideos, setDefaultVideos] = useState<string[]>([]);
  const [defaultvidsloading, setDefaultVidsLoading] = useState(false);

  function getAllDefaultVideos() {
    setDefaultVidsLoading(true);

    setDefaultVideos(bgVideosFromCloudinary);
    setDefaultVidsLoading(false);
  }

  const fetchUserVideos = () => {
    setLoadingVideos(true);
    fetch(`${backendPrefix}/useruploads/videos`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch videos");
        return res.json();
      })
      .then((data) => {
        // Assume API returns [{ url: "..." }, ...]
        setRecentVideos(data.map((vid: any) => vid.url));
      })
      .catch((err) => console.error("❌ Failed to fetch user videos:", err))
      .finally(() => setLoadingVideos(false));
  };

  return {
    fetchUserVideos,
    recentVideos,
    setLoadingVideos,
    loadingVideos,
    setRecentVideos,
    getAllDefaultVideos,
    defaultVideos,
    defaultvidsloading,
  };
};
