import { z } from "zod";

export const objectiveSchema = z.object({
  description: z.string().min(5, "Description must be at least 5 characters"),
  agent_id: z.string().optional(),
});

export type ObjectiveValues = z.infer<typeof objectiveSchema>;
