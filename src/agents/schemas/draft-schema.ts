
import { z } from "zod";

export const draftSchema = z.object({
  draft: z
    .string()
    .describe(
      "A comprehensive answer synthesized from the research findings and analysis. It should directly address the user's original question, explain relevant evidence, compare alternatives where appropriate, and present a logical conclusion."
    ),
});

export type DraftOutput = z.infer<typeof draftSchema>;
