
import "dotenv/config";

import { ChatOpenAI } from "@langchain/openai";

export const model = new ChatOpenAI({
  model: "gpt-6-luna",
  useResponsesApi: true,
});
