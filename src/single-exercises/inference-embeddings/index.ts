import { writeFileSync } from "fs";
import { hfEmbeddings, documentsA, documentsB } from "../../db/embeddings";
import { Chroma } from "@langchain/community/vectorstores/chroma";

const hfPlainEmbeddings = async () => {
  // Embed documents into a vector space
  // The output is an array of arrays, where each array is a vector of floats
  // The number of vectors is the number of documents
  // The number of floats is the dimension of the vector space
  const responseEmbeddings = await hfEmbeddings.embedDocuments(documentsA);

  writeFileSync(
    `${__dirname}/responseEmbeddingsLength.json`,
    JSON.stringify(responseEmbeddings.length, null, 2)
  );

  // Embed a query into a vector space
  // The output is an array of floats
  // The number of floats is the dimension of the vector space
  // The query is a string
  // The query is embedded into the same vector space as the documents
  const responseFromQuery = await hfEmbeddings.embedQuery("Hello, world!");

  writeFileSync(
    `${__dirname}/responseFromQueryLength.json`,
    JSON.stringify(responseFromQuery.length, null, 2)
  );
};

// on Docker terminal
// docker pull chromadb/chroma
// docker run -p 8000:8000 chromadb/chroma

// on Docker Desktop
// pull image and run container (just follow the UI)

const vectorStore = new Chroma(hfEmbeddings, {
  collectionName: "a-test-collection", // collection name
  url: "http://0.0.0.0:8000", // Chroma URL
});

const hfEmbeddingsWithVectorStore = async () => {
  const responseA = await vectorStore.addDocuments(documentsB, {
    ids: ["1", "2", "3", "4"],
  });

  writeFileSync(`${__dirname}/result.json`, JSON.stringify(responseA, null, 2));

  await vectorStore.delete({ ids: ["3"] });

  const responseB = vectorStore;

  writeFileSync(`${__dirname}/resultB.json`, JSON.stringify(responseB, null, 2));
};

hfEmbeddingsWithVectorStore().catch(console.error);
hfPlainEmbeddings().catch(console.error);
