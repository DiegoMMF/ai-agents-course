
import { TextLoader } from "langchain/document_loaders/fs/text";
import { FireworksEmbeddings } from "@langchain/community/embeddings/fireworks";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { Document } from "@langchain/core/documents";


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

const documents = [document1, document2, document3, document4];

const embeddings = new FireworksEmbeddings({
  modelName: "nomic-ai/nomic-embed-text-v1.5",
});

const vectorStore = new FaissStore(embeddings, {});

const main = async () => {
  await vectorStore.addDocuments(documents, { ids: ["1", "2", "3", "4"] });

  console.log(await vectorStore.similaritySearch("biology", 2));
};

main().catch(console.error);

/* Terminal output:

[
  {
    pageContent: 'The powerhouse of the cell is the mitochondria',
    metadata: { source: 'https://example.com' }
  },
  {
    pageContent: 'Mitochondria are made out of lipids',
    metadata: { source: 'https://example.com' }
  }
]
*/
