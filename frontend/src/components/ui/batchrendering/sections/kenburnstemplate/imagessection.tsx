import React, { useState } from "react";
import { ImageSlot } from "../../../../batchrendering/ImageSlotKenBurns";
import { ChooseUploadModalBatchRenderingKenburns } from "../../../modals/ChooseUploadModalBatchRenderingKenBurns";
import { backendPrefix } from "../../../../../config";

interface ImagesSectionInterface {
  userImages: string[];
  setUserImages: React.Dispatch<React.SetStateAction<string[]>>;
  isRendering: boolean;
  setShowUploadsModal: React.Dispatch<React.SetStateAction<boolean>>;
  showUploadsModal?: boolean;
  userUploads?: any[];
}

export const ImagesSection: React.FC<ImagesSectionInterface> = ({
  userImages,
  setUserImages,
  isRendering,
  setShowUploadsModal,
  showUploadsModal = false,
  userUploads = [],
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

 return (
    <div className="w-full">
      {/* === Modal === */}
      <ChooseUploadModalBatchRenderingKenburns
        open={showUploadsModal}
        onClose={() => setShowUploadsModal(false)}
        userUploads={userUploads}
        onSelect={(selectedImages: string[]) => {
          setUserImages((prev: string[]) => [
            ...prev,
            ...selectedImages.filter((img) => !prev.includes(img)),
          ]);
        }}
      />

      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between p-3 md:p-4 gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Images Upload
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <input
              disabled={isRendering}
              type="file"
              id="add-image-upload"
              accept="image/*"
              multiple
              className="hidden"
              onChange={async (e) => {
                const files = e.target.files;
                if (!files || files.length === 0) return;

                setIsUploading(true);
                setUploadError(null);

                const formData = new FormData();
                Array.from(files).forEach((file) =>
                  formData.append("images", file)
                );

                try {
                  const res = await fetch(
                    `${backendPrefix}/uploadhandler/upload-multiple-kenburns-images`,
                    {
                      method: "POST",
                      body: formData,
                    }
                  );
                  const data = await res.json();
                  if (res.ok) {
                    setUserImages((prev: string[]) => [
                      ...prev,
                      ...data.images.map((img: any) => img.url),
                    ]);

                    // Save uploads to DB
                    for (const imgObj of data.images) {
                      try {
                        const saveResponse = await fetch(
                          `${backendPrefix}/useruploads`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                            body: JSON.stringify({
                              type: "image",
                              url: imgObj.url,
                            }),
                          }
                        );
                        if (!saveResponse.ok)
                          throw new Error(await saveResponse.text());
                        console.log("✅ Upload saved:", await saveResponse.json());
                      } catch (err) {
                        console.error("Failed to save upload:", err);
                      }
                    }
                  } else {
                    setUploadError(data.error || "Upload failed.");
                  }
                } catch (err) {
                  console.error(err);
                  setUploadError("Unexpected upload error.");
                } finally {
                  setIsUploading(false);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />

            <button
              onClick={() =>
                !isUploading &&
                document.getElementById("add-image-upload")?.click()
              }
              disabled={isUploading || isRendering}
              className={`flex items-center justify-center px-4 py-2 rounded-lg border-2 font-semibold text-sm transition-all duration-200 w-full md:w-auto ${
                isUploading
                  ? "border-blue-300 bg-blue-100 text-blue-400 cursor-not-allowed"
                  : "border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100"
              }`}
            >
              {isUploading ? (
                <span className="animate-pulse">Uploading...</span>
              ) : (
                "Upload Images"
              )}
            </button>
          </div>

          {/* ==== Upload Folder ==== */}
          <div>
            <input
              disabled={isRendering}
              type="file"
              id="add-folder-upload"
              multiple
              className="hidden"
              // @ts-ignore
              webkitdirectory="true"
              directory="true"
              onChange={async (e) => {
                const files = e.target.files;
                if (!files || files.length === 0) return;

                setIsUploading(true);
                setUploadError(null);

                const formData = new FormData();
                Array.from(files).forEach((file) =>
                  formData.append("images", file)
                );

                try {
                  const res = await fetch(
                    `${backendPrefix}/uploadhandler/upload-kenburns-folder`,
                    {
                      method: "POST",
                      body: formData,
                    }
                  );
                  const data = await res.json();
                  if (res.ok) {
                    setUserImages((prev: string[]) => [
                      ...prev,
                      ...data.images.map((img: any) => img.url),
                    ]);

                    for (const imgObj of data.images) {
                      try {
                        const saveResponse = await fetch(
                          `${backendPrefix}/useruploads`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                            body: JSON.stringify({
                              type: "image",
                              url: imgObj.url,
                            }),
                          }
                        );
                        if (!saveResponse.ok)
                          throw new Error(await saveResponse.text());
                        console.log("✅ Folder upload saved:", await saveResponse.json());
                      } catch (err) {
                        console.error("Save failed:", err);
                      }
                    }
                  } else {
                    setUploadError(data.error || "Folder upload failed.");
                  }
                } catch (err) {
                  console.error(err);
                  setUploadError("Unexpected folder upload error.");
                } finally {
                  setIsUploading(false);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />

            <button
              onClick={() =>
                !isUploading &&
                document.getElementById("add-folder-upload")?.click()
              }
              disabled={isUploading || isRendering}
              className={`flex items-center justify-center px-4 py-2 rounded-lg border-2 font-semibold text-sm transition-all duration-200 w-full md:w-auto ${
                isUploading
                  ? "border-green-300 bg-green-100 text-green-400 cursor-not-allowed"
                  : "border-green-600 text-green-700 bg-green-50 hover:bg-green-100"
              }`}
            >
              {isUploading ? (
                <span className="animate-pulse">Uploading...</span>
              ) : (
                "Upload Folder"
              )}
            </button>
          </div>

          {/* ==== Choose Uploads ==== */}
          <div>
            <button
              onClick={() =>
                isRendering
                  ? alert("Cannot open uploads while rendering.")
                  : setShowUploadsModal(true)
              }
              disabled={isRendering}
              className={`flex items-center justify-center px-4 py-2 rounded-lg border-2 font-semibold text-sm w-full md:w-auto ${
                isRendering
                  ? "border-gray-300 bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-400 text-gray-700 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              Choose from your uploads
            </button>
          </div>
        </div>
      </div>

      {/* === Error Message === */}
      {uploadError && (
        <p className="text-sm text-red-600 mt-3 mb-2">{uploadError}</p>
      )}

      {/* === Empty State === */}
      {userImages.length === 0 && (
        <div className="flex justify-center items-center w-full mt-6 mb-4">
          <p className="text-gray-500 text-center">
            This is where your images will appear
          </p>
        </div>
      )}

      {/* === Image Grid === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {userImages.map((img: string, i: number) => (
          <ImageSlot
            key={i}
            index={i}
            img={img}
            isRendering={isRendering}
            onUpload={async (file: any) => {
              const formData = new FormData();
              formData.append("image", file);
              const res = await fetch(
                `${backendPrefix}/uploadhandler/upload-kenburns-image`,
                {
                  method: "POST",
                  body: formData,
                }
              );
              const data = await res.json();
              if (res.ok) {
                setUserImages((prev: any) => {
                  const arr = [...prev];
                  arr[i] = data.url;
                  return arr;
                });

                const saveResponse = await fetch(`${backendPrefix}/useruploads`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify({ type: "image", url: data.url }),
                });

                if (!saveResponse.ok)
                  throw new Error(await saveResponse.text());
                console.log("✅ Upload saved:", await saveResponse.json());
              }
            }}
            onRemove={() =>
              setUserImages((prev: any) =>
                prev.filter((_: any, idx: number) => idx !== i)
              )
            }
          />
        ))}
      </div>
    </div>
  );
};
