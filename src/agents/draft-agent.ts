
import { model } from "../llm/model.js";
import {
  draftSchema,
  type DraftOutput,
} from "./schemas/draft-schema.js";
import type { ResearchOutput } from "./schemas/research-schema.js";
import type { AnalysisOutput } from "./schemas/analysis-schema.js";

const draftModel = model.withStructuredOutput(draftSchema);

interface DraftAgentInput {
  question: string;
  research: ResearchOutput;
  analysis: AnalysisOutput;
  previousDraft?: string;
  criticFeedback?: string;
}

export async function draftAgent(
  input: DraftAgentInput
): Promise<DraftOutput> {
  const response = await draftModel.invoke([
    {
      role: "system",
      content: `
You are a Draft Agent in a multi-agent research system.

Your responsibility is to create a comprehensive answer by
synthesizing the findings from the Research Agent and Analysis Agent.

Follow these rules:

1. Directly answer the user's original question.
2. Incorporate the most relevant research findings.
3. Incorporate the analysis, alternatives, trade-offs, and recommendations.
4. Organize the answer logically using appropriate sections.
5. Avoid unnecessary repetition.
6. Do not introduce unsupported facts or fabricated statistics.
7. Distinguish assumptions from established facts.
8. Explain technical concepts clearly.
9. Preserve important uncertainties and limitations.
10. Do not blindly accept every recommendation. Use logical reasoning.

If a previous draft and Critic feedback are provided:

11. Treat the previous draft as the starting point.
12. Address every meaningful issue raised by the Critic.
13. Improve the existing answer instead of unnecessarily rewriting it.
14. Do not ignore important information from the previous draft.

Return the completed draft using the required structured output.
      `,
    },
    {
      role: "user",
      content: `
Original user question:
${input.question}

Research Agent findings:
${JSON.stringify(input.research, null, 2)}

Analysis Agent findings:
${JSON.stringify(input.analysis, null, 2)}

Previous draft:
${input.previousDraft ?? "No previous draft. This is the initial draft."}

Critic feedback:
${input.criticFeedback ?? "No critic feedback. This is the initial draft."}

Create the answer.
      `,
    },
  ]);

  return response;
}
