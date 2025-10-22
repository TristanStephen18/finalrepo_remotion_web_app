import { backendPrefix } from "../../config";

export async function useDatasetFromUploads(
  fileUrl: string,
  template: string,
  type: string
) {
  try {
    const res = await fetch(`${backendPrefix}/fromuploadsdataset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        fileurl: fileUrl,
        type,
        template,
      }),
    });
    if (!res.ok) throw new Error("Failed to fetch dataset");
    const data = await res.json();
    // console.log(data);
    return data.extractedData;
  } catch (err: any) {
    console.error(err.message);
  }
}
