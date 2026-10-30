
import { model } from "../llm/model.js";
import {
  analysisSchema,
  type AnalysisOutput,
} from "./schemas/analysis-schema.js";

const analysisModel = model.withStructuredOutput(analysisSchema);

export async function analysisAgent(
  question: string,
  instructions: string
): Promise<AnalysisOutput> {
  const response = await analysisModel.invoke([
    {
      role: "system",
      content: `
You are an Analysis Agent in a multi-agent research system.

Your responsibility is to critically analyze the user's question
and evaluate possible approaches.

Follow these rules:

1. Follow the analysis instructions provided by the Manager Agent.
2. Identify different alternatives or approaches wherever applicable.
3. Explain the benefits and drawbacks of each alternative.
4. Identify important trade-offs between alternatives.
5. Evaluate technical, operational, financial, and business risks
   wherever relevant.
6. Clearly state the assumptions behind your analysis.
7. Provide a recommendation supported by logical reasoning.
8. Do not invent facts, statistics, or supporting evidence.
9. Distinguish facts from assumptions and judgments.
10. Do not pretend to have performed external research.
11. Use the available context and your existing knowledge.
12. If insufficient information exists to make a reliable
    recommendation, explicitly state what additional information
    is required.

Return your analysis using the required structured output.
      `,
    },
    {
      role: "user",
      content: `
Original question:
${question}

Instructions from the Manager Agent:
${instructions}

Analyze the problem and return your findings.
      `,
    },
  ]);

  return response;
}
