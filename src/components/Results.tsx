import type { DataAttributes, Errors, ProcessingOptionsState } from "./App";
import { useCurrentPng } from "recharts-to-png";
import FileSaver from "file-saver";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useCallback } from "react";
import { stringToColor } from "../utils/stringToColor";

interface ResultsOptions {
  data?: DataAttributes;
  processingOptions: ProcessingOptionsState;
  errors: Errors;
}

export default function Results({
  data,
  processingOptions,
  errors,
}: ResultsOptions): React.JSX.Element {
  const { aggregateColumn } = processingOptions;

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
      {data && data.graphs && (
        <div className="relative">
          <div className="section-gradient-shadow"></div>
          <section className="mb-8 p-6 rounded-xl shadow-md glassmorphism">
            <h2 className="text-xl font-semibold mb-4">
              Processed Data Visualization
            </h2>
            {data.result && (
              <div className="mb-4 overflow-x-auto">
                <table className="w-full text-sm text-gray-200">
                  <thead>
                    <tr className="bg-gray-700/20">
                      {data.result.length > 0 &&
                        typeof data.result[0] === "object" &&
                        Object.keys(data.result[0]).map((key) => (
                          <th key={key} className="px-4 py-2 text-left">
                            {key}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.result.map((row, index) => (
                      <tr key={index} className="border-t border-gray-600/20">
                        {Object.values(row).map((value, idx) => (
                          <td key={idx} className="px-4 py-2">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div
              className={`flex items-center ${
                data.graphs.length > 1 ? "justify-between" : "justify-center"
              }`}
            >
              {data.graphs.map((graph, index) => (
                <div key={index} className="flex">
                  {graph.chart_type === "histogram" && (
                    <BarChart
                      width={600}
                      height={300}
                      data={graph.chart_data}
                      ref={ref}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bin" />
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
                      <Bar
                        dataKey={graph.value_key}
                        fill="#8884d8"
                        activeBar={{ fill: `hsl(243, 52%, 63%)` }}
                      />
                    </BarChart>
                  )}
                  {graph.chart_type === "bar" && (
                    <BarChart
                      width={500}
                      height={300}
                      data={graph.chart_data}
                      ref={ref}
                    >
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
                      <Bar
                        dataKey={graph.value_key}
                        fill="#82ca9d"
                        activeBar={{ fill: `hsl(143, 40%, 60%)` }}
                      />
                    </BarChart>
                  )}
                  {graph.chart_type === "two_bars" && (
                    <BarChart
                      width={500}
                      height={300}
                      data={graph.chart_data}
                      ref={ref}
                    >
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
                      {Object.keys(graph.chart_data?.[0] || {})
                        .filter((key) => key !== "name")
                        .map((key) => (
                          <Bar
                            key={key}
                            dataKey={key}
                            fill={stringToColor(key)}
                            activeBar={{ fill: stringToColor(key, 55) }}
                          />
                        ))}
                    </BarChart>
                  )}
                  {graph.chart_type === "line" && (
                    <LineChart width={600} height={300} data={graph.chart_data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
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
                      <Line
                        type="monotone"
                        dataKey={graph.value_key}
                        stroke="#82ca9d"
                      />
                    </LineChart>
                  )}
                  {graph.chart_type === "area" && (
                    <AreaChart width={600} height={300} data={graph.chart_data}>
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
                      <Area
                        type="monotone"
                        dataKey={aggregateColumn}
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  )}
                  {/*
                <Bar dataKey="value">
                  {graphs.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart> */}
                </div>
              ))}
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
