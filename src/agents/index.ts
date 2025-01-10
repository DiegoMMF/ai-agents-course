import dotenv from "dotenv";
dotenv.config();

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { saveOutput } from "../rag/utils";

export const tavilySearch = new TavilySearchResults({
  apiKey: process.env.TAVILY_API_KEY,
  maxResults: 2,
  verbose: true,
});

(async () => {
  const searchResult = await tavilySearch.invoke(
    "Are there alternatives to LangChain?"
  );
  saveOutput("searchResult", searchResult, "./src/agents/output/");
})();
