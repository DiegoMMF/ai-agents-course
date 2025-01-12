import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { fireworksEmbeddings } from "./embeddings";

export const faissVectorStore = new FaissStore(fireworksEmbeddings, {});
