import dotenv from "dotenv";
dotenv.config();

import { FireworksEmbeddings } from "@langchain/community/embeddings/fireworks";

export const fireworksEmbeddings = new FireworksEmbeddings({
  modelName: "nomic-ai/nomic-embed-text-v1.5",
});
