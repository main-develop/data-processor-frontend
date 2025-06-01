import { useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import ProcessingOptions from "./ProcessingOptions";
import ProcessingStatus from "./ProcessingStatus";
import Results from "./Results";
import Footer from "./Footer";

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
        <Results
          graphData={graphData}
          errors={errors}
          setErrors={setErrors}
        ></Results>
      </main>
      <Footer></Footer>
    </div>
  );
}
