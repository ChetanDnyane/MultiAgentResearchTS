
import "dotenv/config";
import { model } from "./model.js";

const apiKey = process.env.OPENAI_API_KEY;

if (
  !apiKey ||
  apiKey === "your_actual_api_key_here" ||
  apiKey === "your_openai_api_key_here"
) {
  console.log("OpenAI API key is not configured with a real key.");
  console.log("Model configuration can be checked, but API calls are not ready.");
} else {
  console.log("An OpenAI API key is configured.");
}

console.log("Model object created:", Boolean(model));
