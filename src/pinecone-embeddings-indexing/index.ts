// Import the Pinecone library
import {
  Pinecone,
  PineconeRecord,
  RecordMetadata,
} from "@pinecone-database/pinecone";
import { documentsC, pc } from "../db/embeddings";
import { writeFileSync } from "fs";

// Convert the text into numerical vectors that Pinecone can index
const model = "multilingual-e5-large";

// Create a serverless index
const myIndex = "example-index";
const myNamespace = "example-namespace";

const main = async () => {
  const embeddings = await pc.inference.embed(
    model,
    documentsC.map((d) => d.text),
    { inputType: "passage", truncate: "END" }
  );

  const indexDescription = await pc.describeIndex(myIndex);

  // Target the index where you'll store the vector embeddings
  const index = pc.index(myIndex);

  // Prepare the records for upsert
  // Each contains an 'id', the embedding 'values', and the original text as 'metadata'
  const records = documentsC.map((d, i) => ({
    id: d.id,
    values: embeddings[i].values,
    metadata: { text: d.text },
  }));

  // Upsert the vectors into the index
  // Load your vector embeddings into a new namespace.
  await index
    .namespace(myNamespace)
    .upsert(records as PineconeRecord<RecordMetadata>[]);

  const stats = await index.describeIndexStats();

  writeFileSync(`${__dirname}/responseUpsert.json`, JSON.stringify(stats, null, 2));
  writeFileSync(
    `${__dirname}/responseIndexDescription.json`,
    JSON.stringify(indexDescription, null, 2)
  );
  writeFileSync(`${__dirname}/responseIndex.json`, JSON.stringify(index, null, 2));
};

main().catch(console.error);
