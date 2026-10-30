
import { researchGraph } from "./graph/workflow.js";

const question =
  process.argv.slice(2).join(" ").trim() ||
  "Should a new software application start with a monolithic architecture or microservices?";

async function main() {
  console.log("\n========================================");
  console.log("       MULTI-AGENT RESEARCH SYSTEM");
  console.log("========================================");

  console.log("\nUser Question:");
  console.log(question);

  // Initialize the shared graph state.
  const initialState = {
    question,
    revisionCount: 0,
    revisionLimitReached: false,
  };

  // Execute the complete LangGraph workflow.
  const result = await researchGraph.invoke(initialState);

  console.log("\n========================================");
  console.log("              FINAL ANSWER");
  console.log("========================================\n");

  console.log(result.finalAnswer);

  console.log("\n========================================");
  console.log("            WORKFLOW SUMMARY");
  console.log("========================================\n");

  console.log(result.workflowSummary);

  console.log("\nCritic Decision:", result.criticDecision);
  console.log("Revisions Performed:", result.revisionCount);

  if (result.revisionLimitReached) {
    console.log("Revision Limit Reached: Yes");
  }

  console.log("\n========================================");
  console.log("             EXECUTION COMPLETE");
  console.log("========================================");
}

main().catch((error: unknown) => {
  console.error("\nApplication execution failed:");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});
