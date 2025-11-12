import React, { useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import axios from "axios";

const S3Uploader = ({ label = "Upload", disabled, presignApi, onUploadSuccess }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error

  const handleUpload = async ({ files }) => {
    const file = files[0];
    if (!file) return;

    setStatus("uploading");
    setProgress(0);

    try {
      const response = await axios.get(`${presignApi}?filename=${encodeURIComponent(file.name)}`);
      const { url } = response.data;

      console.log(response.data);

      await axios.put(url, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      const fileUrl = url.split("?")[0];
      setStatus("success");
      onUploadSuccess && onUploadSuccess(fileUrl);
    } catch (err) {
      console.error("Upload failed:", err);
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <FileUpload
        mode="basic"
        chooseLabel={label}
        className="p-button-sm p-button-warning"
        customUpload
        uploadHandler={handleUpload}
        disabled={disabled || status === "uploading"}
      />
      {status === "uploading" && (
        <ProgressBar value={progress} showValue={true} className="h-2 mt-2" />
      )}
      {status === "success" && <Tag value="Uploaded" severity="success" className="w-fit mt-2" />}
      {status === "error" && <Tag value="Upload Failed" severity="danger" className="w-fit mt-2" />}
    </div>
  );
};

export default S3Uploader;
