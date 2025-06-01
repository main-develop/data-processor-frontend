import { useEffect, useRef, useState } from "react";
import z from "zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  Field,
  Input,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Checkbox,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

const checkFileType = (file: File) => {
  const validTypes = [
    "text/csv",
    "application/vnd.apache.parquet",
    "application/octet-stream",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
  ];
  return (
    validTypes.includes(file.type) ||
    file.name.match(/\.(csv|parquet|pq|xls|xlsx|txt)$/i)
  );
};

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

const processingTypes = [
  { id: 0, processingType: "Filter data" },
  { id: 1, processingType: "Aggregate data" },
  { id: 2, processingType: "Join datasets" },
  { id: 3, processingType: "Generate summary" },
];

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState("");
  const [processingType, setProcessingType] = useState(
    processingTypes[0].processingType
  );
  const [condition, setCondition] = useState("");
  const [isSampleData, setIsSampleData] = useState(false);
  const [graphData, setGraphData] = useState<Record<string, unknown> | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{
    file?: string;
    processingType?: string;
    condition?: string;
    graph?: string;
  }>({});
  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Download graph as PNG
  const handleDownloadGraph = () => {
    if (graphData) {
      // Plotly.downloadImage("plotly-chart", {
      //   format: "png",
      //   filename: "chart",
      // });
    } else {
      setErrors((prev) => ({
        ...prev,
        graph: "No graph available to download.",
      }));
    }
  };

  // Download processed data (mock)
  const handleDownloadData = () => {
    alert("Downloading processed data...");
  };

  // Render Plotly chart
  useEffect(() => {
    if (graphData) {
      // Plotly.newPlot("plotly-chart", graphData.data, graphData.layout);
    }
  }, [graphData]);

  return (
    <div className="min-h-screen flex flex-col background-noise">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-20 flex-1">
        {/* File Upload */}
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
                Drag and drop your dataset (.csv, .parquet, .xls, .xlsx, .txt)
                or click to browse.
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
        {/* Processing Options */}
        <div className="relative">
          <div className="section-gradient-shadow"></div>
          <section className="mb-28 p-6 rounded-xl shadow-md glassmorphism">
            <h2 className="text-xl font-semibold mb-4">Processing Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field className={"mx-auto w-full"}>
                <Label
                  className={"block text-gray-100 opacity-60 mb-2 select-none"}
                >
                  Processing type
                </Label>
                <Listbox value={processingType} onChange={setProcessingType}>
                  {({ open }) => (
                    <div className="relative">
                      <ListboxButton className="block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white/90 outline-none">
                        {processingType}
                        <ChevronDownIcon
                          className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/80"
                          aria-hidden="true"
                        />
                      </ListboxButton>
                      <AnimatePresence>
                        {open && (
                          <ListboxOptions
                            modal={false}
                            static
                            as={motion.div}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: 1,
                              transition: { duration: 0.35, ease: "easeOut" },
                            }}
                            exit={{
                              opacity: 0,
                              transition: { duration: 0.3, ease: "easeIn" },
                            }}
                            transition
                            className={clsx(
                              "absolute z-50 mt-1 w-full rounded-xl border border-white/5 bg-[#2a2828] px-1 pt-0 pb-1 outline-none",
                              "origin-top transform"
                            )}
                          >
                            {processingTypes.map((item) => (
                              <ListboxOption
                                key={item.id}
                                value={item.processingType}
                                className="group mt-1 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 select-none hover:bg-[#242323] aria-selected:bg-[#242323]"
                              >
                                <CheckIcon className="invisible size-4 fill-white/90 group-aria-selected:visible" />
                                <div className="text-sm/6 text-white/90">
                                  {item.processingType}
                                </div>
                              </ListboxOption>
                            ))}
                          </ListboxOptions>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </Listbox>
                {errors.processingType && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.processingType}
                  </p>
                )}
              </Field>
              <Field>
                <Label className="block text-white/90 opacity-60 mb-2 select-none">
                  Condition
                </Label>
                <Input
                  id="condition"
                  type="text"
                  placeholder="e.g., column_name > value"
                  value={condition}
                  onChange={(e) => {
                    setCondition(e.target.value);
                    setErrors((prev) => ({ ...prev, condition: undefined }));
                  }}
                  className={clsx(
                    "block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white/90 placeholder-[#e5e7eb66] placeholder:select-none outline-none",
                    "focus:not-data-[focus]:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/10 [transition-property:all] ease-in-out duration-500"
                  )}
                />
                {errors.condition && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.condition}
                  </p>
                )}
              </Field>
            </div>
            <Field className="mt-4 flex items-center">
              <Checkbox
                checked={isSampleData}
                onChange={setIsSampleData}
                className="group size-5 rounded-md mr-2 bg-transparent p-[3px] ring-1 ring-white/15 ring-inset data-[checked]:bg-green-600/40 outline-none [transition-property:all] ease-in-out duration-500"
              >
                <CheckIcon className="hidden size-4 fill-white/90 group-aria-checked:block" />
              </Checkbox>
              <Label className={"pt-1 text-gray-100 opacity-60 select-none"}>
                Sample data only (faster processing)
              </Label>
            </Field>
          </section>
        </div>
        {/* Processing Status */}
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
        {/* Graph Display */}
        {graphData && (
          <div className="relative">
            <div className="section-gradient-shadow"></div>
            <section className="mb-8 p-6 rounded-xl shadow-md glassmorphism">
              <h2 className="text-xl font-semibold mb-4">
                Processed Data Visualization
              </h2>
              <div id="plotly-chart"></div>
              {errors.graph && (
                <p className="text-red-500 text-sm mt-2">{errors.graph}</p>
              )}
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={handleDownloadGraph}
                  className="bg-indigo-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-indigo-700 select-none outline-none [transition-property:all] ease-in-out duration-500"
                >
                  Download Graph as PNG
                </button>
                <button
                  onClick={handleDownloadData}
                  className="bg-indigo-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-indigo-700 select-none outline-none [transition-property:all] ease-in-out duration-500"
                >
                  Download Processed Data
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
      {/* Footer */}
      <footer className="bg-transparent py-4">
        <div className="container mx-auto px-4 select-none text-center text-base text-gray-200 font-medium opacity-40">
          <p>Powered by FastAPI & Dask</p>
          <p>© 2025 Data Processor</p>
        </div>
      </footer>
    </div>
  );
}
