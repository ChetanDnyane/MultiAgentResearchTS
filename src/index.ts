
import {
  Annotation,
  END,
  START,
  StateGraph,
} from "@langchain/langgraph";

// 1. Define the shared workflow state.
const ResearchState = Annotation.Root({
  question: Annotation<string>(),
  research: Annotation<string>(),
  analysis: Annotation<string>(),
  draft: Annotation<string>(),
  criticDecision: Annotation<"APPROVE" | "REVISE">(),
  revisionCount: Annotation<number>(),
  finalAnswer: Annotation<string>(),
});

// 2. Research branch.
async function researchNode(
  state: typeof ResearchState.State,
) {
  console.log("[Research Node] Running...");

  return {
    research: `Research findings about: ${state.question}`,
  };
}

// 3. Analysis branch.
async function analysisNode(
  state: typeof ResearchState.State,
) {
  console.log("[Analysis Node] Running...");

  return {
    analysis: `Independent analysis of: ${state.question}`,
  };
}

// 4. Create or revise the draft.
async function draftNode(
  state: typeof ResearchState.State,
) {
  const isRevision = state.revisionCount > 0;

  console.log(
    isRevision
      ? `[Draft Node] Revising draft (revision ${state.revisionCount})...`
      : "[Draft Node] Creating initial draft...",
  );

  return {
    draft: [
      "Research:",
      state.research,
      "",
      "Analysis:",
      state.analysis,
      "",
      isRevision
        ? `Improved draft after revision ${state.revisionCount}.`
        : "Initial draft.",
    ].join("\n"),
  };
}

// 5. Simulate the Critic reviewing the draft.
async function criticNode(
  state: typeof ResearchState.State,
) {
  console.log(
    `[Critic Node] Reviewing draft (revision count: ${state.revisionCount})...`,
  );

  // Deterministic demonstration:
  // Reject the first draft, approve the next one.
  const decision =
    state.revisionCount === 0 ? "REVISE" : "APPROVE";

  console.log(`[Critic Node] Decision: ${decision}`);

  return {
    criticDecision: decision as "APPROVE" | "REVISE",
    revisionCount:
      decision === "REVISE"
        ? state.revisionCount + 1
        : state.revisionCount,
  };
}

// 6. Choose the next step.
function routeAfterCritic(
  state: typeof ResearchState.State,
) {
  if (state.criticDecision === "APPROVE") {
    return "finalAnswerNode";
  }

  // Hard limit: allow at most two revisions.
  if (state.revisionCount >= 2) {
    console.log(
      "[Router] Revision limit reached. Proceeding with the current draft.",
    );
    return "finalAnswerNode";
  }

  return "draftNode";
}

// 7. Produce the final answer.
async function finalAnswerNode(
  state: typeof ResearchState.State,
) {
  console.log("[Final Answer Node] Running...");

  return {
    finalAnswer: state.draft,
  };
}

// 8. Build the graph.
const workflow = new StateGraph(ResearchState)
  .addNode("researchNode", researchNode)
  .addNode("analysisNode", analysisNode)
  .addNode("draftNode", draftNode)
  .addNode("criticNode", criticNode)
  .addNode("finalAnswerNode", finalAnswerNode)
  .addEdge(START, "researchNode")
  .addEdge(START, "analysisNode")
  .addEdge("researchNode", "draftNode")
  .addEdge("analysisNode", "draftNode")
  .addEdge("draftNode", "criticNode")
  .addConditionalEdges("criticNode", routeAfterCritic, [
    "finalAnswerNode",
    "draftNode",
  ])
  .addEdge("finalAnswerNode", END)
  .compile();

// 9. Execute the workflow.
const result = await workflow.invoke({
  question: "How can AI help software developers?",
  revisionCount: 0,
});

console.log("\nFinal Workflow State:");
console.log(result);
