import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { writeFileSync } from "fs";
import { fireworksEmbeddings } from "../../db/embeddings";
import { langChainDocuments } from "./documents";

// Create a vector store with the documents and embeddings
const vectorStore = new FaissStore(fireworksEmbeddings, {});

const main = async () => {
  // Add the documents to the vector store
  await vectorStore.addDocuments(langChainDocuments, { ids: ["1", "2", "3", "4"] });

  // Search for the documents in the vector store
  const response = await vectorStore.similaritySearch("biology", 2);

  // Save the vector store to a file
  writeFileSync(`${__dirname}/response.json`, JSON.stringify(response, null, 2));
};

main().catch(console.error);
