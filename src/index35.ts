// Import the Pinecone library
import {
  Pinecone,
  PineconeRecord,
  RecordMetadata,
} from "@pinecone-database/pinecone";


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
const myIndex = "example-index";
const myNamespace = "example-namespace";

(async () => {
  const embeddings = await pc.inference.embed(
    model,
    data.map((d) => d.text),
    { inputType: "passage", truncate: "END" }
  );

  const indexDescription = await pc.describeIndex(myIndex);

  // Target the index where you'll store the vector embeddings
  const index = pc.index(myIndex);

  // Prepare the records for upsert
  // Each contains an 'id', the embedding 'values', and the original text as 'metadata'
  const records = data.map((d, i) => ({
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

  console.log({ index, indexDescription, stats });
})();

/* Terminal output:

{
  index: Index {
    config: {
      apiKey: 'pcsk_6Jpgu7_G7so6qid8i8vB2EH7jmvcWduebkYDtGVhXWAxLpvULnirUP4UXzckKpz7VDdKRK'
    },
    target: { index: 'example-index', namespace: '', indexHostUrl: undefined },
    _deleteAll: [Function (anonymous)],
    _deleteMany: [Function (anonymous)],
    _deleteOne: [Function (anonymous)],
    _describeIndexStats: [Function (anonymous)],
    _listPaginated: [Function (anonymous)],
    _fetchCommand: FetchCommand {
      validator: [Function (anonymous)],
      apiProvider: [VectorOperationsProvider],
      namespace: ''
    },
    _queryCommand: QueryCommand {
      validator: [Function (anonymous)],
      apiProvider: [VectorOperationsProvider],
      namespace: ''
    },
    _updateCommand: UpdateCommand {
      validator: [Function (anonymous)],
      apiProvider: [VectorOperationsProvider],
      namespace: ''
    },
    _upsertCommand: UpsertCommand {
      validator: [Function (anonymous)],
      apiProvider: [VectorOperationsProvider],
      namespace: ''
    },
    _startImportCommand: StartImportCommand {
      apiProvider: [BulkOperationsProvider],
      namespace: ''
    },
    _listImportsCommand: ListImportsCommand {
      apiProvider: [BulkOperationsProvider],
      namespace: ''
    },
    _describeImportCommand: DescribeImportCommand {
      apiProvider: [BulkOperationsProvider],
      namespace: ''
    },
    _cancelImportCommand: CancelImportCommand {
      apiProvider: [BulkOperationsProvider],
      namespace: ''
    }
  },
  indexDescription: {
    name: 'example-index',
    dimension: 1024,
    metric: 'cosine',
    host: 'example-index-6zhhpe2.svc.aped-4627-b74a.pinecone.io',
    deletionProtection: 'disabled',
    tags: undefined,
    spec: { pod: undefined, serverless: [Object] },
    status: { ready: true, state: 'Ready' }
  },
  stats: {
    namespaces: { 'example-namespace': [Object] },
    dimension: 1024,
    indexFullness: 0,
    totalRecordCount: 6
  }
}
*/
