// Import the Pinecone library
import { RecordValues } from "@pinecone-database/pinecone";
import { pc } from "../../db/embeddings";
import { writeFileSync } from "fs";

const query = "Tell me about the tech company known as Apple.";

// Convert the text into numerical vectors that Pinecone can index
const model = "multilingual-e5-large";

// Create a serverless index
const myIndex = "example-index";
const myNamespace = "example-namespace";

const main = async () => {
  // Convert the query into a numerical vector that Pinecone can search with
  const queryEmbedding = await pc.inference.embed(model, [query], {
    inputType: "query",
  });

  // Target the index where you'll store the vector embeddings
  const index = pc.index(myIndex);

  // Search the index for the three most similar vectors
  const queryResponse = await index.namespace(myNamespace).query({
    topK: 3,
    vector: queryEmbedding[0].values as RecordValues,
    includeValues: false,
    includeMetadata: true,
  });

  writeFileSync(
    `${__dirname}/responseQuery.json`,
    JSON.stringify(queryResponse, null, 2)
  );

  await pc.deleteIndex(myIndex);

  console.log("Index deleted: ", myIndex);
};

main().catch(console.error);