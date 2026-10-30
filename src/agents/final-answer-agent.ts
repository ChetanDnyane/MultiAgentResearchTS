
import { model } from "../llm/model.js";
import {
  finalAnswerSchema,
  type FinalAnswerOutput,
} from "./schemas/final-answer-schema.js";

interface FinalAnswerAgentInput {
  question: string;
  draft: string;
  criticDecision: "APPROVE" | "REVISE";
  criticFeedback: string;
  revisionCount: number;
  revisionLimitReached: boolean;
}

const finalAnswerModel = model.withStructuredOutput(finalAnswerSchema);

export async function finalAnswerAgent(
  input: FinalAnswerAgentInput
): Promise<FinalAnswerOutput> {
  const response = await finalAnswerModel.invoke([
    {
      role: "system",
      content: `
You are the Final Answer Agent in a multi-agent research system.

Your responsibility is to prepare the final response for the user.

Follow these rules:

1. Preserve the meaning and important information in the supplied draft.
2. Improve clarity, readability, and organization.
3. Ensure the response directly addresses the original question.
4. Remove unnecessary repetition.
5. Do not introduce unsupported facts or new claims.
6. Preserve important assumptions, uncertainties, and limitations.
7. Do not claim that the Critic approved the answer unless
   its decision was APPROVE.
8. If the revision limit was reached while the Critic still
   requested revisions, clearly acknowledge this in the workflow summary.
9. Keep the workflow summary concise.

Return the final answer and workflow summary using
the required structured output.
      `,
    },
    {
      role: "user",
      content: `
Original user question:
${input.question}

Latest draft:
${input.draft}

Critic decision:
${input.criticDecision}

Critic feedback:
${input.criticFeedback}

Number of revisions performed:
${input.revisionCount}

Revision limit reached:
${input.revisionLimitReached}

Prepare the final response.
      `,
    },
  ]);

  return response;
}
