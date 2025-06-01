import { useRef, useState } from "react";
import z from "zod";
import { checkFileType } from "../utils/checkFileType";

interface ProcessingStatusOptions {
  file: File | null;
  processingStatus: string;
  setProcessingStatus: React.Dispatch<React.SetStateAction<string>>;
  setGraphData: React.Dispatch<
    React.SetStateAction<Record<string, unknown> | null>
  >;
  processingType: string;
  setErrors: React.Dispatch<
    React.SetStateAction<{
      file?: string;
      processingType?: string;
      condition?: string;
      graph?: string;
    }>
  >;
  condition: string;
  isSampleData: boolean;
}

export default function ProcessingStatus({
  file,
  processingStatus,
  setProcessingStatus,
  setGraphData,
  processingType,
  setErrors,
  condition,
  isSampleData,
}: ProcessingStatusOptions): React.JSX.Element {
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const formSchema = z.object({
    file: z
      .instanceof(File)
      .refine(
        (file) => {
          return checkFileType(file);
        },
        {
          message: "Please select a valid file type",
        }
      )
      .refine((file) => file.size <= 10 * 1024 * 1024 * 1024, {
        message: "File size must be less than 10GB",
      }),
    processingType: z.enum(
      ["Filter data", "Aggregate data", "Join datasets", "Generate summary"],
      {
        errorMap: () => ({ message: "Please select a valid processing type" }),
      }
    ),
    condition: z
      .string()
      .min(1, "Condition is required")
      .max(100, "Condition must be 100 characters or less")
      .regex(
        /^[a-zA-Z0-9_\s><=]+$/,
        "Condition can only contain letters, numbers, underscores, spaces, and comparison operators"
      ),
    isSampleData: z.boolean().optional(),
  });

  const validateForm = () => {
    if (!file) {
      setErrors({ file: "Please upload a file" });
      return false;
    }

    const result = formSchema.safeParse({
      file,
      processingType,
      condition,
      isSampleData,
    });

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      setErrors({
        file: formattedErrors.file?.[0],
        processingType: formattedErrors.processingType?.[0],
        condition: formattedErrors.condition?.[0],
      });
      return false;
    }

    setErrors({});
    return true;
  };

  // Simulate processing
  const handleProcess = () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setProcessingStatus("Processing...");
    setProcessingProgress(0);
    processingIntervalRef.current = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(processingIntervalRef.current!);
          processingIntervalRef.current = null;
          setProcessingStatus("Completed!");
          setIsProcessing(false);
          setGraphData({
            data: [
              {
                x: ["Electronics", "Clothing", "Books", "Toys"],
                y: [500000, 300000, 200000, 150000],
                type: "bar",
                marker: {
                  color: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"],
                },
              },
            ],
            layout: {
              title: "Processed Data Visualization",
              xaxis: { title: "Category" },
              yaxis: { title: "Sales (USD)" },
              margin: { t: 50, b: 100, l: 50, r: 50 },
            },
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  // Cancel processing
  const handleCancel = () => {
    if (processingIntervalRef.current) {
      clearInterval(processingIntervalRef.current);
      processingIntervalRef.current = null;
    }
    setProcessingStatus("Cancelled");
    setProcessingProgress(0);
    setGraphData(null);
    setIsProcessing(false);
  };

  return (
    <>
      {processingStatus && (
        <div className="relative">
          <div className="section-gradient-shadow"></div>
          <section className="mb-20 p-6 rounded-xl shadow-md glassmorphism">
            <h2 className="text-xl font-semibold mb-4">Processing Status</h2>
            <p
              className={`font-semibold select-none ${
                processingStatus === "Completed!"
                  ? "text-green-500"
                  : processingStatus === "Cancelled"
                  ? "text-red-500 opacity-80"
                  : "text-gray-400"
              }`}
            >
              {processingStatus}
            </p>
            {!["Uploaded. Ready to process.", "Uploading..."].includes(
              processingStatus
            ) && (
              <>
                <div className="w-full bg-gray-500/30 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-green-500 h-2.5 rounded-full [transition-property:all] ease-in-out duration-500"
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-200 opacity-40 mt-1 select-none [transition-property:all] ease-in-out duration-500">
                  Processing progress: {processingProgress}%
                </p>
              </>
            )}
            {processingStatus !== "Completed!" && (
              <button
                onClick={isProcessing ? handleCancel : handleProcess}
                className={`mt-4 py-2 px-4 rounded-lg select-none outline-none [transition-property:all] ease-in-out duration-500 ${
                  isProcessing
                    ? "border border-red-500 text-red-500 hover:bg-[#f1141433]"
                    : "border-none text-gray-300 bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isProcessing ? "Cancel" : "Start Processing"}
              </button>
            )}
          </section>
        </div>
      )}
    </>
  );
}
