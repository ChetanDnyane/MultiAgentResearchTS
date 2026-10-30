
import { model } from "./model.js";

async function testOpenAI() {
  console.log("Sending request to OpenAI...");

  const response = await model.invoke(
    "Reply with exactly these words: API connection successful."
  );

  console.log("OpenAI response:", response.content);
}

testOpenAI().catch((error) => {
  console.error("OpenAI request failed:", error.message);
});
