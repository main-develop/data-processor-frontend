import type { DatasetMetadata } from "../components/App";

export const useProcessingOptionsData = (metadata: DatasetMetadata) => {
  const availableProcessingTypes = [
    ...(metadata.can_filter ? ["Filter data"] : []),
    ...(metadata.can_aggregate ? ["Aggregate data"] : []),
    "Generate summary",
  ];

  const numericColumns = metadata.columns
    .filter((col) => ["int64", "float64"].includes(col.dtype))
    .map((col) => col.name);
  const categoricalColumns = metadata.columns
    .filter((col) => ["object", "category", "string"].includes(col.dtype))
    .map((col) => col.name);

  return {
    availableProcessingTypes,
    numericColumns,
    categoricalColumns,
  };
};
