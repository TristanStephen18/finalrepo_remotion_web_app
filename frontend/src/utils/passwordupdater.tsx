import toast from "react-hot-toast";
import { backendPrefix } from "../config";

export async function updatePassword(oldPassword: string, newPassword: string) {
  try {
    const response = await fetch(`${backendPrefix}/auth/update-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // or however you store JWT
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to update password");
    }

    return "success";
  } catch (error: any) {
    toast.error("Password update failed:", error);
    return error.message || "error";
  }
}
