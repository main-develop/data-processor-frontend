import { useEffect, useState } from "react";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState("");
  const [processingType, setProcessingType] = useState("Filter Data");
  const [condition, setCondition] = useState("");
  const [sampleData, setSampleData] = useState(false);
  const [graphData, setGraphData] = useState<Record<string, unknown> | null>(
    null
  );

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadProgress(0);
      setProcessingStatus("");
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setUploadProgress(0);
      setProcessingStatus("");
      e.currentTarget.classList.remove("drag-over");
      console.log(file);
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
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }
    setProcessingStatus("Uploading...");
    // Simulate chunked upload
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
    // In production, use Axios to upload to FastAPI endpoint
    /*
  const formData = new FormData();
  formData.append('file', file);
  await axios.post('/api/upload', formData, {
    onUploadProgress: (progressEvent) => {
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setUploadProgress(percent);
    },
  });
  */
  };

  // Simulate processing
  const handleProcess = () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }
    setProcessingStatus("Processing...");
    setProcessingProgress(0);
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessingStatus("Completed");
          // Mock Plotly graph data
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
    // In production, use Axios to trigger Celery task via FastAPI
    /*
  await axios.post('/api/process', {
    processingType,
    condition,
    sampleData,
  });
  */
  };

  // Cancel processing
  const handleCancel = () => {
    setProcessingStatus("Cancelled");
    setProcessingProgress(0);
    setGraphData(null);
  };

  // Download graph as PNG
  const handleDownloadGraph = () => {
    if (graphData) {
      // Plotly.downloadImage("plotly-chart", {
      //   format: "png",
      //   filename: "chart",
      // });
    } else {
      alert("No graph available to download.");
    }
  };

  // Download processed data (mock)
  const handleDownloadData = () => {
    alert("Downloading processed data...");
    // In production, serve file from S3/MinIO via FastAPI
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
          <section className="mb-20 p-6 rounded-lg shadow-md glassmorphism">
            <h2 className="text-xl font-semibold mb-4">Upload Dataset</h2>
            <div
              className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <p className="text-gray-500 mb-4 select-none">
                Drag and drop your dataset (CSV, Parquet, etc.) or click to
                browse.
              </p>
              <input
                type="file"
                accept=".csv,.parquet"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer select-none bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500"
              >
                Upload File
              </label>
            </div>
            {file && (
              <div className="mt-4">
                <p className="text-gray-500">Selected: {file.name}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1 select-none">
                  Upload progress: {uploadProgress}%
                </p>
                <button
                  onClick={handleUpload}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 select-none"
                >
                  Start Upload
                </button>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-4">
              Supports files up to 10GB. Processing occurs in the background.
            </p>
          </section>
        </div>
        {/* Processing Options */}
        <div className="relative">
          <div className="section-gradient-shadow"></div>
          <section className="mb-20 p-6 rounded-lg shadow-md glassmorphism">
            <h2 className="text-xl font-semibold mb-4">Processing Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="processing-type"
                  className="block text-neutral-300 mb-2 opacity-50 select-none"
                >
                  Processing type
                </label>
                <select
                  id="processing-type"
                  className="w-full p-2 border border-neutral-500 rounded-lg outline-none bg-transparent select-none"
                  value={processingType}
                  onChange={(e) => setProcessingType(e.target.value)}
                >
                  <option>Filter data</option>
                  <option>Aggregate data</option>
                  <option>Join datasets</option>
                  <option>Generate summary</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="condition"
                  className="block text-neutral-300 mb-2 opacity-50 select-none"
                >
                  Condition
                </label>
                <input
                  id="condition"
                  type="text"
                  // bg-zinc-800
                  className="w-full p-2 border border-neutral-500 rounded-lg outline-none bg-transparent select-none"
                  placeholder="e.g., column_name > value"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                id="sample-data"
                className="mr-2"
                checked={sampleData}
                onChange={(e) => setSampleData(e.target.checked)}
              />
              <label
                htmlFor="sample-data"
                className="text-neutral-300 opacity-50 select-none"
              >
                Sample data only (faster processing)
              </label>
            </div>
            <button
              onClick={handleProcess}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 select-none"
            >
              Submit
            </button>
          </section>
        </div>
        {/* Processing Status */}
        {processingStatus && (
          <div className="relative">
            <div className="section-gradient-shadow"></div>
            <section className="mb-20 p-6 rounded-lg shadow-md glassmorphism">
              <h2 className="text-xl font-semibold mb-4">Processing Status</h2>
              <p className="text-neutral-300 font-bold select-none opacity-50">
                {processingStatus}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1 select-none">
                Processing progress: {processingProgress}%
              </p>
              {processingStatus === "Processing..." && (
                <button
                  onClick={handleCancel}
                  className="mt-4 border border-red-500 text-red-500 py-2 px-4 rounded-lg hover:bg-red-50 select-none"
                >
                  Cancel
                </button>
              )}
            </section>
          </div>
        )}
        {/* Graph Display */}
        {graphData && (
          <div className="relative">
            <div className="section-gradient-shadow"></div>
            <section className="mb-8 p-6 rounded-lg shadow-md glassmorphism">
              <h2 className="text-xl font-semibold mb-4">
                Processed Data Visualization
              </h2>
              <div id="plotly-chart"></div>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={handleDownloadGraph}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 select-none"
                >
                  Download Graph as PNG
                </button>
                <button
                  onClick={handleDownloadData}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 select-none"
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
        <div className="container mx-auto px-4 select-none text-center text-base text-neutral-300 font-medium opacity-40">
          <p>Powered by FastAPI & Dask</p>
          <p>© 2025 Data Processor</p>
        </div>
      </footer>
    </div>
  );
}
