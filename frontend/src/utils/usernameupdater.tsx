import toast from "react-hot-toast";
import { backendPrefix } from "../config";

export const updateUsername = async (username: string) => {
  try {
    const res = await fetch(`${backendPrefix}/auth/update-username`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify({ username }),
    });

    if (!res.ok) {
      throw new Error(
        `Failed to upload profile picture: ${res.status} ${await res.text()}`
      );
    }

    return "success";
  } catch (error: any) {
    toast.error("There was an error updating your username");
    return "error";
  }
};
