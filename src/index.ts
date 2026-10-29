
import {
  Annotation,
  END,
  START,
  StateGraph,
} from "@langchain/langgraph";

// Shared state for the workflow.
const ResearchState = Annotation.Root({
  question: Annotation<string>(),
  research: Annotation<string>(),
  analysis: Annotation<string>(),
  finalAnswer: Annotation<string>(),
});

// Research branch.
async function researchNode(
  state: typeof ResearchState.State,
) {
  console.log("[Research Node] Running...");

  return {
    research: `Research findings about: ${state.question}`,
  };
}

// Analysis branch.
// It uses the question directly, so it doesn't depend on Research.
async function analysisNode(
  state: typeof ResearchState.State,
) {
  console.log("[Analysis Node] Running...");

  return {
    analysis: `Independent analysis of: ${state.question}`,
  };
}

// Runs after both parallel branches have completed.
async function synthesisNode(
  state: typeof ResearchState.State,
) {
  console.log("[Synthesis Node] Running...");

  return {
    finalAnswer: [
      "Research findings:",
      state.research,
      "",
      "Analysis:",
      state.analysis,
    ].join("\n"),
  };
}

// Build the graph.
const workflow = new StateGraph(ResearchState)
  .addNode("researchNode", researchNode)
  .addNode("analysisNode", analysisNode)
  .addNode("synthesisNode", synthesisNode)
  .addEdge(START, "researchNode")
  .addEdge(START, "analysisNode")
  .addEdge("researchNode", "synthesisNode")
  .addEdge("analysisNode", "synthesisNode")
  .addEdge("synthesisNode", END)
  .compile();

// Execute the graph.
const result = await workflow.invoke({
  question: "How can AI help software developers?",
});

console.log("\nFinal Workflow State:");
console.log(result);
