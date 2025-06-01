import { useState } from "react";
import { checkFileType } from "../utils/checkFileType";

interface FileUploadProperties {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setProcessingStatus: React.Dispatch<React.SetStateAction<string>>;
  uploadProgress: number;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
  errors: {
    file?: string;
    processingType?: string;
    condition?: string;
    submission?: string;
    graph?: string;
  };
  setErrors: React.Dispatch<
    React.SetStateAction<{
      file?: string;
      processingType?: string;
      condition?: string;
      submission?: string;
      graph?: string;
    }>
  >;
}

export default function FileUpload({
  file,
  setFile,
  setProcessingStatus,
  uploadProgress,
  setUploadProgress,
  errors,
  setErrors,
}: FileUploadProperties): React.JSX.Element {
  // Handle file selection and auto-upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors((prev) => ({ ...prev, file: undefined }));

    if (e.target.files && e.target.files.length > 0) {
      if (!checkFileType(e.target.files[0])) {
        setErrors((prev) => ({
          ...prev,
          file: "Please select a valid file type",
        }));
        return false;
      }

      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setUploadProgress(0);
      setProcessingStatus("");
      handleUpload(selectedFile);
    }
  };

  // Handle drag and drop with validation
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, file: undefined }));

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (!checkFileType(e.dataTransfer.files[0])) {
        setErrors((prev) => ({
          ...prev,
          file: "Please select a valid file type",
        }));

        e.currentTarget.classList.remove("drag-over");
        return false;
      }

      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setUploadProgress(0);
      setProcessingStatus("");
      handleUpload(droppedFile);
      e.currentTarget.classList.remove("drag-over");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("drag-over");
  };

  // Simulate file upload
  const handleUpload = async (fileToUpload: File) => {
    setProcessingStatus("Uploading...");
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessingStatus("Uploaded. Ready to process.");
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="relative">
      <div className="section-gradient-shadow"></div>
      <section className="mb-20 p-6 rounded-xl shadow-md glassmorphism">
        <h2 className="text-xl font-semibold mb-4">Upload Dataset</h2>
        <div
          className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <p className="text-gray-200 mb-4 select-none opacity-40">
            Drag and drop your dataset (.csv, .parquet, .xls, .xlsx, .txt) or
            click to browse.
          </p>
          <input
            type="file"
            accept=".csv,.parquet,.pq,.xls,.xlsx,.txt"
            className="hidden"
            id="file-upload"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer select-none bg-indigo-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-indigo-700 [transition-property:all] ease-in-out duration-500"
          >
            Upload File
          </label>
        </div>
        {errors.file && (
          <p className="text-red-500 text-sm mt-3">{errors.file}</p>
        )}
        {file && (
          <div className="mt-4">
            <p className="font-semibold text-white/90 opacity-60">
              Selected: {file.name}
            </p>
            <div className="w-full bg-gray-500/30 rounded-full h-2.5 mt-2">
              <div
                className="bg-green-500 h-2.5 rounded-full [transition-property:all] ease-in-out duration-500"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-200 opacity-40 mt-1 select-none [transition-property:all] ease-in-out duration-500">
              Upload progress: {uploadProgress}%
            </p>
          </div>
        )}
        <p className="text-sm text-gray-200 opacity-40 mt-4">
          Supports files up to 10GB. Processing occurs in the background.
        </p>
      </section>
    </div>
  );
}
