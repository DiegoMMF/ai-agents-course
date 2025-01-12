import dotenv from "dotenv";
dotenv.config();

import { saveOutput } from "../../rag/utils";
import { tavily } from "@tavily/core";

// Step 1. Instantiating your Tavily client
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

(async () => {
  // Executing a simple search query
  const response = await tvly.search("Who is Leo Messi?", {});
  saveOutput("response", response, "./src/tools/tavilySearch/output/");

  // Executing a context search query
  const context = await tvly.searchContext("What's LangChain?", {});
  saveOutput("context", context, "./src/tools/tavilySearch/output/");

  // Executing a Q&A search query
  const answer = await tvly.searchQNA(
    "What's the purpose of LangChain's '.tool()'?",
    {}
  );
  saveOutput("answer", answer, "./src/tools/tavilySearch/output/");
})();
