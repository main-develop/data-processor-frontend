import { useState, useEffect } from "react";
import FileUpload from "./FileUpload";
import ProcessingOptions from "./ProcessingOptions";
import ProcessingStatus from "./ProcessingStatus";
import Results from "./Results";
import Footer from "./Footer";
import SampleData from "./SampleData";
import { v4 as uuidv4 } from "uuid";

export interface ColumnMetadata {
  name: string;
  dtype: string;
  unique: number;
  missing: number;
}

export interface DatasetMetadata {
  columns: ColumnMetadata[];
  can_aggregate: boolean;
  can_filter: boolean;
  sample_data: Record<string, any>[];
}

export interface ProcessingOptionsState {
  processingType: string;
  condition: string;
  isSampleData: boolean;
  groupByColumn: string;
  aggregateColumn: string;
  aggregateFunction: string;
}

export interface DataAttributes {
  result?: Array<Record<string, any>>;
  graphs: Array<{
    chart_type: "histogram" | "bar" | "line" | "area" | "two_bars";
    chart_data: Array<Record<string, any>>;
    value_key: string;
  }>;
}

export interface Errors {
  file?: string;
  processingType?: string;
  condition?: string;
  groupByColumn?: string;
  aggregateColumn?: string;
  aggregateFunction?: string;
  submission?: string;
  graph?: string;
}

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState("");
  const [isSampleData, setIsSampleData] = useState(false);
  const [data, setData] = useState<DataAttributes>();
  const [errors, setErrors] = useState<Errors>({});
  const [metadata, setMetadata] = useState<DatasetMetadata | null>(null);
  const [sessionId] = useState(uuidv4());
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [processingOptions, setProcessingOptions] =
    useState<ProcessingOptionsState>({
      processingType: "Filter data",
      condition: "",
      isSampleData: false,
      groupByColumn: "",
      aggregateColumn: "",
      aggregateFunction: "",
    });

  const resetAppState = () => {
    setFile(null);
    setUploadProgress(0);
    setAnalysisProgress(0);
    setProcessingProgress(0);
    setProcessingStatus("");
    setIsSampleData(false);
    setData(undefined);
    setErrors({});
    setMetadata(null);
    setProcessingOptions({
      processingType: "Filter data",
      condition: "",
      isSampleData: false,
      groupByColumn: "",
      aggregateColumn: "",
      aggregateFunction: "",
    });
  };

  useEffect(() => {
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;

    const connectWebSocket = () => {
      if (ws) {
        ws.close();
      }

      const websocket = new WebSocket(
        `ws://localhost:8000/ws/progress/${sessionId}`
        // `ws://backend:8000/ws/progress/${sessionId}`
      );
      websocket.onopen = () => {
        // console.log(
        //   "WebSocket connected to:",
        //   `ws://backend:8000/ws/progress/${sessionId}`
        // );
        setWs(websocket);
        reconnectAttempts = 0;
      };
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // console.log("WebSocket message:", data);
        const { progress, message } = data;

        setProcessingStatus(message);

        if (message.includes("Uploading...")) {
          setUploadProgress(Math.round(progress));
        } else if (
          message.includes("Starting analysis...") ||
          message.includes("Analyzing columns...") ||
          message.includes("Finalizing metadata...") ||
          message.includes("Analysis Complete")
        ) {
          setAnalysisProgress(Math.round(progress));
        } else if (
          message.includes("Loading dataset...") ||
          message.includes("Applying filter...") ||
          message.includes("Generating charts...") ||
          message.includes("Aggregating data...") ||
          message.includes("Generating summary...") ||
          message.includes("Finalizing results...") ||
          message.includes("Completed!")
        ) {
          setProcessingProgress(Math.round(progress));
        }

        if (message.includes("Error")) {
          setErrors((prev) => ({
            ...prev,
            file: message,
            submission: message,
          }));
        }
      };
      websocket.onclose = () => {
        // console.log("WebSocket closed");
        setWs(null);
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts += 1;
          setTimeout(connectWebSocket, 1000 * reconnectAttempts);
        } else {
          setErrors((prev) => ({
            ...prev,
            file: "WebSocket connection closed",
            submission: "WebSocket connection closed",
          }));
        }
      };
      websocket.onerror = (error) => {
        // console.error("WebSocket error:", error);
        setErrors((prev) => ({
          ...prev,
          file: "WebSocket connection failed",
          submission: `WebSocket connection failed: ${error}`,
        }));
        setProcessingStatus("Error!");
      };
    };

    connectWebSocket();

    return () => {
      ws?.close();
    };
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col background-noise">
      <main className="container mx-auto px-4 py-20 flex-1">
        <FileUpload
          file={file}
          setFile={setFile}
          setProcessingStatus={setProcessingStatus}
          uploadProgress={uploadProgress}
          setUploadProgress={setUploadProgress}
          errors={errors}
          setErrors={setErrors}
          setMetadata={setMetadata}
          sessionId={sessionId}
          isSampleData={isSampleData}
          resetAppState={resetAppState}
        />
        {metadata && (
          <>
            <SampleData sampleData={metadata.sample_data} />
            <ProcessingOptions
              processingOptions={processingOptions}
              setProcessingOptions={setProcessingOptions}
              errors={errors}
              setErrors={setErrors}
              metadata={metadata}
            />
          </>
        )}
        {processingStatus && processingStatus !== "" && (
          <ProcessingStatus
            processingOptions={processingOptions}
            processingStatus={processingStatus}
            setProcessingStatus={setProcessingStatus}
            uploadProgress={uploadProgress}
            analysisProgress={analysisProgress}
            processingProgress={processingProgress}
            setProcessingProgress={setProcessingProgress}
            setData={setData}
            errors={errors}
            setErrors={setErrors}
            sessionId={sessionId}
          />
        )}
        <Results
          data={data}
          processingOptions={processingOptions}
          errors={errors}
        />
      </main>
      <Footer />
    </div>
  );
}
