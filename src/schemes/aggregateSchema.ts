import z from "zod";

export const aggregateSchema = z.object({
  processingType: z.literal("Aggregate data"),
  groupByColumn: z
    .string()
    .nonempty({ message: "Group by column is required" }),
  aggregateColumn: z
    .string()
    .nonempty({ message: "Aggregation column is required" }),
  aggregateFunction: z.enum(["sum", "mean", "count", "min", "max"], {
    message: "Aggregation function is required",
  }),
  isSampleData: z.boolean().optional(),
});
