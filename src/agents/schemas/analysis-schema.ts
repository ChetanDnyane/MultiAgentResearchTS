
import { z } from "zod";

export const analysisSchema = z.object({
  summary: z
    .string()
    .describe("An overall summary of the analysis."),

  alternatives: z
    .array(
      z.object({
        name: z.string().describe("Name of the option or alternative."),
        description: z
          .string()
          .describe("Explanation of the option."),
        benefits: z
          .array(z.string())
          .describe("Advantages of this option."),
        drawbacks: z
          .array(z.string())
          .describe("Disadvantages of this option."),
      })
    )
    .describe("Different approaches or alternatives worth considering."),

  tradeOffs: z
    .array(z.string())
    .describe("Important trade-offs between the available options."),

  risks: z
    .array(z.string())
    .describe("Potential risks, challenges, and failure scenarios."),

  recommendation: z
    .string()
    .describe("The recommended approach and the reasoning behind it."),

  assumptions: z
    .array(z.string())
    .describe("Assumptions made while performing the analysis."),
});

export type AnalysisOutput = z.infer<typeof analysisSchema>;
