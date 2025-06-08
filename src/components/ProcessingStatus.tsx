import type { DataAttributes, Errors, ProcessingOptionsState } from "./App";
import { useState } from "react";
import { filterSchema } from "../schemes/filterSchema";
import { aggregateSchema } from "../schemes/aggregateSchema";
import { summarySchema } from "../schemes/summarySchema";
import axios from "axios";

interface ProcessingStatusOptions {
  processingOptions: ProcessingOptionsState;
  processingStatus: string;
  setProcessingStatus: React.Dispatch<React.SetStateAction<string>>;
  uploadProgress: number;
  analysisProgress: number;
  processingProgress: number;
  setProcessingProgress: React.Dispatch<React.SetStateAction<number>>;
  setData: React.Dispatch<React.SetStateAction<DataAttributes | undefined>>;
  errors: Errors;
  setErrors: React.Dispatch<React.SetStateAction<Errors>>;
  sessionId: string;
}

export default function ProcessingStatus({
  processingOptions,
  processingStatus,
  setProcessingStatus,
  uploadProgress,
  analysisProgress,
  processingProgress,
  setProcessingProgress,
  setData,
  errors,
  setErrors,
  sessionId,
}: ProcessingStatusOptions): React.JSX.Element {
  const {
    processingType,
    condition,
    isSampleData,
    groupByColumn,
    aggregateColumn,
    aggregateFunction,
  } = processingOptions;

  const [isProcessing, setIsProcessing] = useState(false);

  const validateForm = () => {
    let data: any = {
      processingType,
      isSampleData,
    };
    let result = null;

    if (processingType === "Filter data") {
      data.condition = condition;
      result = filterSchema.safeParse(data);
    } else if (processingType === "Aggregate data") {
      data.aggregateColumn = aggregateColumn;
      data.aggregateFunction = aggregateFunction;
      data.groupByColumn = groupByColumn;
      result = aggregateSchema.safeParse(data);
    } else if (processingType === "Generate summary") {
      result = summarySchema.safeParse(data);
    }

    if (result && !result.success) {
      const formattedErrors = result.error.flatten().fieldErrors as Record<
        string,
        string[] | undefined
      >;
      setErrors({
        condition: formattedErrors.condition?.[0],
        groupByColumn: formattedErrors.groupByColumn?.[0],
        aggregateColumn: formattedErrors.aggregateColumn?.[0],
        aggregateFunction: formattedErrors.aggregateFunction?.[0],
      });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleProcess = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setProcessingStatus("Processing...");
    setProcessingProgress(0);
    setErrors((prev) => ({ ...prev, submission: undefined }));

    const data: any = {
      processing_type: processingType,
      is_sample_data: isSampleData,
      session_id: sessionId,
    };

    if (processingType === "Filter data") {
      data.condition = condition;
    } else if (processingType === "Aggregate data") {
      data.group_by_column = groupByColumn;
      data.aggregation_column = aggregateColumn;
      data.aggregation_function = aggregateFunction;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/process-dataset",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setData({
        result: response.data.result,
        graphs: response.data.graphs,
      });
      setIsProcessing(false);
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        submission: `Failed to process: ${
          error.response?.data?.detail || error.message
        }`,
      }));
      setProcessingStatus("Error!");
      setProcessingProgress(0);
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setProcessingStatus("Cancelled");
    setProcessingProgress(0);
    setData(undefined);
    setIsProcessing(false);
  };

  // Determine which progress to display
  const currentProgress = processingStatus.includes("Uploading...")
    ? uploadProgress
    : processingStatus.includes("Starting analysis...") ||
      processingStatus.includes("Analyzing columns...") ||
      processingStatus.includes("Finalizing metadata...") ||
      processingStatus.includes("Analysis Complete")
    ? analysisProgress
    : processingProgress;

  // Hide during initial state or upload phase
  if (!processingStatus || processingStatus === "Uploading...") {
    return <></>;
  }

  return (
    <div className="relative">
      <div className="section-gradient-shadow"></div>
      <section className="mb-20 p-6 rounded-xl shadow-md glassmorphism">
        <h2 className="text-xl font-semibold mb-4">Processing Status</h2>
        <p
          className={`font-semibold select-none ${
            processingStatus === "Completed!" ||
            processingStatus === "Analysis Complete"
              ? "text-green-500"
              : processingStatus === "Cancelled" ||
                processingStatus === "Error!"
              ? "text-red-500 opacity-80"
              : "text-gray-400"
          }`}
        >
          {processingStatus}
        </p>
        {processingStatus !== "Analysis Complete" && (
          <>
            <div className="w-full bg-gray-500/30 rounded-full h-2.5 mt-2">
              <div
                className="bg-green-500 h-2.5 rounded-full [transition-property:all] ease-in-out duration-500"
                style={{ width: `${currentProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-200 opacity-40 mt-1 select-none [transition-property:all] ease-in-out duration-500">
              {processingStatus.includes("Starting analysis") ||
              processingStatus.includes("Analyzing") ||
              processingStatus.includes("Finalizing metadata")
                ? `Analysis progress: ${currentProgress}%`
                : `Processing progress: ${currentProgress}%`}
            </p>
          </>
        )}
        {errors.submission && (
          <p className="text-red-500 text-sm mt-2">{errors.submission}</p>
        )}
        {processingStatus !== "Processing..." && (
          <button
            onClick={isProcessing ? handleCancel : handleProcess}
            className={`mt-4 py-2 px-4 rounded-lg select-none outline-none [transition-property:all] ease-in-out duration-500 ${
              isProcessing
                ? "border border-red-500 text-red-500 hover:bg-[#f1141433]"
                : "border-none text-gray-300 bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isProcessing
              ? "Cancel"
              : processingStatus === "Analysis Complete"
              ? "Start Processing"
              : "Process Again"}
          </button>
        )}
      </section>
    </div>
  );
}
