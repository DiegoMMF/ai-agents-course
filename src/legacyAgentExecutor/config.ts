import dotenv from "dotenv";
dotenv.config();

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { FireworksEmbeddings } from "@langchain/community/embeddings/fireworks";
import { ChatGroq } from "@langchain/groq";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const cheerioLoader = new CheerioWebBaseLoader(
  "https://docs.smith.langchain.com/overview"
);

export const fireworksEmbeddings = new FireworksEmbeddings({
  modelName: "nomic-ai/nomic-embed-text-v1.5",
});

export const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

export const llm = new ChatGroq({
  modelName: "llama3-8b-8192",
  temperature: 0,
  maxTokens: 1000,
});
