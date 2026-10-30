
import { z } from "zod";

export const criticSchema = z.object({
  decision: z
    .enum(["APPROVE", "REVISE"])
    .describe(
      "APPROVE if the draft meets the quality requirements. REVISE if meaningful improvements are necessary."
    ),

  feedback: z
    .string()
    .describe(
      "Specific and actionable feedback explaining why the draft should be approved or revised."
    ),

  issues: z
    .array(z.string())
    .describe(
      "Specific problems identified in the draft, such as missing information, unsupported claims, logical errors, or unclear explanations."
    ),
});

export type CriticOutput = z.infer<typeof criticSchema>;
