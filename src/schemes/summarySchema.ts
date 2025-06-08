import z from "zod";

export const summarySchema = z.object({
  processingType: z.literal("Generate summary"),
  isSampleData: z.boolean().optional(),
});
