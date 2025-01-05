// Import the Pinecone library
import { Pinecone } from "@pinecone-database/pinecone";


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

// Convert the text into numerical vectors that Pinecone can index
const model = "multilingual-e5-large";

// Create a serverless index
const indexName = "example-index";

(async () => {
  const embeddings = await pc.inference.embed(
    model,
    data.map((d) => d.text),
    { inputType: "passage", truncate: "END" }
  );

  const index = await pc.createIndex({
    name: indexName,
    dimension: 1024,
    metric: "cosine",
    spec: {
      serverless: {
        cloud: "aws",
        region: "us-east-1",
      },
    },
  });

  console.log({ embeddings, index });
})();

/* Terminal output:

{
  embeddings: EmbeddingsList(6) [
    { values: [Array] },
    { values: [Array] },
    { values: [Array] },
    { values: [Array] },
    { values: [Array] },
    { values: [Array] },
    model: 'multilingual-e5-large',
    data: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    usage: { totalTokens: 130 }
  ],
  index: {
    name: 'example-index',
    dimension: 1024,
    metric: 'cosine',
    host: 'example-index-6zhhpe2.svc.aped-4627-b74a.pinecone.io',
    deletionProtection: 'disabled',
    tags: undefined,
    spec: { pod: undefined, serverless: [Object] },
    status: { ready: false, state: 'Initializing' }
  }
}
*/
