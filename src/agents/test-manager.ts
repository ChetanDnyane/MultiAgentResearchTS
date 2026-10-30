
import { managerAgent } from "./manager-agent.js";

async function testManager() {
  const question =
    "Should a company migrate its monolithic application to microservices?";

  console.log("Research question:", question);
  console.log("\nInvoking Manager Agent...\n");

  const result = await managerAgent(question);

  console.log("Manager Agent Output:");
  console.log(JSON.stringify(result, null, 2));
}

testManager().catch((error) => {
  console.error("Manager Agent failed:", error.message);
});
