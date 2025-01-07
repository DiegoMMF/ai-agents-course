import dotenv from "dotenv";
dotenv.config();

import type { Document } from "@langchain/core/documents";
import { FireworksEmbeddings } from "@langchain/community/embeddings/fireworks";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

export const fireworksEmbeddings = new FireworksEmbeddings({
  modelName: "nomic-ai/nomic-embed-text-v1.5",
});

export const hfEmbeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACEHUB_API_KEY,
});

// * Mocked Documents for testing

export const documentsA = [
  "Hello, world!",
  "How are you?",
  "I am fine, thank you.",
  "What is your name?",
  "My name is Langchain.",
];

const document1: Document = {
  pageContent: "The powerhouse of the cell is the mitochondria",
  metadata: { source: "https://example.com" },
};

const document2: Document = {
  pageContent: "Buildings are made out of brick",
  metadata: { source: "https://example.com" },
};

const document3: Document = {
  pageContent: "Mitochondria are made out of lipids",
  metadata: { source: "https://example.com" },
};

const document4: Document = {
  pageContent: "The 2024 Olympics are in Paris",
  metadata: { source: "https://example.com" },
};

export const documentsB = [document1, document2, document3, document4];
