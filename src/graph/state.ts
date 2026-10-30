
import { Annotation } from "@langchain/langgraph";

import type { ResearchOutput } from "../agents/schemas/research-schema.js";
import type { AnalysisOutput } from "../agents/schemas/analysis-schema.js";

export const ResearchState = Annotation.Root({
  // Original question submitted by the user
  question: Annotation<string>(),

  // Manager Agent outputs
  plan: Annotation<string>(),
  researchInstructions: Annotation<string>(),
  analysisInstructions: Annotation<string>(),

  // Specialist Agent outputs
  research: Annotation<ResearchOutput>(),
  analysis: Annotation<AnalysisOutput>(),

  // Draft Agent output
  draft: Annotation<string>(),

  // Critic Agent outputs
  criticDecision: Annotation<"APPROVE" | "REVISE">(),
  criticFeedback: Annotation<string>(),
  criticIssues: Annotation<string[]>(),

  // Revision tracking
  revisionCount: Annotation<number>(),
  revisionLimitReached: Annotation<boolean>(),

  // Final Answer Agent outputs
  finalAnswer: Annotation<string>(),
  workflowSummary: Annotation<string>(),
});

export type ResearchStateType = typeof ResearchState.State;
