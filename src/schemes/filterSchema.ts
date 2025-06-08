import z from "zod";

export const filterSchema = z.object({
  processingType: z.literal("Filter data"),
  condition: z
    .string()
    .min(1, "Condition is required")
    .max(100, "Condition must be 100 characters or less")
    .regex(
      /^[a-zA-Z0-9_\s><=.]+$/,
      "Condition can only contain letters, numbers, underscores, spaces, and comparison operators"
    ),
  isSampleData: z.boolean().optional(),
});
