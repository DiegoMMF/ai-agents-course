import dotenv from "dotenv";
dotenv.config();

import type { Document } from "@langchain/core/documents";
import { FireworksEmbeddings } from "@langchain/community/embeddings/fireworks";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { Pinecone } from "@pinecone-database/pinecone";
import { Chroma } from "@langchain/community/vectorstores/chroma";

export const fireworksEmbeddings = new FireworksEmbeddings({
  modelName: "nomic-ai/nomic-embed-text-v1.5",
});

export const hfEmbeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACEHUB_API_KEY,
});

// * Pinecone vectorDB

export const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });

// * Para correr Chroma hay que levantar el servidor en Docker:

// on Docker terminal
// docker pull chromadb/chroma
// docker run -p 8000:8000 chromadb/chroma

// on Docker Desktop
// pull image and run container (just follow the UI)

export const chromaVectorStore = new Chroma(hfEmbeddings, {
  collectionName: "a-test-collection", // collection name
  url: "http://0.0.0.0:8000", // Chroma URL
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

export const documentsC = [
  {
    id: "vec1",
    text: "Apple is a popular fruit known for its sweetness and crisp texture.",
  },
  {
    id: "vec2",
    text: "The tech company Apple is known for its innovative products like the iPhone.",
  },
  { id: "vec3", text: "Many people enjoy eating apples as a healthy snack." },
  {
    id: "vec4",
    text: "Apple Inc. has revolutionized the tech industry with its sleek designs and user-friendly interfaces.",
  },
  { id: "vec5", text: "An apple a day keeps the doctor away, as the saying goes." },
  {
    id: "vec6",
    text: "Apple Computer Company was founded on April 1, 1976, by Steve Jobs, Steve Wozniak, and Ronald Wayne as a partnership.",
  },
];
