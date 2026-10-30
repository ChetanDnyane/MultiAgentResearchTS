
import { z } from "zod";

export const finalAnswerSchema = z.object({
  answer: z
    .string()
    .describe(
      "The final polished answer to the user's original question. It should be clear, accurate, well-structured, and directly address the question."
    ),

  workflowSummary: z
    .string()
    .describe(
      "A brief summary of how the multi-agent workflow processed the question, including the number of revisions and whether the Critic approved the draft or the revision limit was reached."
    ),
});

export type FinalAnswerOutput = z.infer<typeof finalAnswerSchema>;
