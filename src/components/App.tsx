import { useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import ProcessingOptions from "./ProcessingOptions";
import ProcessingStatus from "./ProcessingStatus";
import Footer from "./Footer";

export const checkFileType = (file: File) => {
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

export const processingTypes = [
  { id: 0, processingType: "Filter data" },
  { id: 1, processingType: "Aggregate data" },
  { id: 2, processingType: "Join datasets" },
  { id: 3, processingType: "Generate summary" },
];

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [processingStatus, setProcessingStatus] = useState("");
  const [processingType, setProcessingType] = useState(
    processingTypes[0].processingType
  );
  const [condition, setCondition] = useState("");
  const [isSampleData, setIsSampleData] = useState(false);
  const [graphData, setGraphData] = useState<Record<string, unknown> | null>(
    null
  );

  const [errors, setErrors] = useState<{
    file?: string;
    processingType?: string;
    condition?: string;
    graph?: string;
  }>({});

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
        <FileUpload
          file={file}
          setFile={setFile}
          setProcessingStatus={setProcessingStatus}
          errors={errors}
          setErrors={setErrors}
        ></FileUpload>
        {/* Processing Options */}
        <ProcessingOptions
          processingType={processingType}
          setProcessingType={setProcessingType}
          errors={errors}
          setErrors={setErrors}
          condition={condition}
          setCondition={setCondition}
          isSampleData={isSampleData}
          setIsSampleData={setIsSampleData}
        ></ProcessingOptions>
        {/* Processing Status */}
        <ProcessingStatus
          file={file}
          processingStatus={processingStatus}
          setProcessingStatus={setProcessingStatus}
          setGraphData={setGraphData}
          processingType={processingType}
          setErrors={setErrors}
          condition={condition}
          isSampleData={isSampleData}
        ></ProcessingStatus>
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
      <Footer></Footer>
    </div>
  );
}
