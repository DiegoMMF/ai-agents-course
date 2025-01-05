// Import the Pinecone library
import {
  Pinecone,
  PineconeRecord,
  RecordMetadata,
  RecordValues,
} from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });

// Define a sample dataset where each item has a unique ID and piece of text
const data = [
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

const query = "Tell me about the tech company known as Apple.";

// Convert the text into numerical vectors that Pinecone can index
const model = "multilingual-e5-large";

// Create a serverless index
const myIndex = "example-index";
const myNamespace = "example-namespace";

(async () => {
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

  console.log(queryResponse);

  await pc.deleteIndex(myIndex);

  console.log("Index deleted: ", myIndex);
})();

/* Terminal output:

{
  matches: [
    {
      id: 'vec2',
      score: 0.872819185,
      values: [],
      sparseValues: undefined,
      metadata: [Object]
    },
    {
      id: 'vec4',
      score: 0.852485359,
      values: [],
      sparseValues: undefined,
      metadata: [Object]
    },
    {
      id: 'vec6',
      score: 0.850248575,
      values: [],
      sparseValues: undefined,
      metadata: [Object]
    }
  ],
  namespace: 'example-namespace',
  usage: { readUnits: 6 }
}
Index deleted: 'example-namespace'
*/
