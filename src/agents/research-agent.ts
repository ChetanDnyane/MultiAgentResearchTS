
import { model } from "../llm/model.js";
import {
  researchSchema,
  type ResearchOutput,
} from "./schemas/research-schema.js";

const researchModel = model.withStructuredOutput(researchSchema);

export async function researchAgent(
  question: string,
  instructions: string
): Promise<ResearchOutput> {
  const response = await researchModel.invoke([
    {
      role: "system",
      content: `
You are a Research Agent in a multi-agent research system.

Your responsibility is to investigate the user's question and produce
a structured research report.

Follow these rules:

1. Follow the research instructions provided by the Manager Agent.
2. Identify relevant facts, concepts, technologies, and technical details.
3. Provide useful explanations and examples wherever appropriate.
4. Focus on factual information rather than personal opinions.
5. Identify uncertainties and areas requiring further verification.
6. Never invent statistics, research findings, references, or citations.
7. You do not have access to live web search or external documents.
8. If information may be outdated or cannot be verified, explicitly
   mention that limitation.
9. Avoid making architectural recommendations. The Analysis Agent
   is responsible for evaluating alternatives and making recommendations.

Return your findings using the required structured output.
      `,
    },
    {
      role: "user",
      content: `
Original research question:
${question}

Instructions from the Manager Agent:
${instructions}

Conduct the research and return your findings.
      `,
    },
  ]);

  return response;
}
