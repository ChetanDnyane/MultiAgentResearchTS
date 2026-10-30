
import { z } from "zod";

export const researchSchema = z.object({
  summary: z
    .string()
    .describe("A concise summary of the research findings."),

  keyFindings: z
    .array(z.string())
    .describe(
      "The most important facts, findings, and observations relevant to the research question."
    ),

  supportingDetails: z
    .array(z.string())
    .describe(
      "Additional explanations, examples, and technical details supporting the key findings."
    ),

  uncertainties: z
    .array(z.string())
    .describe(
      "Areas where information is incomplete, uncertain, potentially outdated, or requires verification."
    ),

  limitations: z
    .array(z.string())
    .describe(
      "Limitations of the research, including the absence of live web searches or external source verification."
    ),
});

export type ResearchOutput = z.infer<typeof researchSchema>;
