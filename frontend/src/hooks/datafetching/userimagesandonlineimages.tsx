import { useState } from "react";
import { backendPrefix } from "../../config";

export const useBackgroundImages = () => {
  const [userUploads, setUserUploads] = useState<string[]>([]);
  const [loadingUploads, setLoadingUploads] = useState(false);

  const [onlineImages, setOnlineImages] = useState<string[]>([]);
  const [loadingOnline, setLoadingOnline] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchUserUploads = () => {
    setLoadingUploads(true);
    fetch(`${backendPrefix}/useruploads/images`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or failed fetch");
        return res.json();
      })
      .then((data) => {
        setUserUploads(data.map((img: any) => img.url));
      })
      .catch((err) => console.error("❌ Failed to fetch user uploads:", err))
      .finally(() => setLoadingUploads(false));
  };

  const fetchOnlineImages = (query: string) => {
    setLoadingOnline(true);
    fetch(`${backendPrefix}/pixabay/images?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        setOnlineImages(data.hits.map((hit: any) => hit.webformatURL));
      })
      .catch((err) => console.error("❌ Failed to fetch Pixabay images:", err))
      .finally(() => setLoadingOnline(false));
  };

  return {
    userUploads,
    loadingUploads,
    fetchUserUploads,
    onlineImages,
    loadingOnline,
    fetchOnlineImages,
    searchQuery,
    setSearchQuery,
  };
};
