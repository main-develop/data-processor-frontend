import { useCurrentPng } from "recharts-to-png";
import FileSaver from "file-saver";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCallback } from "react";

interface ResultsOptions {
  graphData: any[];
  errors: {
    file?: string;
    processingType?: string;
    condition?: string;
    submission?: string;
    graph?: string;
  };
}

export default function Results({
  graphData,
  errors,
}: ResultsOptions): React.JSX.Element {
  const [getPng, { ref }] = useCurrentPng();

  // Download graph as PNG
  const handleDownloadGraph = useCallback(async () => {
    const png = await getPng();
    if (png) {
      FileSaver.saveAs(png, "test.png");
    }
  }, [getPng]);

  // Download processed data (mock)
  const handleDownloadData = () => {
    alert("Downloading processed data...");
  };

  return (
    <>
      {graphData.length !== 0 && (
        <div className="relative">
          <div className="section-gradient-shadow"></div>
          <section className="mb-8 p-6 rounded-xl shadow-md glassmorphism">
            <h2 className="text-xl font-semibold mb-4">
              Processed Data Visualization
            </h2>
            <div className="flex items-center justify-center">
              <BarChart width={500} height={300} data={graphData} ref={ref}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderColor: "transparent",
                    borderRadius: 6,
                    backgroundColor: "#333131",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                {/* <Bar
                  dataKey="pv"
                  fill="#8884d8"
                  activeBar={{ fill: "#736fc3" }}
                />
               */}
                <Bar dataKey="value">
                  {graphData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </div>
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
