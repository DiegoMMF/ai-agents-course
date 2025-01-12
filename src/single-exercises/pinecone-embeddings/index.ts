import { writeFileSync } from "fs";
import { documentsC, pc } from "../../utils/embeddings";

// Convert the text into numerical vectors that Pinecone can index
const model = "multilingual-e5-large";

// Create a serverless index
const indexName = "example-index-3";

const main = async () => {
  const embeddings = await pc.inference.embed(
    model,
    documentsC.map((d) => d.text),
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

  writeFileSync(
    `${__dirname}/responseEmbeddings.json`,
    JSON.stringify(embeddings, null, 2)
  );
  writeFileSync(`${__dirname}/responseIndex.json`, JSON.stringify(index, null, 2));
};

main().catch(console.error);