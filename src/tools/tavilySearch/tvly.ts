import dotenv from "dotenv";
dotenv.config();

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

export const tvly: TavilySearchResults = new TavilySearchResults({
  apiKey: process.env.TAVILY_API_KEY,
  // verbose: true,
  maxResults: 2,
});