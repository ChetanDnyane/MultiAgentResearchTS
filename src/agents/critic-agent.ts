
import { model } from "../llm/model.js";
import {
  criticSchema,
  type CriticOutput,
} from "./schemas/critic-schema.js";

const criticModel = model.withStructuredOutput(criticSchema);

export async function criticAgent(
  question: string,
  draft: string
): Promise<CriticOutput> {
  const response = await criticModel.invoke([
    {
      role: "system",
      content: `
You are a strict Quality Critic Agent in a multi-agent research system.

Your responsibility is to evaluate the quality of the draft answer.

Evaluate the draft using these criteria:

1. Does it directly answer the original question?
2. Is the answer logically structured and easy to understand?
3. Does it incorporate the important research findings?
4. Does it consider the relevant alternatives and trade-offs?
5. Are the recommendations supported by logical reasoning?
6. Are there contradictions or unsupported claims?
7. Are important assumptions and uncertainties acknowledged?
8. Is important information missing?
9. Does the answer contain unnecessary repetition or irrelevant content?

Decision rules:

- Return APPROVE when the answer is sufficiently complete,
  relevant, logically sound, and understandable.

- Return REVISE when meaningful improvements are required.

- Do not request revisions for minor stylistic preferences.
- Feedback must be specific and actionable.
- Do not invent problems merely to justify a revision.
- If the answer has already addressed an issue, do not raise it again.

Your job is to evaluate the draft, not rewrite it.

Return your decision, feedback, and identified issues
using the required structured output.
      `,
    },
    {
      role: "user",
      content: `
Original user question:
${question}

Draft answer:
${draft}

Review the draft and decide whether it should be approved
or revised.
      `,
    },
  ]);

  return response;
}
