
import { StateGraph, START, END } from "@langchain/langgraph";

import { ResearchState } from "./state.js";

import {
  managerNode,
  researchNode,
  analysisNode,
  draftNode,
  criticNode,
  finalAnswerNode,
} from "./nodes.js";

const workflow = new StateGraph(ResearchState)
  .addNode("managerNode", managerNode)
  .addNode("researchNode", researchNode)
  .addNode("analysisNode", analysisNode)
  .addNode("draftNode", draftNode)
  .addNode("criticNode", criticNode)
  .addNode("finalAnswerNode", finalAnswerNode);

// Starting point
workflow.addEdge(START, "managerNode");

// Manager delegates to Research and Analysis in parallel
workflow.addEdge("managerNode", "researchNode");
workflow.addEdge("managerNode", "analysisNode");

// Wait for both agents before drafting
workflow.addEdge("researchNode", "draftNode");
workflow.addEdge("analysisNode", "draftNode");

// Draft must be reviewed
workflow.addEdge("draftNode", "criticNode");

// Conditional routing
workflow.addConditionalEdges(
  "criticNode",
  (state) => {
    if (
      state.criticDecision === "REVISE" &&
      !state.revisionLimitReached
    ) {
      return "revise";
    }

    return "finalize";
  },
  {
    revise: "draftNode",
    finalize: "finalAnswerNode",
  }
);

// Finish
workflow.addEdge("finalAnswerNode", END);

export const researchGraph = workflow.compile();
