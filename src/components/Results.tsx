import { useEffect } from "react";

interface ResultsOptions {
  graphData: Record<string, unknown> | null;
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

export default function Results({
  graphData,
  errors,
  setErrors,
}: ResultsOptions): React.JSX.Element {
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
    <>
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
    </>
  );
}
