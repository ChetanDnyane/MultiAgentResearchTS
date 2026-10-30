
import { managerAgent } from "../agents/manager-agent.js";
import { researchAgent } from "../agents/research-agent.js";
import { analysisAgent } from "../agents/analysis-agent.js";
import { draftAgent } from "../agents/draft-agent.js";
import { criticAgent } from "../agents/critic-agent.js";
import { finalAnswerAgent } from "../agents/final-answer-agent.js";

import type { ResearchStateType } from "./state.js";

// Maximum number of times the Draft Agent can revise its answer.
const MAX_REVISION_ATTEMPTS = Math.max(
  1,
  Number(process.env.MAX_REVISION_ATTEMPTS ?? 2) || 2
);

// 1. Manager Node
export async function managerNode(state: ResearchStateType) {
  console.log("\n[Manager Node] Creating the research plan...");

  const result = await managerAgent(state.question);

  console.log("[Manager Node] Plan created.");

  return {
    plan: result.plan,
    researchInstructions: result.researchInstructions,
    analysisInstructions: result.analysisInstructions,
  };
}

// 2. Research Node
export async function researchNode(state: ResearchStateType) {
  console.log("\n[Research Node] Researching the question...");

  const result = await researchAgent(
    state.question,
    state.researchInstructions
  );

  console.log("[Research Node] Research completed.");

  return {
    research: result,
  };
}

// 3. Analysis Node
export async function analysisNode(state: ResearchStateType) {
  console.log("\n[Analysis Node] Analyzing the question...");

  const result = await analysisAgent(
    state.question,
    state.analysisInstructions
  );

  console.log("[Analysis Node] Analysis completed.");

  return {
    analysis: result,
  };
}

// 4. Draft Node
export async function draftNode(state: ResearchStateType) {
  const isRevision = state.revisionCount > 0;

  console.log(
    isRevision
      ? `\n[Draft Node] Revising the answer (revision ${state.revisionCount})...`
      : "\n[Draft Node] Creating the initial draft..."
  );

  const result = await draftAgent({
    question: state.question,
    research: state.research,
    analysis: state.analysis,
    ...(isRevision
      ? {
          previousDraft: state.draft,
          criticFeedback: state.criticFeedback,
        }
      : {}),
  });

  console.log("[Draft Node] Draft completed.");

  return {
    draft: result.draft,
  };
}

// 5. Critic Node
export async function criticNode(state: ResearchStateType) {
  console.log("\n[Critic Node] Reviewing the draft...");

  const result = await criticAgent(
    state.question,
    state.draft
  );

  const nextRevisionCount =
    state.revisionCount + (result.decision === "REVISE" ? 1 : 0);

  const revisionLimitReached =
    result.decision === "REVISE" &&
    nextRevisionCount >= MAX_REVISION_ATTEMPTS;

  console.log(`[Critic Node] Decision: ${result.decision}`);

  if (result.decision === "REVISE") {
    console.log("[Critic Node] Feedback:", result.feedback);
  }

  if (revisionLimitReached) {
    console.log("[Critic Node] Maximum revision attempts reached.");
  }

  return {
    criticDecision: result.decision,
    criticFeedback: result.feedback,
    criticIssues: result.issues,
    revisionCount: nextRevisionCount,
    revisionLimitReached,
  };
}

// 6. Final Answer Node
export async function finalAnswerNode(state: ResearchStateType) {
  console.log("\n[Final Answer Node] Preparing the final response...");

  const result = await finalAnswerAgent({
    question: state.question,
    draft: state.draft,
    criticDecision: state.criticDecision,
    criticFeedback: state.criticFeedback,
    revisionCount: state.revisionCount,
    revisionLimitReached: state.revisionLimitReached,
  });

  console.log("[Final Answer Node] Final response prepared.");

  return {
    finalAnswer: result.answer,
    workflowSummary: result.workflowSummary,
  };
}
