import { useState } from "react";

export const userVideos = () => {
  const [recentVideos, setRecentVideos] = useState<string[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [defaultVideos, setDefaultVideos] = useState<string[]>([]);
  const [defaultvidsloading, setDefaultVidsLoading] = useState(false);

  function getAllDefaultVideos() {
    setDefaultVidsLoading(true);
  const videoCounts: Record<string, number> = {
    minecraft: 8,
    subwaysurfers: 7,
    templerun: 3,
    ugc: 5
  };
  const videos: string[] = [];
  Object.keys(videoCounts).forEach(tab => {
    const prefix = tab === "minecraft" ? "m" : 
                  tab === "subwaysurfers" ? "ss" : 
                  tab === "templerun" ? "tr" : "ugc";
    for (let i = 1; i <= videoCounts[tab]; i++) {
      videos.push(`/defaultvideos/${tab}/${prefix}${i}.mp4`);
    }
  });
//   return videos;
setDefaultVideos(videos);
setDefaultVidsLoading(false);
}

  const fetchUserVideos = () => {
    setLoadingVideos(true);
    fetch("/useruploads/videos", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
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
    defaultvidsloading
  };
};
