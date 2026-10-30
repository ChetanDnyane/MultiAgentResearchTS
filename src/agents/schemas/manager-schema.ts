
import { z } from "zod";

export const managerSchema = z.object({
  plan: z
    .string()
    .describe("The overall strategy for answering the user's research question."),

  researchInstructions: z
    .string()
    .describe("Specific instructions for the Research Agent to investigate facts, evidence, and relevant information."),

  analysisInstructions: z
    .string()
    .describe("Specific instructions for the Analysis Agent to evaluate the question, compare alternatives, and identify implications."),
});

export type ManagerOutput = z.infer<typeof managerSchema>;
