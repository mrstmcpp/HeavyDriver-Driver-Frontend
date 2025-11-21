import React, { useState, useRef } from "react";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import axios from "axios";

const MAX_FILE_SIZE_MB = 1;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const S3Uploader = ({ label = "Upload", disabled, presignApi, onUploadSuccess }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileUploadRef = useRef(null);

  const resetUploader = (openPicker = false) => {
    setProgress(0);
    setStatus("idle");
    setErrorMessage("");
    if (fileUploadRef.current) {
      fileUploadRef.current.clear();
      if (openPicker) {
        const inputEl = fileUploadRef.current.fileInput;
        if (inputEl) inputEl.click();
      }
    }
  };

  const handleUpload = async ({ files }) => {
    const file = files[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setStatus("invalid");
      setErrorMessage("Only JPEG, PNG, or PDF files are allowed.");
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      setStatus("invalid");
      setErrorMessage(`File size exceeds ${MAX_FILE_SIZE_MB} MB limit.`);
      return;
    }

    setStatus("uploading");
    setProgress(0);
    setErrorMessage("");

    try {
      const response = await axios.get(`${presignApi}?filename=${encodeURIComponent(file.name)}`);
      const { url } = response.data;

      await axios.put(url, file, {
        headers: { "Content-Type": file.type },
        withCredentials: false,
        transformRequest: (data) => data,
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      const fileUrl = url.split("?")[0];
      const fileName = response.data.file;

      setStatus("success");
      onUploadSuccess && onUploadSuccess(fileUrl, fileName);
      if (fileUploadRef.current) fileUploadRef.current.clear();
    } catch (err) {
      console.error("Upload failed:", err);
      setStatus("error");
      setErrorMessage("Upload failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {status !== "uploading" && (
        <FileUpload
          ref={fileUploadRef}
          mode="basic"
          chooseLabel={label}
          className="p-button-sm p-button-warning overflow-x-clip"
          customUpload
          uploadHandler={handleUpload}
          disabled={disabled || status === "uploading"}
          accept=".jpg,.jpeg,.png,.pdf"
        />
      )}

      {status === "uploading" && (
        <ProgressBar value={progress} showValue={true} className="h-2 mt-2 rounded-md" />
      )}

      {status === "success" && (
        <Tag value="Uploaded Successfully" severity="success" className="w-fit mt-2" />
      )}
      {status === "error" && (
        <>
          <Tag value="Upload Failed" severity="danger" className="w-fit mt-2" />
          <Button
            label="Try Again"
            className="p-button-text p-button-sm text-yellow-400 hover:text-yellow-300 w-fit"
            onClick={() => resetUploader(true)}
          />
        </>
      )}
      {status === "invalid" && (
        <>
          <Tag value="Invalid File" severity="warning" className="w-fit mt-2" />
          <p className="text-red-400 text-xs mt-1">{errorMessage}</p>
          <Button
            label="Choose Another File"
            className="p-button-text p-button-sm text-yellow-400 hover:text-yellow-300 w-fit"
            onClick={() => resetUploader(true)}
          />
        </>
      )}
    </div>
  );
};

export default S3Uploader;
