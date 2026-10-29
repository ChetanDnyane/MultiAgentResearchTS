
import {
  Annotation,
  END,
  START,
  StateGraph,
} from "@langchain/langgraph";

// 1. Define the shared workflow state.
const ResearchState = Annotation.Root({
  question: Annotation<string>(),
  plan: Annotation<string>(),
  researchInstructions: Annotation<string>(),
  analysisInstructions: Annotation<string>(),
  researchStatus: Annotation<"PENDING" | "COMPLETED">(),
  analysisStatus: Annotation<"PENDING" | "COMPLETED">(),
  research: Annotation<string>(),
  analysis: Annotation<string>(),
  draft: Annotation<string>(),
  criticDecision: Annotation<"APPROVE" | "REVISE">(),
  criticFeedback: Annotation<string>(),
  revisionCount: Annotation<number>(),
  finalAnswer: Annotation<string>(),
  workflowSummary: Annotation<string>(),
});

// 2. Manager: create a plan for the workflow.
async function managerNode(
  state: typeof ResearchState.State,
) {
  console.log("[Manager Node] Creating research plan...");

  const plan = [
    "1. Research practical applications of AI in software development.",
    "2. Analyze benefits, limitations, and risks.",
    "3. Combine research and analysis into a draft.",
    "4. Review the draft and revise if necessary.",
  ].join("\n");

  const researchInstructions = [
    `Research question: ${state.question}`,
    "Identify practical applications of AI in software development.",
    "Describe relevant use cases and examples.",
    "Focus on factual information rather than opinions.",
  ].join("\n");

  const analysisInstructions = [
    `Analysis question: ${state.question}`,
    "Evaluate the benefits and limitations of AI in software development.",
    "Consider risks, trade-offs, and potential impact on developers.",
    "Provide balanced reasoning rather than only listing advantages.",
  ].join("\n");

  console.log("[Manager Node] Plan and specialist instructions created.");

  return {
    plan,
    researchInstructions,
    analysisInstructions,
  };
}

// 3. Research branch.
async function researchNode(
  state: typeof ResearchState.State,
) {
  console.log("[Research Node] Running...");
  console.log("[Research Node] Instructions:");
  console.log(state.researchInstructions);

  const research = [
    `Research findings about: ${state.question}`,
    `Instructions followed: ${state.researchInstructions}`,
    "Example use case: AI-assisted code generation and test creation.",
    "Example use case: AI-assisted debugging and code review.",
  ].join("\n");

  console.log("[Research Node] Work completed.");

  return {
    research,
    researchStatus: "COMPLETED" as const,
  };
}

// 4. Analysis branch.
async function analysisNode(
  state: typeof ResearchState.State,
) {
  console.log("[Analysis Node] Running...");
  console.log("[Analysis Node] Instructions:");
  console.log(state.analysisInstructions);

  const analysis = [
    `Analysis of: ${state.question}`,
    `Instructions followed: ${state.analysisInstructions}`,
    "Benefit: AI can accelerate routine coding and test generation.",
    "Limitation: AI-generated code can contain errors and security vulnerabilities.",
    "Trade-off: Productivity gains must be balanced against review and verification effort.",
  ].join("\n");

  console.log("[Analysis Node] Work completed.");

  return {
    analysis,
    analysisStatus: "COMPLETED" as const,
  };
}

// 5. Create or revise the draft.
async function draftNode(
  state: typeof ResearchState.State,
) {
  // Ensure both parallel branches have completed.
  if (
    state.researchStatus !== "COMPLETED" ||
    state.analysisStatus !== "COMPLETED"
  ) {
    throw new Error(
      "Cannot create a draft: Research and Analysis must both complete first.",
    );
  }

  console.log(
    `[Draft Node] Both specialists completed. Research=${state.researchStatus}, Analysis=${state.analysisStatus}`,
  );

  const isRevision = state.revisionCount > 0;

  console.log(
    isRevision
      ? `[Draft Node] Revising draft (revision ${state.revisionCount})...`
      : "[Draft Node] Creating initial draft...",
  );

  if (isRevision) {
    console.log("[Draft Node] Applying Critic feedback:");
    console.log(state.criticFeedback);
  }

  const draftSections = [
    "Research:",
    state.research,
    "",
    "Analysis:",
    state.analysis,
  ];

  if (isRevision) {
    draftSections.push(
      "",
      "Critic feedback applied:",
      state.criticFeedback,
      "",
      "Improved draft: Benefits, limitations, risks, and trade-offs are now explicitly considered.",
    );
  } else {
    draftSections.push("", "Initial draft.");
  }

  return {
    draft: draftSections.join("\n"),
  };
}

// 7. Simulate the Critic reviewing the draft.
async function criticNode(
  state: typeof ResearchState.State,
) {
  console.log(
    `[Critic Node] Reviewing draft (revision count: ${state.revisionCount})...`,
  );

  // Simulate a review based on the current revision.
  const decision =
    state.revisionCount === 0 ? "REVISE" : "APPROVE";

  const feedback =
    decision === "REVISE"
      ? "The draft needs clearer benefits, limitations, risks, and trade-offs."
      : "The draft has addressed the review criteria.";

  console.log(`[Critic Node] Decision: ${decision}`);
  console.log(`[Critic Node] Feedback: ${feedback}`);

  return {
    criticDecision: decision as "APPROVE" | "REVISE",
    criticFeedback: feedback,
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

  const workflowSummary = [
    `Question: ${state.question}`,
    `Research status: ${state.researchStatus}`,
    `Analysis status: ${state.analysisStatus}`,
    `Critic decision: ${state.criticDecision}`,
    `Revisions performed: ${state.revisionCount}`,
    "Workflow status: COMPLETED",
  ].join("\n");

  return {
    finalAnswer: state.draft,
    workflowSummary,
  };
}

// 8. Build the graph.
const workflow = new StateGraph(ResearchState)
  .addNode("managerNode", managerNode)
  .addNode("researchNode", researchNode)
  .addNode("analysisNode", analysisNode)
  .addNode("draftNode", draftNode)
  .addNode("criticNode", criticNode)
  .addNode("finalAnswerNode", finalAnswerNode)
  .addEdge(START, "managerNode")
  .addEdge("managerNode", "researchNode")
  .addEdge("managerNode", "analysisNode")
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
